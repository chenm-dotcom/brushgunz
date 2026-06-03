<?php get_header(); ?>

<div class="page">

  <!-- ABOUT HEADER --------------------------------------------------------- -->
  <div class="about-header">
    <h1 class="about-title" id="aboutTitle">Brushgunz</h1>
    <div class="about-bubble" aria-hidden="true"><span>About</span></div>
    <div class="title-spacer"></div>
  </div>

  <!-- 2×2 PHOTO GRID ------------------------------------------------------- -->
  <?php $cells = array_pad(bg_ids('bg_about_photos'), 4, 0); ?>
  <div class="photo-grid" aria-hidden="true">
    <?php foreach (['c1','c2','c3','c4'] as $i => $cls):
      $url = $cells[$i] ? wp_get_attachment_image_url($cells[$i], 'large') : '';
    ?>
      <div class="photo-cell <?php echo $cls; ?>"<?php if ($url) echo ' style="background-image:url(\'' . esc_url($url) . '\')"'; ?>></div>
    <?php endforeach; ?>
  </div>

  <!-- BIO ------------------------------------------------------------------ -->
  <section class="bio-section">
    <?php
    $blocks = parse_blocks(get_post_field('post_content', get_the_ID()));
    $p_idx  = 0;
    foreach ($blocks as $block):
        if ($block['blockName'] !== 'core/paragraph') continue;
        $cls = $p_idx === 0 ? 'bio-black' : 'bio-blue';
        $p_idx++;
        $text = wp_kses_post($block['innerHTML']);
        // strip the block's own <p> tags so we control the element
        $inner = preg_replace('#^<p[^>]*>|</p>$#i', '', trim($text));
        echo '<p class="' . $cls . '">' . $inner . '</p>';
    endforeach;

    // fallback defaults if editor is empty
    if ($p_idx === 0):
    ?>
      <p class="bio-black">Brushgunz is Chen Mizrach who is a Creative Director &amp; photographer.</p>
      <p class="bio-blue">I create vision and clarity for brands. Help them create the content they didn't know they need. All with a playful and creative attitude.</p>
    <?php endif; ?>
  </section>

  <!-- FOOTER --------------------------------------------------------------- -->
  <?php
  $pid = absint(get_option('bg_profile_pic', 0));
  $profile_url = $pid ? wp_get_attachment_image_url($pid, 'medium_large') : '';
  $email = get_option('bg_contact_email',     'chen@brushgunz.com');
  $ig    = get_option('bg_contact_instagram', 'chenhanozel');
  ?>
  <footer>
    <div class="footer-top">
      <div class="footer-hey">Hey.</div>
      <div class="footer-pic" role="img" aria-label="Chen Mizrach photo"<?php if ($profile_url) echo ' style="background-image:url(\'' . esc_url($profile_url) . '\')"'; ?>></div>
      <p class="footer-desc">If this website got you interested in something<br>and you work on some kind of a lifestyle product,<br>don't hesitate to call or contact.</p>
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
