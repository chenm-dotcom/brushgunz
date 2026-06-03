<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<?php $light = !is_front_page(); ?>
<nav id="mainNav"<?php if ($light) echo ' class="nav-light"'; ?> role="navigation" aria-label="Main">
  <ul class="nav-links">
    <li><a href="<?php echo esc_url(home_url('/')); ?>"<?php if (is_front_page()) echo ' class="active"'; ?>>Brushgunz</a></li>
    <li><a href="<?php echo bg_page_url('about'); ?>"<?php if (is_page('about')) echo ' class="active"'; ?>>About</a></li>
    <li><a href="<?php echo bg_page_url('work'); ?>"<?php if (is_page('work')) echo ' class="active"'; ?>>Work</a></li>
    <li><a href="<?php echo bg_page_url('contact'); ?>"<?php if (is_page('contact')) echo ' class="active"'; ?>>Contact</a></li>
  </ul>
</nav>

<button class="mob-menu-btn" id="mobMenuBtn" aria-label="Open menu" aria-expanded="false">
  <span></span><span></span><span></span>
</button>

<div class="mob-overlay" id="mobOverlay" role="dialog" aria-modal="true" aria-label="Navigation">
  <a href="<?php echo esc_url(home_url('/')); ?>">Brushgunz</a>
  <a href="<?php echo bg_page_url('about'); ?>">About</a>
  <a href="<?php echo bg_page_url('work'); ?>">Work</a>
  <a href="<?php echo bg_page_url('contact'); ?>">Contact</a>
  <button class="mob-close" id="mobClose" aria-label="Close menu">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="4" y1="4" x2="20" y2="20"/>
      <line x1="20" y1="4" x2="4" y2="20"/>
    </svg>
  </button>
</div>
