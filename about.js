/* ── Custom cursor ───────────────────────────────────────────────────────── */
(function () {
  const cur = document.getElementById('cursor');
  if (!cur) return;
  document.addEventListener('mousemove', (e) => {
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ── Nav scroll ─────────────────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Fit about title edge-to-edge ────────────────────────────────────────── */
function fitTitle() {
  const title = document.getElementById('aboutTitle');
  if (!title) return;
  title.style.fontSize = '200px';
  const ratio = window.innerWidth / title.scrollWidth;
  title.style.fontSize = Math.floor(200 * ratio) + 'px';
}
document.fonts.ready.then(() => {
  fitTitle();
  window.addEventListener('resize', fitTitle, { passive: true });
});

/* ── Photo cells fade in on scroll ──────────────────────────────────────── */
const cells = document.querySelectorAll('.photo-cell');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
cells.forEach(cell => observer.observe(cell));

/* ── About bubble — bounces on desktop, tilt-driven on mobile ────────────── */
(function () {
  const bubble = document.querySelector('.about-bubble');
  const header = document.querySelector('.about-header');
  if (!bubble || !header) return;

  const S = 100;
  let x, y, vx, vy;
  const label = bubble.querySelector('span');
  let rafId;
  let tiltX = 0, tiltY = 0;

  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  function randSpeed() { return 2.2 + Math.random() * 1.8; }

  function init() {
    const w = header.offsetWidth;
    const h = header.offsetHeight;
    x = Math.random() * (w - S);
    y = Math.random() * (h - S);
    const angle = Math.random() * Math.PI * 2;
    const spd = randSpeed();
    vx = Math.cos(angle) * spd;
    vy = Math.sin(angle) * spd;
  }

  function tick(now) {
    const w = header.offsetWidth;
    const h = header.offsetHeight;

    if (isMobile) {
      // Tilt adds gravity-like acceleration; damping prevents runaway speed
      vx = vx * 0.97 + tiltX * 0.5;
      vy = vy * 0.97 + tiltY * 0.5;
      const spd = Math.sqrt(vx * vx + vy * vy);
      if (spd > 12) { vx = vx / spd * 12; vy = vy / spd * 12; }
      x += vx; y += vy;
      if (x <= 0)     { x = 0;     vx =  Math.abs(vx) * 0.7; }
      if (x >= w - S) { x = w - S; vx = -Math.abs(vx) * 0.7; }
      if (y <= 0)     { y = 0;     vy =  Math.abs(vy) * 0.7; }
      if (y >= h - S) { y = h - S; vy = -Math.abs(vy) * 0.7; }
    } else {
      x += vx; y += vy;
      if (x <= 0)     { x = 0;     vx =  randSpeed(); }
      if (x >= w - S) { x = w - S; vx = -randSpeed(); }
      if (y <= 0)     { y = 0;     vy =  randSpeed(); }
      if (y >= h - S) { y = h - S; vy = -randSpeed(); }
    }

    bubble.style.left = x + 'px';
    bubble.style.top  = y + 'px';
    const wave = Math.sin(now / 400);
    const sy = 1 + wave * 0.06;
    const sx = 1 - wave * 0.04;
    const a = 50 + wave * 8, b = 50 - wave * 8;
    bubble.style.transform = `scaleX(${sx}) scaleY(${sy})`;
    bubble.style.borderRadius = `${a}% ${b}% ${b}% ${a}% / ${a}% ${a}% ${b}% ${b}%`;
    if (label) label.style.transform = `scaleX(${1/sx}) scaleY(${1/sy})`;
    rafId = requestAnimationFrame(tick);
  }

  // Device orientation: gamma = left/right tilt, beta = front/back tilt
  function handleOrientation(e) {
    const gamma = e.gamma || 0;
    const beta  = (e.beta  || 0) - 30; // ~30° is natural phone-hold angle
    tiltX = Math.max(-1, Math.min(1, gamma / 45));
    tiltY = Math.max(-1, Math.min(1, beta  / 45));
  }

  function enableOrientation() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires explicit permission from a user gesture
      DeviceOrientationEvent.requestPermission()
        .then(state => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          }
        })
        .catch(() => {});
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      // Android / older iOS — no permission needed
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  if (isMobile) {
    document.addEventListener('touchstart', enableOrientation, { once: true });
  }

  init();
  rafId = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(tick);
  });
})();

/* ── Mobile menu ─────────────────────────────────────────────────────────── */
const mobBtn     = document.getElementById('mobMenuBtn');
const mobOverlay = document.getElementById('mobOverlay');

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
document.getElementById('mobClose').addEventListener('click', closeMob);
document.querySelectorAll('.mob-overlay a').forEach(link => {
  link.addEventListener('click', closeMob);
});

window.addEventListener('scroll', () => {
  mobBtn.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });
