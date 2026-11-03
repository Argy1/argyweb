# 03 — Spesifikasi 3D: Chip CPU

> **Status implementasi (2026-11-03):** chip dibangun sesuai dokumen ini dengan perubahan (ikuti `docs/08` §5): (1) **tanpa `@react-three/drei`**: RoundedBox, environment panel cahaya, dan bayangan dibuat sendiri; (2) **§5 dan §7 digantikan** untuk < 1024px: chip ikut turun antar section lewat anchor "stage" di alur layout (bukan hanya di hero); garis aktivasi section 72% tinggi viewport di < 1024px; (3) Mode Ringan (dan reduced-motion) di HP: chip hanya di hero; (4) fallback tanpa WebGL memakai `public/chip-fallback.webp`.

Referensi visual dan perilaku: `reference/prototype/portfolio-prototype.dc.html` dan shader `reference/shaders/cpu-chip.frag.glsl`. Prototipe memakai raymarching layar penuh; **versi produksi memakai mesh asli di React Three Fiber**, karena:

- raymarching per-piksel terlalu berat di HP (penyebab utama prototipe tidak nyaman di mobile),
- mesh mendapat anti-aliasing, material PBR, dan bayangan yang lebih baik,
- ukuran dan posisi lebih mudah dikontrol lewat anchor DOM (lihat bawah).

Shader prototipe tetap jadi acuan untuk **bentuk, warna, pola sirkuit, dan animasi perakitan**.

## 1. Geometri (unit three.js, chip rata di bidang XZ, Y ke atas)

| Bagian | Bentuk | Ukuran | Posisi Y | Catatan |
|---|---|---|---|---|
| Papan (substrate) | `RoundedBox` | 1.90 × 0.09 × 1.90, radius 0.04 | 0 | |
| Pin | `InstancedMesh` box, 32 buah | 0.06 × 0.028 × 0.20 | -0.02 | 8 per sisi, jarak 0.18, dari tepi papan keluar 0.20 |
| Die | box | 0.72 × 0.06 × 0.72, radius 0.012 | 0.08 | Terlihat hanya saat perakitan |
| Tutup (IHS) | `RoundedBox` | 1.32 × 0.09 × 1.32, radius 0.05 | 0.15 | |
| Ukiran "AF" | decal/plane di atas tutup | ±0.55 × 0.30 | 0.196 | Huruf Gabarito 900, terpusat |
| Penanda pin-1 | segitiga kecil emas | sisi 0.08 | 0.046 | Pojok kiri depan papan |

Lebar total chip termasuk pin ≈ **2.30 unit**. Ini dipakai untuk menghitung skala dari ukuran anchor (bagian 5).

## 2. Material & warna

| Bagian | Material | Nilai |
|---|---|---|
| Papan | `MeshPhysicalMaterial` | color `#121A3A`, roughness .35, clearcoat .8, clearcoatRoughness .2 |
| Jalur sirkuit | emissiveMap di papan (tekstur canvas 1024²) + shader pulse | warna dasar tembaga `#B88C4D`, glow `#5B8CFF` |
| Pin | `MeshStandardMaterial` | color `#E3B34C`, metalness 1, roughness .25 |
| Die | `MeshStandardMaterial` | color `#1A1440`, emissive grid `#8C7BFF` |
| Tutup | `MeshPhysicalMaterial` | color `#E1E5EC`, metalness 1, roughness .28, anisotropy .6 (brushed), clearcoat .3 |
| Ukiran "AF" | emissive | `#5B8CFF`, intensity .25 normal, sampai 2.5 saat flash |

**Pola sirkuit**: garis dari tepi tutup (|x| atau |z| = 0.71) ke setiap pin, ditambah satu "bus" persegi di jarak 0.82 dari tengah (lihat fungsi `traces()` di shader). **Pulse** cahaya bergerak keluar dari tengah: `pow(0.5 + 0.5*sin(r*22 - t*3.5 + (x - z)*2), 8)`, dengan `r = max(|x|, |z|)`. Implementasi: `onBeforeCompile` pada material papan atau `shaderMaterial` kustom.

