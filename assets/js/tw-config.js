/* Konfigurasi Tailwind, digabung dari ekspor Google Stitch:
   - brand + font Merriweather/Plus Jakarta Sans: dari halaman Beranda (code.html)
   - token warna, tipografi, dan spacing "Metropolitan Editorial": dari DESIGN.md
     dan halaman Pencarian Mobile. Halaman Artikel & Pencarian desktop memakai kelas
     token ini, tetapi ekspor Stitch-nya lupa menyertakan definisinya. */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { red: '#DC2626', dark: '#111827', navy: '#0F172A', blue: '#1D4ED8', muted: '#64748B' },
        'tertiary-container': '#717476', 'primary': '#b80035', 'inverse-on-surface': '#eef0ff',
        'primary-container': '#e11d48', 'on-secondary-fixed': '#111c2d', 'on-surface': '#131b2e',
        'on-primary-fixed': '#40000c', 'on-primary-fixed-variant': '#920028', 'on-secondary-fixed-variant': '#3c475a',
        'secondary-fixed-dim': '#bcc7de', 'outline': '#906f70', 'on-tertiary-fixed-variant': '#444749',
        'surface-container-lowest': '#ffffff', 'surface-container-high': '#e2e7ff', 'on-surface-variant': '#5c3f40',
        'surface-variant': '#dae2fd', 'tertiary-fixed-dim': '#c4c7c9', 'on-secondary-container': '#586377',
        'on-primary-container': '#fffaf9', 'secondary-fixed': '#d8e3fb', 'surface-dim': '#d2d9f4',
        'on-tertiary-container': '#f9fbfd', 'on-tertiary': '#ffffff', 'secondary-container': '#d5e0f8',
        'tertiary-fixed': '#e0e3e5', 'on-error-container': '#93000a', 'surface-tint': '#be0037', 'surface': '#faf8ff',
        'inverse-surface': '#283044', 'surface-container': '#eaedff', 'background': '#faf8ff', 'on-secondary': '#ffffff',
        'on-tertiary-fixed': '#191c1e', 'tertiary': '#585c5d', 'primary-fixed-dim': '#ffb3b6', 'surface-bright': '#faf8ff',
        'on-primary': '#ffffff', 'surface-container-highest': '#dae2fd', 'error': '#ba1a1a', 'on-error': '#ffffff',
        'inverse-primary': '#ffb3b6', 'outline-variant': '#e5bdbe', 'on-background': '#131b2e',
        'error-container': '#ffdad6', 'primary-fixed': '#ffdada', 'surface-container-low': '#f2f3ff', 'secondary': '#545f73'
      },
      spacing: {
        'gutter-mobile': '1rem', 'space-xs': '0.25rem', 'margin': '2rem', 'space-sm': '0.5rem', 'space-lg': '1.5rem',
        'margin-mobile': '1rem', 'gutter': '1.5rem', 'space-xl': '2.5rem', 'space-md': '1rem'
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-sm': ['"Playfair Display"', 'Georgia', 'serif'], 'headline-xs': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'], 'headline-lg': ['"Playfair Display"', 'Georgia', 'serif'],
        'body-dense': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'], 'meta-label': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'], 'headline-hero': ['"Playfair Display"', 'Georgia', 'serif'],
        'body-lead': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'], 'headline-hero-mobile': ['"Playfair Display"', 'Georgia', 'serif'], 'headline-lg-mobile': ['"Playfair Display"', 'Georgia', 'serif'],
        'headline-md': ['"Playfair Display"', 'Georgia', 'serif'], 'meta-eyebrow': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'], 'meta-caption': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'body-default': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-xs': ['16px', { lineHeight: '22px', fontWeight: '700' }],
        'headline-lg': ['36px', { lineHeight: '44px', letterSpacing: '-0.015em', fontWeight: '700' }],
        'body-dense': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'meta-label': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'headline-hero': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lead': ['18px', { lineHeight: '30px', fontWeight: '400' }],
        'headline-hero-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg-mobile': ['26px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'meta-eyebrow': ['11px', { lineHeight: '14px', letterSpacing: '0.08em', fontWeight: '800' }],
        'meta-caption': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'body-default': ['16px', { lineHeight: '26px', fontWeight: '400' }]
      },
      boxShadow: { xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }
    }
  }
};
