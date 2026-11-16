/* Komponen tampilan bersama: header, footer, kartu, pager, pembersih HTML isi artikel. */
(function () {
  var AJ = window.AJ;
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var slugify = function (s) {
    return String(s).toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };
  var NOW = function () { return new Date(); };

  var ICON = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    ig: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
  };

  var UI = { esc: esc, slugify: slugify, ICON: ICON, active: 'home', cats: [] };

  /* ---------- format ---------- */
  var fmtLong = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  var fmtShort = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  var fmtFull = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  UI.dateLong = function (p) { return p.noDate || !p.date ? '' : fmtLong.format(new Date(p.date)); };
  UI.dateShort = function (p) { return p.noDate || !p.date ? '' : fmtShort.format(new Date(p.date)); };
  UI.ago = function (p) {
    if (p.noDate || !p.date) return '';
    var diff = (NOW() - new Date(p.date)) / 1000;
    if (diff < 0 || diff > 7 * 86400) return UI.dateShort(p);
    if (diff < 3600) return Math.max(1, Math.round(diff / 60)) + ' menit lalu';
    if (diff < 86400) return Math.round(diff / 3600) + ' jam lalu';
    return Math.round(diff / 86400) + ' hari lalu';
  };
  UI.readMin = function (p) {
    if (!p.content) return 0;
    var d = new DOMParser().parseFromString(p.content, 'text/html');
    var words = (d.body.textContent || '').trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };
  UI.hl = function (text, q) {
    if (!q) return esc(text);
    var w = q.trim().split(/\s+/).filter(Boolean).map(function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    if (!w.length) return esc(text);
    return String(text).split(new RegExp('(' + w.join('|') + ')', 'gi')).map(function (part, i) {
      return i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part);
    }).join('');
  };

  /* ---------- tautan ---------- */
  UI.postHref = function (p) { return 'artikel.html?slug=' + encodeURIComponent(p.slug); };
  UI.catHref = function (slug) { return 'cari.html?kategori=' + encodeURIComponent(slug); };

  /* ---------- gambar ---------- */
  var looksLikeFile = /(\.(jpe?g|png|webp|gif)$)|^IMG[_-]|^[A-Za-z0-9_-]{18,}$/;
  UI.img = function (p, size) {
    if (!p.img) return '';
    var src = p.img[size] || p.img.full;
    var alt = p.imgAlt && !looksLikeFile.test(p.imgAlt) ? p.imgAlt : p.title;
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">';
  };
  UI.imgBox = function (p, size, ratio) {
    return '<div class="img ' + (ratio || 'r169') + '">' + UI.img(p, size) + '</div>';
  };
  UI.badge = function (p, hot) {
    var c = p.cats && p.cats[0];
    return c ? '<span class="badge' + (hot ? ' hot' : '') + '">' + esc(c.name) + '</span>' : '';
  };

  /* ---------- kartu ---------- */
  UI.metaLine = function (p, opt) {
    opt = opt || {};
    var bits = [];
    var d = UI.dateShort(p); if (d) bits.push('<time datetime="' + esc(p.date) + '">' + esc(d) + '</time>');
    if (opt.author) bits.push(esc(p.author));
    return '<div class="meta">' + bits.join('<span class="sep">·</span>') + '</div>';
  };
  UI.card = function (p) {
    return '<a class="card" href="' + UI.postHref(p) + '">' + UI.imgBox(p, 'medium', 'r169') +
      '<div class="b">' + (p.cats[0] ? '<span class="eyebrow">' + esc(p.cats[0].name) + '</span>' : '') +
      '<h3>' + esc(p.title) + '</h3>' + UI.metaLine(p) + '</div></a>';
  };
  UI.row = function (p, q) {
    return '<a class="row" href="' + UI.postHref(p) + '">' + UI.imgBox(p, 'medium', 'r32') +
      '<div>' + (p.cats[0] ? '<span class="eyebrow">' + esc(p.cats[0].name) + '</span>' : '') +
      '<h3>' + UI.hl(p.title, q) + '</h3>' +
      (p.excerpt ? '<p>' + UI.hl(p.excerpt, q) + '</p>' : '') + UI.metaLine(p) + '</div></a>';
  };
  UI.mini = function (p) {
    return '<a class="mini" href="' + UI.postHref(p) + '"><div class="img">' + UI.img(p, 'thumb') + '</div>' +
      '<div><h3>' + esc(p.title) + '</h3>' + UI.metaLine(p) + '</div></a>';
  };
  UI.sideItem = function (p) {
    var t = UI.ago(p);
    return '<a class="side-item" href="' + UI.postHref(p) + '"><div class="img">' + UI.img(p, 'thumb') + '</div>' +
      '<div><h3>' + esc(p.title) + '</h3>' + (t ? '<time>' + esc(t) + '</time>' : '') + '</div></a>';
  };
  UI.trendItem = function (p, i) {
    return '<a class="trend-item" href="' + UI.postHref(p) + '"><div class="img">' + UI.img(p, 'thumb') + '</div>' +
      '<div><span class="num">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(p.title) + '</h3></div></a>';
  };
  UI.catWidget = function (cats, title) {
    return '<section class="widget"><h2>' + esc(title || 'Kategori') + '</h2><div class="cat-list">' +
      cats.map(function (c) {
        return '<a href="' + UI.catHref(c.slug) + '"><strong>' + esc(c.name) + '</strong><span>' + c.count + '</span></a>';
      }).join('') + '</div></section>';
  };
  UI.followWidget = function () {
    return '<section class="widget follow"><h2>Ikuti kami</h2>' +
      '<a href="' + esc(AJ.INSTAGRAM) + '" rel="noopener">' + ICON.ig + 'Instagram</a>' +
      '<a href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + ICON.yt + 'YouTube @AroundJakartacom</a></section>';
  };
  UI.pager = function (page, pages, href) {
    if (pages <= 1) return '';
    var out = [];
    out.push(page > 1 ? '<a href="' + href(page - 1) + '" rel="prev">Sebelumnya</a>' : '<span class="dis">Sebelumnya</span>');
    var set = new Set([1, pages, page - 1, page, page + 1]);
    var list = Array.from(set).filter(function (n) { return n >= 1 && n <= pages; }).sort(function (a, b) { return a - b; });
    var last = 0;
    list.forEach(function (n) {
      if (n - last > 1) out.push('<span class="dis">…</span>');
      out.push(n === page ? '<span class="cur" aria-current="page">' + n + '</span>' : '<a href="' + href(n) + '">' + n + '</a>');
      last = n;
    });
    out.push(page < pages ? '<a href="' + href(page + 1) + '" rel="next">Berikutnya</a>' : '<span class="dis">Berikutnya</span>');
    return '<nav class="pager" aria-label="Halaman">' + out.join('') + '</nav>';
  };

  /* ---------- YouTube ringan: iframe dimuat saat diklik ---------- */
  UI.youtube = function (id) {
    return '<button class="yt" type="button" data-yt="' + esc(id) + '" aria-label="Putar video YouTube">' +
      '<img src="https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg" alt="" loading="lazy">' +
      '<span class="play">' + ICON.play + '</span></button>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-yt]');
    if (!b) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/' + encodeURIComponent(b.getAttribute('data-yt')) + '?autoplay=1&rel=0';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    f.title = 'Video YouTube AroundJakarta';
    b.replaceWith(f);
  });

  /* ---------- Pembersih isi artikel (tanpa mengubah teks/foto/video) ---------- */
  UI.cleanContent = function (html) {
    var doc = new DOMParser().parseFromString('<div id="r">' + html + '</div>', 'text/html');
    var root = doc.getElementById('r');
    root.querySelectorAll('script,style,object,embed,form').forEach(function (n) { n.remove(); });
    root.querySelectorAll('*').forEach(function (el) {
      Array.from(el.attributes).forEach(function (a) {
        var n = a.name.toLowerCase(), v = (a.value || '').trim().toLowerCase();
        if (n.indexOf('on') === 0) el.removeAttribute(a.name);
        else if ((n === 'href' || n === 'src') && v.indexOf('javascript:') === 0) el.removeAttribute(a.name);
      });
      if (el.tagName === 'IFRAME') { el.setAttribute('loading', 'lazy'); el.removeAttribute('width'); el.removeAttribute('height'); }
      if (el.tagName === 'IMG') { el.setAttribute('loading', 'lazy'); el.removeAttribute('width'); el.removeAttribute('height'); el.removeAttribute('sizes'); }
      if (el.tagName === 'A' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener');
    });
    return root.innerHTML;
  };

  /* ---------- Chrome: header, nav, drawer, footer ---------- */
  function menuLinks(cls) {
    return AJ.MENU.map(function (m) {
      var href = m.href || (m.external ? AJ.WP_BASE + m.external : UI.catHref(slugify(m.cat)));
      var on = (m.key && m.key === UI.active) || (m.cat && slugify(m.cat) === UI.active);
      return '<a href="' + esc(href) + '"' + (m.cat ? ' data-cat="' + esc(m.cat) + '"' : '') +
        (on ? ' class="on" aria-current="page"' : '') + '>' +
        (m.live ? '<i class="dot pulse"></i>' : '') + esc(m.label) + '</a>';
    }).join('');
  }

  UI.chrome = function (active, q) {
    UI.active = active == null ? 'home' : active;
    var top = document.getElementById('chrome-top');
    var bottom = document.getElementById('chrome-bottom');
    var searchForm = function (cls) {
      return '<form class="m-search ' + (cls || '') + '" role="search" action="cari.html" method="get">' +
        '<label class="sr-only" for="q-' + (cls || 'h') + '">Cari berita</label>' +
        '<input id="q-' + (cls || 'h') + '" name="q" type="search" placeholder="Cari berita…" value="' + esc(q || '') + '">' +
        '<button type="submit" aria-label="Cari">' + ICON.search + '</button></form>';
    };
    top.innerHTML =
      '<a class="skip" href="#konten">Lewati ke konten</a><div id="fb"></div>' +
      '<div class="utility"><div class="wrap"><span>' + esc(fmtFull.format(NOW())) + '</span>' +
      '<div class="soc"><a href="' + esc(AJ.INSTAGRAM) + '" aria-label="Instagram" rel="noopener">' + ICON.ig + '</a>' +
      '<a href="#" aria-label="Facebook">' + ICON.fb + '</a>' +
      '<a href="' + esc(AJ.YT_CHANNEL) + '" aria-label="YouTube" rel="noopener">' + ICON.yt + '</a>' +
      '<a href="#" aria-label="X (Twitter)">' + ICON.x + '</a></div></div></div>' +
      '<header class="masthead"><div class="wrap">' +
      '<div>' + searchForm('') + '<button class="icon-btn" type="button" id="open-menu" aria-label="Buka menu" aria-controls="drawer" aria-expanded="false">' + ICON.menu + '</button></div>' +
      '<a class="logo" href="index.html" aria-label="AroundJakarta.com, beranda">Around<b>Jakarta</b><small>.com</small></a>' +
      '<div class="m-right"><a class="btn red" href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + ICON.yt + ' Tonton Video</a></div>' +
      '<a class="icon-btn" href="cari.html" aria-label="Cari" id="m-search-link" style="justify-self:end">' + ICON.search + '</a>' +
      '</div></header>' +
      '<nav class="nav" aria-label="Menu utama"><div class="wrap">' + menuLinks() + '</div></nav>' +
      '<div class="drawer" id="drawer"><div class="scrim" data-close></div><div class="panel" role="dialog" aria-label="Menu">' +
      '<div class="head"><span class="logo" style="font-size:24px">Around<b>Jakarta</b></span>' +
      '<button class="icon-btn" style="display:flex" type="button" data-close aria-label="Tutup menu">' + ICON.close + '</button></div>' +
      searchForm('d').replace('class="m-search d"', 'class="m-search d" style="display:flex;max-width:none;margin-bottom:8px"') +
      '<nav aria-label="Menu seluler">' + menuLinks() + '</nav></div></div>';
    bottom.innerHTML =
      '<footer class="footer"><div class="wrap"><div class="cols">' +
      '<div><a class="logo" href="index.html">Around<b>Jakarta</b><small>.com</small></a>' +
      '<p>Demo redesain tampilan. Seluruh berita, foto, dan video adalah milik AroundJakarta.com dan dibaca langsung dari situs aslinya.</p></div>' +
      '<div><h4>Menu</h4>' + menuLinks() + '</div>' +
      '<div><h4>Kategori</h4><div id="foot-cats"></div></div>' +
      '<div><h4>Ikuti kami</h4><a href="' + esc(AJ.INSTAGRAM) + '" rel="noopener">Instagram</a>' +
      '<a href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">YouTube</a>' +
      '<a href="' + esc(AJ.WP_BASE) + '" rel="noopener">Situs asli</a></div></div>' +
      '<div class="bar"><span>Konten © AroundJakarta.com</span><a href="#top">Kembali ke atas ↑</a></div></div></footer>';
    var drawer = document.getElementById('drawer');
    var btn = document.getElementById('open-menu');
    var setOpen = function (v) { drawer.classList.toggle('open', v); btn.setAttribute('aria-expanded', String(v)); };
    btn.addEventListener('click', function () { setOpen(true); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  };

  /* Setelah daftar kategori dimuat: samakan tautan menu dengan slug asli WordPress. */
  UI.refine = function (cats) {
    UI.cats = cats;
    document.querySelectorAll('a[data-cat]').forEach(function (a) {
      var name = a.getAttribute('data-cat').toLowerCase();
      var c = cats.find(function (x) { return x.name.toLowerCase() === name; });
      if (c) {
        a.setAttribute('href', UI.catHref(c.slug));
        if (c.slug === UI.active) { a.classList.add('on'); a.setAttribute('aria-current', 'page'); }
      }
    });
    var fc = document.getElementById('foot-cats');
    if (fc) fc.innerHTML = cats.map(function (c) { return '<a href="' + UI.catHref(c.slug) + '">' + esc(c.name) + '</a>'; }).join('');
  };

  UI.finish = function () {
    if (AJ.usingFallback) {
      var el = document.getElementById('fb');
      if (el) el.innerHTML = '<div class="fb-banner"><div class="wrap">Mode data cadangan: koneksi ke WordPress ' +
        '(' + esc(AJ.WP_BASE) + ') tidak berhasil, jadi hanya sebagian berita yang tampil. Lihat README bagian "CORS dan perantara".</div></div>';
    }
  };

  window.UI = UI;
})();