**Pencahayaan**: drei `<Environment>` dengan `<Lightformer>`:
- strip atas putih (intensity 2),
- key hangat `#FFE2B0` kanan atas (1.2),
- fill dingin `#5B8CFF` kiri (0.8).

Mode gelap: environment lebih redup (×0.45), glow sirkuit ×1.4. `<ContactShadows>` di bawah chip, opacity .25 (terang) / .4 (gelap), blur 2.5.

## 3. Pose & gerak dasar

- Kemiringan dasar (rotasi X): **-0.92 rad** (memperlihatkan permukaan atas).
- Putaran idle (rotasi Y): **0.16 rad/detik**.
- Mengambang: posisi Y ± 0.04, 1.1 rad/detik.
- Kursor (desktop saja): yaw += mouseX × 0.8, tilt += mouseY × 0.35, di-lerp 0.05/frame.
- **Scroll spin**: tiap event scroll, `velocity += deltaY_px × 0.004` rad; tiap frame `yaw += velocity; velocity *= 0.9`.
- Pindah halaman: dorongan `velocity += 0.6`.
- Semua di atas dimatikan/diperhalus saat `prefers-reduced-motion` (idle 0.04 rad/detik, tanpa scroll spin).

## 4. Intro "chip dirakit"

Progres `p` (0–1) dari loading asli (drei `useProgress` + `document.fonts.ready`), di-smooth `p += (target - p) × 0.1` per frame. Tiap tahap memakai ease-out kubik `1 - (1 - k)^3`.

| Tahap | Rentang p | Gerakan |
|---|---|---|
| Papan | 0 – 0.26 | Naik dari Y -2.4, skala 0 → 1 |
| Pin | 0.22 – 0.50 | Panjang pin 0 → 0.20 (tumbuh keluar), stagger 40ms antar sisi |
| Die | 0.46 – 0.72 | Turun dari Y +2.0, lebar 0 → 1, grid menyala |
| Tutup | 0.70 – 0.97 | Turun dari Y +2.6 sambil berputar 1.8 rad → 0, mengunci |

- Tiap tahap selesai: `velocity += 0.22` dan `glow = max(glow, 0.55)`.
- Selama intro: chip di tengah layar, kemiringan **-1.3 rad** (lebih dari atas).
- Di 100%: `glow = 1.5` (sirkuit + "AF" menyala), tahan 650ms, overlay intro fade 800ms, kemiringan ke -0.92 (lerp 0.045), chip terbang ke anchor hero (lerp 0.055 ≈ 1 detik).
- `glow *= 0.955` per frame.
- UI overlay intro (lihat prototipe): logo kiri atas, tombol Lewati kanan atas, angka persen besar kiri bawah, label tahap + 4 chip tahapan kanan bawah (Papan/Pin/Die/Tutup, warna navy/emas/ungu/perak, chip aktif ber-border `--glow`).
- Overlay memakai `.bg-circuit`; **canvas 3D di atas overlay selama intro** (z-index), lalu kembali ke belakang konten.

## 5. Posisi & ukuran: sistem anchor (solusi masalah ukuran, teks tertutup, dan responsif)

Prototipe memakai tabel koordinat tetap, sehingga chip kadang terlalu besar dan menutupi teks. Di produksi, **posisi dan ukuran chip mengikuti elemen anchor di DOM**:

```tsx
<div data-chip-anchor="home-hero" data-chip-opacity="1" className="chip-anchor" />
```

