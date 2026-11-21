// Portfolio interactions. The theme is applied before paint by a tiny inline script in <head>;
// this file wires the toggle, nav, mobile menu, project filters, copy-email and scroll reveal.
const root = document.documentElement;

// Theme toggle — defaults to system preference, choice saved to localStorage.
const tb = document.getElementById('theme');
if (tb) {
  const sysDark = matchMedia('(prefers-color-scheme: dark)');
  const cur = () => root.dataset.theme || (sysDark.matches ? 'dark' : 'light');
  const label = () => tb.setAttribute('aria-label', cur() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  label();
  sysDark.addEventListener('change', label);
  tb.addEventListener('click', () => {
    root.dataset.theme = cur() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage blocked: theme lasts this visit only */ }
    label();
  });
}

// Nav shrinks once the page scrolls.
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu: dialog with focus trap; Esc closes and returns focus.
const menu = document.getElementById('mobile-menu');
const openB = document.getElementById('menu-open');
const closeB = document.getElementById('menu-close');
if (menu && openB && closeB) {
  const openMenu = () => { menu.classList.add('open'); openB.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; closeB.focus(); };
  const closeMenu = () => { menu.classList.remove('open'); openB.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; openB.focus(); };
  openB.addEventListener('click', openMenu);
  closeB.addEventListener('click', closeMenu);
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  menu.addEventListener('keydown', e => {
    if (e.key === 'Escape') return closeMenu();
    if (e.key !== 'Tab') return;
    const f = menu.querySelectorAll('a, button');
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

// Project filters.
const filters = document.querySelectorAll('.filter');
filters.forEach(b => b.addEventListener('click', () => {
  filters.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.hidden = !(b.dataset.f === 'all' || el.dataset.cat.split(' ').includes(b.dataset.f));
  });
}));

// Copy email.
const copy = document.getElementById('copy');
if (copy) copy.addEventListener('click', async () => {
  const msg = document.getElementById('copy-msg');
  try { await navigator.clipboard.writeText(copy.dataset.email); msg.textContent = 'Copied'; }
  catch (e) { msg.textContent = 'Copy failed — select the address instead'; }
});

// Scroll reveal (CSS disables it under prefers-reduced-motion).
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}
