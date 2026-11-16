/* Lapisan data: membaca konten dari WordPress REST API.
   Konten (judul, ringkasan, isi, foto, video) tidak diubah sama sekali.
   Jika API tidak bisa dijangkau, data cadangan (data/fallback.json) dipakai dan banner ditampilkan. */
(function () {
  var AJ = window.AJ;
  var cache = new Map();
  var fbPromise = null;

  function loadFallback() {
    if (!fbPromise) fbPromise = fetch('data/fallback.json').then(function (r) { return r.json(); });
    return fbPromise;
  }

  function decode(s) { var t = document.createElement('textarea'); t.innerHTML = s == null ? '' : s; return t.value; }
  function plain(html) {
    var d = new DOMParser().parseFromString(html || '', 'text/html');
    return (d.body.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* Urutan sumber data:
     1. API_BASE di config.js, bila diisi (mis. Cloudflare Worker).
     2. Perantara di domain sendiri (/wp-json lewat vercel.json), bila tersedia.
     3. Langsung ke WP_BASE.
     Sumber yang berhasil diingat selama sesi, agar tidak mencoba ulang yang gagal. */
  var SAME = location.origin + '/wp-json/wp/v2';
  var DIRECT = AJ.WP_BASE + '/wp-json/wp/v2';
  function bases() {
    if (AJ.API_BASE) return [AJ.API_BASE.replace(/\/+$/, '') + '/wp-json/wp/v2'];
    var known = null;
    try { known = sessionStorage.getItem('aj_api'); } catch (e) {}
    if (known === 'same') return [SAME];
    if (known === 'direct') return [DIRECT];
    return location.protocol.indexOf('http') === 0 && location.origin !== AJ.WP_BASE ? [SAME, DIRECT] : [DIRECT];
  }

  async function get(url) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, AJ.TIMEOUT_MS);
    try {
      var res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if ((res.headers.get('content-type') || '').indexOf('json') < 0) throw new Error('Bukan JSON');
      var data = await res.json();
      return {
        data: data,
        total: parseInt(res.headers.get('X-WP-Total') || '', 10) || (Array.isArray(data) ? data.length : 0),
        pages: parseInt(res.headers.get('X-WP-TotalPages') || '', 10) || 1
      };
    } finally { clearTimeout(timer); }
  }

  async function net(path, params) {
    var q = new URLSearchParams(params || {});
    var tail = path + (q.toString() ? '?' + q.toString() : '');
    if (cache.has(tail)) return cache.get(tail);
    var list = bases(), err;
    for (var i = 0; i < list.length; i++) {
      try {
        var out = await get(list[i] + tail);
        if (!AJ.API_BASE) { try { sessionStorage.setItem('aj_api', list[i] === SAME ? 'same' : 'direct'); } catch (e) {} }
        AJ.source = list[i] === SAME ? 'perantara Vercel' : (AJ.API_BASE ? 'API_BASE' : 'langsung');
        cache.set(tail, out);
        return out;
      } catch (e) { err = e; }
    }
    throw err;
  }

  function norm(p) {
    var emb = p._embedded || {};
    var media = (emb['wp:featuredmedia'] || [])[0];
    var sizes = (media && media.media_details && media.media_details.sizes) || {};
    var u = function (k) { return sizes[k] && sizes[k].source_url; };
    var terms = emb['wp:term'] || [];
    var author = (emb.author || [])[0];
    var mk = function (c) { return { id: c.id, name: decode(c.name), slug: c.slug }; };
    return {
      id: p.id, slug: p.slug, link: p.link, date: p.date,
      title: decode(p.title && p.title.rendered),
      excerpt: plain(p.excerpt && p.excerpt.rendered),
      content: p.content && p.content.rendered,
      cats: (terms[0] || []).map(mk),
      tags: (terms[1] || []).map(mk),
      author: (author && author.name) || 'Redaksi AroundJakarta',
      img: media && media.source_url ? {
        full: media.source_url,
        large: u('large') || u('medium_large') || media.source_url,
        medium: u('medium_large') || u('medium') || media.source_url,
        thumb: u('medium') || u('thumbnail') || media.source_url
      } : null,
      imgAlt: (media && media.alt_text) || '',
      caption: media && media.caption ? plain(media.caption.rendered) : ''
    };
  }

  function localPosts(fb, o) {
    var a = fb.posts.slice();
    if (o.slug) a = a.filter(function (p) { return p.slug === o.slug; });
    if (o.search) {
      var s = o.search.toLowerCase();
      a = a.filter(function (p) { return (p.title + ' ' + (p.excerpt || '')).toLowerCase().indexOf(s) > -1; });
    }
    if (o.category) a = a.filter(function (p) { return p.cats.some(function (c) { return c.id === o.category || c.slug === o.category; }); });
    if (o.exclude) a = a.filter(function (p) { return p.id !== o.exclude; });
    if (o.before) a = a.filter(function (p) { return p.date < o.before; });
    if (o.after) a = a.filter(function (p) { return p.date > o.after; });
    a.sort(function (x, y) { return o.order === 'asc' ? x.date.localeCompare(y.date) : y.date.localeCompare(x.date); });
    var per = o.perPage || 10, pg = o.page || 1;
    return { items: a.slice((pg - 1) * per, pg * per), total: a.length, pages: Math.max(1, Math.ceil(a.length / per)) };
  }

  var API = {
    async posts(o) {
      o = o || {};
      var params = { _embed: 1, per_page: o.perPage || 10, page: o.page || 1 };
      if (o.search) params.search = o.search;
      if (o.category) params.categories = o.category;
      if (o.exclude) params.exclude = o.exclude;
      if (o.slug) params.slug = o.slug;
      if (o.orderby) params.orderby = o.orderby;
      if (o.order) params.order = o.order;
      if (o.before) params.before = o.before;
      if (o.after) params.after = o.after;
      try {
        var r = await net('/posts', params);
        return { items: r.data.map(norm), total: r.total, pages: r.pages };
      } catch (e) {
        AJ.usingFallback = true;
        return localPosts(await loadFallback(), o);
      }
    },
    async categories() {
      try {
        var r = await net('/categories', { per_page: 100, hide_empty: true, _fields: 'id,name,slug,count' });
        var items = r.data.map(function (c) { return { id: c.id, name: decode(c.name), slug: c.slug, count: c.count }; })
          .filter(function (c) { return !/^(uncategorized|tak berkategori)$/i.test(c.name); })
          .sort(function (a, b) { return b.count - a.count; });
        return { items: items };
      } catch (e) {
        AJ.usingFallback = true;
        var fb = await loadFallback();
        return { items: fb.categories.slice() };
      }
    }
  };
  window.API = API;
})();
