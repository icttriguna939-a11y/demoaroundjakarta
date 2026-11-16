(async function () {
  var U = UI, esc = U.esc, API = window.API, AJ = window.AJ;
  U.chrome('home');
  var app = document.getElementById('konten');
  app.innerHTML = '<div class="wrap"><p class="loading">Memuat berita…</p></div>';

  var res = await Promise.all([API.categories(), API.posts({ perPage: 14 })]);
  var cats = res[0].items, posts = res[1].items, totalPages = res[1].pages;
  U.refine(cats);

  if (!posts.length) {
    app.innerHTML = '<div class="wrap"><p class="empty">Berita belum dapat dimuat. Coba muat ulang halaman.</p></div>';
    U.finish();
    return;
  }

  var tcat = cats.find(function (c) { return /trending/i.test(c.name); });
  var trending = tcat ? (await API.posts({ perPage: 4, category: tcat.id })).items : [];

  var hero = posts[0], side = posts.slice(1, 5), picks = posts.slice(5, 8), rest = posts.slice(8);

  function readTxt(p) { var m = U.readMin(p); return m ? m + ' menit baca' : ''; }

  var leadImg = hero.img
    ? U.img(hero, 'large').replace('loading="lazy"', 'loading="eager" fetchpriority="high"')
    : '<div class="ph"></div>';
  var heroMeta = [U.dateLong(hero), hero.author, readTxt(hero)].filter(Boolean).map(esc).join('<span class="sep"> · </span>');

  var html = '';
  html += '<div class="ticker"><div class="wrap"><span class="pill"><i class="pulse"></i>Terbaru</span>' +
    '<a href="' + U.postHref(hero) + '">' + esc(hero.title) + '</a>' +
    (U.ago(hero) ? '<time>' + esc(U.ago(hero)) + '</time>' : '') + '</div></div>';

  html += '<section class="hero" aria-label="Berita utama"><div class="wrap"><div class="hero-grid">' +
    '<a class="lead" href="' + U.postHref(hero) + '">' + leadImg +
    '<div class="body">' + U.badge(hero, true) + '<h1>' + esc(hero.title) + '</h1>' +
    (hero.excerpt ? '<p>' + esc(hero.excerpt) + '</p>' : '') +
    '<div class="meta">' + heroMeta + '</div></div></a>' +
    '<aside class="side" aria-label="Berita terbaru"><div class="side-h"><i class="dot pulse"></i>Terbaru</div>' +
    side.map(U.sideItem).join('') + '</aside></div>';
  if (trending.length) {
    html += '<div class="trend-row"><div class="t-h"><i class="dot"></i>' + esc(tcat.name) + '</div>' +
      trending.map(U.trendItem).join('') + '</div>';
  }
  html += '</div></section>';

  html += '<div class="wrap">';
  if (picks.length) {
    html += '<section class="section" aria-label="Pilihan editor"><div class="sec-title"><h2>Pilihan Editor</h2></div>' +
      '<div class="cols3">' + picks.map(U.card).join('') + '</div></section>';
  }
  html += '<div class="section grid-main"><section aria-label="Berita terbaru"><div class="sec-title"><h2>Berita Terbaru</h2></div>' +
    '<div id="list">' + rest.map(function (p) { return U.row(p); }).join('') + '</div>' +
    '<div class="more" id="more-wrap"' + (totalPages > 1 ? '' : ' hidden') + '><button class="btn ghost" type="button" id="more">Muat lebih banyak</button></div>' +
    '</section><aside aria-label="Sidebar">' + U.catWidget(cats) + U.followWidget() + '</aside></div></div>';

  if (AJ.VIDEO_ID) {
    html += '<section class="video" aria-label="Aroundjakarta Video"><div class="wrap"><div>' + U.youtube(AJ.VIDEO_ID) + '</div>' +
      '<div><span class="eyebrow">Aroundjakarta Video</span><h2>Tonton liputan kami</h2>' +
      '<a class="btn red" href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + U.ICON.yt + ' Kanal YouTube</a></div></div></section>';
  }
  app.innerHTML = html;
  app.removeAttribute('aria-busy');

  var page = 1;
  var more = document.getElementById('more');
  if (more) more.addEventListener('click', async function () {
    more.disabled = true; more.textContent = 'Memuat…';
    page += 1;
    var r = await API.posts({ perPage: 14, page: page });
    document.getElementById('list').insertAdjacentHTML('beforeend', r.items.map(function (p) { return U.row(p); }).join(''));
    if (page >= r.pages || !r.items.length) document.getElementById('more-wrap').hidden = true;
    more.disabled = false; more.textContent = 'Muat lebih banyak';
  });
  U.finish();
})();
