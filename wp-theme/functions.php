<?php
/* ── Theme setup ─────────────────────────────────────────────────────────── */
add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('html5', ['script', 'style']);
});

/* ── Enqueue styles + page-specific scripts ──────────────────────────────── */
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('brushgunz', get_stylesheet_uri(), [], '1.0');

    if (is_front_page())
        wp_enqueue_script('bg-main', get_template_directory_uri() . '/main.js', [], null, true);
    elseif (is_page('about'))
        wp_enqueue_script('bg-about', get_template_directory_uri() . '/about.js', [], null, true);
    elseif (is_page('contact'))
        wp_enqueue_script('bg-contact', get_template_directory_uri() . '/contact.js', [], null, true);
    elseif (is_page('work'))
        wp_enqueue_script('bg-work', get_template_directory_uri() . '/work.js', [], null, true);
});

/* ── Custom post type: Project ───────────────────────────────────────────── */
add_action('init', function () {
    register_post_type('bg_project', [
        'labels'        => [
            'name'          => 'Projects',
            'singular_name' => 'Project',
            'add_new'       => 'Add Project',
            'add_new_item'  => 'Add New Project',
            'edit_item'     => 'Edit Project',
            'all_items'     => 'All Projects',
        ],
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_icon'          => 'dashicons-portfolio',
        'menu_position'      => 5,
        'supports'           => ['title', 'editor', 'thumbnail', 'page-attributes'],
        'rewrite'            => ['slug' => 'project', 'with_front' => false],
        'has_archive'        => false,
    ]);
});

/* ── Project meta boxes: category label + gallery images ─────────────────── */
add_action('add_meta_boxes', function () {
    add_meta_box('bg_cat_box', 'Category Label', function ($post) {
        wp_nonce_field('bg_save_project', 'bg_nonce');
        $val = esc_attr(get_post_meta($post->ID, '_bg_cat', true));
        echo '<input type="text" name="bg_cat" value="' . $val . '" placeholder="e.g. Photography" style="width:100%">';
        echo '<p class="description">Shown above the project title on the grid card.</p>';
    }, 'bg_project');

    add_meta_box('bg_gallery_box', 'Project Gallery Images', function ($post) {
        $ids = get_post_meta($post->ID, '_bg_gallery', true);
        if (!is_array($ids)) $ids = [];
        ?>
        <p class="description" style="margin-bottom:12px">Images shown on the project detail page (right-side scroll). Add as many as you like.</p>
        <div class="bg-list" id="bg-gallery-list" data-name="bg_gallery">
            <?php foreach ($ids as $id) bg_admin_row('bg_gallery', $id); ?>
        </div>
        <button type="button" class="button button-secondary bg-add-btn" data-list="bg-gallery-list" data-name="bg_gallery">+ Add Image</button>
        <?php
    }, 'bg_project', 'normal', 'default');
});

