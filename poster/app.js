'use strict';

/* ════════════════════════════════════════════════════════════════════════════
   CONFIG
   Set your Unsplash Access Key here (get one free at unsplash.com/developers).
   Without a key, Unsplash search will use the no-auth source URL (single random
   photo per query — good enough for most use cases).
   ════════════════════════════════════════════════════════════════════════════ */
const UNSPLASH_KEY = '';  // ← paste your key here, e.g. 'abc123xyz'

/* ════════════════════════════════════════════════════════════════════════════
   BRAND COLOUR PALETTES  (Mindspace-toned)
   ════════════════════════════════════════════════════════════════════════════ */
const PALETTES = {
  event: [
    { h:'#d6c6f0', n:'Lavender'   },
    { h:'#8ed4a2', n:'Sage'       },
    { h:'#f0d4b2', n:'Peach'      },
    { h:'#b2caec', n:'Powder'     },
    { h:'#e6ddb0', n:'Cream'      },
    { h:'#d0e8b0', n:'Mint'       },
    { h:'#f0d8d2', n:'Blush'      },
    { h:'#f2ece0', n:'Ivory'      },
  ],
  spotlight: [
    { h:'#b8ccec', n:'Powder'     },
    { h:'#dcd0ec', n:'Lilac'      },
    { h:'#d0ecda', n:'Sage'       },
    { h:'#ece0d0', n:'Sand'       },
    { h:'#f0e8d6', n:'Cream'      },
    { h:'#ecd4d0', n:'Blush'      },
    { h:'#d0e6e2', n:'Seafoam'    },
    { h:'#f6f2e8', n:'Ivory'      },
  ],
  offer: [
    { h:'#111110', n:'Charcoal'   },
    { h:'#1c1228', n:'Plum'       },
    { h:'#0c1e30', n:'Navy'       },
    { h:'#0c2018', n:'Forest'     },
    { h:'#281210', n:'Burgundy'   },
    { h:'#241c0c', n:'Espresso'   },
  ],
  announcement: [
    { h:'#d45c38', n:'Terracotta' },
    { h:'#111110', n:'Charcoal'   },
    { h:'#1c3858', n:'Navy'       },
    { h:'#14301e', n:'Forest'     },
    { h:'#381212', n:'Burgundy'   },
    { h:'#501c40', n:'Plum'       },
    { h:'#b08828', n:'Gold'       },
    { h:'#484440', n:'Slate'      },
  ],
};

/* ════════════════════════════════════════════════════════════════════════════
   ADVENTURE PALETTES  — wider, more expressive
   ════════════════════════════════════════════════════════════════════════════ */
const ADV_PALETTES = {
  event: [
    { h:'#ff6b6b', n:'Coral'      },
    { h:'#ffd93d', n:'Yellow'     },
    { h:'#6bcb77', n:'Lime'       },
    { h:'#4d96ff', n:'Blue'       },
    { h:'#ff922b', n:'Orange'     },
    { h:'#cc5de8', n:'Purple'     },
    { h:'#f06595', n:'Pink'       },
    { h:'#20c997', n:'Teal'       },
    { h:'#f8f9fa', n:'White'      },
    { h:'#212529', n:'Black'      },
  ],
  spotlight: [
    { h:'#ffd6e7', n:'Baby Pink'  },
    { h:'#c5f0a4', n:'Lime'       },
    { h:'#a5d8ff', n:'Baby Blue'  },
    { h:'#ffe8cc', n:'Apricot'    },
    { h:'#e5dbff', n:'Lavender'   },
    { h:'#fff3bf', n:'Butter'     },
    { h:'#d0bfff', n:'Periwinkle' },
    { h:'#99e9f2', n:'Cyan'       },
  ],
  offer: [
    { h:'#111110', n:'Charcoal'   },
    { h:'#0d1b2a', n:'Midnight'   },
    { h:'#1a0a2e', n:'Deep Plum'  },
    { h:'#0a2614', n:'Deep Forest'},
    { h:'#2e0a0a', n:'Deep Red'   },
    { h:'#1a1000', n:'Espresso'   },
  ],
  announcement: [
    { h:'#e63946', n:'Red'        },
    { h:'#f4a261', n:'Apricot'    },
    { h:'#2a9d8f', n:'Teal'       },
    { h:'#e9c46a', n:'Gold'       },
    { h:'#264653', n:'Petrol'     },
    { h:'#6a4c93', n:'Violet'     },
    { h:'#1982c4', n:'Royal Blue' },
    { h:'#8ac926', n:'Lime'       },
  ],
};

