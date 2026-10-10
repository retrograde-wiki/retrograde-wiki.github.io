const headerHTML = `
<header>
  <div class="header-player" id="header-player">
    <button class="hp-btn" id="hp-prev" title="Previous"><i class="fa-solid fa-backward-step"></i></button>
    <button class="hp-btn" id="hp-play" title="Play / Pause"><i class="fa-solid fa-play"></i></button>
    <button class="hp-btn" id="hp-next" title="Next"><i class="fa-solid fa-forward-step"></i></button>
    <div class="hp-marquee">
      <div class="hp-title">Pick a song...</div>
      <select class="hp-select" id="hp-select" aria-label="Pick a song"></select>
    </div>
  </div>
  <div class="header-links">
    <h3><a href="/index.html">HOME</a></h3>
    <h3><a href="/about.html">ABOUT</a></h3>
    <h3><a href="/lore/">LORE</a></h3>
    <h3><a href="/zones.html">ZONES</a></h3>
    <h3><a href="/organizations.html" data-match="/monoliths,/institutes,/networks,/companies">ORGANIZATIONS</a></h3>

    <h3><a href="/gallery.html">GALLERY</a></h3>
    <h3><a href="/meta.html">META</a></h3>
    <h3><a href="#" id="hp-search" class="hp-btn hp-sitemap hp-search" title="Search (Ctrl+K)"><i class="fa-solid fa-magnifying-glass"></i></a></h3>
    <h3><a href="/sitemap.html" class="hp-btn hp-sitemap" title="Sitemap"><i class="fa-solid fa-signs-post"></i></a></h3>
    <h3><div class="hp-theme" title="Theme">
      <div class="hp-btn"><i class="fa-solid fa-palette"></i></div>
      <select class="hp-select" id="theme-select" aria-label="Pick a theme"></select>
    </div></h3>
  </div>
</header>
`;

// <h3><a href="/characters.html">CHARACTERS</a></h3>
// ^^^ removed for now
document.getElementById('header-placeholder').innerHTML = headerHTML;

if (window.initHoverSounds) {
  window.initHoverSounds();
}

const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://use.typekit.net/zce6xzy.css';
document.head.appendChild(fontLink);


(function () {
  var path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.header-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var h = href.replace(/index\.html$/, '');
    var section = h.replace(/\.html$/, '/');
    var match = (h === '/')
      ? path === '/'
      : (path === h || path.indexOf(section) === 0);
    if (match) a.classList.add('current');
  });
})();

(function () {
  var path = location.pathname.replace(/index\.html$/, '');
  var links = Array.from(document.querySelectorAll('.header-links a')).filter(function (a) {
    var href = a.getAttribute('href');
    return href && href !== '#';
  });

  function clean(a) { return a.getAttribute('href').replace(/index\.html$/, ''); }

  var exact = links.filter(function (a) { return clean(a) === path; });

  if (exact.length) {
    exact.forEach(function (a) { a.classList.add('current'); });
    return;
  }

  links.forEach(function (a) {
    var h = clean(a);
    if (h === '/') return;
    var section = h.replace(/\.html$/, '/');
    var extra = (a.getAttribute('data-match') || '').split(',').filter(Boolean);
    var inExtra = extra.some(function (p) { return path.indexOf(p) === 0; });
    if (path.indexOf(section) === 0 || inExtra) a.classList.add('current');
  });
})();

document.addEventListener('click', function (e) {
  var img = e.target.closest('.gallery img, .art-grid img, .map-container img');
  if (!img) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  var big = document.createElement('img');
  big.src = img.dataset.full || img.currentSrc || img.src;
  big.alt = img.alt;
  box.appendChild(big);
  document.body.appendChild(box);

  function close() {
    box.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(ev) { if (ev.key === 'Escape') close(); }

  box.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
});

const playerScript = document.createElement('script');
playerScript.src = '/style/player.js';
document.body.appendChild(playerScript);

// CHANGE THEMES HEREE VVVV
(function () {
  var THEMES = [
    { id: 'dark-1',  name: 'Classic Dark' },
    { id: 'dark-2', name: 'Retro Dark' },
    { id: 'light-1', name: 'Classic Dark' },
    { id: 'light-2', name: 'Retro Light' }
  ];
  var KEY = 'retrograde-theme';
  var root = document.documentElement;

  var saved = THEMES[0].id;
  try { saved = localStorage.getItem(KEY) || saved; } catch (e) {}
  if (!THEMES.some(function (t) { return t.id === saved; })) saved = THEMES[0].id;
  root.setAttribute('data-theme', saved);

  var select = document.getElementById('theme-select');
  if (!select) return;

  THEMES.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t.id;
    o.textContent = t.name;
    select.appendChild(o);
  });
  select.value = saved;

  select.addEventListener('change', function () {
    root.setAttribute('data-theme', select.value);
    try { localStorage.setItem(KEY, select.value); } catch (e) {}
  });
})();

// Favicon for every page (change the path here, nowhere else)
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/im/favicon.png';
document.head.appendChild(favicon);

const searchScript = document.createElement('script');
searchScript.src = '/style/search.js';
document.body.appendChild(searchScript);
