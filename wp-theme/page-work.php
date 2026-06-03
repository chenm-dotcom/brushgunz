<?php get_header(); ?>

<div class="page">

  <div class="grid-intro">
    <h2>Some of the projects I'm proud to say I was the owner of</h2>
  </div>

  <section class="grid-section" aria-label="Work">
    <ul class="grid" role="list">
      <?php
      $q = new WP_Query([
          'post_type'      => 'bg_project',
          'posts_per_page' => -1,
          'orderby'        => 'menu_order',
          'order'          => 'ASC',
      ]);
      while ($q->have_posts()):
          $q->the_post();
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

  <!-- FOOTER --------------------------------------------------------------- -->
  <?php
  $profile_url = '';
  $pid = absint(get_option('bg_profile_pic', 0));
  if ($pid) $profile_url = wp_get_attachment_image_url($pid, 'medium_large');
  $email = get_option('bg_contact_email',     'chen@brushgunz.com');
  $ig    = get_option('bg_contact_instagram', 'chenhanozel');
  ?>
  <footer>
    <div class="footer-top">
      <div class="footer-hey">Hey.</div>
      <div class="footer-pic" role="img" aria-label="Chen Mizrach photo"<?php if ($profile_url) echo ' style="background-image:url(\'' . esc_url($profile_url) . '\')"'; ?>></div>
      <p class="footer-desc">If this website got you interested in something and you work on some kind of a lifestyle product, don't hesitate to call or contact.</p>
    </div>
    <hr class="footer-divider">
    <div class="footer-links">
      <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
      <a href="https://instagram.com/<?php echo esc_attr($ig); ?>" target="_blank" rel="noopener noreferrer">@<?php echo esc_html($ig); ?></a>
    </div>
    <div class="footer-bar">
      <span>&copy; <?php echo date('Y'); ?> Brushgunz &mdash; Chen Mizrach</span>
      <span>Creative Direction &amp; Photography</span>
    </div>
  </footer>

</div>

<?php get_footer(); ?>
