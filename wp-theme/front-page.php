<?php get_header(); ?>

<main>

  <!-- HERO ----------------------------------------------------------------- -->
  <section class="hero" id="hero" aria-label="Hero">
    <div class="hero-slides" id="heroSlides" aria-hidden="true">
      <?php foreach (bg_ids('bg_hero_slides') as $id) bg_slide_html($id, 'hero-slide'); ?>
    </div>
    <div class="hero-badge" aria-hidden="true"><span>Creative</span></div>
    <h1 class="hero-title" id="heroTitle" aria-label="Brushgunz"><span class="letter" style="animation-delay:0s">B</span><span class="letter" style="animation-delay:.07s">r</span><span class="letter" style="animation-delay:.14s">u</span><span class="letter" style="animation-delay:.21s">s</span><span class="letter" style="animation-delay:.28s">h</span><span class="letter" style="animation-delay:.35s">g</span><span class="letter" style="animation-delay:.42s">u</span><span class="letter" style="animation-delay:.49s">n</span><span class="letter" style="animation-delay:.56s">z</span></h1>
  </section>

  <!-- INTRO ---------------------------------------------------------------- -->
  <section class="intro" id="about">
    <p class="intro-text">Brushgunz is Chen Mizrach who is a Creative Director &amp; photographer.</p>
    <button class="expand-btn" id="expandBtn" aria-expanded="false">
      <span class="btn-label-open">More</span>
      <span class="btn-label-close">Close</span>
    </button>
    <div class="intro-extra" id="introExtra" aria-hidden="true">
      <p>I create vision and clarity for brands. Help them create the content they didn't know they need. All with a playful and creative attitude.</p>
    </div>
  </section>

  <!-- IMAGE SLIDER --------------------------------------------------------- -->
  <section class="img-slider" id="imgSlider" aria-label="Portfolio images">
    <div class="img-slider-track" id="imgTrack">
      <?php foreach (bg_ids('bg_slider_images') as $id) bg_slide_html($id, 'img-slide'); ?>
    </div>
    <button class="slide-zone zone-prev" id="slidePrev" aria-label="Previous image">
      <div class="slide-circle" aria-hidden="true"><span>Prev</span></div>
    </button>
    <button class="slide-zone zone-next" id="slideNext" aria-label="Next image">
      <div class="slide-circle" aria-hidden="true"><span>Next</span></div>
    </button>
  </section>

  <!-- TICKER --------------------------------------------------------------- -->
  <?php
  $ticker = esc_html(get_option('bg_ticker_text', 'Less bullshit, more creative stuff ppl. Please.'));
  $ticker_item = '<span class="ticker-item">' . $ticker . '</span><span class="ticker-dot"></span>';
  $ticker_row  = str_repeat($ticker_item, 4);
  ?>
  <div class="ticker" aria-hidden="true">
    <div class="ticker-inner" id="tickerInner">
      <span class="ticker-half" id="tickerHalf1"><?php echo $ticker_row; ?></span>
      <span class="ticker-half" id="tickerHalf2"><?php echo $ticker_row; ?></span>
    </div>
  </div>

  <!-- WORK GRID (6 cards) -------------------------------------------------- -->
  <div class="grid-intro">
    <h2>Some of the projects I'm proud to say I was the owner of</h2>
  </div>
  <section class="grid-section" id="work" aria-label="Work">
    <ul class="grid" role="list">
      <?php
      $q = new WP_Query([
          'post_type'      => 'bg_project',
          'posts_per_page' => 6,
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

  <div class="view-all-row">
    <a href="<?php echo bg_page_url('work'); ?>" class="view-all-btn">View All Work</a>
  </div>

</main>

<!-- FOOTER --------------------------------------------------------------- -->
<?php
$profile_url = '';
$pid = absint(get_option('bg_profile_pic', 0));
if ($pid) $profile_url = wp_get_attachment_image_url($pid, 'medium_large');
$email    = get_option('bg_contact_email',     'chen@brushgunz.com');
$ig       = get_option('bg_contact_instagram', 'chenhanozel');
?>
<footer id="contact">
  <div class="footer-top">
    <div class="footer-hey">Hey.</div>
    <div class="footer-pic" role="img" aria-label="Chen Mizrach photo"<?php if ($profile_url) echo ' style="background-image:url(\'' . esc_url($profile_url) . '\')"'; ?>></div>
    <p class="footer-desc">If this website got you interested in something<span class="desk-br"><br></span> and you work on some kind of a lifestyle product,<span class="desk-br"><br></span> don't hesitate to call or contact.</p>
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

<?php get_footer(); ?>
