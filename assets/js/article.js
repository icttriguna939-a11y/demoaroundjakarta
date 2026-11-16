(async function () {
  var U = UI, esc = U.esc, API = window.API, AJ = window.AJ;
  U.chrome('');
  var app = document.getElementById('konten');
  var slug = new URLSearchParams(location.search).get('slug');

  function msg(t) {
    app.innerHTML = '<div class="wrap"><p class="empty">' + t + ' <a href="index.html"><u>Kembali ke beranda</u></a></p></div>';
    U.finish();
  }
  if (!slug) return msg('Artikel tidak ditentukan.');
  app.innerHTML = '<div class="wrap"><p class="loading">Memuat artikel…</p></div>';

  var r = await Promise.all([API.categories(), API.posts({ slug: slug, perPage: 1 })]);
  var cats = r[0].items, p = r[1].items[0];
  if (!p) return msg('Artikel tidak ditemukan.');

  var c0 = p.cats[0];
  U.active = c0 ? c0.slug : '';
  U.refine(cats);
  document.title = p.title + ' | AroundJakarta.com';

  var more = await Promise.all([
    API.posts({ perPage: 1, before: p.date, order: 'desc' }),
    API.posts({ perPage: 1, after: p.date, order: 'asc' }),
    c0 ? API.posts({ perPage: 3, category: c0.id, exclude: p.id }) : Promise.resolve({ items: [] }),
    API.posts({ perPage: 5, exclude: p.id })
  ]);
  var prev = more[0].items[0], next = more[1].items[0], related = more[2].items, latest = more[3].items;

  var rm = U.readMin(p);
  var when = [U.dateLong(p), rm ? rm + ' menit baca' : ''].filter(Boolean).map(esc).join(' · ');
  var initial = (p.author || 'R').trim().charAt(0).toUpperCase();
  var shareText = encodeURIComponent(p.title + ' ' + p.link);

  var body;
  if (p.content) {
    body = '<div class="prose" id="isi">' + U.cleanContent(p.content) + '</div>';
  } else {
    body = '<div class="notice">' + (p.excerpt ? '<p>' + esc(p.excerpt) + '</p>' : '') +
      '<p style="margin:0">Isi lengkap artikel tidak dapat dimuat pada mode data cadangan. ' +
      '<a href="' + esc(p.link) + '" rel="noopener"><u>Baca artikel lengkap di situs asli</u></a>.</p></div>';
  }

  var html = '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Beranda</a><span>›</span>' +
    (c0 ? '<a href="' + U.catHref(c0.slug) + '">' + esc(c0.name) + '</a><span>›</span>' : '') +
    '<span aria-current="page">' + esc(p.title) + '</span></nav>' +
    '<div class="article-grid"><article class="article">' +
    '<div class="chips">' + p.cats.map(function (c, i) {
      return '<a class="badge' + (i === 0 ? ' hot' : '') + '" href="' + U.catHref(c.slug) + '">' + esc(c.name) + '</a>';
    }).join('') + '</div>' +
    '<h1>' + esc(p.title) + '</h1>' +
    '<div class="byline"><span class="av" aria-hidden="true">' + esc(initial) + '</span>' +
    '<div><b>' + esc(p.author) + '</b><div class="muted" style="font-size:13px">' + when + '</div></div>' +
    '<div class="share" aria-label="Bagikan"><a href="https://wa.me/?text=' + shareText + '" rel="noopener" target="_blank">WhatsApp</a>' +
    '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(p.link) + '" rel="noopener" target="_blank">Facebook</a>' +
    '<a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(p.title) + '&url=' + encodeURIComponent(p.link) + '" rel="noopener" target="_blank">X</a>' +
    '<button type="button" id="copy">Salin tautan</button></div></div>';

  if (p.img) {
    html += '<figure class="feat"><div class="img">' +
      U.img(p, 'large').replace('loading="lazy"', 'loading="eager" fetchpriority="high"') + '</div>' +
      (p.caption ? '<figcaption>' + esc(p.caption) + '</figcaption>' : '') + '</figure>';
  }
  html += body;

  if (p.tags && p.tags.length) {
    html += '<div class="tags" aria-label="Tag">' + p.tags.map(function (t) {
      return '<span class="t">#' + esc(t.name) + '</span>';
    }).join('') + '</div>';
  }
  html += '<p style="margin-top:20px"><a class="btn ghost" href="' + esc(p.link) + '" rel="noopener">Baca di situs asli ↗</a></p>';

  if (prev || next) {
    html += '<nav class="pn" aria-label="Artikel lain">' +
      (prev ? '<a href="' + U.postHref(prev) + '"><small>← Sebelumnya</small><span>' + esc(prev.title) + '</span></a>' : '<span></span>') +
      (next ? '<a class="next" href="' + U.postHref(next) + '"><small>Berikutnya →</small><span>' + esc(next.title) + '</span></a>' : '<span></span>') +
      '</nav>';
  }
  if (related.length) {
    html += '<section class="section" aria-label="Berita terkait"><div class="sec-title"><h2>Berita Terkait</h2></div>' +
      '<div class="cols3">' + related.map(U.card).join('') + '</div></section>';
  }
  html += '<section class="comments" aria-label="Komentar"><div class="sec-title"><h2>Komentar</h2></div>' +
    '<div class="notice">Komentar dikelola di situs asli. ' +
    '<a href="' + esc(p.link) + '#respond" rel="noopener"><u>Tulis atau baca komentar di aroundjakarta.com</u></a>.</div></section>';

  html += '</article><aside aria-label="Sidebar">' +
    (latest.length ? '<section class="widget"><h2>Terbaru</h2>' + latest.map(U.mini).join('') + '</section>' : '') +
    U.catWidget(cats) + U.followWidget() + '</aside></div></div>';

  app.innerHTML = html;

  var copy = document.getElementById('copy');
  if (copy) copy.addEventListener('click', function () {
    var done = function () { copy.textContent = 'Tersalin'; setTimeout(function () { copy.textContent = 'Salin tautan'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(p.link).then(done, done); else done();
  });
  U.finish();
})();
