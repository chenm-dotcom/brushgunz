<?php get_header(); if (!have_posts()) { wp_redirect(home_url()); exit; } the_post();
$current_id = get_the_ID();
?>

<div class="project-page">

  <!-- LEFT: sticky info panel -->
  <div class="project-left">
    <?php
    $cats = get_post_meta($current_id, '_bg_cats', true);
    if (!is_array($cats) || empty($cats)) {
        $old = get_post_meta($current_id, '_bg_cat', true);
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
    $gallery  = get_post_meta($current_id, '_bg_gallery', true);
    if (!is_array($gallery)) $gallery = [];
    $thumb_id = get_post_thumbnail_id();
    $has_any  = !empty($gallery) || $thumb_id;

    if ($thumb_id && !in_array($thumb_id, $gallery)) {
        array_unshift($gallery, $thumb_id);
    }

    foreach ($gallery as $gid):
        $url = wp_get_attachment_image_url($gid, 'large');
        if (!$url) continue;
    ?>
      <div class="project-img fade-in" style="background-image:url('<?php echo esc_url($url); ?>')" role="img" aria-label="Project image"></div>
    <?php endforeach; ?>

    <?php if (!$has_any): ?>
      <div class="project-img-empty">No images yet — add images via the "Project Gallery Images" panel when editing this project.</div>
    <?php endif; ?>
  </div>

</div>

<!-- MORE PROJECTS ---------------------------------------------------------- -->
<?php
$more = new WP_Query([
    'post_type'      => 'bg_project',
    'posts_per_page' => 4,
    'orderby'        => 'rand',
    'post__not_in'   => [$current_id],
]);
if ($more->have_posts()):
?>
<section class="more-projects">
  <h2 class="more-projects-title">More stuff I made and was a part of</h2>
  <ul class="grid" role="list">
    <?php while ($more->have_posts()): $more->the_post();
      $cat   = esc_html(get_post_meta(get_the_ID(), '_bg_cat', true));
      $thumb = get_the_post_thumbnail_url(null, 'large');
    ?>
      <li class="grid-card">
        <a href="<?php the_permalink(); ?>" class="grid-card-link" aria-label="<?php the_title_attribute(); ?>">
          <span class="grid-card-cat"><?php echo $cat; ?></span>
          <div class="grid-card-img"<?php if ($thumb) echo ' style="background-image:url(\'' . esc_url($thumb) . '\')"'; ?>></div>
          <span class="grid-card-title"><?php the_title(); ?></span>
        </a>
      </li>
    <?php endwhile; wp_reset_postdata(); ?>
  </ul>
</section>
<?php endif; ?>

<?php get_footer(); ?>
