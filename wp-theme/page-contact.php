<?php get_header(); ?>

<?php
$phone = get_option('bg_contact_phone',     '+972 45 447 5675');
$email = get_option('bg_contact_email',     'chen@brushgunz.com');
$ig    = get_option('bg_contact_instagram', 'chenhanozel');
?>

<main class="contact-page">

  <div class="contact-body">
    <p class="contact-intro">
      If you like what you saw here and wanna chitchat,
      you can either call me, send me an email,
      or DM me on Instagram since I'm there all the time.
    </p>

    <div class="contact-links">
      <a href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a>
      <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
      <a href="https://instagram.com/<?php echo esc_attr($ig); ?>" target="_blank" rel="noopener noreferrer">@<?php echo esc_html($ig); ?></a>
    </div>
  </div>

  <footer class="contact-footer">
    <span>&copy; <?php echo date('Y'); ?> Brushgunz &mdash; Chen Mizrach</span>
    <span class="weather-widget" id="weatherWidget"></span>
    <span>Creative Direction &amp; Photography</span>
  </footer>

</main>

<?php get_footer(); ?>
