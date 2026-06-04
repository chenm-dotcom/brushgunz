/* ── Nav scroll ─────────────────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Fade-in gallery images on scroll ───────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  fadeEls.forEach(el => observer.observe(el));
}

/* ── Mobile menu ─────────────────────────────────────────────────────────── */
const mobBtn     = document.getElementById('mobMenuBtn');
const mobOverlay = document.getElementById('mobOverlay');

if (mobBtn && mobOverlay) {
  function openMob() {
    mobOverlay.style.display = 'flex';
    requestAnimationFrame(() => mobOverlay.classList.add('open'));
    mobBtn.classList.add('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMob() {
    mobOverlay.classList.remove('open');
    setTimeout(() => { mobOverlay.style.display = 'none'; }, 300);
    mobBtn.classList.remove('hidden');
    document.body.style.overflow = '';
  }

  mobBtn.addEventListener('click', openMob);
  const mobClose = document.getElementById('mobClose');
  if (mobClose) mobClose.addEventListener('click', closeMob);
  document.querySelectorAll('.mob-overlay a').forEach(link => link.addEventListener('click', closeMob));

  window.addEventListener('scroll', () => {
    mobBtn.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}
