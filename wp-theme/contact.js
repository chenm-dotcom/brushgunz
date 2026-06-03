/* ── Tel Aviv weather + time ─────────────────────────────────────────────── */
function weatherIcon(code) {
  if (code === 0)   return '☀';
  if (code <= 3)    return '⛅';
  if (code <= 48)   return '☁';
  if (code <= 67)   return '🌧';
  if (code <= 77)   return '❄';
  if (code <= 82)   return '🌦';
  return '⛈';
}

async function loadWeather() {
  const widget = document.getElementById('weatherWidget');
  if (!widget) return;
  try {
    const res  = await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.0853&longitude=34.7818&current=temperature_2m,weather_code&timezone=Asia%2FJerusalem');
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const icon = weatherIcon(data.current.weather_code);
    const time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false });
    widget.textContent = `${icon} ${temp}° · ${time} / Tel Aviv`;
  } catch (_) { /* silently skip if offline */ }
}

loadWeather();

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
