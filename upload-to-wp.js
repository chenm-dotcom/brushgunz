#!/usr/bin/env node
/**
 * upload-to-wp.js
 * Compress images and upload them to the WordPress media library.
 *
 * Setup (one time):
 *   1. npm install
 *   2. cp wp-upload.config.example.json wp-upload.config.json
 *   3. Fill in your WordPress username + Application Password
 *      (WP Admin → Users → Profile → Application Passwords → Add New)
 *
 * Usage:
 *   node upload-to-wp.js photo.jpg
 *   node upload-to-wp.js ./my-photos/
 *   node upload-to-wp.js hero1.jpg hero2.jpg slider1.mp4
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');
const Form  = require('form-data');
const axios = require('axios');

/* ── Config ────────────────────────────────────────────────────────────────── */
const CFG_PATH = path.join(__dirname, 'wp-upload.config.json');
if (!fs.existsSync(CFG_PATH)) {
    console.error('\n❌  wp-upload.config.json not found.');
    console.error('    Copy wp-upload.config.example.json → wp-upload.config.json and fill in your details.\n');
    process.exit(1);
}
const { url: WP_URL, user: WP_USER, pass: WP_PASS } = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const AUTH     = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const ENDPOINT = WP_URL.replace(/\/$/, '') + '/wp-json/wp/v2/media';

/* ── Constants ─────────────────────────────────────────────────────────────── */
const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif', '.heic', '.heif']);
const VID_EXTS = new Set(['.mp4', '.mov', '.webm', '.avi', '.m4v']);
const MAX_PX   = 2400;   // max width or height after resize
const QUALITY  = 85;     // JPEG / WebP quality (0-100)

/* ── Collect files from CLI args ────────────────────────────────────────────── */
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!args.length) {
    console.log('\nUsage: node upload-to-wp.js <file-or-folder> [more files...]\n');
    process.exit(0);
}

function collectFiles(input) {
    const stat = fs.statSync(input);
    if (stat.isDirectory()) {
        return fs.readdirSync(input)
            .map(f => path.join(input, f))
            .filter(f => {
                const ext = path.extname(f).toLowerCase();
                return IMG_EXTS.has(ext) || VID_EXTS.has(ext);
            })
            .sort();
    }
    return [input];
}

/* ── Image compression via sharp ────────────────────────────────────────────── */
async function compress(filePath) {
    const ext      = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath, ext);
    const origSize = fs.statSync(filePath).size;

    if (VID_EXTS.has(ext)) {
        const mime = { '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm',
                       '.avi': 'video/x-msvideo', '.m4v': 'video/mp4' }[ext] || 'video/mp4';
        return { buffer: fs.readFileSync(filePath), mime, filename: path.basename(filePath), origSize, saving: 0 };
    }

    let img = sharp(filePath).rotate(); // auto-rotate EXIF

    const meta = await img.metadata();
    if ((meta.width || 0) > MAX_PX || (meta.height || 0) > MAX_PX) {
        img = img.resize(MAX_PX, MAX_PX, { fit: 'inside', withoutEnlargement: true });
    }

    let buffer, mime, filename;

    if (ext === '.png') {
        buffer   = await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
        mime     = 'image/png';
        filename = basename + '.png';
    } else if (ext === '.webp') {
        buffer   = await img.webp({ quality: QUALITY }).toBuffer();
        mime     = 'image/webp';
        filename = basename + '.webp';
    } else {
        buffer   = await img.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
        mime     = 'image/jpeg';
        filename = basename + '.jpg';
    }

    const saving = Math.max(0, Math.round((1 - buffer.length / origSize) * 100));
    return { buffer, mime, filename, origSize, compressedSize: buffer.length, saving };
}

/* ── Upload to WordPress REST API ───────────────────────────────────────────── */
async function upload({ buffer, mime, filename }) {
    const form = new Form();
    form.append('file', buffer, { filename, contentType: mime });

    const { data } = await axios.post(ENDPOINT, form, {
        headers: { ...form.getHeaders(), Authorization: `Basic ${AUTH}` },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    });
    return data;
}

/* ── Main ───────────────────────────────────────────────────────────────────── */
async function main() {
    const files = args.flatMap(collectFiles);
    if (!files.length) { console.log('No image or video files found.'); return; }

    console.log(`\n🚀  Uploading ${files.length} file(s) to ${WP_URL}\n`);

    const done = [];
    for (const filePath of files) {
        const name = path.basename(filePath);
        process.stdout.write(`  ${name}`);
        try {
            const c = await compress(filePath);
            const origKB = Math.round(c.origSize / 1024);
            const newKB  = Math.round((c.compressedSize || c.origSize) / 1024);
            process.stdout.write(`  ${origKB}KB → ${newKB}KB (${c.saving}% smaller) … `);

            const media = await upload(c);
            console.log(`✅  ID ${media.id}`);
            console.log(`      ${media.source_url}`);
            done.push({ name, id: media.id, url: media.source_url });
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            console.log(`❌  ${msg}`);
        }
    }

    if (done.length) {
        console.log('\n── Uploaded ────────────────────────────────────────────');
        done.forEach(r => console.log(`  [ID ${r.id}]  ${r.name}`));
        console.log('────────────────────────────────────────────────────────');
        console.log('\nOpen WP Admin → Brushgunz to assign these to your slides / grid.\n');
    }
}

main().catch(err => { console.error('\n❌ ', err.message); process.exit(1); });
