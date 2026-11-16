/* Konfigurasi demo. Ubah di sini saja; file lain tidak perlu disentuh. */
window.AJ = {
  // Alamat situs WordPress asli (sumber seluruh konten)
  WP_BASE: 'https://aroundjakarta.com',
  // Opsional: alamat perantara lain (mis. Cloudflare Worker, lihat proxy/worker.js).
  // Kosongkan: demo otomatis mencoba perantara Vercel (vercel.json), lalu langsung ke WP_BASE.
  API_BASE: '',
  // Embed YouTube yang tampil di beranda situs asli
  VIDEO_ID: 'kHRUbxAhPyU',
  YT_CHANNEL: 'https://www.youtube.com/@AroundJakartacom',
  INSTAGRAM: 'https://www.instagram.com/aroundjakarta.info',
  // Isi bila akun resminya sudah ada; ikon hanya tampil jika alamat diisi (di situs asli masih "#").
  X_URL: '',
  FACEBOOK: '',
  TAGLINE: 'Meneropong Kota Lewat Berita Faktual',
  // Menu utama (urutan sama dengan situs asli). "cat" = nama kategori di WordPress.
  MENU: [
    { label: 'Home', href: 'index.html', key: 'home' },
    { label: 'Around Jakarta', cat: 'Around Jakarta' },
    { label: 'Aroundjakarta Video', cat: 'Aroundjakarta Video', live: true },
    { label: 'Metro', cat: 'Metro' },
    { label: 'Hukum', cat: 'Hukum' },
    { label: 'Ekonomi', cat: 'Ekonomi' },
    { label: 'Event & Gaya Hidup', cat: 'Event & Gaya Hidup' },
    { label: 'Contact', external: '/contact/' }
  ],
  TIMEOUT_MS: 12000
};
