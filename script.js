/* ===== Cleanup: remove the old "install app" service worker and caches ===== */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(r => r.unregister()))
    .catch(() => {});
}
if ('caches' in window) {
  caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
}

/* ===== Theme toggle ===== */
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('i');

  function sync() {
    const dark = root.getAttribute('data-theme') === 'dark';
    icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  sync();

  btn.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    if (dark) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
    sync();
  });
})();

/* ===== Mobile menu ===== */
(function () {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menuBtn');

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-bars';
  }

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();

/* ===== Typing effect ===== */
(function () {
  const el = document.getElementById('typing');
  const words = ['ICT Consultant', 'ICT Support Specialist', 'ICT Technician', 'Web Developer'];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = words[0]; return; }

  let w = 0, i = 0, deleting = false;
  function tick() {
    const word = words[w];
    el.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;

    if (!deleting && i === word.length) { deleting = true; delay = 1500; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
    else { i += deleting ? -1 : 1; }

    setTimeout(tick, delay);
  }
  tick();
})();

/* ===== Highlight current section in the nav ===== */
(function () {
  const links = [...document.querySelectorAll('.nav a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const sections = [...map.keys()].map(id => document.getElementById(id)).filter(Boolean);

  function update() {
    const line = window.scrollY + 120;
    let current = sections[0].id;
    sections.forEach(s => { if (s.offsetTop <= line) current = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1].id;
    links.forEach(a => a.classList.toggle('active', a === map.get(current)));
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ===== Reveal on scroll ===== */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, n) => {
    el.style.transitionDelay = (n % 3) * 70 + 'ms';
    io.observe(el);
  });
})();

/* ===== Footer year ===== */
document.getElementById('year').textContent = new Date().getFullYear();


/* ===== Preloader ===== */
(function () {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  const started = Date.now();
  const MIN = 700;       // show for at least this long so it doesn't flash
  let done = false;

  function hide() {
    if (done) return;
    done = true;
    pre.classList.add('hidden');
    setTimeout(() => pre.remove(), 600);
  }
  function onLoaded() { setTimeout(hide, Math.max(0, MIN - (Date.now() - started))); }

  if (document.readyState === 'complete') onLoaded();
  else window.addEventListener('load', onLoaded);

  setTimeout(hide, 4000); // never keep visitors waiting on a slow image
})();
