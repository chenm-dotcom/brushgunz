<?php get_header(); the_post(); ?>

<div class="project-page">

  <!-- LEFT: sticky info panel -->
  <div class="project-left">
    <a href="<?php echo esc_url(get_permalink(get_page_by_path('work'))); ?>" class="project-back">← All Work</a>
    <span class="project-cat"><?php echo esc_html(get_post_meta(get_the_ID(), '_bg_cat', true)); ?></span>
    <h1 class="project-title"><?php the_title(); ?></h1>
    <?php if (get_the_content()): ?>
      <div class="project-content"><?php the_content(); ?></div>
    <?php endif; ?>
  </div>

  <!-- RIGHT: scrollable gallery -->
  <div class="project-right">
    <?php
    $gallery = get_post_meta(get_the_ID(), '_bg_gallery', true);
    if (!is_array($gallery)) $gallery = [];

    // always show featured image first if set
    $thumb_id = get_post_thumbnail_id();
    if ($thumb_id && !in_array($thumb_id, $gallery)) {
        array_unshift($gallery, $thumb_id);
    }

    foreach ($gallery as $gid):
        $url = wp_get_attachment_image_url($gid, 'large');
        if (!$url) continue;
    ?>
      <div class="project-img" style="background-image:url('<?php echo esc_url($url); ?>')" role="img" aria-label="Project image"></div>
    <?php endforeach; ?>

    <?php if (empty($gallery)): ?>
      <div class="project-img-empty">No images added yet. Edit this project and add images in the "Project Gallery Images" box.</div>
    <?php endif; ?>
  </div>

</div>

<?php get_footer(); ?>
