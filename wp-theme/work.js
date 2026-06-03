/* ── Nav scroll ─────────────────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
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
