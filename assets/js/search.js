(async function () {
  var U = UI, esc = U.esc, API = window.API;
  var sp = new URLSearchParams(location.search);
  var q = (sp.get('q') || '').trim();
  var kslug = sp.get('kategori') || '';
  var page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
  var order = sp.get('urut') || (q ? 'relevance' : 'date');

  U.chrome(kslug, q);
  var app = document.getElementById('konten');
  app.innerHTML = '<div class="wrap"><p class="loading">Memuat…</p></div>';

  var cr = await API.categories();
  var cats = cr.items;
  U.refine(cats);
  var cat = kslug ? cats.find(function (c) { return c.slug === kslug; }) : null;

  var res = { items: [], total: 0, pages: 1 };
  if (!kslug || cat) {
    res = await API.posts({
      search: q || undefined,
      category: cat ? cat.id : undefined,
      page: page, perPage: 10,
      orderby: order === 'relevance' && q ? 'relevance' : 'date',
      order: order === 'asc' ? 'asc' : 'desc'
    });
  }

  var title = q ? 'Hasil Pencarian' : (cat ? cat.name : (kslug ? 'Kategori tidak ditemukan' : 'Semua Berita'));
  document.title = title + ' | AroundJakarta.com';
  var sub = q
    ? 'Menemukan <b>' + res.total + '</b> artikel untuk "' + esc(q) + '"' + (cat ? ' di ' + esc(cat.name) : '')
    : (cat ? '<b>' + res.total + '</b> artikel' : '');

  function url(over) {
    var n = new URLSearchParams();
    var s = Object.assign({ q: q, kategori: kslug, urut: sp.get('urut') || '', page: '' }, over);
    Object.keys(s).forEach(function (k) { if (s[k]) n.set(k, s[k]); });
    var qs = n.toString();
    return 'cari.html' + (qs ? '?' + qs : '');
  }

  var html = '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Beranda</a><span>›</span>' +
    '<span aria-current="page">' + (q ? 'Pencarian' : 'Arsip') + '</span></nav>' +
    '<div class="s-head"><h1>' + esc(title) + '</h1><p class="muted" style="margin:6px 0 0">' + sub + '</p>' +
    '<form class="s-form" action="cari.html" method="get" role="search">' +
    '<div class="m-search"><label class="sr-only" for="sq">Kata kunci</label>' +
    '<input id="sq" name="q" type="search" placeholder="Cari berita…" value="' + esc(q) + '">' +
    (kslug ? '<input type="hidden" name="kategori" value="' + esc(kslug) + '">' : '') +
    '<button type="submit" aria-label="Cari">' + U.ICON.search + '</button></div>' +
    '<button class="btn" type="submit">Cari</button></form>' +
    '<div class="chips-row" role="list" aria-label="Filter kategori"><a role="listitem" class="chip' + (!kslug ? ' on' : '') + '" href="' + url({ kategori: '', page: '' }) + '">Semua</a>' +
    cats.map(function (c) {
      return '<a role="listitem" class="chip' + (c.slug === kslug ? ' on' : '') + '" href="' + url({ kategori: c.slug, page: '' }) + '">' + esc(c.name) + '</a>';
    }).join('') + '</div></div>';

  html += '<div class="grid-main"><section aria-label="Daftar berita">' +
    '<div class="toolbar"><span class="muted">Halaman ' + page + ' dari ' + res.pages + '</span>' +
    '<label>Urutkan <select id="urut">' +
    (q ? '<option value="relevance"' + (order === 'relevance' ? ' selected' : '') + '>Paling relevan</option>' : '') +
    '<option value="date"' + (order === 'date' ? ' selected' : '') + '>Terbaru</option>' +
    '<option value="asc"' + (order === 'asc' ? ' selected' : '') + '>Terlama</option></select></label></div>';

  if (res.items.length) {
    html += res.items.map(function (p) { return U.row(p, q); }).join('') +
      U.pager(page, res.pages, function (n) { return url({ page: n > 1 ? String(n) : '' }); });
  } else {
    html += '<div class="empty"><p><b>Tidak ada artikel yang cocok.</b></p><p>Coba kata kunci lain atau pilih kategori "Semua".</p></div>';
  }
  html += '</section><aside aria-label="Sidebar">' + U.catWidget(cats) + U.followWidget() + '</aside></div></div>';

  app.innerHTML = html;
  var sel = document.getElementById('urut');
  if (sel) sel.addEventListener('change', function () { location.href = url({ urut: sel.value, page: '' }); });
  U.finish();
})();
