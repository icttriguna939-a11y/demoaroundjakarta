/* Komponen tampilan bersama. Markup dan kelas Tailwind disalin dari ekspor Google Stitch
   (stitch_custom_design_generator): Beranda, Detail Artikel, Hasil Pencarian (desktop & mobile).
   Teks contoh Stitch diganti data asli dari WordPress; isi berita tidak diubah. */
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

  /* ---------- Ikon SVG (path dari Stitch) ---------- */
  var P = {
    cal: '<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>',
    x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>',
    ig: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>',
    yt: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>',
    fb: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>',
    wa: '<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>',
    search: '<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>',
    trend: '<path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>',
    play: '<path d="M8 5v14l11-7z"></path>',
    up: '<path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>',
    close: '<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>'
  };
  var STROKE = { cal: 1, menu: 1, search: 1, trend: 1, up: 1, close: 1 };
  function svg(name, cls) {
    return STROKE[name]
      ? '<svg class="' + cls + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' + P[name] + '</svg>'
      : '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true">' + P[name] + '</svg>';
  }
  function ms(name, cls, fill) {
    return '<span class="material-symbols-outlined ' + (cls || '') + '" aria-hidden="true"' +
      (fill ? ' style="font-variation-settings: \'FILL\' 1;"' : '') + '>' + name + '</span>';
  }

  var UI = { esc: esc, slugify: slugify, svg: svg, ms: ms, cats: [], active: 'home' };

  /* ---------- Format tanggal & waktu (WIB) ---------- */
  var TZ = 'Asia/Jakarta';
  var fmtShort = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ });
  var fmtLong = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
  var fmtFull = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
  var fmtDay = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short', timeZone: TZ });
  var fmtTime = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
  /* WordPress "date" = waktu lokal situs (WIB) tanpa zona; tambahkan +07:00 agar benar di semua zona waktu. */
  function toDate(p) { var s = p && p.date; if (!s) return null; return new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s + '+07:00'); }
  UI.toDate = toDate;
  UI.dShort = function (p) { var d = toDate(p); return d ? fmtShort.format(d).replace(/\./g, '') : ''; };
  UI.dLong = function (p) { var d = toDate(p); return d ? fmtLong.format(d) : ''; };
  UI.time = function (p) { var d = toDate(p); return d ? fmtTime.format(d).replace('.', ':') + ' WIB' : ''; };
  UI.today = function () { return fmtFull.format(new Date()); };
  UI.todayShort = function () { return fmtDay.format(new Date()).replace(/\./g, ''); };
  UI.ago = function (p, short) {
    var d = toDate(p); if (!d) return '';
    var s = (Date.now() - d) / 1000;
    if (s < 0 || s > 7 * 86400) return UI.dShort(p);
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + (short ? 'm lalu' : ' menit lalu');
    if (s < 86400) return Math.round(s / 3600) + ' jam lalu';
    var dd = Math.round(s / 86400);
    return dd === 1 ? 'Kemarin' : dd + ' hari lalu';
  };
  UI.readMin = function (p) {
    if (!p || !p.content) return 0;
    if (p._rm) return p._rm;
    var d = new DOMParser().parseFromString(p.content, 'text/html');
    p._rm = Math.max(1, Math.ceil(((d.body.textContent || '').trim().split(/\s+/).length) / 200));
    return p._rm;
  };
  UI.readTxt = function (p, word) { var m = UI.readMin(p); return m ? m + ' ' + (word || 'Menit Baca') : ''; };
  UI.join = function (bits, sep) { return bits.filter(Boolean).join(sep == null ? ' • ' : sep); };

  /* Sorot kata kunci (tag <mark> mengikuti kelas Stitch). */
  UI.hl = function (text, q, cls) {
    if (!q) return esc(text);
    var w = q.replace(/"/g, ' ').trim().split(/\s+/).filter(function (s) { return s.length > 1; })
      .map(function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    if (!w.length) return esc(text);
    return String(text).split(new RegExp('(' + w.join('|') + ')', 'gi')).map(function (part, i) {
      return i % 2 ? '<mark class="' + (cls || 'bg-primary-fixed text-on-primary-fixed px-1 rounded') + '">' + esc(part) + '</mark>' : esc(part);
    }).join('');
  };

  /* ---------- Tautan & gambar ---------- */
  UI.postHref = function (p) { return 'artikel.html?slug=' + encodeURIComponent(p.slug); };
  UI.catHref = function (slug) { return 'cari.html?kategori=' + encodeURIComponent(slug); };
  UI.catOf = function (p) { return (p && p.cats && p.cats[0]) || null; };
  UI.catName = function (p) { var c = UI.catOf(p); return c ? c.name : ''; };
  var looksLikeFile = /(\.(jpe?g|png|webp|gif)$)|^IMG[_-]|^[A-Za-z0-9_-]{18,}$/;
  UI.alt = function (p) { return p.imgAlt && !looksLikeFile.test(p.imgAlt) ? p.imgAlt : p.title; };
  UI.img = function (p, size, cls, eager) {
    if (!p || !p.img) return '<div class="' + esc(cls) + ' bg-neutral-800" aria-hidden="true"></div>';
    var src = p.img[size] || p.img.full;
    return '<img class="' + esc(cls) + '" src="' + esc(src) + '" alt="' + esc(UI.alt(p)) + '" ' +
      (eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">';
  };
  UI.isVideo = function (p) { return (p.cats || []).some(function (c) { return /video/i.test(c.name); }); };

  /* Warna badge kategori (gaya kartu "Popular Now" Stitch). */
  UI.catColor = function (name) {
    var n = (name || '').toLowerCase();
    if (/video/.test(n)) return 'bg-red-600';
    if (/trending/.test(n)) return 'bg-red-600';
    if (/ekonomi/.test(n)) return 'bg-blue-800';
    if (/hukum/.test(n)) return 'bg-neutral-900';
    if (/event|gaya/.test(n)) return 'bg-purple-700';
    if (/metro/.test(n)) return 'bg-amber-600';
    return 'bg-emerald-700';
  };

  /* ---------- Menu ---------- */
  UI.menuHref = function (m) {
    if (m.href) return m.href;
    if (m.external) return AJ.WP_BASE + m.external;
    var c = UI.cats.find(function (x) { return x.name.toLowerCase() === m.cat.toLowerCase(); });
    return UI.catHref(c ? c.slug : slugify(m.cat));
  };
  UI.isActive = function (m) {
    if (m.key) return m.key === UI.active;
    if (!m.cat) return false;
    var c = UI.cats.find(function (x) { return x.name.toLowerCase() === m.cat.toLowerCase(); });
    return (c ? c.slug : slugify(m.cat)) === UI.active;
  };
  UI.menuLabel = function (m) { return m.external ? 'Kontak' : m.label; };

  /* ---------- Shell atas: utility bar, masthead, nav sticky (Stitch: TopUtilityBar, MainMasthead, StickyNavigationBar) ---------- */
  function socials(size) {
    var out = '';
    if (AJ.X_URL) out += '<a aria-label="X (Twitter)" class="text-neutral-400 hover:text-white transition" href="' + esc(AJ.X_URL) + '" rel="noopener">' + svg('x', 'w-3.5 h-3.5 fill-current') + '</a>';
    if (AJ.FACEBOOK) out += '<a aria-label="Facebook" class="text-neutral-400 hover:text-white transition" href="' + esc(AJ.FACEBOOK) + '" rel="noopener">' + svg('fb', 'w-3.5 h-3.5 fill-current') + '</a>';
    out += '<a aria-label="Instagram" class="text-neutral-400 hover:text-white transition" href="' + esc(AJ.INSTAGRAM) + '" rel="noopener">' + svg('ig', 'w-3.5 h-3.5 fill-current') + '</a>';
    out += '<a aria-label="YouTube" class="text-neutral-400 hover:text-red-500 transition" href="' + esc(AJ.YT_CHANNEL) + '" rel="noopener">' + svg('yt', 'w-4 h-4 fill-current') + '</a>';
    return out;
  }
  function navLinks() {
    return AJ.MENU.map(function (m) {
      var on = UI.isActive(m), href = UI.menuHref(m), lab = esc(UI.menuLabel(m));
      var cur = on ? ' aria-current="page"' : '';
      if (m.live) {
        return '<li><a class="px-3 py-2 ' + (on ? 'text-white font-bold border-b-2 border-red-600' : 'hover:text-red-500 hover:border-b-2 hover:border-red-500 text-red-400 font-semibold') +
          ' transition flex items-center gap-1.5" href="' + esc(href) + '"' + cur + '><span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>' + lab + '</a></li>';
      }
      return '<li><a class="px-3 py-2 ' + (on ? 'text-white font-bold border-b-2 border-red-600 flex items-center gap-1' : 'hover:text-white hover:border-b-2 hover:border-white transition') +
        '" href="' + esc(href) + '"' + cur + '>' + lab + '</a></li>';
    }).join('');
  }
  function logo(tag, cls) {
    return '<' + tag + ' class="' + cls + '">Around<span class="italic font-normal">Jakarta</span><span class="text-red-600">.com</span></' + tag + '>';
  }
  UI.top = function (q) {
    var home = UI.active === 'home';
    return '<a class="skip" href="#aj-main">Lewati ke konten</a>' +
      '<aside class="bg-black text-slate-300 text-xs border-b border-neutral-800 py-2" data-purpose="utility-bar" aria-label="Info situs">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-3">' +
      '<div class="flex items-center space-x-4"><span class="flex items-center gap-1.5 font-medium">' + svg('cal', 'w-3.5 h-3.5 text-neutral-400') + esc(UI.today()) + '</span></div>' +
      '<div class="flex items-center space-x-5"><div class="hidden md:flex items-center space-x-4 text-neutral-400">' +
      '<a class="hover:text-white transition" href="' + esc(AJ.WP_BASE) + '/contact/" rel="noopener">Kontak Redaksi</a>' +
      '<a class="hover:text-white transition" href="' + esc(AJ.WP_BASE) + '" rel="noopener">Situs Asli</a></div>' +
      '<div class="flex items-center space-x-3 border-l border-neutral-700 pl-4">' + socials() + '</div></div></div></aside>' +

      '<header class="bg-black text-white border-b border-neutral-800 py-2.5" data-purpose="masthead"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"><div class="flex items-center justify-between gap-4">' +
      '<div class="flex items-center space-x-3 sm:w-1/4">' +
      '<button aria-label="Buka menu" aria-controls="aj-drawer" aria-expanded="false" data-aj-menu class="text-neutral-300 hover:text-white p-1.5 rounded-md hover:bg-neutral-800 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center" type="button">' + svg('menu', 'w-6 h-6') + '</button>' +
      '<button aria-label="Cari berita" aria-controls="aj-search" aria-expanded="false" data-aj-search class="hidden sm:flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-full hover:border-neutral-500 hover:text-white transition" type="button">' + svg('search', 'w-3.5 h-3.5') + '<span>Cari berita DKI...</span></button></div>' +
      '<div class="flex flex-col items-center justify-center text-center flex-1 min-w-0"><a href="index.html" class="inline-block group" aria-label="AroundJakarta.com, ke beranda">' +
      logo(home ? 'h1' : 'div', 'font-headline text-[26px] leading-tight sm:text-4xl md:text-5xl font-black tracking-tight text-white group-hover:text-neutral-200 transition font-serif') + '</a>' +
      '<p class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mt-1 flex items-center justify-center gap-2"><span class="w-6 sm:w-10 h-px bg-neutral-700 inline-block"></span>' + esc(AJ.TAGLINE) + '<span class="w-6 sm:w-10 h-px bg-neutral-700 inline-block"></span></p></div>' +
      '<div class="flex items-center justify-end space-x-3 sm:w-1/4">' +
      '<button aria-label="Cari berita" aria-controls="aj-search" aria-expanded="false" data-aj-search class="sm:hidden text-neutral-300 hover:text-white p-1.5 rounded-md hover:bg-neutral-800 min-w-[44px] min-h-[44px] flex items-center justify-center" type="button">' + svg('search', 'w-5 h-5') + '</button>' +
      '<a class="hidden sm:inline-block text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded shadow transition" href="' + esc(AJ.YT_CHANNEL) + '?sub_confirmation=1" rel="noopener">Langganan</a></div>' +
      '</div></div>' +
      '<div id="aj-search" hidden class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3"><form action="cari.html" method="get" role="search" class="flex gap-2">' +
      '<label class="sr-only" for="aj-q">Kata kunci berita</label>' +
      '<input id="aj-q" name="q" type="search" value="' + esc(q || '') + '" placeholder="Cari berita DKI..." class="flex-1 text-sm bg-neutral-900 text-white border border-neutral-700 rounded-full px-4 py-2 focus:outline-none focus:border-red-500">' +
      '<button class="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition" type="submit">Cari</button></form></div></header>' +

      '<nav class="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-neutral-800 text-sm" data-purpose="primary-navigation" aria-label="Menu utama">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-12">' +
      '<ul class="flex items-center space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar font-medium whitespace-nowrap text-neutral-300">' + navLinks() + '</ul>' +
      '<div class="hidden lg:flex items-center text-xs font-semibold text-neutral-400 pl-4 border-l border-neutral-800"><span class="text-white">ID</span></div>' +
      '</div></div></nav><div id="aj-fb"></div>';
  };

  /* Laci menu ponsel (tidak ada di Stitch; mengikuti gaya masthead hitam). */
  UI.drawer = function (q) {
    return '<div class="aj-drawer" id="aj-drawer"><div class="scrim" data-close></div>' +
      '<div class="panel bg-black text-white border-r border-neutral-800 p-5" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="flex items-center justify-between mb-5">' + logo('div', 'font-headline text-2xl font-black tracking-tight font-serif') +
      '<button type="button" data-close aria-label="Tutup menu" class="text-neutral-300 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-neutral-800">' + svg('close', 'w-6 h-6') + '</button></div>' +
      '<form action="cari.html" method="get" role="search" class="flex gap-2 mb-5"><label class="sr-only" for="aj-dq">Kata kunci</label>' +
      '<input id="aj-dq" name="q" type="search" value="' + esc(q || '') + '" placeholder="Cari berita DKI..." class="flex-1 min-w-0 text-sm bg-neutral-900 text-white border border-neutral-700 rounded-full px-4 py-2 focus:outline-none focus:border-red-500">' +
      '<button class="bg-red-600 text-white text-xs font-bold px-4 rounded-full" type="submit">Cari</button></form>' +
      '<ul class="space-y-1 text-sm">' + AJ.MENU.map(function (m) {
        var on = UI.isActive(m);
        return '<li><a class="flex items-center gap-2 px-3 py-3 rounded ' + (on ? 'bg-neutral-900 text-white font-bold border-l-2 border-red-600' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white') +
          '" href="' + esc(UI.menuHref(m)) + '">' + (m.live ? '<span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>' : '') + esc(UI.menuLabel(m)) + '</a></li>';
      }).join('') + '</ul>' +
      '<div class="flex items-center gap-4 mt-6 pt-5 border-t border-neutral-800">' + socials() + '</div></div></div>';
  };

  var opener = null;
  function setOpen(v) {
    var drawer = document.getElementById('aj-drawer');
    if (!drawer) return;
    drawer.classList.toggle('open', v);
    document.querySelectorAll('[data-aj-menu]').forEach(function (b) { b.setAttribute('aria-expanded', String(v)); });
    document.body.style.overflow = v ? 'hidden' : '';
    if (v) { var f = drawer.querySelector('input'); if (f) setTimeout(function () { f.focus(); }, 50); }
    else if (opener) opener.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-aj-menu], #aj-drawer [data-close]');
    if (!t) return;
    if (t.hasAttribute('data-aj-menu')) { opener = t; setOpen(true); } else setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    var d = document.getElementById('aj-drawer');
    if (e.key === 'Escape' && d && d.classList.contains('open')) setOpen(false);
  });
  UI.bindTop = function () {
    /* Laci dipasang langsung di <body> agar tetap bisa tampil saat shell desktop disembunyikan (ponsel). */
    var host = document.getElementById('aj-drawer-host');
    if (!host) { host = document.createElement('div'); host.id = 'aj-drawer-host'; document.body.appendChild(host); }
    host.innerHTML = UI.drawer(UI.q);
    var box = document.getElementById('aj-search');
    document.querySelectorAll('[data-aj-search]').forEach(function (b) {
      if (b.dataset.bound) return; b.dataset.bound = '1';
      b.addEventListener('click', function () {
        if (!box) { location.href = 'cari.html'; return; }
        box.hidden = !box.hidden;
        document.querySelectorAll('[data-aj-search]').forEach(function (x) { x.setAttribute('aria-expanded', String(!box.hidden)); });
        if (!box.hidden) box.querySelector('input').focus();
      });
    });
  };

  /* ---------- Hero (Stitch: HeroGridSection) ---------- */
  UI.heroSkeleton = function () {
    return '<section class="bg-neutral-950 text-white pt-6 pb-10 border-b border-neutral-800" aria-busy="true" aria-label="Memuat berita utama">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">' +
      '<div class="lg:col-span-8"><div class="aj-skel-dark min-h-[460px] md:min-h-[520px]"></div></div>' +
      '<div class="lg:col-span-4"><div class="aj-skel-dark h-[460px]"></div></div></div></div></section>';
  };
  UI.hero = function (lead, trending, side) {
    if (!lead) return '';
    var meta = UI.join([UI.catName(lead), UI.dShort(lead)]);
    var html = '<section class="bg-neutral-950 text-white pt-6 pb-10 border-b border-neutral-800" data-purpose="hero-highlight-grid" aria-label="Berita utama">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">' +
      '<div class="lg:col-span-8 flex flex-col justify-between">' +
      '<a href="' + UI.postHref(lead) + '" class="relative group rounded-xl overflow-hidden min-h-[460px] md:min-h-[520px] flex flex-col justify-end p-6 sm:p-8 bg-neutral-900 shadow-2xl">' +
      UI.img(lead, 'large', 'absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out', true) +
      '<div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"></div>' +
      '<div class="relative z-10 max-w-3xl"><div class="flex items-center gap-2 mb-3">' +
      '<span class="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wider">HOT NOW</span>' +
      '<span class="text-xs text-neutral-300 font-medium">' + esc(meta) + '</span></div>' +
      '<h2 class="font-headline text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-3 group-hover:text-slate-200 hero-text-shadow">' + esc(lead.title) + '</h2>' +
      (lead.excerpt ? '<p class="text-neutral-300 text-sm sm:text-base line-clamp-2 mb-4 font-normal">' + esc(lead.excerpt) + '</p>' : '') +
      '<div class="flex items-center gap-3 text-xs text-neutral-400"><span class="font-semibold text-neutral-200">' + esc(lead.author) + '</span>' +
      (UI.readTxt(lead) ? '<span>•</span><span>' + esc(UI.readTxt(lead)) + '</span>' : '') + '</div></div></a>';
    if (trending.length) {
      html += '<div class="mt-6 pt-5 border-t border-neutral-800"><div class="flex items-center gap-2 mb-3 text-neutral-400 text-xs font-bold uppercase tracking-wider">' +
        svg('trend', 'w-4 h-4 text-red-500') + '<span>TRENDING NOW</span></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4">' +
        trending.slice(0, 3).map(function (p) {
          return '<a class="group flex sm:flex-col items-center sm:items-start gap-3 bg-neutral-900/60 p-2.5 rounded-lg hover:bg-neutral-900 border border-neutral-800/80 transition" href="' + UI.postHref(p) + '">' +
            UI.img(p, 'medium', 'w-20 h-16 sm:w-full sm:h-24 object-cover rounded flex-shrink-0 group-hover:opacity-90') +
            '<h3 class="font-headline text-xs font-bold leading-snug text-neutral-200 group-hover:text-red-400 transition line-clamp-2">' + esc(p.title) + '</h3></a>';
        }).join('') + '</div></div>';
    }
    html += '</div>' +
      '<aside class="lg:col-span-4 bg-neutral-900/50 p-5 rounded-xl border border-neutral-800 flex flex-col" aria-label="Berita terbaru">' +
      '<div class="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800"><h2 class="font-bold text-xs uppercase tracking-widest text-neutral-200 flex items-center gap-2">' +
      '<span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>BREAKING NEWS</h2><span class="text-[11px] text-neutral-400 font-medium">Update Terkini</span></div>' +
      '<div class="space-y-4 divide-y divide-neutral-800/70">' +
      side.map(function (p, i) {
        return '<a href="' + UI.postHref(p) + '" class="' + (i ? 'pt-3' : 'pt-0') + ' flex items-start gap-3 group">' +
          UI.img(p, 'thumb', 'w-20 h-16 object-cover rounded flex-shrink-0 group-hover:brightness-110') +
          '<div class="flex-1 min-w-0"><h3 class="font-headline text-xs font-bold leading-snug text-neutral-100 group-hover:text-red-400 transition line-clamp-2">' + esc(p.title) + '</h3>' +
          '<div class="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5"><span class="' + (i ? 'text-neutral-300' : 'text-red-500 font-semibold') + '">' + esc(UI.ago(p, true)) + '</span>' +
          (UI.catName(p) ? '<span>•</span><span>' + esc(UI.catName(p)) + '</span>' : '') + '</div></div></a>';
      }).join('') + '</div>' +
      '<div class="mt-auto pt-4 text-center"><a class="inline-block text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 w-full py-2 rounded transition" href="cari.html">Lihat Semua Breaking News →</a></div>' +
      '</aside></div></div></section>';
    return html;
  };

  /* ---------- Shell bawah (Stitch: BlueFullWidthAppBanner + LowerSectionEditorAndVideo) ---------- */
  function storeBadge(href, icon, small, big) {
    return '<a class="flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow transition w-44 justify-center" href="' + esc(href) + '" rel="noopener">' +
      icon + '<div class="text-left leading-tight"><div class="text-[9px] uppercase tracking-wider text-neutral-400">' + small + '</div><div class="text-xs font-bold font-sans">' + big + '</div></div></a>';
  }
  UI.banner = function () {
    return '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12" data-purpose="app-newsletter-banner" id="newsletter" aria-label="Ikuti AroundJakarta">' +
      '<div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-6 sm:p-10 shadow-xl">' +
      '<div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>' +
      '<div class="absolute left-1/3 -top-12 w-48 h-48 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>' +
      '<div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8"><div class="max-w-xl text-center lg:text-left">' +
      '<span class="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 backdrop-blur-sm">AroundJakarta Mobile &amp; Digest</span>' +
      '<h2 class="font-headline text-2xl sm:text-3xl font-extrabold leading-tight mb-2">Dapatkan Update Berita Terkini Sekitar Jakarta Langsung di Ponsel Anda</h2>' +
      '<p class="text-blue-100 text-xs sm:text-sm">Ikuti Instagram dan kanal YouTube AroundJakarta untuk liputan foto, video, dan kabar terbaru seputar Jakarta.</p></div>' +
      '<div class="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-center">' +
      storeBadge(AJ.INSTAGRAM, svg('ig', 'w-6 h-6 fill-current'), 'Ikuti di', 'Instagram') +
      storeBadge(AJ.YT_CHANNEL, svg('yt', 'w-6 h-6 fill-current text-white'), 'Tonton di', 'YouTube') +
      '</div></div></div></section>';
  };

  UI.lower = function (editor, video, worth) {
    var html = '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" data-purpose="editorial-choice-and-video" aria-label="Pilihan editor dan video">' +
      '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8"><div class="lg:col-span-8 space-y-10">';
    if (editor.length) {
      html += '<div><div class="flex items-center justify-between mb-4 border-b border-slate-300 pb-2"><h2 class="font-headline text-xl font-black text-slate-900 tracking-tight">Editor\'s Choice</h2>' +
        '<span class="text-xs font-semibold text-slate-500">Pilihan Kurator Berita</span></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-5">' +
        editor.map(function (p) {
          return '<a href="' + UI.postHref(p) + '" class="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow transition group flex flex-col justify-between"><div>' +
            '<div class="relative h-32 rounded overflow-hidden mb-2">' + UI.img(p, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300') +
            (UI.catName(p) ? '<span class="absolute bottom-1.5 left-1.5 bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">' + esc(UI.catName(p)) + '</span>' : '') + '</div>' +
            '<h3 class="font-headline text-xs font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2 mb-1">' + esc(p.title) + '</h3>' +
            (p.excerpt ? '<p class="text-slate-500 text-[11px] line-clamp-2">' + esc(p.excerpt) + '</p>' : '') + '</div>' +
            '<div class="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">' + esc(UI.join([UI.dShort(p), UI.readTxt(p, 'Min Baca')])) + '</div></a>';
        }).join('') + '</div></div>';
    }
    /* Blok video: embed YouTube asli (ID dari beranda situs asli), dimuat saat diklik. */
    var vp = video && video[0];
    html += '<div class="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800" id="video-section">' +
      '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">' +
      '<div class="flex items-center gap-2"><span class="bg-red-600 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded">YOUTUBE</span>' +
      '<h2 class="font-headline text-lg sm:text-xl font-bold">Aroundjakarta Video</h2></div>' +
      '<a class="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1" href="' + esc(AJ.YT_CHANNEL) + '?sub_confirmation=1" rel="noopener noreferrer" target="_blank">Subscribe @AroundJakartacom →</a></div>' +
      '<div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">' + UI.ytBox(AJ.VIDEO_ID, 'md:col-span-7') +
      '<div class="md:col-span-5 flex flex-col justify-between"><div>' +
      '<span class="text-red-400 text-[11px] font-bold uppercase tracking-wider">' + (vp ? 'Video Terbaru' : 'Kanal Resmi') + '</span>' +
      (vp ? '<h3 class="font-headline text-base font-bold text-white mt-1 mb-2 hover:text-slate-200"><a href="' + UI.postHref(vp) + '">' + esc(vp.title) + '</a></h3>' +
        (vp.excerpt ? '<p class="text-slate-400 text-xs line-clamp-3 mb-4">' + esc(vp.excerpt) + '</p>' : '')
        : '<h3 class="font-headline text-base font-bold text-white mt-1 mb-2">Tonton liputan AroundJakarta di YouTube</h3><p class="text-slate-400 text-xs line-clamp-3 mb-4">Video liputan dari kanal YouTube @AroundJakartacom.</p>') +
      '</div><div class="bg-slate-800/80 p-3 rounded-lg flex items-center justify-between border border-slate-700"><div class="flex items-center gap-2.5">' +
      '<div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white" aria-hidden="true">AJ</div>' +
      '<div><div class="text-xs font-bold text-white leading-none">AroundJakarta.com</div><div class="text-[10px] text-slate-400 mt-0.5">@AroundJakartacom</div></div></div>' +
      '<a class="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded transition" href="' + esc(AJ.YT_CHANNEL) + '?sub_confirmation=1" rel="noopener" target="_blank">Subscribe</a></div></div></div></div>';
    html += '</div>';

    /* Worth Reading */
    var big = worth[0], list = worth.slice(1, 5);
    html += '<aside class="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col" data-purpose="worth-reading-column" aria-label="Worth Reading">' +
      '<div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-2"><h2 class="font-headline text-lg font-black text-slate-900 tracking-tight">Worth Reading</h2>' +
      '<span class="text-xs font-semibold text-slate-400">Pilihan Redaksi</span></div>';
    if (big) {
      html += '<a href="' + UI.postHref(big) + '" class="group mb-5 block"><div class="relative h-44 rounded-lg overflow-hidden mb-3">' +
        UI.img(big, 'medium', 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300') +
        '<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>' +
        (UI.isVideo(big) ? '<div class="absolute inset-0 flex items-center justify-center"><div class="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">' + svg('play', 'w-4 h-4 fill-current translate-x-0.5') + '</div></div>' : '') +
        '</div><h3 class="font-headline text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">' + esc(big.title) + '</h3>' +
        '<span class="text-[11px] text-slate-400 block mt-1">' + esc(UI.join([UI.dShort(big), UI.readTxt(big, 'Min Baca')])) + '</span></a>';
    }
    html += '<ol class="space-y-4 divide-y divide-slate-100 flex-1">' + list.map(function (p, i) {
      return '<li class="' + (i ? 'pt-3' : 'pt-0') + ' flex items-start gap-3"><span class="text-2xl font-black text-slate-300 font-headline leading-none" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div><h3 class="font-headline text-xs font-bold text-slate-800 hover:text-blue-600 line-clamp-2"><a href="' + UI.postHref(p) + '">' + esc(p.title) + '</a></h3>' +
        '<span class="text-[10px] text-slate-400 mt-1 block">' + esc(UI.join([UI.catName(p), UI.ago(p)])) + '</span></div></li>';
    }).join('') + '</ol>' +
      '<div class="mt-6 p-4 rounded bg-slate-100 border border-dashed border-slate-300 text-center"><span class="text-[10px] tracking-wider text-slate-400 uppercase font-bold block mb-1">Ruang Iklan</span>' +
      '<p class="text-xs font-medium text-slate-600">Pasang Iklan Banner &amp; Advertorial di AroundJakarta</p>' +
      '<a class="text-[11px] text-blue-600 font-bold hover:underline mt-1 inline-block" href="' + esc(AJ.WP_BASE) + '/contact/" rel="noopener">Hubungi Redaksi →</a></div></aside></div></section>';
    return html;
  };

  /* Pemutar YouTube ringan: gambar sampul dulu, iframe dimuat saat diklik. */
  UI.ytBox = function (id, extra) {
    if (!id) return '';
    return '<button type="button" data-yt="' + esc(id) + '" aria-label="Putar video YouTube AroundJakarta" class="' + (extra || '') + ' relative group rounded-lg overflow-hidden bg-black aspect-video w-full flex items-center justify-center cursor-pointer shadow-lg">' +
      '<img alt="" class="w-full h-full object-cover group-hover:opacity-80 transition duration-300" src="https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg" loading="lazy">' +
      '<div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition"></div>' +
      '<div class="absolute w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">' + svg('play', 'w-6 h-6 fill-current translate-x-0.5') + '</div></button>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-yt]');
    if (!b) return;
    var d = document.createElement('div');
    d.className = b.className.replace('cursor-pointer', '');
    d.innerHTML = '<iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/' + encodeURIComponent(b.getAttribute('data-yt')) +
      '?autoplay=1&rel=0" title="Video YouTube AroundJakarta" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    b.replaceWith(d);
  });

  /* ---------- Footer (Stitch: SiteFooter) ---------- */
  UI.footer = function () {
    var col = function (t) { return '<h2 class="font-headline text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">' + t + '</h2>'; };
    var cats = UI.cats.slice(0, 6).map(function (c) {
      return '<li><a class="hover:text-white transition" href="' + UI.catHref(c.slug) + '">' + esc(c.name) + '</a></li>';
    }).join('');
    var menu = AJ.MENU.map(function (m) {
      return '<li><a class="hover:text-white transition" href="' + esc(UI.menuHref(m)) + '">' + esc(UI.menuLabel(m)) + '</a></li>';
    }).join('');
    return '<footer class="bg-black text-neutral-400 pt-14 pb-8 border-t border-neutral-800 text-xs" data-purpose="primary-footer">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">' +
      '<div class="space-y-3"><a href="index.html" class="inline-block group mb-1">' + logo('div', 'font-headline text-2xl font-black tracking-tight text-white group-hover:text-neutral-200 transition font-serif') +
      '<p class="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold mt-0.5">' + esc(AJ.TAGLINE) + '</p></a>' +
      '<p class="text-neutral-400 leading-relaxed text-xs">Portal berita berbahasa Indonesia seputar Jakarta: metro, hukum, ekonomi, event, dan gaya hidup.</p>' +
      '<p class="text-[11px] text-neutral-500">Demo tampilan baru. Seluruh berita, foto, dan video dibaca langsung dari situs aroundjakarta.com tanpa diubah.</p></div>' +
      '<div>' + col('Kategori Berita') + '<ul class="space-y-2" id="aj-foot-cats">' + cats + '</ul></div>' +
      '<div>' + col('Menu') + '<ul class="space-y-2">' + menu + '</ul></div>' +
      '<div>' + col('Hubungi Redaksi') +
      '<p class="text-xs mb-3 text-neutral-400">Kirim informasi, pertanyaan, atau kerja sama melalui halaman kontak situs AroundJakarta.com.</p>' +
      '<p class="mb-4"><a class="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded transition" href="' + esc(AJ.WP_BASE) + '/contact/" rel="noopener">Halaman Kontak</a></p>' +
      '<p class="text-[11px] text-neutral-400 font-semibold mb-2">Ikuti kami:</p><div class="flex items-center gap-4">' + socials() + '</div></div></div>' +
      '<div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">' +
      '<div>© ' + new Date().getFullYear() + ' AroundJakarta.com. Seluruh hak cipta dilindungi undang-undang.</div>' +
      '<div class="flex items-center space-x-4"><a class="hover:text-neutral-300 transition" href="' + esc(AJ.WP_BASE) + '/wp-sitemap.xml" rel="noopener">Sitemap</a><span aria-hidden="true">•</span>' +
      '<a class="hover:text-neutral-300 transition" href="' + esc(AJ.WP_BASE) + '/feed/" rel="noopener">RSS Feed</a><span aria-hidden="true">•</span>' +
      '<button class="text-neutral-300 hover:text-white flex items-center gap-1 font-semibold" data-totop type="button"><span>Ke Atas</span>' + svg('up', 'w-3.5 h-3.5') + '</button></div></div></div></footer>';
  };
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-totop]')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var s = document.querySelector('.skip'); if (s) s.focus({ preventScroll: true });
    }
  });

  /* ---------- Pembersih isi artikel (teks/foto/video tidak diubah, hanya atribut berbahaya dibuang) ---------- */
  UI.cleanContent = function (html) {
    var doc = new DOMParser().parseFromString('<div id="r">' + html + '</div>', 'text/html');
    var root = doc.getElementById('r');
    root.querySelectorAll('script,style,object,form').forEach(function (n) { n.remove(); });
    root.querySelectorAll('*').forEach(function (el) {
      Array.from(el.attributes).forEach(function (a) {
        var n = a.name.toLowerCase(), v = (a.value || '').trim().toLowerCase();
        if (n.indexOf('on') === 0) el.removeAttribute(a.name);
        else if ((n === 'href' || n === 'src') && v.indexOf('javascript:') === 0) el.removeAttribute(a.name);
      });
      if (el.tagName === 'IFRAME') { el.setAttribute('loading', 'lazy'); el.removeAttribute('width'); el.removeAttribute('height'); if (!el.title) el.title = 'Video'; }
      if (el.tagName === 'IMG') { el.setAttribute('loading', 'lazy'); el.setAttribute('decoding', 'async'); el.removeAttribute('sizes'); el.style.height = 'auto'; }
      if (el.tagName === 'A' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener');
    });
    return root.innerHTML;
  };

  /* ---------- Data bersama untuk shell (hero, bawah, footer) ---------- */
  UI.loadShared = async function () {
    var r = await Promise.all([window.API.categories(), window.API.posts({ perPage: 30 })]);
    UI.cats = r[0].items;
    var latest = r[1].items;
    var tcat = UI.cats.find(function (c) { return /trending/i.test(c.name); });
    var vcat = UI.cats.find(function (c) { return /video/i.test(c.name); });
    var r2 = await Promise.all([
      tcat ? window.API.posts({ perPage: 8, category: tcat.id }) : Promise.resolve({ items: [] }),
      vcat ? window.API.posts({ perPage: 2, category: vcat.id }) : Promise.resolve({ items: [] })
    ]);
    return { cats: UI.cats, latest: latest, total: r[1].total, trending: r2[0].items, tcat: tcat, video: r2[1].items, vcat: vcat };
  };

  /* Ambil n artikel dari kumpulan, tanpa mengulang yang sudah tampil. */
  UI.picker = function (pool) {
    var used = new Set();
    var fn = function (n, from) {
      var src = from || pool, out = [];
      for (var i = 0; i < src.length && out.length < n; i++) {
        if (!used.has(src[i].id)) { used.add(src[i].id); out.push(src[i]); }
      }
      if (from && out.length < n) out = out.concat(fn(n - out.length));
      return out;
    };
    fn.use = function (p) { if (p) used.add(p.id); };
    return fn;
  };

  /* Pasang shell lengkap. opts: {active, q, pageHero:true} */
  UI.mountTop = function (active, q) {
    UI.active = active == null ? 'home' : active;
    UI.q = q || '';
    var top = document.getElementById('aj-top');
    if (top) top.innerHTML = UI.top(q);
    var hero = document.getElementById('aj-hero');
    if (hero) hero.innerHTML = UI.heroSkeleton();
    UI.bindTop();
  };
  UI.mountShell = function (S, take) {
    var hero = document.getElementById('aj-hero');
    if (hero) {
      var lead = take(1)[0];
      var trending = take(3, S.trending);
      var side = take(5);
      hero.innerHTML = UI.hero(lead, trending, side);
      hero.removeAttribute('aria-busy');
    }
    var top = document.getElementById('aj-top');
    if (top) { top.innerHTML = UI.top(UI.q); UI.bindTop(); }
  };
  UI.mountBottom = function (S, take) {
    var bot = document.getElementById('aj-bottom');
    if (bot) {
      var editor = take(3), video = S.video, worth = take(5);
      bot.innerHTML = UI.banner() + UI.lower(editor, video, worth);
    }
    var foot = document.getElementById('aj-footer');
    if (foot) foot.innerHTML = UI.footer();
    UI.finish();
  };

  UI.finish = function () {
    if (AJ.usingFallback) {
      var el = document.getElementById('aj-fb');
      if (el && !el.innerHTML) el.innerHTML = '<div class="bg-amber-100 text-amber-900 text-[13px] leading-5 py-2 border-b border-amber-200"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
        'Mode data cadangan: koneksi ke WordPress (' + esc(AJ.WP_BASE) + ') tidak berhasil, jadi hanya sebagian berita yang tampil.</div></div>';
    }
  };

  window.UI = UI;
})();