- Setiap section yang ingin menampilkan chip punya satu anchor kosong yang **menempati ruang nyata di layout** (kolom grid kosong, bukan absolute di atas teks).
- Komponen 3D membaca `getBoundingClientRect()` anchor aktif (anchor yang pusatnya paling dekat dengan tengah viewport, atau section yang sedang aktif), lalu memproyeksikan pusat rect ke koordinat dunia dan menghitung skala: `scale = (rect.width × 0.92) / lebarChipDalamPiksel`.
- Karena ukuran anchor diatur CSS per breakpoint, chip **otomatis responsif** dan **tidak pernah menutupi teks**.
- Anchor `display: none` di breakpoint tertentu → chip fade out (opacity 0) dan render dijeda.
- Selama berpindah antar anchor, opacity turun ke 0.6 lalu naik lagi, supaya tidak mengganggu teks yang dilewati.

### Tabel anchor (ukuran = lebar anchor)

| Rute · section | Desktop ≥ 1024px | Tablet 768–1023px | Mobile < 768px |
|---|---|---|---|
| Intro | tengah, 30vw (maks 460px) | tengah, 46vw | tengah, 66vw (maks 34svh) |
| Beranda · hero | kolom kanan, 34vw (maks 520px), vertikal tengah | di atas teks, tengah, 44vw | di atas teks, tengah, 62vw (maks 32svh) |
| Beranda · karya | pojok kanan atas samping judul, 12vw | 16vw kanan judul | disembunyikan |
| Beranda · tentang | kolom kiri kosong, 26vw | 32vw di atas teks | disembunyikan |
| Semua · kontak | kanan atas di luar panel, 11vw | 14vw | disembunyikan |
| Karya · header | kolom kanan, 26vw | 34vw kanan | 46vw di atas judul |
| Karya · grid | pojok kanan atas, 8vw, opacity .9 | disembunyikan | disembunyikan |
| Proyek · hero | kolom kanan, 26vw | 34vw kanan | 46vw di atas judul |
| Proyek · body | pojok kanan atas, 8vw | disembunyikan | disembunyikan |
| Tentang · hero | kolom kanan, 28vw | 36vw kanan | 50vw di atas judul |
| Tentang · stack | tepi kiri (sebagian keluar layar), 12vw | disembunyikan | disembunyikan |
| Tentang · perjalanan | tepi kanan, 12vw | disembunyikan | disembunyikan |

Angka di atas adalah titik awal; sesuaikan setelah cek visual, tapi aturan legibility di bawah tidak boleh dilanggar.

## 6. Legibility (aturan keras)

1. **Chip tidak boleh berada di belakang teks paragraf, judul, atau tombol.** Anchor harus berada di area kosong layout.
2. Kalau secara layout tidak ada ruang (mobile, tablet tertentu), anchor disembunyikan → chip fade out.
3. Kartu dan panel yang mungkin dilewati chip punya latar solid (`--surface`, warna tone), bukan transparan.
4. Uji wajib: screenshot Playwright di 360, 768, 1280, 1440px × tema terang/gelap × tiap section; tidak boleh ada teks yang tumpang tindih dengan chip.

## 7. Mobile

- DPR maksimal 1 (desktop 1.5), environment resolusi rendah, tanpa `ContactShadows` bila FPS < 45.
- Chip hanya tampil di hero tiap halaman dan intro; section lain disembunyikan (render dijeda, `frameloop="demand"` atau `invalidate` manual).
- Tidak ada efek kursor; ganti dengan sedikit respons gyro? **Tidak** (butuh izin perangkat). Cukup idle rotation + scroll spin.
- Hero mobile: chip di atas, teks di bawah; tinggi hero `min-height: 100svh`, chip anchor maksimal 32svh.

## 8. Performa

- Target 60fps desktop, ≥ 45fps HP kelas menengah.
- Pin dengan `InstancedMesh`; tekstur ≤ 1024²; geometri dibuat sekali (`useMemo`).
- Canvas berhenti render saat tab tersembunyi atau chip opacity 0.
- Komponen 3D di-load dengan `dynamic(() => import(...), { ssr: false })`; intro menunggu Suspense.
- Fallback tanpa WebGL: gambar statis chip (`/public/chip-fallback.webp`, render dari scene itu sendiri) di posisi anchor hero.
