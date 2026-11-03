# reference/

Bahan acuan untuk membangun argyweb. **Bukan** kode produksi; salin/adaptasi ke `src/` sesuai dokumen di `docs/`.

| Path | Isi | Cara pakai |
|---|---|---|
| `styles/tokens.css` | Token desain resmi "Silicon" (terang/gelap, brand, font, radius, gerak) | Salin ke `src/styles/tokens.css`, petakan ke `@theme` Tailwind |
| `styles/prototype.css` | CSS lengkap prototipe | Acuan ukuran/spasi komponen; jangan di-copy mentah |
| `content/projects.ts` | 13 proyek + timeline + stack, bertipe, bilingual | Pindahkan ke `src/content/` |
| `content/messages.id.json`, `messages.en.json` | Teks UI dari prototipe | Dasar `messages/*.json` next-intl (rapikan namespace) |
| `shaders/cpu-chip.frag.glsl` | Shader raymarching chip CPU dari prototipe | Acuan bentuk, pola sirkuit, pulse, dan animasi perakitan |
| `prototype/portfolio-prototype.dc.html` | Sumber prototipe lengkap (format Design Component; tidak bisa dibuka langsung di browser) | Baca markup untuk struktur section, dan bagian `<script>` untuk logika (router, intro, chat fallback, target chip) |

Prototipe yang bisa diklik ada di artifact Claude "Argy Portfolio 3D" milik Argy.