/* ════════════════════════════════════════════════════════════════════════════
   ADVENTURE FONTS
   ════════════════════════════════════════════════════════════════════════════ */
const ADV_FONTS = [
  { key: 'DM Serif Display',  label: 'Brand Serif',     style: 'italic',  weight: '400' },
  { key: 'Abril Fatface',     label: 'Abril Heavy',     style: 'normal',  weight: '400' },
  { key: 'Playfair Display',  label: 'Playfair',        style: 'italic',  weight: '700' },
  { key: 'Bebas Neue',        label: 'Bebas Block',     style: 'normal',  weight: '400' },
  { key: 'Dancing Script',    label: 'Handwritten',     style: 'normal',  weight: '700' },
  { key: 'Space Mono',        label: 'Mono',            style: 'italic',  weight: '400' },
];

/* ════════════════════════════════════════════════════════════════════════════
   TEMPLATE DEFINITIONS
   ════════════════════════════════════════════════════════════════════════════ */
const TEMPLATES = {
  event: {
    title: 'Event Poster',
    hint:  'What\'s happening, when, and where. The photo does the rest.',
    fields: [
      { id:'brand',    label:'Label',                type:'text',     ph:'MINDSPACE HOUR',                  xl:true },
      { id:'headline', label:'Event name',           type:'text',     ph:'Doggo Playdate',                  xl:true },
      { id:'tagline',  label:'One-liner (optional)', type:'text',     ph:'Bring your dog & make some friends'       },
      { id:'date',     label:'Date',                 type:'text',     ph:'14/08'                                    },
      { id:'time',     label:'Time',                 type:'text',     ph:'15:00–16:00'                              },
      { id:'location', label:'Location',             type:'text',     ph:'Eventspace'                               },
      { id:'photo',    label:'Event photo',          type:'image'                                                    },
    ],
  },
  spotlight: {
    title: 'Member Spotlight',
    hint:  'Introduce someone. Keep it real, keep it warm.',
    fields: [
      { id:'brand',  label:'Label',                    type:'text',     ph:'MINDSPACE SPOTLIGHT',  xl:true },
      { id:'name',   label:'Member name',              type:'text',     ph:'Liza Holiarchuk',      xl:true },
      { id:'bio',    label:'Bio',                      type:'textarea', ph:'Liza is a freelance photographer based in Hamburg, specialising in **corporate portraits** and event photography.\n\nHer work focuses on natural, confident portraits that feel professional but not staged.' },
      { id:'link',   label:'Website (optional)',       type:'text',     ph:'lizaholiarchuk.com'             },
      { id:'photo',  label:'Portrait photo',           type:'image'                                        },
    ],
  },
  offer: {
    title: 'Member Special',
    hint:  'Lead with the number. Make the deal look as good as it is.',
    fields: [
      { id:'brand',    label:'Brand line',    type:'text',  ph:'Mindspace',                                xl:true },
      { id:'title',    label:'Offer title',   type:'text',  ph:'Member\'s Special',                        xl:true },
      { id:'stat',     label:'Big number',    type:'text',  ph:'30%'                                               },
      { id:'headline', label:'Offer text',    type:'text',  ph:'discount on your event booking for 2026!'          },
      { id:'note',     label:'Fine print',    type:'text',  ph:"Don't miss out – valid only for June events"        },
      { id:'photo',    label:'Background photo', type:'image'                                                        },
    ],
  },
  announcement: {
    title: 'Announcement',
    hint:  'Short. Loud. Readable from the elevator.',
    fields: [
      { id:'brand',    label:'Brand line',            type:'text',     ph:'Mindspace',                     xl:true },
      { id:'headline', label:'Headline',              type:'text',     ph:"We're on the 4th floor lounge", xl:true },
      { id:'body',     label:'Body text (optional)',  type:'textarea', ph:'If needed / bring back cards call:' },
      { id:'contact',  label:'Contact',               type:'textarea', ph:'Anna\n015120511147'                  },
    ],
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════════════════════════════════ */
let tpl         = null;
let bgColor     = null;
let imgs        = {};
let adventure   = false;
let advFont     = ADV_FONTS[0];
let activePhotoFieldId = null;

/* ════════════════════════════════════════════════════════════════════════════
   DOM REFS
   ════════════════════════════════════════════════════════════════════════════ */
const $pick        = id('screen-pick');
const $build       = id('screen-build');
const $poster      = id('poster');
const $fields      = id('formFields');
const $title       = id('formTitle');
const $hint        = id('formHint');
const $colorRow    = id('colorRow');
const $dlBtn       = id('btnDownload');
const $printBtn    = id('btnPrint');
const $backBtn     = id('btnBack');
const $navLogo     = id('navLogo');
const $advBtn      = id('btnAdventure');
const $advFontSec  = id('advFontSection');
const $fontPicker  = id('fontPicker');

/* ════════════════════════════════════════════════════════════════════════════
   ROUTING
   ════════════════════════════════════════════════════════════════════════════ */
qsa('.pcard').forEach(c => c.addEventListener('click', () => open(c.dataset.tpl)));

[$backBtn, $navLogo].forEach(el => el.addEventListener('click', () => {
  $build.classList.add('hidden');
  $pick.classList.remove('hidden');
  tpl = null; imgs = {}; adventure = false;
  $advBtn.classList.remove('active');
}));

$advBtn.addEventListener('click', () => {
  adventure = !adventure;
  $advBtn.classList.toggle('active', adventure);
  $advFontSec.classList.toggle('hidden', !adventure);
  buildPalette(adventure ? ADV_PALETTES[tpl] : PALETTES[tpl]);
  render();
});

/* ════════════════════════════════════════════════════════════════════════════
   OPEN TEMPLATE
   ════════════════════════════════════════════════════════════════════════════ */
function open(key) {
  tpl = key; imgs = {}; adventure = false;
  $advBtn.classList.remove('active');
  $advFontSec.classList.add('hidden');

  const def = TEMPLATES[key];
  $title.textContent = def.title;
  $hint.textContent  = def.hint;

  buildForm(def.fields);
  buildFontPicker();
  buildPalette(PALETTES[key]);

  $pick.classList.add('hidden');
  $build.classList.remove('hidden');
  render();
}

/* ════════════════════════════════════════════════════════════════════════════
   FORM BUILDER
   ════════════════════════════════════════════════════════════════════════════ */
function buildForm(fields) {
  $fields.innerHTML = '';
  fields.forEach(f => {
    const wrap  = mk('div', 'field');
    const label = mk('label', 'field-label');
    label.setAttribute('for', 'f-' + f.id);
    label.textContent = f.label;
    wrap.appendChild(label);

    if (f.type === 'image') {
      wrap.appendChild(buildImageField(f.id));
    } else if (f.type === 'textarea') {
      const ta = mk('textarea', 'tall');
      ta.id = 'f-' + f.id;
      ta.placeholder = f.ph || '';
      ta.addEventListener('input', render);
      wrap.appendChild(ta);
    } else {
      const inp = mk('input');
      inp.type = 'text'; inp.id = 'f-' + f.id;
      inp.placeholder = f.ph || '';
      if (f.xl) inp.classList.add('xl');
      inp.addEventListener('input', render);
      wrap.appendChild(inp);
    }
    $fields.appendChild(wrap);
  });
}

/* ── Image field: Upload + Unsplash search ── */
function buildImageField(fieldId) {
  const wrapper = mk('div', 'img-field');

  // ── Upload zone ──
  const zone = mk('label', 'upload-zone');
  zone.id = 'zone-' + fieldId;
  zone.innerHTML = `
    <svg class="uz-icon" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.4"/>
      <path d="M3 16l5-5 4 4 4-6 5 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="uz-hint">Click to upload photo</span>`;

  const fileInp = mk('input');
  fileInp.type = 'file'; fileInp.accept = 'image/*';
  fileInp.addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      imgs[fieldId] = ev.target.result;
      setZoneThumb(zone, ev.target.result, fileInp);
      render();
    };
    r.readAsDataURL(file);
  });
  zone.appendChild(fileInp);
  wrapper.appendChild(zone);

  // ── Unsplash search ──
  const unsplashRow = mk('div', 'unsplash-row');
  unsplashRow.innerHTML = `
    <span class="unsplash-label">or search Unsplash</span>
    <div class="unsplash-input-row">
      <input type="text" class="unsplash-input" placeholder="e.g. coworking space" id="us-${fieldId}">
      <button type="button" class="unsplash-btn" data-field="${fieldId}">Search</button>
    </div>
    <div class="unsplash-results" id="usr-${fieldId}"></div>`;
  wrapper.appendChild(unsplashRow);

  // Search handler
  const usInput  = unsplashRow.querySelector('.unsplash-input');
  const usBtn    = unsplashRow.querySelector('.unsplash-btn');
  const usResult = unsplashRow.querySelector('.unsplash-results');

  const doSearch = () => searchUnsplash(usInput.value, fieldId, usResult, zone, fileInp);
  usBtn.addEventListener('click', doSearch);
  usInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  return wrapper;
}

