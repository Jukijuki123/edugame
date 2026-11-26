Konsep game edukasi Bahasa Inggris untuk anak SD menggunakan arsitektur **frontend-only (tanpa backend)** sangat cocok untuk dideploy secara statis di Vercel atau Cloudflare Pages. Karena kamu sudah terbiasa dengan ekosistem React/Next.js dan Tailwind CSS, stack tersebut bisa langsung dipakai untuk mengejar performa ringan dan animasi mulus.

Berikut adalah pengembangan ide gameplay beserta dokumen **Product Requirements Document (PRD)** yang siap kamu jadikan acuan koding.

---

## Pengembangan Ide Konsep Game

Agar anak SD tidak cepat bosan dan langsung paham tanpa banyak membaca teks instruksi, kemas game dalam tema petualangan ringan bernama **"WordQuest Junior"**. Semua data soal, progres level, dan skor tersimpan secara lokal di browser menggunakan `localStorage`.

1. **Mode 1: Drag & Drop (My Room / My Backpack)**
* **Mekanik:** Muncul ilustrasi ruang kelas atau isi tas sekolah yang kosong. Di bagian bawah ada kartu kosakata bergambar (misalnya: *Pencil, Eraser, Ruler, Book*). Anak menarik barang ke siluet yang tepat.
* **Feedback:** Saat kartu dilepas di posisi benar, muncul efek partikel bintang, suara *ding*, dan audio pengucapan kata dalam Bahasa Inggris (*Text-to-Speech* bawaan browser). Jika salah, kartu memantul kembali ke posisi awal (*spring bounce*).


2. **Mode 2: Speed Matching (Animal & Color Match)**
* **Mekanik:** Layar terbagi dua sisi atau berbentuk grid kartu tertutup (Memory Match). Anak mencocokkan gambar hewan/warna dengan teks Bahasa Inggrisnya (misalnya gambar Gajah dengan kata *Elephant*).
* **Feedback:** Kartu berbalik dengan animasi 3D *flip*. Jika cocok, kedua kartu menghilang dengan efek *pop* dan menambah *combo meter*.


3. **Mode 3: Bubble Pop (Listen & Tap)**
* **Mekanik:** Balon atau gelembung warna-warni melayang pelan dari bawah ke atas berisi huruf atau kata sederhana (misalnya angka *One* sampai *Ten*, atau buah-buahan). Sistem membacakan satu kata lewat suara, lalu anak harus memecahkan gelembung yang sesuai sebelum mencapai batas atas.



---

## Product Requirements Document (PRD)

### 1. Informasi Umum Produk

* **Nama Produk:** WordQuest Junior
* **Target Pengguna:** Siswa Sekolah Dasar (Usia 6–10 tahun / Kelas 1–4 SD)
* **Platform:** Web Browser (Desktop & Tablet/Mobile responsif)
* **Arsitektur:** Client-Side Only (Static Web App, tanpa database atau server backend)

### 2. Tech Stack & Arsitektur Teknis

* **Framework Utama:** React (Vite) atau Next.js (Static Export) dengan TypeScript. Vite sangat disarankan agar ringan dan cepat di-build.
* **Styling:** Tailwind CSS untuk tata letak responsif dengan tombol berukuran besar (ramah sentuhan jari anak).
* **Animasi & Interaksi:**
* **Framer Motion:** Untuk transisi halaman, efek memantul (*spring physics*), kartu berbalik (3D flip), dan pop-up kemenangan.
* **dnd-kit (`@dnd-kit/core`):** Library modern untuk mekanik *drag-and-drop* yang ringan dan mendukung layar sentuh (*touchscreen*) maupun mouse dengan mulus.
* **Canvas Confetti:** Untuk efek perayaan saat level selesai.


* **Audio & Suara:**
* **Web Speech API (`window.speechSynthesis`):** Mengubah teks soal menjadi suara pelafalan Bahasa Inggris secara gratis tanpa perlu file MP3 tambahan.
* **Howler.js:** Untuk efek suara (*SFX*) klik, jawaban benar, dan jawaban salah.


* **Penyimpanan Data:** Browser `localStorage` untuk menyimpan jumlah bintang yang dikumpulkan dan membuka kunci (*unlock*) level berikutnya.

### 3. Ruang Lingkup Fitur (MVP)

| Fitur | Deskripsi Fungsional | Prioritas |
| --- | --- | --- |
| **Layar Utama (Home)** | Judul game, tombol "Play" besar, pengaturan mute/unmute audio, dan tampilan total bintang terkumpul. | P0 (Wajib) |
| **Peta Level (Stage Map)** | Pilihan 3 topik dasar: *Colors & Numbers*, *Animals*, dan *School Objects*. Level terkunci terbuka bertahap. | P0 (Wajib) |
| **Engine Drag & Drop** | Sistem seret gambar ke kotak jawaban dengan deteksi area otomatis dan animasi *snap* atau *bounce back*. | P0 (Wajib) |
| **Engine Matching** | Sistem mencocokkan pasangan kartu (gambar ke teks) dengan animasi rotasi kartu. | P0 (Wajib) |
| **Audio Pronunciation** | Tombol ikon speaker di setiap soal yang membacakan kata Bahasa Inggris saat ditekan atau saat jawaban benar. | P0 (Wajib) |
| **Hasil & Reward** | Layar ringkasan akhir level menampilkan perolehan 1–3 bintang berdasarkan jumlah kesalahan, disertai tombol *Next Level*. | P1 (Penting) |

### 4. Struktur Data Soal (JSON Statis)

Karena tanpa backend, seluruh bank soal disimpan dalam file `src/data/levels.ts`. Berikut contoh skema datanya:

```json
{
  "id": "level-1",
  "title": "School Objects",
  "mode": "drag-and-drop",
  "items": [
    {
      "id": "item-1",
      "word": "Pencil",
      "translation": "Pensil",
      "image": "/assets/items/pencil.svg",
      "targetZone": "zone-pencil"
    },
    {
      "id": "item-2",
      "word": "Book",
      "translation": "Buku",
      "image": "/assets/items/book.svg",
      "targetZone": "zone-book"
    }
  ]
}

```

### 5. Pedoman Desain UI/UX & Animasi

* **Palet Warna Cerah & Kontras Tinggi:** Gunakan warna primer hangat seperti kuning cerah (`#FACC15`), biru langit (`#38BDF8`), dan hijau rumput (`#4ADE80`) dengan latar belakang lembut (`#FEFCE8`) agar mata anak tidak cepat lelah.
* **Tipografi Ramah Anak:** Gunakan font membulat (*rounded sans-serif*) seperti **Fredoka**, **Nunito**, atau **Quicksand** dari Google Fonts dengan ukuran minimal `18px` untuk teks biasa dan `28px+` untuk kata kunci.
* **Prinsip Micro-Interactions:**
* Setiap tombol harus membesar sedikit saat disentuh (`whileHover={{ scale: 1.05 }}`) dan mengecil saat ditekan (`whileTap={{ scale: 0.95 }}`).
* Tidak boleh ada teks *Game Over* yang menghukum. Jika nyawa habis atau salah berkali-kali, tampilkan pesan penyemangat seperti *"Ayo coba lagi!"* dengan tombol ulangi yang jelas.



### 6. Kriteria Keberhasilan (Success Metrics)

* **Performa:** Waktu muat awal (*First Contentful Paint*) di bawah 1,5 detik dan animasi berjalan stabil di 60 FPS pada perangkat spesifikasi menengah ke bawah.
* **Usability:** Anak SD dapat memahami cara bermain pada 10 detik pertama tanpa bantuan penjelasan orang dewasa.