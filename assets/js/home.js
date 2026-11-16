/* Beranda: mengikuti aroundjakarta.com_beranda_berita_editorial/code.html */
(async function () {
  var U = UI, esc = U.esc;
  U.mountTop('home');
  var app = document.getElementById('konten');
  app.innerHTML = '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8" aria-busy="true">' +
    '<div class="lg:col-span-5 aj-skel h-[540px]"></div><div class="lg:col-span-7 aj-skel h-[540px]"></div></div>';

  var S = await U.loadShared();
  if (!S.latest.length) {
    document.getElementById('aj-hero').innerHTML = '';
    app.innerHTML = '<div class="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Berita belum dapat dimuat. Coba muat ulang halaman.</div>';
    document.getElementById('aj-footer').innerHTML = U.footer();
    return;
  }
  var take = U.picker(S.latest);
  U.mountShell(S, take);

  var focus = take(1)[0];
  var popular = take(4, S.trending);

  var html = '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">';
  /* Kolom kiri: kartu besar (Stitch "Breaking News") */
  if (focus) {
    var cn = U.catName(focus);
    html += '<section class="lg:col-span-5" data-purpose="breaking-focus-column" aria-labelledby="h-breaking">' +
      '<div class="flex items-center justify-between mb-4 border-b border-slate-300 pb-2"><h2 id="h-breaking" class="font-headline text-xl font-black text-slate-900 tracking-tight">Breaking News</h2>' +
      '<span class="text-xs font-bold text-red-600 uppercase">Sorotan</span></div>' +
      '<a href="' + U.postHref(focus) + '" class="relative group rounded-xl overflow-hidden shadow-lg h-[540px] flex flex-col justify-end p-6 bg-slate-900 text-white">' +
      U.img(focus, 'large', 'absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out') +
      '<div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div><div class="relative z-10">' +
      '<div class="flex items-center gap-2 mb-2"><span class="bg-amber-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">BREAKING</span>' +
      (cn ? '<span class="bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide">' + esc(cn) + '</span>' : '') + '</div>' +
      '<h3 class="font-headline text-2xl font-bold leading-tight mb-3 text-white group-hover:text-slate-200 transition">' + esc(focus.title) + '</h3>' +
      (focus.excerpt ? '<p class="text-slate-300 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">' + esc(focus.excerpt) + '</p>' : '') +
      '<div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">' +
      '<span>' + esc(U.join([U.dShort(focus), 'Oleh ' + focus.author])) + '</span><span class="text-amber-400 font-medium">Baca Selengkapnya →</span></div></div></a></section>';
  }
  /* Kolom kanan: Popular Now 2x2 (diisi kategori Trending News) */
  html += '<section class="lg:col-span-7" data-purpose="popular-now-grid" aria-labelledby="h-popular">' +
    '<div class="flex items-center justify-between mb-4 border-b border-slate-300 pb-2"><h2 id="h-popular" class="font-headline text-xl font-black text-slate-900 tracking-tight">Popular Now</h2>' +
    '<a class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition" href="' + (S.tcat ? U.catHref(S.tcat.slug) : 'cari.html') + '">Lihat Populer Lainnya</a></div>' +
    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">' + popular.map(function (p) {
      var c = U.catName(p);
      return '<a href="' + U.postHref(p) + '" class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">' +
        '<div class="relative h-44 overflow-hidden bg-slate-100">' + U.img(p, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300') +
        (c ? '<div class="absolute bottom-2 left-2 flex gap-1"><span class="' + U.catColor(c) + ' text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">' + esc(c) + '</span></div>' : '') + '</div>' +
        '<div class="p-4 flex-1 flex flex-col justify-between"><div>' +
        '<h3 class="font-headline text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug mb-2 line-clamp-2">' + esc(p.title) + '</h3>' +
        (p.excerpt ? '<p class="text-slate-600 text-xs line-clamp-2 leading-relaxed">' + esc(p.excerpt) + '</p>' : '') + '</div>' +
        '<div class="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between"><span>' + esc(U.dShort(p)) + '</span>' +
        '<span class="font-medium text-slate-600">' + esc(U.readTxt(p, 'Min Baca')) + '</span></div></div></a>';
    }).join('') + '</div></section></div>';

  app.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10';
  app.innerHTML = html;
  U.mountBottom(S, take);
})();