function setZoneThumb(zone, src, fileInp) {
  zone.innerHTML = '';
  const thumb = mk('img', 'uz-thumb'); thumb.src = src;
  const hint  = mk('span', 'uz-hint'); hint.textContent = 'Click to change';
  zone.append(thumb, hint, fileInp);
}

/* ════════════════════════════════════════════════════════════════════════════
   UNSPLASH SEARCH
   ════════════════════════════════════════════════════════════════════════════ */
async function searchUnsplash(query, fieldId, resultEl, zone, fileInp) {
  if (!query.trim()) return;
  resultEl.innerHTML = '<span class="us-loading">Searching…</span>';

  try {
    let photos = [];

    if (UNSPLASH_KEY) {
      // Full API — shows grid of results
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=portrait`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      const data = await res.json();
      photos = (data.results || []).map(p => ({
        thumb: p.urls.small,
        full:  p.urls.regular,
        credit: p.user.name,
      }));
    } else {
      // No API key — use source URL (returns one random matching photo)
      const src = `https://source.unsplash.com/featured/720x1280/?${encodeURIComponent(query)}`;
      photos = [{ thumb: src, full: src, credit: 'Unsplash' }];
    }

    if (!photos.length) {
      resultEl.innerHTML = '<span class="us-loading">No results. Try another keyword.</span>';
      return;
    }

    resultEl.innerHTML = '';
    photos.forEach(p => {
      const img = mk('img', 'us-thumb');
      img.src = p.thumb;
      img.title = `Photo by ${p.credit}`;
      img.addEventListener('click', async () => {
        resultEl.querySelectorAll('.us-thumb').forEach(t => t.classList.remove('us-selected'));
        img.classList.add('us-selected');
        // Load full URL as dataURL for html2canvas compatibility
        try {
          const blob = await fetch(p.full).then(r => r.blob());
          const reader = new FileReader();
          reader.onload = ev => {
            imgs[fieldId] = ev.target.result;
            setZoneThumb(zone, ev.target.result, fileInp);
            render();
          };
          reader.readAsDataURL(blob);
        } catch {
          // Fallback: use URL directly
          imgs[fieldId] = p.full;
          setZoneThumb(zone, p.full, fileInp);
          render();
        }
      });
      resultEl.appendChild(img);
    });
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = '<span class="us-loading">Search failed. Check your connection.</span>';
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   FONT PICKER  (adventure mode)
   ════════════════════════════════════════════════════════════════════════════ */
function buildFontPicker() {
  advFont = ADV_FONTS[0];
  $fontPicker.innerHTML = '';
  ADV_FONTS.forEach((f, i) => {
    const btn = mk('button', 'font-chip' + (i === 0 ? ' on' : ''));
    btn.type = 'button';
    btn.textContent = f.label;
    btn.style.fontFamily = `'${f.key}', serif`;
    btn.style.fontStyle  = f.style;
    btn.addEventListener('click', () => {
      qsa('.font-chip', $fontPicker).forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      advFont = f;
      render();
    });
    $fontPicker.appendChild(btn);
  });
}

/* ════════════════════════════════════════════════════════════════════════════
   PALETTE BUILDER
   ════════════════════════════════════════════════════════════════════════════ */
function buildPalette(palette) {
  $colorRow.innerHTML = '';
  bgColor = palette[0].h;
  palette.forEach((p, i) => {
    const s = mk('button', 'swatch' + (i === 0 ? ' on' : ''));
    s.type = 'button'; s.style.background = p.h;
    s.title = p.n; s.setAttribute('aria-label', p.n);
    s.addEventListener('click', () => {
      qsa('.swatch', $colorRow).forEach(x => x.classList.remove('on'));
      s.classList.add('on'); bgColor = p.h; render();
    });
    $colorRow.appendChild(s);
  });
}

/* ════════════════════════════════════════════════════════════════════════════
   RENDER POSTER
   ════════════════════════════════════════════════════════════════════════════ */
function render() {
  $poster.className = 'poster t-' + tpl;
  $poster.style.setProperty('--pb', bgColor);
  // Apply font
  const font   = adventure ? advFont.key   : 'DM Serif Display';
  const fstyle = adventure ? advFont.style : 'italic';
  const fweight= adventure ? advFont.weight: '400';
  $poster.style.setProperty('--headline-font',   `'${font}', Georgia, serif`);
  $poster.style.setProperty('--headline-style',  fstyle);
  $poster.style.setProperty('--headline-weight', fweight);
  ({ event:renderEvent, spotlight:renderSpotlight, offer:renderOffer, announcement:renderAnnouncement })[tpl]();
}

/* ── Helpers ── */
function v(fid) { const e = id('f-' + fid); return e ? e.value.trim() : ''; }
function x(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function bioToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .split(/\n{2,}/).map(p => `<p>${x(p).replace(/\n/g,'<br>')}</p>`).join('');
}
function headlineStyle() {
  return `font-family:var(--headline-font);font-style:var(--headline-style);font-weight:var(--headline-weight);`;
}

/* ── EVENT ── */
function renderEvent() {
  const brand    = v('brand')    || 'MINDSPACE HOUR';
  const headline = v('headline');
  const tagline  = v('tagline');
  const date     = v('date');
  const time     = v('time');
  const location = v('location');
  const photo    = imgs['photo'] || '';

  $poster.innerHTML = `
    <span class="ev-label">${x(brand)}</span>
    <div class="ev-title" style="${headlineStyle()}">${headline||'<span style="opacity:.22">Event name</span>'}</div>
    ${tagline ? `<span class="ev-tagline">${x(tagline)}</span>` : ''}
    <div class="ev-meta">
      <div class="ev-date">${x(date)}</div>
      <div class="ev-timeloc">${[time,location].filter(Boolean).map(x).join('<br>')}</div>
    </div>
    <div class="ev-photo">
      ${photo
        ? `<img src="${photo}" alt="" crossorigin="anonymous">`
        : `<div class="ev-photo-empty">Add a photo above ↑</div>`}
    </div>`;
}

/* ── SPOTLIGHT ── */
function renderSpotlight() {
  const brand = v('brand') || 'MINDSPACE SPOTLIGHT';
  const name  = v('name');
  const bio   = v('bio');
  const link  = v('link');
  const photo = imgs['photo'] || '';
  const bioHtml = bio ? bioToHtml(bio) : '';

  $poster.innerHTML = `
    <div class="sp-label">${x(brand)}</div>
    <div class="sp-name" style="${headlineStyle()}">${name||'<span style="opacity:.22">Member name</span>'}</div>
    <div class="sp-photo">
      ${photo
        ? `<img src="${photo}" alt="" crossorigin="anonymous">`
        : `<div class="sp-photo-empty">Add portrait ↑</div>`}
    </div>
    <div class="sp-rule"></div>
    ${bioHtml ? `<div class="sp-bio">${bioHtml}</div>` : ''}
    ${link    ? `<div class="sp-link">${x(link)}</div>` : ''}`;
}

/* ── OFFER ── */
function renderOffer() {
  const brand    = v('brand')    || 'Mindspace';
  const title    = v('title');
  const stat     = v('stat');
  const headline = v('headline');
  const note     = v('note');
  const photo    = imgs['photo'] || '';

  $poster.innerHTML = `
    ${photo ? `<div class="of-bg"><img src="${photo}" alt="" crossorigin="anonymous"></div>` : ''}
    <div class="of-overlay"></div>
    <div class="of-body">
      <div class="of-brand">${x(brand)}</div>
      ${title    ? `<div class="of-title" style="${headlineStyle()}">${x(title)}</div>`     : ''}
      ${stat     ? `<div class="of-stat"  style="${headlineStyle()}">${x(stat)}</div>`     : ''}
      ${headline ? `<div class="of-desc">${x(headline)}</div>`   : ''}
      ${note     ? `<div class="of-note">${x(note)}</div>`       : ''}
    </div>`;
}

/* ── ANNOUNCEMENT ── */
function renderAnnouncement() {
  const brand   = v('brand')    || 'Mindspace';
  const title   = v('headline');
  const body    = v('body');
  const contact = v('contact');

  $poster.innerHTML = `
    <div class="an-brand">${x(brand)}</div>
    <div class="an-title" style="${headlineStyle()}">${
      title ? x(title).replace(/\n/g,'<br>') : '<span style="opacity:.28">Your headline</span>'}</div>
    ${body    ? `<div class="an-body">${x(body)}</div>` : ''}
    ${contact ? `<div class="an-contact">${x(contact)}</div>` : ''}`;
}

/* ════════════════════════════════════════════════════════════════════════════
   DOWNLOAD
   ════════════════════════════════════════════════════════════════════════════ */
$dlBtn.addEventListener('click', async () => {
  if (typeof html2canvas === 'undefined') {
    alert('Download library not loaded — check your internet connection.');
    return;
  }
  const orig = $dlBtn.innerHTML;
  $dlBtn.disabled = true; $dlBtn.textContent = 'Generating…';
  try {
    const canvas = await html2canvas($poster, {
      scale: 3, useCORS: true, allowTaint: true,
      backgroundColor: null, logging: false,
    });
    const slug = (v('headline')||v('name')||v('brand')||'poster')
      .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
    const a = document.createElement('a');
    a.download = `mindspace-${slug}.png`; a.href = canvas.toDataURL('image/png'); a.click();
  } catch (err) {
    console.error(err);
    alert('PNG export failed — try "Print / Save as PDF" instead.');
  } finally {
    $dlBtn.disabled = false; $dlBtn.innerHTML = orig;
  }
});

$printBtn.addEventListener('click', () => window.print());

/* ════════════════════════════════════════════════════════════════════════════
   UTILS
   ════════════════════════════════════════════════════════════════════════════ */
function id(s)     { return document.getElementById(s); }
function mk(t, c)  { const e = document.createElement(t); if (c) e.className = c; return e; }
function qsa(s, p) { return Array.from((p||document).querySelectorAll(s)); }
