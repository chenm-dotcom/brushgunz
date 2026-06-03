/* ── Nav scroll ─────────────────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Fit hero title to viewport ─────────────────────────────────────────── */
function fitTitle() {
  const title = document.getElementById('heroTitle');
  title.style.fontSize = '200px';
  const ratio = window.innerWidth / title.offsetWidth;
  title.style.fontSize = Math.floor(200 * ratio) + 'px';
}
document.fonts.ready.then(() => {
  fitTitle();
  window.addEventListener('resize', fitTitle, { passive: true });
});

/* ── Hero image slideshow ────────────────────────────────────────────────── */
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
let heroIdx = 0;
let heroTimer = null;

if (heroSlides.length) heroSlides[0].style.opacity = '1';

function goHero(i) {
  heroSlides[heroIdx].style.opacity = '0';
  heroIdx = ((i % heroSlides.length) + heroSlides.length) % heroSlides.length;
  heroSlides[heroIdx].style.opacity = '1';
}

function startHeroTimer() {
  if (!heroSlides.length) return;
  heroTimer = setInterval(() => goHero(heroIdx + 1), 5000);
}

startHeroTimer();

const heroEl = document.getElementById('hero');
heroEl.addEventListener('mouseenter', () => clearInterval(heroTimer));
heroEl.addEventListener('mouseleave', startHeroTimer);

/* ── Expand bio ─────────────────────────────────────────────────────────── */
const expandBtn  = document.getElementById('expandBtn');
const introExtra = document.getElementById('introExtra');

expandBtn.addEventListener('click', () => {
  const isOpen = introExtra.classList.toggle('open');
  expandBtn.classList.toggle('open', isOpen);
  expandBtn.setAttribute('aria-expanded', isOpen);
});

/* ── Image slider ───────────────────────────────────────────────────────── */
const imgSlides = Array.from(document.querySelectorAll('.img-slide'));
let imgIdx = 0;
let imgTimer = null;

if (imgSlides.length) imgSlides[0].style.opacity = '1';

function goSlide(i) {
  imgSlides[imgIdx].style.opacity = '0';
  imgIdx = ((i % imgSlides.length) + imgSlides.length) % imgSlides.length;
  imgSlides[imgIdx].style.opacity = '1';
}

function startSlideTimer() {
  if (!imgSlides.length) return;
  imgTimer = setInterval(() => goSlide(imgIdx + 1), 5000);
}

startSlideTimer();

document.getElementById('slideNext').addEventListener('click', () => {
  clearInterval(imgTimer);
  goSlide(imgIdx + 1);
  startSlideTimer();
});
document.getElementById('slidePrev').addEventListener('click', () => {
  clearInterval(imgTimer);
  goSlide(imgIdx - 1);
  startSlideTimer();
});

/* ── Floating hero bubbles ──────────────────────────────────────────────── */
(function () {
  const hero   = document.getElementById('hero');
  const words  = ['Creative', 'AI', 'Design', 'Social', 'Content', 'Photography'];
  const colors = ['#1a4aff', '#e8251a', '#1a1020', '#e8251a', '#1a4aff', '#1a1020'];

  function spawnBubble() {
    const el    = document.createElement('div');
    el.className = 'hero-bubble';

    const col  = colors[Math.floor(Math.random() * colors.length)];
    const word = words[Math.floor(Math.random() * words.length)];

    const s = 85;

    const startX     = 4 + Math.random() * 88;
    const startY     = hero.offsetHeight * (0.2 + Math.random() * 0.7);
    const amplitude  = 20 + Math.random() * 30;
    const freq       = 0.8 + Math.random() * 1.2;
    const speed      = 3000 + Math.random() * 3000;
    const riseTotal  = startY + s;

    Object.assign(el.style, {
      width: `${s}px`, height: `${s}px`,
      background: col,
      position: 'absolute',
      left: `${startX}%`, top: `${startY}px`,
      borderRadius: '50%', opacity: '0',
      transformOrigin: 'center center',
    });
    el.innerHTML = `<span>${word}</span>`;
    const label = el.querySelector('span');
    hero.appendChild(el);

    const t0 = performance.now();

    function frame(now) {
      if (document.hidden) { requestAnimationFrame(frame); return; }
      const t = Math.min((now - t0) / speed, 1);

      const y    = startY - t * (riseTotal + s * 2);
      const sinX = Math.sin(t * Math.PI * 2 * freq) * amplitude;
      const op   = t < 0.15 ? t / 0.15 : t < 0.80 ? 1 : 1 - (t - 0.80) / 0.20;

      const wave = Math.sin((now - t0) / 400);
      const sy   = 1 + wave * 0.06;
      const sx   = 1 - wave * 0.04;
      const a    = 50 + wave * 8;
      const b    = 50 - wave * 8;

      el.style.top          = `${y}px`;
      el.style.left         = `calc(${startX}% + ${sinX}px)`;
      el.style.opacity      = op;
      el.style.transform    = `scaleX(${sx}) scaleY(${sy})`;
      el.style.borderRadius = `${a}% ${b}% ${b}% ${a}% / ${a}% ${a}% ${b}% ${b}%`;
      label.style.transform = `scaleX(${1 / sx}) scaleY(${1 / sy})`;

      if (t < 1) requestAnimationFrame(frame);
      else el.remove();
    }
    requestAnimationFrame(frame);
  }

  const interval = window.innerWidth <= 768 ? 900 : 1200;
  for (let i = 0; i < 5; i++) setTimeout(spawnBubble, i * (interval / 5));
  let bubbleTimer = setInterval(spawnBubble, interval);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(heroTimer);
      clearInterval(bubbleTimer);
    } else {
      startHeroTimer();
      bubbleTimer = setInterval(spawnBubble, interval);
    }
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
