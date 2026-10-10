(function () {
  var btn = document.getElementById('hp-search');
  if (!btn) return;

  var index = null, overlay, input, list, shown = [], active = 0;

  function lower(s) { return String(s).toLowerCase(); }

  function load(cb) {
    if (index) return cb();
    fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        data.forEach(function (e) { e.lower = lower(e.text); });
        index = data;
        cb();
      })
      .catch(function () { index = []; cb(); });
  }

  function count(hay, term) {
    var n = 0, i = hay.indexOf(term);
    while (i !== -1 && n < 10) { n++; i = hay.indexOf(term, i + term.length); }
    return n;
  }

  function score(e, terms) {
    var names = [lower(e.title)].concat((e.aliases || []).map(lower));
    var s = 0;
    for (var t = 0; t < terms.length; t++) {
      var term = terms[t], found = false;
      for (var n = 0; n < names.length; n++) {
        if (names[n] === term) { s += 100; found = true; }
        else if (names[n].indexOf(term) === 0) { s += 60; found = true; }
        else if (names[n].indexOf(term) > -1) { s += 40; found = true; }
      }
      var c = count(e.lower, term);
      if (c) { s += c; found = true; }
      if (!found) return 0;
    }
    return s;
  }

  function highlight(parent, text, terms) {
    var re = new RegExp('(' + terms.map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    text.split(re).forEach(function (part, i) {
      if (i % 2) {
        var m = document.createElement('mark');
        m.textContent = part;
        parent.appendChild(m);
      } else if (part) {
        parent.appendChild(document.createTextNode(part));
      }
    });
  }

  function snippet(e, terms) {
    var pos = -1;
    for (var i = 0; i < terms.length; i++) {
      var p = e.lower.indexOf(terms[i]);
      if (p !== -1 && (pos === -1 || p < pos)) pos = p;
    }
    if (pos === -1) return e.description || '';
    var start = Math.max(0, pos - 50);
    var out = e.text.slice(start, pos + 110).trim();
    return (start > 0 ? '… ' : '') + out + (pos + 110 < e.text.length ? ' …' : '');
  }

  function render() {
    var q = lower(input.value).trim();
    list.textContent = '';
    shown = [];
    active = 0;
    if (!q) return;

    var terms = q.split(/\s+/);
    var hits = [];
    index.forEach(function (e) {
      var s = score(e, terms);
      if (s) hits.push({ e: e, s: s });
    });
    hits.sort(function (a, b) { return b.s - a.s; });
    shown = hits.slice(0, 10);

    if (!shown.length) {
      var none = document.createElement('div');
      none.className = 'search-empty';
      none.textContent = 'Nothing found.';
      list.appendChild(none);
      return;
    }

    shown.forEach(function (h, i) {
      var a = document.createElement('a');
      a.className = 'search-result' + (i === 0 ? ' active' : '');
      a.href = h.e.url;

      var head = document.createElement('div');
      head.className = 'search-result-head';
      var title = document.createElement('span');
      title.className = 'search-result-title';
      highlight(title, h.e.title, terms);
      var type = document.createElement('span');
      type.className = 'search-result-type';
      type.textContent = h.e.type;
      head.appendChild(title);
      head.appendChild(type);
      a.appendChild(head);

      var snip = snippet(h.e, terms);
      if (snip) {
        var sn = document.createElement('div');
        sn.className = 'search-result-snippet';
        highlight(sn, snip, terms);
        a.appendChild(sn);
      }

      a.addEventListener('mousemove', function () { setActive(i); });
      list.appendChild(a);
    });
  }

  function setActive(i) {
    var rows = list.querySelectorAll('.search-result');
    if (!rows.length) return;
    active = (i + rows.length) % rows.length;
    rows.forEach(function (r, n) { r.classList.toggle('active', n === active); });
    rows[active].scrollIntoView({ block: 'nearest' });
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="search-box">' +
        '<input class="search-input" type="text" placeholder="Search the site..." autocomplete="off" spellcheck="false">' +
        '<div class="search-results"></div>' +
        '<div class="search-hint">Enter to open &middot; Esc to close</div>' +
      '</div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector('.search-input');
    list = overlay.querySelector('.search-results');

    input.addEventListener('input', render);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter' && shown[active]) { window.location.href = shown[active].e.url; }
    });
  }

  function open() {
    if (!overlay) build();
    overlay.hidden = false;
    input.value = '';
    list.textContent = '';
    input.focus();
    load(function () {});
  }

  function close() { if (overlay) overlay.hidden = true; }

  btn.addEventListener('click', function (e) { e.preventDefault(); open(); });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select';
    if (e.key === 'Escape') close();
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); open(); }
  });
})();