add_action('save_post_bg_project', function ($id) {
    if (!isset($_POST['bg_nonce']) || !wp_verify_nonce($_POST['bg_nonce'], 'bg_save_project')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (isset($_POST['bg_cat']))
        update_post_meta($id, '_bg_cat', sanitize_text_field($_POST['bg_cat']));
    $gallery = isset($_POST['bg_gallery']) ? $_POST['bg_gallery'] : [];
    $gallery = array_values(array_filter(array_map('absint', (array) $gallery)));
    update_post_meta($id, '_bg_gallery', $gallery);
});

/* ── Helper: get stored array of attachment IDs ──────────────────────────── */
function bg_ids($key) {
    $v = get_option($key, []);
    if (!is_array($v)) $v = [];
    return array_values(array_filter(array_map('absint', $v)));
}

/* ── Helper: render one media slot (image or video) ─────────────────────── */
function bg_slide_html($id, $class = '') {
    if (!$id) return;
    $mime = get_post_mime_type($id);
    $wrap_open  = '<div class="' . esc_attr($class) . '">';
    $wrap_close = '</div>';
    if (strpos($mime, 'video') !== false) {
        $url = wp_get_attachment_url($id);
        echo $wrap_open . '<video autoplay muted loop playsinline><source src="' . esc_url($url) . '"></video>' . $wrap_close;
    } else {
        $url = wp_get_attachment_image_url($id, 'full');
        echo '<div class="' . esc_attr($class) . '" style="background-image:url(\'' . esc_url($url) . '\')"></div>';
    }
}

/* ── Helper: footer / about contact info ────────────────────────────────── */
function bg_contact($key, $default = '') {
    return esc_html(get_option($key, $default));
}

/* ── Admin: register settings ───────────────────────────────────────────── */
add_action('admin_init', function () {
    $array_keys = ['bg_hero_slides', 'bg_slider_images', 'bg_about_photos'];
    foreach ($array_keys as $k)
        register_setting('bg_options', $k, ['sanitize_callback' => function ($v) {
            if (!is_array($v)) return [];
            return array_values(array_filter(array_map('absint', $v)));
        }]);

    register_setting('bg_options', 'bg_profile_pic',        ['sanitize_callback' => 'absint']);
    register_setting('bg_options', 'bg_contact_phone',      ['sanitize_callback' => 'sanitize_text_field']);
    register_setting('bg_options', 'bg_contact_email',      ['sanitize_callback' => 'sanitize_email']);
    register_setting('bg_options', 'bg_contact_instagram',  ['sanitize_callback' => 'sanitize_text_field']);
    register_setting('bg_options', 'bg_ticker_text',        ['sanitize_callback' => 'sanitize_text_field']);
});

/* ── Admin: menu page ───────────────────────────────────────────────────── */
add_action('admin_menu', function () {
    add_menu_page('Brushgunz', 'Brushgunz', 'manage_options', 'brushgunz', 'bg_settings_page', 'dashicons-camera', 4);
});

/* ── Admin: enqueue media uploader + admin JS/CSS ───────────────────────── */
add_action('admin_enqueue_scripts', function ($hook) {
    $on_settings = ($hook === 'toplevel_page_brushgunz');
    $on_project  = in_array($hook, ['post.php', 'post-new.php']) &&
                   (isset($_GET['post_type']) && $_GET['post_type'] === 'bg_project' ||
                    isset($_GET['post']) && get_post_type(absint($_GET['post'])) === 'bg_project');

    if (!$on_settings && !$on_project) return;
    wp_enqueue_media();
    wp_enqueue_script('bg-admin', get_template_directory_uri() . '/admin/options.js', ['jquery'], null, true);
    wp_add_inline_style('wp-admin', bg_admin_css());
});

function bg_admin_css() {
    return '
    .bg-admin h2 { margin-top: 2rem; }
    .bg-form { max-width: 860px; }
    .bg-list { display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0; }
    .bg-row { position: relative; width: 160px; background: #f0f0f0; border-radius: 6px; padding: 8px; text-align: center; }
    .bg-row .bg-preview { width: 144px; height: 96px; background: #ddd; border-radius: 4px; overflow: hidden; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; }
    .bg-row .bg-preview img { width: 100%; height: 100%; object-fit: cover; }
    .bg-row .button { display: block; width: 100%; margin-bottom: 4px; font-size: 12px; }
    .bg-about-grid { display: grid; grid-template-columns: repeat(2, 200px); gap: 20px; margin: 16px 0; }
    .bg-about-cell strong { display: block; margin-bottom: 8px; }
    .bg-about-cell .bg-row { width: 184px; }
    .bg-about-cell .bg-preview { width: 168px; height: 120px; }
    .bg-single-preview { width: 160px; height: 160px; background: #ddd; border-radius: 6px; overflow: hidden; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; }
    .bg-single-preview img { width: 100%; height: 100%; object-fit: cover; }
    ';
}

/* ── Admin: settings page HTML ──────────────────────────────────────────── */
function bg_settings_page() {
    $tab  = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'hero';
    $tabs = ['hero' => 'Hero Slides', 'slider' => 'Image Slider', 'about' => 'About Photos', 'ticker' => 'Ticker', 'contact' => 'Contact Info'];
    ?>
    <div class="wrap bg-admin">
        <h1>Brushgunz Media Manager</h1>
        <nav class="nav-tab-wrapper" style="margin-bottom:0">
            <?php foreach ($tabs as $k => $label): ?>
                <a href="<?php echo admin_url('admin.php?page=brushgunz&tab=' . $k); ?>"
                   class="nav-tab <?php echo $tab === $k ? 'nav-tab-active' : ''; ?>">
                    <?php echo esc_html($label); ?>
                </a>
            <?php endforeach; ?>
        </nav>

        <form method="post" action="options.php" class="bg-form" style="padding-top:24px">
            <?php settings_fields('bg_options'); ?>

            <?php if ($tab === 'hero'): ?>
                <h2>Hero Slides</h2>
                <p>Full-screen images or videos that cycle behind the Brushgunz title. <strong>Order matches upload order.</strong></p>
                <div class="bg-list" id="bg-hero-list" data-name="bg_hero_slides">
                    <?php foreach (bg_ids('bg_hero_slides') as $id) bg_admin_row('bg_hero_slides', $id); ?>
                </div>
                <button type="button" class="button button-secondary bg-add-btn" data-list="bg-hero-list" data-name="bg_hero_slides">+ Add Slide</button>

            <?php elseif ($tab === 'slider'): ?>
                <h2>Image Slider</h2>
                <p>Photos or videos in the horizontal strip below the bio text.</p>
                <div class="bg-list" id="bg-slider-list" data-name="bg_slider_images">
                    <?php foreach (bg_ids('bg_slider_images') as $id) bg_admin_row('bg_slider_images', $id); ?>
                </div>
                <button type="button" class="button button-secondary bg-add-btn" data-list="bg-slider-list" data-name="bg_slider_images">+ Add Slide</button>

            <?php elseif ($tab === 'about'): ?>
                <h2>About Photos</h2>
                <p>The 2×2 photo grid on the about page. Upload one image per cell.</p>
                <?php
                $cells = array_pad(bg_ids('bg_about_photos'), 4, 0);
                $labels = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'];
                ?>
                <div class="bg-about-grid">
                    <?php for ($i = 0; $i < 4; $i++): ?>
                        <div class="bg-about-cell">
                            <strong><?php echo $labels[$i]; ?></strong>
                            <?php bg_admin_row('bg_about_photos', $cells[$i]); ?>
                        </div>
                    <?php endfor; ?>
                </div>

                <h2 style="margin-top:2rem">Profile Photo</h2>
                <p>Portrait in the footer of the home and about pages.</p>
                <?php
                $pid  = absint(get_option('bg_profile_pic', 0));
                $purl = $pid ? wp_get_attachment_image_url($pid, 'medium') : '';
                ?>
                <input type="hidden" name="bg_profile_pic" id="bg-profile-id" value="<?php echo $pid; ?>">
                <div class="bg-single-preview" id="bg-profile-preview">
                    <?php if ($purl): ?><img src="<?php echo esc_url($purl); ?>" alt=""><?php endif; ?>
                </div>
                <button type="button" class="button bg-pick-single"><?php echo $pid ? 'Change Photo' : 'Upload Photo'; ?></button>
                <?php if ($pid): ?>
                    <button type="button" class="button bg-remove-single" style="margin-left:8px">Remove</button>
                <?php endif; ?>

            <?php elseif ($tab === 'ticker'): ?>
                <h2>Ticker Text</h2>
                <p>The scrolling marquee line on the homepage. Keep it short and punchy — it repeats automatically.</p>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="bg_ticker">Ticker message</label></th>
                        <td>
                            <input type="text" id="bg_ticker" name="bg_ticker_text"
                                 value="<?php echo esc_attr(get_option('bg_ticker_text', 'Less bullshit, more creative stuff ppl. Please.')); ?>"
                                 class="large-text">
                            <p class="description">The dot separator between repetitions is added automatically.</p>
                        </td>
                    </tr>
                </table>

            <?php elseif ($tab === 'contact'): ?>
                <h2>Contact Info</h2>
                <p>Displayed on the contact page and in footers across the site.</p>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="bg_phone">Phone</label></th>
                        <td><input type="text" id="bg_phone" name="bg_contact_phone"
                             value="<?php echo esc_attr(get_option('bg_contact_phone', '+972 45 447 5675')); ?>"
                             class="regular-text" placeholder="+972 ..."></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="bg_email">Email</label></th>
                        <td><input type="email" id="bg_email" name="bg_contact_email"
                             value="<?php echo esc_attr(get_option('bg_contact_email', 'chen@brushgunz.com')); ?>"
                             class="regular-text"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="bg_ig">Instagram</label></th>
                        <td>
                            <span style="line-height:30px;margin-right:4px">@</span>
                            <input type="text" id="bg_ig" name="bg_contact_instagram"
                                 value="<?php echo esc_attr(get_option('bg_contact_instagram', 'chenhanozel')); ?>"
                                 placeholder="handle without @" style="width:240px">
                        </td>
                    </tr>
                </table>
            <?php endif; ?>

            <?php submit_button('Save Changes'); ?>
        </form>
    </div>
    <?php
}

/* ── Admin: render one media row ─────────────────────────────────────────── */
function bg_admin_row($name, $id = 0) {
    $url   = $id ? wp_get_attachment_image_url($id, 'medium') : '';
    $mime  = $id ? get_post_mime_type($id) : '';
    $video = $mime && strpos($mime, 'video') !== false;
    ?>
    <div class="bg-row">
        <input type="hidden" name="<?php echo esc_attr($name); ?>[]" class="bg-id" value="<?php echo (int) $id; ?>">
        <div class="bg-preview">
            <?php if ($id && !$video && $url): ?>
                <img src="<?php echo esc_url($url); ?>" alt="">
            <?php elseif ($id && $video): ?>
                &#9654; video
            <?php endif; ?>
        </div>
        <button type="button" class="button bg-pick"><?php echo $id ? 'Change' : 'Upload'; ?></button>
        <button type="button" class="button bg-remove" <?php echo $id ? '' : 'style="display:none"'; ?>>Remove</button>
    </div>
    <?php
}
