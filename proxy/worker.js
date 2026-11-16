// Perantara opsional (Cloudflare Worker, gratis) bila browser memblokir akses langsung ke
// aroundjakarta.com/wp-json karena CORS. Hanya meneruskan permintaan BACA (GET) ke /wp-json/.
// Setelah dipasang, isi API_BASE di assets/js/config.js dengan alamat Worker (tanpa garis miring akhir).
const ORIGIN = 'https://aroundjakarta.com';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages'
};
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET' } });
    if (req.method !== 'GET' || !url.pathname.startsWith('/wp-json/')) return new Response('Tidak diizinkan', { status: 405 });
    const up = await fetch(ORIGIN + url.pathname + url.search, {
      headers: { Accept: 'application/json' },
      cf: { cacheTtl: 300, cacheEverything: true }
    });
    const res = new Response(up.body, up);
    Object.entries(CORS).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }
};
