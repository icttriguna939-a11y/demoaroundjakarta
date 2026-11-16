/* Detail artikel: mengikuti aroundjakarta.com_detail_artikel_berita/code.html
   Isi artikel (content.rendered) ditampilkan utuh; hanya gayanya yang diatur. */
(async function () {
  var U = UI, esc = U.esc, API = window.API, AJ = window.AJ, ms = U.ms, svg = U.svg;
  var slug = new URLSearchParams(location.search).get('slug');
  U.mountTop('');
  var app = document.getElementById('konten');
  app.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10';

  function fail(t) {
    document.getElementById('aj-hero').innerHTML = '';
    app.innerHTML = '<div class="py-16 text-center text-slate-500"><p class="mb-3">' + t + '</p><a class="text-primary font-bold underline" href="index.html">Kembali ke beranda</a></div>';
    document.getElementById('aj-footer').innerHTML = U.footer();
  }
  if (!slug) return fail('Artikel tidak ditentukan.');
  app.innerHTML = '<div aria-busy="true" class="space-y-4"><div class="aj-skel h-6 w-1/3"></div><div class="aj-skel h-12 w-4/5"></div><div class="aj-skel h-80"></div></div>';

  var r = await Promise.all([U.loadShared(), API.posts({ slug: slug, perPage: 1 })]);
  var S = r[0], p = r[1].items[0];
  if (!p) return fail('Artikel tidak ditemukan.');
  var c0 = U.catOf(p);
  U.active = c0 ? c0.slug : '';
  document.title = p.title + ' | AroundJakarta.com';

  var more = await Promise.all([
    API.posts({ perPage: 1, before: p.date, order: 'desc' }),
    API.posts({ perPage: 1, after: p.date, order: 'asc' }),
    c0 ? API.posts({ perPage: 5, category: c0.id, exclude: p.id }) : Promise.resolve({ items: [] }),
    API.comments(p.id)
  ]);
  var prev = more[0].items[0], next = more[1].items[0], sameCat = more[2].items, comments = more[3].items;

  var take = U.picker(S.latest);
  take.use(p);
  U.mountShell(S, take);

  var initials = (p.author || 'AJ').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  if (/redaksi/i.test(p.author || '')) initials = 'AJ';
  var url = p.link || location.href;
  var enc = encodeURIComponent;
  var rm = U.readMin(p);

  var html = '<div class="flex flex-col w-full">';
  /* Breadcrumb */
  html += '<div class="w-full bg-surface-container-lowest py-3"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
    '<nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-meta-caption font-meta-caption text-secondary min-w-0">' +
    '<a class="hover:text-primary transition flex items-center gap-1 flex-shrink-0" href="index.html">' + ms('home', 'text-xs') + 'Beranda</a>' +
    (c0 ? '<span class="text-tertiary-fixed-dim" aria-hidden="true">/</span><a class="hover:text-primary transition flex-shrink-0" href="' + U.catHref(c0.slug) + '">' + esc(c0.name) + '</a>' : '') +
    '<span class="text-tertiary-fixed-dim" aria-hidden="true">/</span><span class="text-on-surface font-semibold truncate" aria-current="page">' + esc(p.title) + '</span></nav></div></div>';

  /* Header artikel */
  html += '<header class="w-full bg-surface-container-lowest pb-6 pt-2"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
    '<div class="flex flex-wrap items-center gap-2 mb-4">' + p.cats.map(function (c, i) {
      return '<a href="' + U.catHref(c.slug) + '" class="' + (i === 0 ? 'bg-primary-container text-on-primary px-3' : 'bg-surface-container-high text-on-surface px-2.5') +
        ' font-meta-eyebrow text-meta-eyebrow py-1 rounded tracking-wider uppercase">' + esc(c.name) + '</a>';
    }).join('') + '</div>' +
    '<h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg lg:text-headline-hero text-on-surface leading-tight mb-4 tracking-tight max-w-5xl">' + esc(p.title) + '</h1>' +
    (p.excerpt ? '<p class="font-body-lead text-body-lead text-secondary max-w-4xl mb-6">' + esc(p.excerpt) + '</p>' : '') +
    '<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 bg-surface-container-low px-4 sm:px-6 rounded-xl">' +
    '<div class="flex flex-wrap items-center gap-4 sm:gap-6 text-meta-label font-meta-label text-secondary">' +
    '<div class="flex items-center gap-2.5"><div class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm" aria-hidden="true">' + esc(initials) + '</div>' +
    '<div><span class="block text-on-surface font-bold">' + esc(p.author) + '</span><span class="text-tertiary text-meta-caption font-meta-caption">AroundJakarta.com</span></div></div>' +
    '<span class="hidden sm:inline-block text-tertiary-fixed-dim" aria-hidden="true">|</span>' +
    '<div class="flex items-center gap-1.5">' + ms('calendar_today', 'text-sm text-tertiary') + '<time datetime="' + esc(U.toDate(p) ? U.toDate(p).toISOString() : '') + '">' + esc(U.join([U.dLong(p), U.time(p)])) + '</time></div>' +
    (rm ? '<span class="hidden sm:inline-block text-tertiary-fixed-dim" aria-hidden="true">|</span><div class="flex items-center gap-1.5">' + ms('schedule', 'text-sm text-tertiary') + '<span>' + rm + ' Menit Baca</span></div>' : '') +
    '</div>' +
    '<div class="flex items-center flex-wrap gap-2 pt-2 lg:pt-0"><span class="text-meta-caption font-meta-caption text-tertiary uppercase font-bold mr-1">Bagikan:</span>' +
    '<a aria-label="Bagikan via WhatsApp" target="_blank" rel="noopener" href="https://wa.me/?text=' + enc(p.title + ' ' + url) + '" class="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-[#25D366] hover:text-white text-secondary flex items-center justify-center shadow-sm transition">' + svg('wa', 'w-4 h-4 fill-current') + '</a>' +
    '<a aria-label="Bagikan via X" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + enc(p.title) + '&url=' + enc(url) + '" class="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-black hover:text-white text-secondary flex items-center justify-center shadow-sm transition">' + svg('x', 'w-3.5 h-3.5 fill-current') + '</a>' +
    '<a aria-label="Bagikan via Facebook" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + enc(url) + '" class="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-[#1877F2] hover:text-white text-secondary flex items-center justify-center shadow-sm transition">' + svg('fb', 'w-4 h-4 fill-current') + '</a>' +
    '<button class="flex items-center gap-1 text-meta-caption font-meta-caption bg-surface-container-lowest hover:bg-surface-container px-2.5 py-1.5 rounded-lg text-on-surface shadow-sm transition" id="copy-btn" type="button">' + ms('link', 'text-xs') + '<span id="copy-label" aria-live="polite">Salin Tautan</span></button>' +
    '<div class="flex items-center gap-1 pl-2 border-l border-surface-container-high">' +
    '<button data-font="sm" class="w-7 h-7 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface text-meta-caption font-bold flex items-center justify-center transition" title="Perkecil Font" aria-label="Perkecil ukuran teks" type="button">A-</button>' +
    '<button data-font="lg" class="w-7 h-7 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface text-meta-caption font-bold flex items-center justify-center transition" title="Perbesar Font" aria-label="Perbesar ukuran teks" type="button">A+</button>' +
    '<button id="save-btn" class="w-8 h-8 rounded-full bg-surface-container-lowest hover:text-primary text-secondary flex items-center justify-center transition shadow-sm ml-1" title="Simpan Artikel" aria-label="Simpan artikel" aria-pressed="false" type="button">' + ms('bookmark_border', 'text-base') + '</button>' +
    '</div></div></div></div></header>';

  /* Gambar utama */
  if (p.img) {
    html += '<figure class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">' +
      '<div class="relative w-full overflow-hidden rounded-xl bg-surface-container-high aspect-[16/9] md:aspect-[21/9] shadow-md">' +
      U.img(p, 'full', 'w-full h-full object-cover', true) + '<div class="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent"></div></div>' +
      (p.caption ? '<figcaption class="mt-2.5 text-meta-caption font-meta-caption text-secondary px-1">' + esc(p.caption) + '</figcaption>' : '') + '</figure>';
  }

  /* Isi + sidebar */
  html += '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full"><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">' +
    '<article class="lg:col-span-8 flex flex-col space-y-6 min-w-0">';
  if (p.content) {
    html += '<div class="aj-prose font-body-default text-body-default text-on-surface leading-relaxed" id="article-body">' + U.cleanContent(p.content) + '</div>';
  } else {
    html += '<div class="bg-surface-container-low rounded-xl p-5 font-body-dense text-body-dense text-secondary">' + (p.excerpt ? '<p class="mb-2">' + esc(p.excerpt) + '</p>' : '') +
      'Isi lengkap artikel tidak dapat dimuat pada mode data cadangan. <a class="text-primary font-bold underline" href="' + esc(p.link) + '" rel="noopener">Baca di situs asli</a>.</div>';
  }
  html += '<p class="text-meta-caption font-meta-caption text-secondary"><a class="text-primary font-bold hover:underline inline-flex items-center gap-1" href="' + esc(p.link) + '" rel="noopener">Baca di situs asli ' + ms('open_in_new', 'text-xs') + '</a></p>';

  if (p.tags && p.tags.length) {
    html += '<div class="pt-6 border-t border-surface-container-high"><div class="flex items-center gap-2 mb-3">' + ms('sell', 'text-sm text-primary') +
      '<span class="text-meta-label font-meta-label text-on-surface uppercase tracking-wider font-bold">Topik Terkait:</span></div><div class="flex flex-wrap gap-2">' +
      p.tags.map(function (t) {
        return '<a class="bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-meta-caption text-meta-caption px-3 py-1.5 rounded-full transition shadow-sm" href="cari.html?q=' + enc(t.name) + '">#' + esc(t.name.replace(/\s+/g, '')) + '</a>';
      }).join('') + '</div></div>';
  }
  if (prev || next) {
    html += '<nav aria-label="Artikel lain" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">' +
      (prev ? '<a class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition flex items-center gap-3.5 group" href="' + U.postHref(prev) + '">' + ms('arrow_back', 'text-secondary group-hover:-translate-x-1 transition-transform flex-shrink-0') +
        '<div class="min-w-0"><span class="text-[10px] uppercase font-bold text-tertiary tracking-wider block">Artikel Sebelumnya</span><span class="block font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition truncate">' + esc(prev.title) + '</span></div></a>' : '<span></span>') +
      (next ? '<a class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition flex items-center justify-between gap-3.5 group text-right" href="' + U.postHref(next) + '"><div class="min-w-0 flex-1">' +
        '<span class="text-[10px] uppercase font-bold text-tertiary tracking-wider block">Artikel Selanjutnya</span><span class="block font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition truncate">' + esc(next.title) + '</span></div>' +
        ms('arrow_forward', 'text-secondary group-hover:translate-x-1 transition-transform flex-shrink-0') + '</a>' : '') + '</nav>';
  }
  /* Kartu penulis */
  html += '<div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">' +
    '<div class="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold text-xl flex-shrink-0 shadow-md" aria-hidden="true">' + esc(initials) + '</div>' +
    '<div class="flex-1 text-center sm:text-left"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">' +
    '<h2 class="font-headline-xs text-headline-xs text-on-surface font-bold">' + esc(p.author) + '</h2><span class="text-meta-caption font-meta-caption text-primary font-semibold">AroundJakarta.com</span></div>' +
    '<p class="text-body-dense font-body-dense text-secondary mb-3">Berita ini diterbitkan oleh ' + esc(p.author) + ' di AroundJakarta.com' + (c0 ? ' dalam rubrik ' + esc(c0.name) : '') + '.</p>' +
    '<div class="flex items-center justify-center sm:justify-start gap-4 text-meta-caption font-meta-caption text-secondary">' +
    '<a class="hover:text-primary transition flex items-center gap-1" href="cari.html">' + ms('article', 'text-xs') + '<span>Lihat Semua Artikel</span></a><span class="text-tertiary-fixed-dim" aria-hidden="true">•</span>' +
    '<a class="hover:text-primary transition flex items-center gap-1" href="' + esc(AJ.WP_BASE) + '/contact/" rel="noopener">' + ms('mail', 'text-xs') + '<span>Kontak Redaksi</span></a></div></div></div>';

  /* Komentar: dibaca dari situs asli; formulir dikirim ke wp-comments-post.php situs asli */
  html += '<section class="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-sm space-y-6" aria-labelledby="h-komentar">' +
    '<div class="flex items-center justify-between pb-3 border-b border-surface-container-high"><div class="flex items-center gap-2">' + ms('chat', 'text-primary') +
    '<h2 id="h-komentar" class="font-headline-sm text-headline-sm text-on-surface font-bold">Komentar Pembaca</h2>' +
    '<span class="bg-surface-container text-on-surface font-meta-label text-meta-label px-2 py-0.5 rounded-full font-bold">' + comments.length + '</span></div>' +
    '<span class="text-meta-caption font-meta-caption text-tertiary">Pedoman Komunitas Berlaku</span></div>';
  if (comments.length) {
    html += '<div class="space-y-4">' + comments.map(function (c, i) {
      var ini = c.author.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
      return '<div class="p-4 rounded-lg bg-surface-container-low space-y-2' + (c.parent ? ' ml-6' : '') + '"><div class="flex items-center gap-2.5">' +
        '<div class="w-8 h-8 rounded-full ' + (i % 2 ? 'bg-primary-container' : 'bg-secondary') + ' text-on-primary flex items-center justify-center font-bold text-xs" aria-hidden="true">' + esc(ini) + '</div>' +
        '<div><h3 class="font-meta-label text-meta-label font-bold text-on-surface">' + esc(c.author) + '</h3><span class="text-meta-caption font-meta-caption text-tertiary">' + esc(U.ago(c)) + '</span></div></div>' +
        '<div class="text-body-dense font-body-dense text-on-surface pl-10">' + U.cleanContent(c.html || '') + '</div></div>';
    }).join('') + '</div>';
  } else {
    html += '<p class="text-body-dense font-body-dense text-secondary">Belum ada komentar. Jadilah yang pertama menanggapi berita ini.</p>';
  }
  var inp = 'w-full bg-surface-container-low text-on-surface text-body-dense font-body-dense rounded-lg px-3.5 py-2.5 border-0 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner';
  html += '<div class="pt-4"><h3 class="font-headline-xs text-headline-xs text-on-surface font-bold mb-3">Tulis Tanggapan Anda</h3>' +
    '<form class="space-y-4" method="post" action="' + esc(AJ.WP_BASE) + '/wp-comments-post.php" target="_blank" id="comment-form">' +
    '<input type="hidden" name="comment_post_ID" value="' + (p.id > 0 ? p.id : '') + '"><input type="hidden" name="comment_parent" value="0">' +
    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-meta-label font-meta-label text-secondary mb-1.5" for="comment-name">Nama Lengkap *</label>' +
    '<input class="' + inp + '" id="comment-name" name="author" autocomplete="name" placeholder="Contoh: Rian Anggoro" required type="text"></div>' +
    '<div><label class="block text-meta-label font-meta-label text-secondary mb-1.5" for="comment-email">Alamat Email * (Tidak dipublikasikan)</label>' +
    '<input class="' + inp + '" id="comment-email" name="email" autocomplete="email" placeholder="nama@email.com" required type="email"></div></div>' +
    '<div><label class="block text-meta-label font-meta-label text-secondary mb-1.5" for="comment-message">Isi Komentar *</label>' +
    '<textarea class="' + inp.replace('px-3.5 py-2.5', 'p-3.5') + '" id="comment-message" name="comment" placeholder="Sampaikan pendapat Anda secara santun, relevan, dan konstruktif..." required rows="4"></textarea></div>' +
    '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1"><span class="text-meta-caption font-meta-caption text-tertiary">Komentar dikirim ke aroundjakarta.com dan tampil setelah dimoderasi.</span>' +
    '<button class="bg-primary hover:bg-primary-container text-on-primary font-meta-label text-meta-label font-bold px-6 py-2.5 rounded-lg shadow-sm transition"' + (p.id > 0 ? '' : ' disabled') + ' type="submit">Kirim Komentar</button></div>' +
    '</form></div></section></article>';

  /* Sidebar */
  var trend = S.trending.filter(function (x) { return x.id !== p.id; }).slice(0, 5);
  var picks = take(2);
  html += '<aside class="lg:col-span-4 flex flex-col space-y-8" aria-label="Sidebar">';
  if (trend.length) {
    html += '<div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm"><div class="flex items-center justify-between pb-3 mb-4 border-b border-surface-container-high"><div class="flex items-center gap-2">' +
      '<span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span><h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Trending Jakarta</h2></div>' +
      '<span class="text-meta-caption font-meta-caption text-tertiary font-semibold">Trending News</span></div><ol class="space-y-4">' +
      trend.map(function (x, i) {
        return '<li class="flex items-start gap-3 group' + (i ? ' pt-3 border-t border-surface-container-low' : '') + '">' +
          '<span class="font-headline-hero text-headline-md text-primary/40 group-hover:text-primary font-black leading-none flex-shrink-0 w-6" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<div class="flex-1 min-w-0"><a class="font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition line-clamp-2 leading-snug" href="' + U.postHref(x) + '">' + esc(x.title) + '</a>' +
          '<span class="text-meta-caption font-meta-caption text-secondary mt-1 block">' + esc(U.join([U.catName(x), U.dShort(x)])) + '</span></div></li>';
      }).join('') + '</ol></div>';
  }
  if (picks.length) {
    var a = picks[0], b = picks[1];
    html += '<div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm"><div class="flex items-center justify-between pb-3 mb-4 border-b border-surface-container-high">' +
      '<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Sorotan Redaksi</h2>' + ms('verified', 'text-primary text-base') + '</div>' +
      '<a href="' + U.postHref(a) + '" class="group block mb-4"><div class="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-container mb-2.5">' +
      U.img(a, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition duration-300') +
      (U.catName(a) ? '<span class="absolute top-2 left-2 bg-on-surface/90 text-on-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">' + esc(U.catName(a)) + '</span>' : '') + '</div>' +
      '<h3 class="font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition leading-snug font-bold">' + esc(a.title) + '</h3>' +
      (a.excerpt ? '<p class="text-meta-caption font-meta-caption text-secondary mt-1 line-clamp-2">' + esc(a.excerpt) + '</p>' : '') + '</a>' +
      (b ? '<a href="' + U.postHref(b) + '" class="group pt-3 border-t border-surface-container-low flex items-center gap-3"><div class="w-20 h-16 rounded overflow-hidden bg-surface-container flex-shrink-0">' +
        U.img(b, 'thumb', 'w-full h-full object-cover group-hover:scale-105 transition') + '</div><div class="flex-1 min-w-0">' +
        '<h3 class="font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition line-clamp-2 leading-tight">' + esc(b.title) + '</h3>' +
        '<span class="text-meta-caption font-meta-caption text-tertiary mt-1 block">' + esc(U.catName(b)) + '</span></div></a>' : '') + '</div>';
  }
  html += '<div class="bg-gradient-to-br from-on-surface via-inverse-surface to-on-surface text-on-primary p-6 rounded-xl shadow-md">' +
    '<div class="flex items-center gap-2 mb-2">' + ms('mark_email_unread', 'text-primary-fixed-dim') + '<span class="text-meta-eyebrow font-meta-eyebrow text-primary-fixed-dim uppercase tracking-wider">IKUTI AROUNDJAKARTA</span></div>' +
    '<h2 class="font-headline-sm text-headline-sm text-on-primary font-bold mb-2">Kabar Jakarta Terbaru Setiap Hari</h2>' +
    '<p class="text-meta-caption font-meta-caption text-surface-container-highest mb-4">Liputan foto dan video terbaru AroundJakarta hadir di Instagram dan kanal YouTube resmi.</p>' +
    '<div class="space-y-2.5"><a class="w-full bg-primary hover:bg-primary-container text-on-primary font-meta-label text-meta-label font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center gap-1.5" href="' + esc(AJ.INSTAGRAM) + '" rel="noopener">' + svg('ig', 'w-4 h-4 fill-current') + '<span>Ikuti di Instagram</span></a>' +
    '<a class="w-full bg-surface-container-low/10 hover:bg-surface-container-low/20 text-on-primary font-meta-label text-meta-label font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-1.5" href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + svg('yt', 'w-4 h-4 fill-current') + '<span>Tonton di YouTube</span></a></div></div>';
  html += '<div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm"><h2 class="font-headline-sm text-headline-sm text-on-surface font-bold pb-3 mb-3 border-b border-surface-container-high">Kategori Berita</h2>' +
    '<ul class="space-y-2 font-meta-label text-meta-label">' + S.cats.map(function (c) {
      return '<li><a class="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low ' + (c.slug === U.active ? 'text-primary' : 'text-secondary') + ' hover:text-primary transition" href="' + U.catHref(c.slug) + '">' +
        '<span class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>' + esc(c.name) + '</span>' +
        '<span class="bg-surface-container text-on-surface font-bold text-meta-caption px-2 py-0.5 rounded-full">' + c.count + '</span></a></li>';
    }).join('') + '</ul></div></aside></div></div>';

  /* Berita terkait */
  var related = sameCat.slice(0, 4);
  if (related.length < 4) related = related.concat(take(4 - related.length));
  html += '<section class="w-full bg-surface-container-low py-12" aria-labelledby="h-terkait"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
    '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-surface-container-high"><div>' +
    '<span class="text-meta-eyebrow font-meta-eyebrow text-primary uppercase font-bold tracking-wider">REKOMENDASI REDAKSI</span>' +
    '<h2 id="h-terkait" class="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mt-0.5">Berita Terkait' + (c0 ? ' ' + esc(c0.name) : '') + '</h2></div>' +
    '<a class="text-meta-label font-meta-label text-primary font-bold hover:underline flex items-center gap-1" href="' + (c0 ? U.catHref(c0.slug) : 'cari.html') + '"><span>Lihat Semua Berita' + (c0 ? ' ' + esc(c0.name) : '') + '</span>' + ms('arrow_forward', 'text-sm') + '</a></div>' +
    '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">' + related.map(function (x, i) {
      return '<a href="' + U.postHref(x) + '" class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"><div>' +
        '<div class="relative w-full aspect-video overflow-hidden bg-surface-container">' + U.img(x, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition duration-300') +
        (U.catName(x) ? '<span class="absolute top-2 left-2 ' + (i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface') + ' text-[10px] font-bold px-2 py-0.5 rounded uppercase">' + esc(U.catName(x)) + '</span>' : '') + '</div>' +
        '<div class="p-4"><h3 class="font-headline-xs text-headline-xs text-on-surface group-hover:text-primary transition line-clamp-2 leading-snug mb-2">' + esc(x.title) + '</h3>' +
        (x.excerpt ? '<p class="text-meta-caption font-meta-caption text-secondary line-clamp-2">' + esc(x.excerpt) + '</p>' : '') + '</div></div>' +
        '<div class="px-4 pb-4 pt-2 text-meta-caption font-meta-caption text-tertiary">' + esc(U.join([U.dShort(x), U.readTxt(x, 'Min Baca')])) + '</div></a>';
    }).join('') + '</div></div></section></div>';

  app.innerHTML = html;
  U.mountBottom(S, take);

  /* Interaksi kecil */
  var body = document.getElementById('article-body');
  document.querySelectorAll('[data-font]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!body) return;
      body.classList.remove('text-sm', 'text-lg');
      body.classList.add(b.getAttribute('data-font') === 'sm' ? 'text-sm' : 'text-lg');
    });
  });
  var copy = document.getElementById('copy-btn');
  copy.addEventListener('click', function () {
    var lab = document.getElementById('copy-label');
    var done = function () { lab.textContent = 'Tersalin!'; setTimeout(function () { lab.textContent = 'Salin Tautan'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
  });
  var save = document.getElementById('save-btn');
  var KEY = 'aj_saved';
  function saved() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function paint() {
    var on = saved().indexOf(p.slug) > -1;
    save.classList.toggle('text-primary', on);
    save.setAttribute('aria-pressed', String(on));
    save.querySelector('.material-symbols-outlined').textContent = on ? 'bookmark' : 'bookmark_border';
  }
  save.addEventListener('click', function () {
    var s = saved(), i = s.indexOf(p.slug);
    if (i > -1) s.splice(i, 1); else s.push(p.slug);
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    paint();
  });
  paint();
})();
