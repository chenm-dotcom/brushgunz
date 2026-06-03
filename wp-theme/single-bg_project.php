<?php get_header(); if (!have_posts()) { wp_redirect(home_url()); exit; } the_post(); ?>

<div class="project-page">

  <!-- LEFT: sticky info panel -->
  <div class="project-left">
    <a href="<?php echo bg_page_url('work'); ?>" class="project-back">← All Work</a>
    <?php
    $cats = get_post_meta(get_the_ID(), '_bg_cats', true);
    if (!is_array($cats) || empty($cats)) {
        $old = get_post_meta(get_the_ID(), '_bg_cat', true);
        $cats = $old ? [$old] : [];
    }
    if ($cats): foreach ($cats as $cat): ?>
      <span class="project-cat"><?php echo esc_html($cat); ?></span>
    <?php endforeach; endif; ?>
    <h1 class="project-title"><?php the_title(); ?></h1>
    <?php if (get_the_content()): ?>
      <div class="project-content"><?php the_content(); ?></div>
    <?php endif; ?>
  </div>

  <!-- RIGHT: scrollable gallery -->
  <div class="project-right">
    <?php
    $gallery  = get_post_meta(get_the_ID(), '_bg_gallery', true);
    if (!is_array($gallery)) $gallery = [];
    $thumb_id = get_post_thumbnail_id();
    $has_any  = !empty($gallery) || $thumb_id;

    // featured image always first, avoid duplicating if already in gallery
    if ($thumb_id && !in_array($thumb_id, $gallery)) {
        array_unshift($gallery, $thumb_id);
    }

    foreach ($gallery as $gid):
        $url = wp_get_attachment_image_url($gid, 'large');
        if (!$url) continue;
    ?>
      <div class="project-img" style="background-image:url('<?php echo esc_url($url); ?>')" role="img" aria-label="Project image"></div>
    <?php endforeach; ?>

    <?php if (!$has_any): ?>
      <div class="project-img-empty">No images yet — edit this project and add images via the "Project Gallery Images" panel.</div>
    <?php endif; ?>
  </div>

</div>

<?php get_footer(); ?>
