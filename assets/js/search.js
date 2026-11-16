/* Pencarian & arsip kategori.
   Desktop (>= 768px): aroundjakarta.com_hasil_pencarian/code.html
   Ponsel  (< 768px):  aroundjakarta.com_hasil_pencarian_mobile/code.html */
(async function () {
  var U = UI, esc = U.esc, API = window.API, AJ = window.AJ, ms = U.ms, svg = U.svg;
  var sp = new URLSearchParams(location.search);
  var q = (sp.get('q') || '').trim();
  var kslug = sp.get('kategori') || '';
  var page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
  var urut = sp.get('urut') || (q ? 'relevance' : 'date');
  var rentang = sp.get('rentang') || 'all';
  var RANGES = { all: ['Semua Waktu', 'Semua'], '24h': ['24 Jam Terakhir', '24 Jam', 1], '7d': ['1 Minggu Terakhir', '1 Minggu', 7], '30d': ['1 Bulan Terakhir', '1 Bulan', 30], '1y': ['1 Tahun Terakhir', '1 Tahun', 365] };
  var SORTS = q ? { relevance: 'Paling Relevan', date: 'Terbaru', asc: 'Terlama' } : { date: 'Terbaru', asc: 'Terlama' };
  if (!SORTS[urut]) urut = q ? 'relevance' : 'date';
  if (!RANGES[rentang]) rentang = 'all';

  U.mountTop(kslug, q);
  var app = document.getElementById('konten');
  var mob = document.getElementById('aj-mobile');
  app.innerHTML = '<div class="space-y-4" aria-busy="true"><div class="aj-skel h-48"></div><div class="aj-skel h-40"></div><div class="aj-skel h-40"></div></div>';
  mob.innerHTML = '<div class="p-4 space-y-4" aria-busy="true"><div class="aj-skel h-11"></div><div class="aj-skel h-64"></div><div class="aj-skel h-28"></div></div>';

  var S = await U.loadShared();
  var cat = kslug ? S.cats.find(function (c) { return c.slug === kslug; }) : null;
  var after = '';
  if (RANGES[rentang][2]) {
    var d = new Date(Date.now() - RANGES[rentang][2] * 86400000 + 7 * 3600000);
    after = d.toISOString().slice(0, 19);
  }
  var res = { items: [], total: 0, pages: 1 };
  if (!kslug || cat) {
    res = await API.posts({
      search: q || undefined, category: cat ? cat.id : undefined, page: page, perPage: 10,
      orderby: urut === 'relevance' && q ? 'relevance' : 'date', order: urut === 'asc' ? 'asc' : 'desc',
      after: after || undefined
    });
  }

  var take = U.picker(S.latest);
  U.mountShell(S, take);

  var title = q ? 'Hasil Pencarian' : (cat ? cat.name : (kslug ? 'Kategori tidak ditemukan' : 'Semua Berita'));
  document.title = (q ? 'Hasil Pencarian: ' + q : title) + ' | AroundJakarta.com';

  function url(over) {
    var n = new URLSearchParams();
    var s = Object.assign({ q: q, kategori: kslug, urut: sp.get('urut') || '', rentang: rentang === 'all' ? '' : rentang, page: '' }, over);
    Object.keys(s).forEach(function (k) { if (s[k]) n.set(k, s[k]); });
    var qs = n.toString();
    return 'cari.html' + (qs ? '?' + qs : '');
  }
  var hidden = (kslug ? '<input type="hidden" name="kategori" value="' + esc(kslug) + '">' : '') +
    (sp.get('urut') ? '<input type="hidden" name="urut" value="' + esc(sp.get('urut')) + '">' : '') +
    (rentang !== 'all' ? '<input type="hidden" name="rentang" value="' + esc(rentang) + '">' : '');
  var tags = [], seen = {};
  res.items.forEach(function (p) { (p.tags || []).forEach(function (t) { if (!seen[t.id]) { seen[t.id] = 1; tags.push(t); } }); });
  tags = tags.slice(0, 8);
  var trend = S.trending.slice(0, 5);
  var dotColors = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-secondary', 'bg-outline', 'bg-outline'];
  var pages = res.pages;
  function pageList() {
    var set = [1, pages, page - 1, page, page + 1].filter(function (n) { return n >= 1 && n <= pages; });
    return Array.from(new Set(set)).sort(function (a, b) { return a - b; });
  }

  /* ================= DESKTOP ================= */
  var html = '<div class="flex flex-col w-full">' +
    '<nav aria-label="Breadcrumb" class="mb-6"><ol class="flex items-center space-x-2 text-meta-caption font-meta-caption text-secondary">' +
    '<li><a class="hover:text-primary transition-colors flex items-center gap-1" href="index.html">' + ms('home', 'text-sm') + '<span>Beranda</span></a></li>' +
    '<li class="flex items-center text-outline" aria-hidden="true">' + ms('chevron_right', 'text-xs') + '</li>' +
    '<li><a class="hover:text-primary transition-colors" href="cari.html">' + (q ? 'Pencarian' : 'Arsip') + '</a></li>' +
    '<li class="flex items-center text-outline" aria-hidden="true">' + ms('chevron_right', 'text-xs') + '</li>' +
    '<li aria-current="page" class="font-meta-label text-on-surface font-semibold">' + esc(q ? 'Hasil Pencarian' : title) + '</li></ol></nav>';

  html += '<header class="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm mb-8"><div class="max-w-4xl">' +
    '<div class="flex items-center gap-2 mb-2"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-meta-eyebrow font-meta-eyebrow">' +
    '<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>ARSIP BERITA AROUNDJAKARTA</span>' +
    '<span class="text-meta-caption font-meta-caption text-secondary">Dibaca langsung dari aroundjakarta.com</span></div>' +
    '<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-2">' +
    (q ? 'Hasil Pencarian: <span class="text-primary italic font-headline-lg font-normal">"' + esc(q) + '"</span>' : esc(title)) + '</h1>' +
    '<p class="font-body-dense text-body-dense text-secondary mb-6">Menemukan <strong class="text-on-surface font-semibold">' + res.total + ' artikel</strong>' +
    (cat ? ' di rubrik ' + esc(cat.name) : '') + ' dari arsip AroundJakarta.com' + (rentang !== 'all' ? ' dalam ' + RANGES[rentang][0].toLowerCase() : '') + '.</p>' +
    '<form class="relative flex flex-col sm:flex-row gap-3 mb-6" action="cari.html" method="get" role="search"><div class="relative flex-1">' +
    '<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">' + ms('search') + '</span>' +
    '<label class="sr-only" for="query-input">Kata kunci</label>' +
    '<input class="w-full pl-11 pr-10 py-3.5 bg-surface-container-low text-on-surface rounded-lg border-0 font-body-default text-body-default placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" id="query-input" name="q" placeholder="Ketik topik, tokoh, dinas, atau kata kunci berita..." type="search" value="' + esc(q) + '">' +
    '<button class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-on-surface transition-colors" data-clear="query-input" title="Hapus kata kunci" aria-label="Hapus kata kunci" type="button">' + ms('close', 'text-sm') + '</button></div>' + hidden +
    '<button class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-on-primary font-meta-label text-meta-label uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-sm" type="submit">' + ms('tune', 'text-sm') + '<span>' + (q ? 'Cari Ulang' : 'Cari') + '</span></button></form>' +
    '<div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1" role="list" aria-label="Filter rubrik">' +
    '<a role="listitem" href="' + url({ kategori: '' }) + '" class="px-4 py-2 rounded-full ' + (!kslug ? 'bg-on-surface text-on-primary font-bold shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high') + ' text-meta-label font-meta-label whitespace-nowrap transition"' + (!kslug ? ' aria-current="true"' : '') + '>Semua' + (!kslug ? ' (' + res.total + ')' : '') + '</a>' +
    S.cats.map(function (c) {
      var on = c.slug === kslug;
      return '<a role="listitem" href="' + url({ kategori: c.slug }) + '" class="px-4 py-2 rounded-full ' + (on ? 'bg-on-surface text-on-primary font-bold shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high') +
        ' text-meta-label font-meta-label whitespace-nowrap transition flex items-center gap-1"' + (on ? ' aria-current="true"' : '') + '>' +
        (/video/i.test(c.name) ? ms('play_circle', 'text-xs text-primary', true) : '') + '<span>' + esc(c.name) + (on ? ' (' + res.total + ')' : (q ? '' : ' (' + c.count + ')')) + '</span></a>';
    }).join('') + '</div></div></header>';

  html += '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 bg-surface-container-low px-5 py-3.5 rounded-lg">' +
    '<div class="flex items-center gap-2 text-meta-label font-meta-label text-secondary">' + ms('filter_list', 'text-base') + '<span class="text-on-surface font-semibold">Urutkan:</span>' +
    '<div class="inline-flex rounded-lg bg-surface-container p-0.5">' + Object.keys(SORTS).map(function (k) {
      return k === urut
        ? '<a aria-current="true" href="' + url({ urut: k }) + '" class="px-3 py-1 rounded bg-surface-container-lowest text-on-surface font-bold text-meta-caption font-meta-caption shadow-xs">' + SORTS[k] + '</a>'
        : '<a href="' + url({ urut: k }) + '" class="px-3 py-1 rounded text-secondary hover:text-on-surface text-meta-caption font-meta-caption transition">' + SORTS[k] + '</a>';
    }).join('') + '</div></div>' +
    '<div class="flex items-center gap-2 text-meta-caption font-meta-caption text-secondary">' + ms('date_range', 'text-base') + '<label for="rentang">Rentang Waktu:</label>' +
    '<select id="rentang" data-range class="bg-surface-container text-on-surface text-meta-caption font-meta-caption rounded px-3 py-1 pr-8 border-0 focus:ring-1 focus:ring-primary cursor-pointer">' +
    Object.keys(RANGES).map(function (k) { return '<option value="' + k + '"' + (k === rentang ? ' selected' : '') + '>' + RANGES[k][0] + '</option>'; }).join('') + '</select></div></div>';

  html += '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8"><section class="lg:col-span-8 flex flex-col space-y-6" aria-label="Daftar hasil">';
  if (!res.items.length) {
    html += '<div class="bg-surface-container-lowest rounded-xl p-8 shadow-sm text-center"><div class="w-14 h-14 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto mb-3">' + ms('search_off', 'text-3xl') + '</div>' +
      '<h2 class="font-headline-sm text-headline-sm text-on-surface mb-1">Tidak ada artikel yang cocok</h2>' +
      '<p class="font-body-dense text-body-dense text-secondary mb-4">Coba kata kunci lain, pilih rubrik "Semua", atau perluas rentang waktu.</p>' +
      '<a class="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-on-primary font-meta-label text-meta-label font-bold" href="cari.html">Lihat semua berita</a></div>';
  }
  res.items.forEach(function (p, i) {
    var c = U.catName(p), date = U.dShort(p), rt = U.readTxt(p);
    if (i === 0 && page === 1) {
      html += '<article class="relative group bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">' +
        '<div class="absolute -top-3 left-6"><span class="bg-primary text-on-primary text-meta-eyebrow font-meta-eyebrow px-3 py-1 rounded shadow-xs uppercase tracking-wider inline-flex items-center gap-1">' + ms('verified', 'text-xs') + (q && urut === 'relevance' ? 'HASIL PALING RELEVAN' : 'BERITA UTAMA') + '</span></div>' +
        '<div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start mt-2"><a href="' + U.postHref(p) + '" class="md:col-span-5 relative overflow-hidden rounded-lg aspect-[16/10] bg-surface-container block" tabindex="-1" aria-hidden="true">' +
        U.img(p, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500') +
        (c ? '<span class="absolute bottom-2 left-2 px-2 py-0.5 bg-inverse-surface/90 text-inverse-on-surface text-meta-eyebrow font-meta-eyebrow rounded uppercase">' + esc(c) + '</span>' : '') + '</a>' +
        '<div class="md:col-span-7 flex flex-col justify-between"><div><div class="flex items-center gap-2 text-meta-caption font-meta-caption text-secondary mb-2"><span>' + esc(date) + '</span>' +
        (rt ? '<span>•</span><span class="text-primary font-semibold">' + esc(rt) + '</span>' : '') + '</div>' +
        '<h2 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-2.5"><a href="' + U.postHref(p) + '">' + U.hl(p.title, q) + '</a></h2>' +
        (p.excerpt ? '<p class="font-body-dense text-body-dense text-secondary line-clamp-3 mb-4">' + U.hl(p.excerpt, q) + '</p>' : '') + '</div>' +
        '<div class="flex items-center justify-between pt-3 text-meta-caption font-meta-caption text-secondary"><span class="font-meta-label text-on-surface font-semibold">' + esc(p.author) + '</span>' +
        '<a class="hover:text-primary transition-colors flex items-center gap-1" href="' + U.postHref(p) + '">' + ms('arrow_forward', 'text-base') + '<span>Baca</span></a></div></div></div></article>';
    } else if (U.isVideo(p)) {
      html += '<article class="group bg-inverse-surface text-inverse-on-surface rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div class="flex flex-col sm:flex-row gap-5 items-start">' +
        '<a href="' + U.postHref(p) + '" tabindex="-1" aria-hidden="true" class="w-full sm:w-56 sm:h-36 flex-shrink-0 relative overflow-hidden rounded-lg aspect-video sm:aspect-auto bg-surface-container-highest block">' +
        U.img(p, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90') +
        '<div class="absolute inset-0 bg-inverse-surface/30 flex items-center justify-center"><div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">' + ms('play_arrow', 'text-xl', true) + '</div></div></a>' +
        '<div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1.5"><span class="bg-primary text-on-primary px-2 py-0.5 rounded text-meta-eyebrow font-meta-eyebrow font-bold uppercase tracking-wider">AROUNDJAKARTA VIDEO</span>' +
        '<span class="text-meta-caption font-meta-caption text-tertiary-fixed-dim">' + esc(date) + '</span></div>' +
        '<h3 class="font-headline-sm text-headline-sm text-inverse-on-surface group-hover:text-primary-fixed transition-colors leading-snug mb-2"><a href="' + U.postHref(p) + '">' + U.hl(p.title, q) + '</a></h3>' +
        (p.excerpt ? '<p class="font-body-dense text-body-dense text-tertiary-fixed-dim line-clamp-2 mb-3">' + U.hl(p.excerpt, q) + '</p>' : '') +
        '<div class="flex items-center justify-between text-meta-caption font-meta-caption text-tertiary-fixed-dim"><span>' + esc(p.author) + '</span>' +
        '<span class="flex items-center gap-1 text-primary-fixed">' + ms('play_circle', 'text-xs') + '<span>Tonton</span></span></div></div></div></article>';
    } else {
      html += '<article class="group bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div class="flex flex-col sm:flex-row gap-5 items-start">' +
        '<a href="' + U.postHref(p) + '" tabindex="-1" aria-hidden="true" class="w-full sm:w-48 sm:h-32 flex-shrink-0 relative overflow-hidden rounded-lg aspect-video sm:aspect-auto bg-surface-container block">' +
        U.img(p, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500') +
        (c ? '<span class="absolute bottom-2 left-2 px-2 py-0.5 bg-inverse-surface/90 text-inverse-on-surface text-meta-eyebrow font-meta-eyebrow rounded uppercase">' + esc(c) + '</span>' : '') + '</a>' +
        '<div class="flex-1 min-w-0"><div class="flex items-center gap-2 text-meta-caption font-meta-caption text-secondary mb-1.5"><span>' + esc(date) + '</span>' + (rt ? '<span>•</span><span>' + esc(rt) + '</span>' : '') + '</div>' +
        '<h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-2"><a href="' + U.postHref(p) + '">' + U.hl(p.title, q) + '</a></h3>' +
        (p.excerpt ? '<p class="font-body-dense text-body-dense text-secondary line-clamp-2 mb-3">' + U.hl(p.excerpt, q) + '</p>' : '') +
        '<div class="flex items-center justify-between text-meta-caption font-meta-caption text-secondary"><span class="font-meta-label text-on-surface font-semibold">' + esc(p.author) + '</span>' +
        (c ? '<span class="flex items-center gap-1 text-outline">' + ms('folder', 'text-xs') + '<span>' + esc(c) + '</span></span>' : '') + '</div></div></div></article>';
    }
    if (q && i === 2) {
      html += '<div class="bg-surface-container-low rounded-xl p-5 flex items-start gap-4 shadow-xs"><div class="p-2.5 rounded-lg bg-surface-container text-primary flex-shrink-0">' + ms('lightbulb', 'text-2xl') + '</div>' +
        '<div><h3 class="font-headline-xs text-headline-xs text-on-surface mb-1">Tips Pencarian Berita Lebih Akurat</h3><p class="font-body-dense text-body-dense text-secondary">Gunakan kata kunci yang lebih spesifik, misalnya nama tempat atau tokoh, lalu persempit dengan memilih rubrik dan rentang waktu.</p></div></div>';
    }
  });
  if (pages > 1) {
    var btnDis = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container text-secondary text-meta-label font-meta-label opacity-40';
    html += '<nav aria-label="Navigasi Halaman Hasil Pencarian" class="pt-4 flex items-center justify-between">' +
      (page > 1 ? '<a rel="prev" href="' + url({ page: page - 1 > 1 ? String(page - 1) : '' }) + '" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container text-secondary hover:text-on-surface text-meta-label font-meta-label transition">' + ms('arrow_back', 'text-sm') + '<span>Sebelumnya</span></a>'
        : '<span class="' + btnDis + '" aria-disabled="true">' + ms('arrow_back', 'text-sm') + '<span>Sebelumnya</span></span>') +
      '<div class="flex items-center space-x-1.5">' + (function () {
        var out = '', last = 0;
        pageList().forEach(function (n) {
          if (n - last > 1) out += '<span class="px-2 text-secondary font-headline-sm" aria-hidden="true">...</span>';
          out += n === page
            ? '<a aria-current="page" class="w-9 h-9 rounded-lg bg-primary text-on-primary font-meta-label text-meta-label font-bold flex items-center justify-center shadow-xs" href="' + url({ page: n > 1 ? String(n) : '' }) + '">' + n + '</a>'
            : '<a class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-meta-label text-meta-label font-medium flex items-center justify-center transition" href="' + url({ page: n > 1 ? String(n) : '' }) + '">' + n + '</a>';
          last = n;
        });
        return out;
      })() + '</div>' +
      (page < pages ? '<a rel="next" href="' + url({ page: String(page + 1) }) + '" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant text-meta-label font-meta-label font-semibold transition"><span>Berikutnya</span>' + ms('arrow_forward', 'text-sm') + '</a>'
        : '<span class="' + btnDis + '" aria-disabled="true"><span>Berikutnya</span>' + ms('arrow_forward', 'text-sm') + '</span>') + '</nav>';
  }
  html += '</section><aside aria-label="Sidebar Informasi Terkait" class="lg:col-span-4 space-y-8">';
  var wHead = 'flex items-center justify-between pb-3 mb-4 bg-surface-container-low -mx-5 -mt-5 p-4 rounded-t-xl';
  if (tags.length) {
    html += '<div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm"><div class="' + wHead + '"><h2 class="font-headline-xs text-headline-xs text-on-surface flex items-center gap-2">' + ms('tag', 'text-primary text-base') + '<span>Topik Terkait</span></h2>' +
      '<span class="text-meta-caption font-meta-caption text-secondary">Dari hasil ini</span></div><div class="flex flex-wrap gap-2">' +
      tags.map(function (t) {
        var on = q && t.name.toLowerCase() === q.toLowerCase();
        return '<a class="px-3 py-1.5 rounded-full ' + (on ? 'bg-primary text-on-primary font-bold shadow-xs' : 'bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition') + ' text-meta-label font-meta-label" href="cari.html?q=' + encodeURIComponent(t.name) + '">#' + esc(t.name.replace(/\s+/g, '')) + '</a>';
      }).join('') + '</div></div>';
  }
  if (trend.length) {
    html += '<div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm"><div class="' + wHead + '"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>' +
      '<h2 class="font-headline-xs text-headline-xs text-on-surface">Trending Jakarta</h2></div><span class="text-meta-eyebrow font-meta-eyebrow text-primary uppercase font-bold">Trending</span></div><ol class="space-y-4">' +
      trend.map(function (p, i) {
        return '<li class="flex items-start gap-3 group"><span class="font-headline-sm text-headline-sm font-black ' + (i ? 'text-outline' : 'text-primary') + ' leading-none w-6 flex-shrink-0" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<div class="flex-1 min-w-0"><h3 class="font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2"><a href="' + U.postHref(p) + '">' + esc(p.title) + '</a></h3>' +
          '<span class="text-meta-caption font-meta-caption text-secondary mt-1 block">' + esc(U.join([U.catName(p), U.ago(p)])) + '</span></div></li>';
      }).join('') + '</ol></div>';
  }
  html += '<div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm"><div class="' + wHead + '"><h2 class="font-headline-xs text-headline-xs text-on-surface flex items-center gap-2">' + ms('category', 'text-primary text-base') + '<span>Distribusi Rubrik</span></h2>' +
    '<span class="text-meta-caption font-meta-caption text-secondary">Total ' + S.total + ' artikel</span></div><ul class="space-y-2.5 font-meta-label text-meta-label">' +
    S.cats.map(function (c, i) {
      return '<li><a class="flex items-center justify-between p-2 rounded hover:bg-surface-container transition ' + (c.slug === kslug ? 'text-primary font-bold' : 'text-on-surface') + '" href="' + url({ kategori: c.slug }) + '">' +
        '<span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full ' + dotColors[Math.min(i, dotColors.length - 1)] + '"></span><span>' + esc(c.name) + '</span></span>' +
        '<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold text-meta-caption font-meta-caption">' + c.count + '</span></a></li>';
    }).join('') + '</ul></div>';
  html += '<div class="relative overflow-hidden bg-primary text-on-primary rounded-xl p-6 shadow-sm"><div class="relative z-10">' +
    '<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-on-primary/10 text-on-primary text-meta-eyebrow font-meta-eyebrow uppercase tracking-wider mb-3">' + ms('mail', 'text-xs') + '<span>IKUTI AROUNDJAKARTA</span></div>' +
    '<h2 class="font-headline-sm text-headline-sm font-bold leading-snug mb-2">Kabar Ibu Kota Setiap Hari</h2>' +
    '<p class="font-body-dense text-body-dense text-on-primary/80 mb-4">Liputan foto dan video terbaru AroundJakarta hadir di Instagram dan kanal YouTube resmi.</p>' +
    '<div class="space-y-2"><a class="w-full px-3.5 py-2.5 rounded bg-on-primary text-on-surface font-meta-label text-meta-label font-bold flex items-center justify-center gap-2" href="' + esc(AJ.INSTAGRAM) + '" rel="noopener">' + svg('ig', 'w-4 h-4 fill-current') + 'Instagram</a>' +
    '<a class="w-full py-2.5 rounded bg-inverse-surface text-inverse-on-surface font-meta-label text-meta-label font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2" href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + svg('yt', 'w-4 h-4 fill-current') + 'YouTube</a></div></div></div>';
  html += '</aside></div>';

  /* Bawah: kurasi (kategori Trending News) */
  var bottom = (function () { var t = S.trending.slice(5); var out = t.slice(0, 3); return out.length === 3 ? out : out.concat(take(3 - out.length)); })();
  html += '<section class="mt-16 pt-8 bg-surface-container-low -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-10" aria-labelledby="h-kurasi"><div class="max-w-7xl mx-auto">' +
    '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6"><div><span class="text-meta-eyebrow font-meta-eyebrow text-primary uppercase font-bold tracking-wider">KURASI REDAKSI</span>' +
    '<h2 id="h-kurasi" class="font-headline-md text-headline-md text-on-surface">Trending News Pekan Ini</h2></div>' +
    '<a class="text-meta-label font-meta-label text-primary font-bold hover:underline flex items-center gap-1" href="' + (S.tcat ? U.catHref(S.tcat.slug) : 'cari.html') + '"><span>Lihat Seluruh Arsip Trending</span>' + ms('arrow_forward', 'text-sm') + '</a></div>' +
    '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' + bottom.map(function (p) {
      return '<a href="' + U.postHref(p) + '" class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"><div>' +
        '<div class="aspect-[16/10] overflow-hidden bg-surface-container relative">' + U.img(p, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500') +
        (U.catName(p) ? '<span class="absolute top-3 left-3 bg-inverse-surface/90 text-inverse-on-surface px-2 py-0.5 rounded text-meta-eyebrow font-meta-eyebrow font-bold uppercase">' + esc(U.catName(p)) + '</span>' : '') + '</div>' +
        '<div class="p-5"><div class="text-meta-caption font-meta-caption text-secondary mb-2">' + esc(U.join([U.dShort(p), U.readTxt(p, 'Min Baca')])) + '</div>' +
        '<h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-2">' + esc(p.title) + '</h3>' +
        (p.excerpt ? '<p class="font-body-dense text-body-dense text-secondary line-clamp-2">' + esc(p.excerpt) + '</p>' : '') + '</div></div>' +
        '<div class="px-5 pb-5 pt-2 text-meta-caption font-meta-caption text-secondary flex items-center justify-between"><span class="font-semibold text-on-surface">' + esc(p.author) + '</span>' + ms('arrow_forward', 'text-base') + '</div></a>';
    }).join('') + '</div></div></section></div>';

  app.innerHTML = html;
  U.mountBottom(S, take);

  /* ================= PONSEL ================= */
  /* Ekspor Stitch mobile memakai radius kustom: DEFAULT .125rem, lg .25rem, xl .5rem, full .75rem */
  function R(s) {
    return s.replace(/class="([^"]*)"/g, function (m, c) {
      return 'class="' + c.split(/\s+/).map(function (k) {
        return ({ 'rounded': 'rounded-[0.125rem]', 'rounded-lg': 'rounded-[0.25rem]', 'rounded-xl': 'rounded-[0.5rem]', 'rounded-full': 'rounded-[0.75rem]' })[k] || k;
      }).join(' ') + '"';
    });
  }
  var mhl = function (t) { return U.hl(t, q, 'bg-primary-fixed text-on-primary-fixed px-1 rounded-sm'); };
  var m = '<a class="skip" href="#m-main">Lewati ke konten</a>' +
    '<header class="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-24 px-gutter-mobile flex flex-col justify-between py-space-xs">' +
    '<div class="flex items-center justify-between h-12"><div class="flex items-center gap-space-sm"><button aria-label="Menu Navigasi" data-aj-menu aria-controls="aj-drawer" aria-expanded="false" type="button" class="w-11 h-11 flex items-center justify-center text-on-surface rounded-full active:bg-surface-container">' + ms('menu', 'text-[24px]') + '</button></div>' +
    '<div class="flex items-center justify-center"><a class="flex items-baseline" href="index.html" aria-label="AroundJakarta.com, ke beranda"><span class="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">AroundJakarta</span>' +
    '<span class="w-1.5 h-1.5 rounded-full bg-primary-container ml-0.5 inline-block animate-pulse"></span><span class="font-meta-label text-meta-label text-tertiary ml-0.5">com</span></a></div>' +
    '<div class="flex items-center gap-space-xs"><button aria-label="Cari Berita" id="m-search-btn" type="button" class="w-11 h-11 flex items-center justify-center text-on-surface rounded-full active:bg-surface-container">' + ms('search', 'text-[22px]') + '</button></div></div>' +
    '<div class="h-6 px-1 flex items-center justify-between text-meta-caption font-meta-caption text-secondary"><div class="flex items-center gap-space-xs">' +
    '<span class="font-meta-eyebrow text-meta-eyebrow uppercase tracking-wider text-primary-container font-extrabold">EDISI HARI INI</span><span class="text-tertiary-container text-[10px]" aria-hidden="true">•</span>' +
    '<span class="truncate max-w-[130px]">' + esc(U.todayShort()) + '</span></div><div class="flex items-center gap-space-xs">' + ms('location_on', 'text-[14px] text-tertiary') +
    '<span class="font-meta-label text-meta-label text-on-surface">Jakarta</span></div></div></div></header>' +
    '<main id="m-main" tabindex="-1" class="flex-1 w-full pt-24 pb-24 bg-surface min-h-screen"><div class="flex flex-col w-full">';

  m += '<section class="bg-surface-container-lowest px-gutter-mobile pt-space-sm pb-space-md shadow-sm"><nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-secondary mb-space-sm">' +
    '<a class="font-meta-label text-meta-label hover:text-primary transition-colors" href="index.html">Beranda</a>' + ms('chevron_right', 'text-[13px] text-tertiary') +
    '<span class="font-meta-label text-meta-label text-primary font-bold" aria-current="page">' + esc(q ? 'Pencarian' : title) + '</span></nav>' +
    '<form class="relative flex items-center w-full" action="cari.html" method="get" role="search"><div class="absolute left-3 flex items-center pointer-events-none text-secondary">' + ms('search', 'text-[20px]') + '</div>' +
    '<label class="sr-only" for="m-q">Kata kunci</label><input id="m-q" name="q" class="w-full h-11 pl-10 pr-20 bg-surface-container-low text-on-surface font-body-dense text-body-dense rounded-full border-0 focus:outline-none focus:ring-0 focus:bg-surface-container transition-all" placeholder="Cari berita, arsip, opini..." type="search" value="' + esc(q) + '">' + hidden +
    '<div class="absolute right-1.5 flex items-center gap-1"><button aria-label="Bersihkan pencarian" data-clear="m-q" class="w-8 h-8 rounded-full flex items-center justify-center text-tertiary hover:text-on-surface active:bg-surface-container-high transition-colors" type="button">' + ms('close', 'text-[18px]') + '</button>' +
    '<button aria-label="Kirim pencarian" class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm active:scale-95 transition-transform" type="submit">' + ms('arrow_forward', 'text-[18px]') + '</button></div></form>' +
    '<div class="flex items-center justify-between mt-space-sm pt-space-xs text-secondary"><div class="flex items-center gap-1.5 min-w-0"><span class="font-meta-label text-meta-label text-on-surface font-bold truncate">Ditemukan ' + res.total + ' artikel' + (cat ? ' di ' + esc(cat.name) : '') + '</span></div>' +
    (pages > 1 ? '<div class="flex items-center gap-1 flex-shrink-0 bg-surface-container px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span><span class="font-meta-eyebrow text-meta-eyebrow uppercase text-secondary">Hal ' + page + '/' + pages + '</span></div>' : '') +
    '</div></section>';

  m += '<section aria-label="Filter rubrik" class="bg-surface-container-lowest px-gutter-mobile py-2.5 shadow-sm overflow-x-auto no-scrollbar"><div class="flex items-center gap-2 min-w-max py-0.5">' +
    '<a href="' + url({ kategori: '' }) + '" class="flex items-center gap-2 min-h-[44px] px-4 rounded-full ' + (!kslug ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface font-semibold hover:text-primary') + ' font-meta-label text-meta-label active:scale-95 transition-all"><span>Semua</span>' +
    (!kslug ? '<span class="px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary text-[11px] font-extrabold leading-none">' + res.total + '</span>' : '') + '</a>' +
    S.cats.map(function (c) {
      var on = c.slug === kslug;
      return '<a href="' + url({ kategori: c.slug }) + '" class="flex items-center gap-2 min-h-[44px] px-4 rounded-full ' + (on ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface font-semibold active:bg-surface-container-high hover:text-primary') + ' font-meta-label text-meta-label active:scale-95 transition-all">' +
        (/video/i.test(c.name) ? ms('play_circle', 'text-[18px] ' + (on ? '' : 'text-primary')) : '') + '<span>' + esc(c.name) + '</span>' +
        '<span class="px-2 py-0.5 rounded-full ' + (on ? 'bg-surface-container-lowest text-primary font-extrabold' : 'bg-surface-container-high text-secondary font-bold') + ' text-[11px] leading-none">' + (on ? res.total : c.count) + '</span></a>';
    }).join('') + '</div></section>';

  var selBox = function (id, label, value, opts) {
    return '<label for="' + id + '" class="relative h-8 px-2.5 rounded-lg bg-surface-container-lowest text-on-surface flex items-center gap-1 shadow-sm active:bg-surface-container transition-colors">' +
      '<span class="font-meta-label text-meta-label font-medium text-secondary">' + label + '</span><span class="font-meta-label text-meta-label font-bold text-on-surface">' + value + '</span>' + ms('expand_more', 'text-[16px] text-tertiary') +
      '<select id="' + id + '" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">' + opts + '</select></label>';
  };
  m += '<div class="px-gutter-mobile py-3 flex items-center justify-between bg-surface-container-low"><div class="flex items-center gap-2">' +
    selBox('m-urut', 'Urutan:', SORTS[urut], Object.keys(SORTS).map(function (k) { return '<option value="' + k + '"' + (k === urut ? ' selected' : '') + '>' + SORTS[k] + '</option>'; }).join('')) +
    selBox('m-rentang', 'Rentang:', RANGES[rentang][1], Object.keys(RANGES).map(function (k) { return '<option value="' + k + '"' + (k === rentang ? ' selected' : '') + '>' + RANGES[k][0] + '</option>'; }).join('')) +
    '</div><a aria-label="Atur ulang filter" title="Atur ulang filter" href="' + (q ? 'cari.html?q=' + encodeURIComponent(q) : 'cari.html') + '" class="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-sm active:bg-surface-container transition-colors">' + ms('tune', 'text-[18px]') + '</a></div>';

  m += '<section aria-label="Daftar hasil" class="px-gutter-mobile py-space-md flex flex-col gap-space-md">';
  if (!res.items.length) {
    m += '<div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm text-center flex flex-col items-center gap-2">' + ms('search_off', 'text-[32px] text-primary') +
      '<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Tidak ada artikel yang cocok</h2><p class="font-body-dense text-body-dense text-secondary">Coba kata kunci lain atau pilih rubrik "Semua".</p></div>';
  }
  res.items.forEach(function (p, i) {
    var c = U.catName(p);
    if (i === 0 && page === 1) {
      m += '<article class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col"><a href="' + U.postHref(p) + '" class="relative w-full aspect-[16/9] bg-surface-container block" tabindex="-1" aria-hidden="true">' +
        U.img(p, 'medium', 'w-full h-full object-cover') +
        (c ? '<div class="absolute top-3 left-3"><span class="px-2.5 py-1 rounded-sm bg-primary-container text-on-primary font-meta-eyebrow text-meta-eyebrow tracking-wider uppercase font-bold shadow-sm">' + esc(c) + '</span></div>' : '') +
        '<div class="absolute bottom-3 right-3 bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface px-2 py-0.5 rounded-sm font-meta-eyebrow text-meta-eyebrow flex items-center gap-1">' + ms('verified', 'text-[12px] text-primary-fixed-dim') + '<span>' + (q && urut === 'relevance' ? 'Paling Relevan' : 'Laporan Utama') + '</span></div></a>' +
        '<div class="p-4 flex flex-col gap-2"><h2 class="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug"><a href="' + U.postHref(p) + '">' + mhl(p.title) + '</a></h2>' +
        (p.excerpt ? '<p class="font-body-dense text-body-dense text-secondary line-clamp-2">' + mhl(p.excerpt) + '</p>' : '') +
        '<div class="pt-2 mt-1 flex items-center justify-between text-secondary"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">' + ms('edit_note', 'text-[14px]') + '</div>' +
        '<div class="flex flex-col"><span class="font-meta-label text-meta-label font-bold text-on-surface">' + esc(p.author) + '</span><span class="font-meta-caption text-meta-caption text-tertiary">' + esc(U.join([U.dShort(p), U.readTxt(p, 'mnt baca')])) + '</span></div></div>' +
        '<a href="' + U.postHref(p) + '" aria-label="Baca artikel" class="w-9 h-9 rounded-full flex items-center justify-center text-tertiary hover:text-primary active:bg-surface-container transition-colors">' + ms('arrow_forward', 'text-[20px]') + '</a></div></div></article>';
    } else if (U.isVideo(p)) {
      m += '<article class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col"><a href="' + U.postHref(p) + '" tabindex="-1" aria-hidden="true" class="relative w-full aspect-video bg-inverse-surface overflow-hidden block">' +
        U.img(p, 'medium', 'w-full h-full object-cover') + '<div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-transparent to-inverse-surface/30"></div>' +
        '<div class="absolute top-3 left-3 flex items-center gap-1.5"><span class="px-2.5 py-1 rounded-sm bg-primary text-on-primary font-meta-eyebrow text-meta-eyebrow tracking-wider uppercase font-extrabold shadow-md flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-pulse"></span><span>AroundJakarta TV</span></span>' +
        '<span class="px-2 py-1 rounded-sm bg-inverse-surface/85 backdrop-blur-sm text-surface-bright font-meta-eyebrow text-[10px] tracking-wide uppercase font-semibold">VIDEO</span></div>' +
        '<div class="absolute inset-0 flex items-center justify-center"><div class="w-16 h-16 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-lg backdrop-blur-sm ring-4 ring-surface-container-lowest/30">' + ms('play_arrow', 'text-[36px] translate-x-0.5') + '</div></div></a>' +
        '<div class="p-4 flex flex-col gap-2"><h3 class="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug"><a href="' + U.postHref(p) + '">' + mhl(p.title) + '</a></h3>' +
        '<div class="flex items-center justify-between text-secondary pt-1"><div class="flex items-center gap-2 font-meta-caption text-meta-caption"><span class="flex items-center gap-1 text-on-surface font-medium">' + ms('play_circle', 'text-[14px] text-primary') + 'Video</span>' +
        '<span class="text-tertiary" aria-hidden="true">•</span><span class="text-tertiary">' + esc(U.ago(p)) + '</span></div></div></div></article>';
    } else {
      m += '<a href="' + U.postHref(p) + '" class="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3"><div class="flex-1 flex flex-col gap-1 min-w-0"><div class="flex items-center gap-1.5 min-w-0">' +
        (c ? '<span class="px-1.5 py-0.5 rounded-sm bg-surface-container-high font-meta-eyebrow text-meta-eyebrow text-on-secondary-container font-extrabold uppercase tracking-wide truncate">' + esc(c) + '</span>' : '') +
        '<span class="font-meta-caption text-meta-caption text-tertiary flex-shrink-0">• ' + esc(U.dShort(p)) + '</span></div>' +
        '<h3 class="font-headline-xs text-headline-xs text-on-surface font-bold line-clamp-2 leading-snug">' + mhl(p.title) + '</h3>' +
        '<span class="font-meta-caption text-meta-caption text-secondary mt-1">' + esc(U.join([p.author, U.readTxt(p, 'mnt baca')])) + '</span></div>' +
        '<div class="w-[84px] h-[84px] rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">' + U.img(p, 'thumb', 'w-full h-full object-cover') + '</div></a>';
    }
    if (q && i === 1) {
      m += '<div class="p-3.5 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-start gap-3 shadow-sm"><div class="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary-container flex-shrink-0 mt-0.5">' + ms('lightbulb', 'text-[18px]') + '</div>' +
        '<div class="flex flex-col gap-0.5"><span class="font-meta-label text-meta-label font-bold text-on-secondary-fixed">Tips Penelusuran Cerdas</span><p class="font-body-dense text-body-dense text-on-secondary-container text-[13px] leading-relaxed">Pakai kata kunci yang spesifik, lalu persempit dengan rubrik atau <span class="font-bold text-on-secondary-fixed">rentang waktu</span>.</p></div></div>';
    }
  });
  m += '</section>';
  if (pages > 1) {
    m += '<nav aria-label="Halaman" class="px-gutter-mobile py-space-sm flex items-center justify-center gap-1.5">' +
      (page > 1 ? '<a href="' + url({ page: page - 1 > 1 ? String(page - 1) : '' }) + '" class="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-meta-label text-meta-label font-semibold flex items-center gap-1 shadow-sm">' + ms('chevron_left', 'text-[16px]') + '<span>Sebelum</span></a>'
        : '<span aria-disabled="true" class="h-11 px-3 rounded-lg bg-surface-container text-tertiary font-meta-label text-meta-label flex items-center gap-1 opacity-50">' + ms('chevron_left', 'text-[16px]') + '<span>Sebelum</span></span>') +
      (function () {
        var out = '', last = 0;
        pageList().forEach(function (n) {
          if (n - last > 1) out += '<span class="w-8 h-11 flex items-center justify-center text-tertiary font-bold text-body-dense" aria-hidden="true">...</span>';
          out += '<a href="' + url({ page: n > 1 ? String(n) : '' }) + '"' + (n === page ? ' aria-current="page" class="w-11 h-11 rounded-lg bg-primary text-on-primary font-meta-label text-meta-label font-bold flex items-center justify-center shadow-sm"' : ' class="w-11 h-11 rounded-lg bg-surface-container-lowest text-on-surface font-meta-label text-meta-label font-semibold flex items-center justify-center shadow-sm active:bg-surface-container"') + '>' + n + '</a>';
          last = n;
        });
        return out;
      })() +
      (page < pages ? '<a href="' + url({ page: String(page + 1) }) + '" class="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-meta-label text-meta-label font-semibold flex items-center gap-1 shadow-sm active:bg-surface-container"><span>Berikut</span>' + ms('chevron_right', 'text-[16px]') + '</a>'
        : '<span aria-disabled="true" class="h-11 px-3 rounded-lg bg-surface-container text-tertiary font-meta-label text-meta-label flex items-center gap-1 opacity-50"><span>Berikut</span>' + ms('chevron_right', 'text-[16px]') + '</span>') + '</nav>';
  }

  var mHead = function (t, right) {
    return '<div class="flex items-center justify-between pb-1"><div class="flex items-center gap-2"><span class="w-1 h-3.5 rounded bg-primary-container"></span>' +
      '<h2 class="font-meta-label text-meta-label font-bold text-on-surface uppercase tracking-wider">' + t + '</h2></div>' + (right || '') + '</div>';
  };
  m += '<section class="mt-space-md bg-surface-container-low px-gutter-mobile py-space-md flex flex-col gap-space-md">';
  if (tags.length) {
    m += '<div class="flex flex-col gap-2">' + mHead('Topik Terkait').replace('pb-1', '') + '<div class="flex flex-wrap gap-2 pt-1">' + tags.map(function (t) {
      return '<a class="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-meta-label text-meta-label shadow-sm active:bg-primary active:text-on-primary transition-colors" href="cari.html?q=' + encodeURIComponent(t.name) + '">#' + esc(t.name.replace(/\s+/g, '')) + '</a>';
    }).join('') + '</div></div>';
  }
  if (trend.length) {
    m += '<div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-3">' + mHead('Trending di Jakarta', ms('trending_up', 'text-[18px] text-primary-container')) +
      '<ol class="flex flex-col gap-3 pt-1">' + trend.map(function (p, i) {
        return '<li><a class="flex items-start gap-3 group" href="' + U.postHref(p) + '"><span class="font-headline-md text-headline-md text-tertiary-fixed-dim font-bold leading-none w-6 flex-shrink-0" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<div class="flex flex-col gap-0.5"><span class="font-meta-eyebrow text-meta-eyebrow uppercase ' + (i ? 'text-secondary' : 'text-primary') + ' font-bold">' + esc(U.catName(p)) + '</span>' +
          '<span class="font-headline-xs text-headline-xs text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-2">' + esc(p.title) + '</span></div></a></li>';
      }).join('') + '</ol></div>';
  }
  m += '<div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-2.5">' + mHead('Distribusi Rubrik', '<span class="font-meta-eyebrow text-meta-eyebrow text-secondary font-bold">TOTAL ' + S.total + '</span>') +
    '<div class="grid grid-cols-2 gap-2 pt-1">' + S.cats.map(function (c, i) {
      return '<a href="' + url({ kategori: c.slug }) + '" class="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between gap-1 min-h-[44px]"><span class="font-meta-label text-meta-label text-secondary truncate">' + esc(c.name) + '</span>' +
        '<span class="font-meta-label text-meta-label font-bold ' + (i ? 'text-on-surface' : 'text-primary') + ' px-1.5 py-0.5 rounded bg-surface-container-lowest shadow-sm">' + c.count + '</span></a>';
    }).join('') + '</div></div></section>';

  m += '<section class="px-gutter-mobile py-space-md" aria-label="Ikuti AroundJakarta"><div class="bg-surface-container-high p-4 rounded-xl shadow-sm flex flex-col gap-3"><div class="flex items-center gap-2.5">' +
    '<div class="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">' + ms('notifications', 'text-[20px]') + '</div>' +
    '<div><h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Ikuti AroundJakarta</h2><p class="font-body-dense text-body-dense text-secondary text-[13px]">Liputan foto dan video terbaru seputar Jakarta setiap hari.</p></div></div>' +
    '<div class="flex flex-col gap-2 pt-1"><a class="w-full h-11 bg-primary text-on-primary font-meta-label text-meta-label font-bold rounded-lg shadow-sm active:bg-primary-container transition-colors flex items-center justify-center gap-1.5" href="' + esc(AJ.INSTAGRAM) + '" rel="noopener">' + svg('ig', 'w-4 h-4 fill-current') + '<span>Ikuti di Instagram</span></a>' +
    '<a class="w-full h-11 bg-surface-container-lowest text-on-surface font-meta-label text-meta-label font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5" href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + svg('yt', 'w-4 h-4 fill-current text-red-600') + '<span>Tonton di YouTube</span></a></div></div></section>';

  m += '<section class="px-gutter-mobile pb-space-lg" aria-label="Kanal video"><div class="bg-inverse-surface text-inverse-on-surface p-4 rounded-xl shadow-sm flex items-center justify-between gap-3"><div class="flex flex-col gap-1 min-w-0">' +
    '<span class="font-meta-eyebrow text-meta-eyebrow text-primary-fixed uppercase tracking-wider font-extrabold">AROUNDJAKARTA VIDEO</span>' +
    '<h2 class="font-headline-xs text-headline-xs text-surface-bright font-bold leading-tight">Pantau Liputan Video Jakarta</h2><div class="flex items-center gap-2 mt-1.5">' +
    '<a href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener" class="flex items-center gap-1 bg-surface-container-lowest/15 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-meta-label font-bold text-surface-bright min-h-[32px]">' + ms('smart_display', 'text-[14px]') + '<span>YouTube</span></a>' +
    '<a href="' + esc(AJ.INSTAGRAM) + '" rel="noopener" class="flex items-center gap-1 bg-surface-container-lowest/15 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-meta-label font-bold text-surface-bright min-h-[32px]">' + ms('photo_camera', 'text-[14px]') + '<span>Instagram</span></a></div></div>' +
    '<a href="' + (S.vcat ? U.catHref(S.vcat.slug) : esc(AJ.YT_CHANNEL)) + '" aria-label="Lihat video AroundJakarta" class="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-md">' + ms('play_arrow', 'text-[28px]') + '</a></div></section>';
  m += '</div></main>';

  /* Navigasi bawah (maks. 5 item) */
  var tabs = [
    { label: 'Terkini', icon: 'newspaper', href: 'index.html', on: false },
    { label: 'Trending', icon: 'bolt', href: S.tcat ? U.catHref(S.tcat.slug) : 'cari.html', on: S.tcat && kslug === S.tcat.slug },
    { label: 'Metro', icon: 'location_city', cat: 'Metro' },
    { label: 'Video', icon: 'smart_display', href: S.vcat ? U.catHref(S.vcat.slug) : AJ.YT_CHANNEL, on: S.vcat && kslug === S.vcat.slug },
    { label: 'Cari', icon: 'search', href: 'cari.html', on: !!q || !kslug }
  ];
  var metro = S.cats.find(function (c) { return /^metro$/i.test(c.name); });
  tabs[2].href = metro ? U.catHref(metro.slug) : 'cari.html'; tabs[2].on = metro && kslug === metro.slug;
  m += '<nav aria-label="Navigasi bawah" class="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]"><div class="flex justify-around items-center h-16 px-gutter-mobile">' +
    tabs.map(function (t) {
      return '<a' + (t.on ? ' aria-current="page"' : '') + ' class="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors ' + (t.on ? 'text-primary-container font-bold' : 'text-secondary') + '" href="' + esc(t.href) + '">' +
        ms(t.icon, 'text-[22px]') + '<span class="font-meta-label text-meta-label">' + t.label + '</span></a>';
    }).join('') + '</div></nav>';

  mob.innerHTML = R(m);
  U.bindTop();

  /* Interaksi */
  document.querySelectorAll('[data-clear]').forEach(function (b) {
    b.addEventListener('click', function () { var i = document.getElementById(b.getAttribute('data-clear')); i.value = ''; i.focus(); });
  });
  var rs = document.querySelector('[data-range]');
  if (rs) rs.addEventListener('change', function () { location.href = url({ rentang: rs.value === 'all' ? '' : rs.value }); });
  var mu = document.getElementById('m-urut'), mr = document.getElementById('m-rentang');
  mu.addEventListener('change', function () { location.href = url({ urut: mu.value }); });
  mr.addEventListener('change', function () { location.href = url({ rentang: mr.value === 'all' ? '' : mr.value }); });
  document.getElementById('m-search-btn').addEventListener('click', function () { var i = document.getElementById('m-q'); i.focus(); i.select(); });
})();
