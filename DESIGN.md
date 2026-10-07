# 🏛️ MoneyTrack — Design System & UI Guidelines
**Versi:** 2.0  
**Filosofi Desain:** *Warm Editorial Glassmorphism (Organic Modernism)*  
**Prinsip Utama:** Tenang, Hangat, Humanis, dan **Anti-AI-Slop**.

---

## 1. Filosofi & Visi Estetika

MoneyTrack mengusung estetika **buku jurnal keuangan editorial modern** (terinspirasi dari tipografi elegan serif editorial ala koran finansial berkelas dipadukan dengan material kaca hangat). Desain ini dirancang untuk memberikan ketenangan pikiran saat mengelola uang pribadi.

### 🚫 Kebijakan Tegas: ANTI-AI-SLOP (Larangan Desain Generik AI)
Untuk menjaga UI tetap berkelas, natural, dan tidak terlihat seperti template buatan AI generik:

| ❌ DILARANG KERAS (AI Slop Clichés) | ✅ DIHARUSKAN (MoneyTrack Standard) |
| :--- | :--- |
| **Gradien Ungu / Indigo / Neon** (`from-purple-500 to-indigo-600`) | Warna solid hangat dan organik: **Terracotta, Sage Green, Charcoal, Warm Cream** |
| **Glow / Border Cyberpunk Menyala** (`shadow-cyan-500/50`) | Bayangan difus lembut bertona hangat (`rgba(43, 39, 36, 0.08)`) |
| **Kaca Berlebihan (Unreadable Glass)** | Kaca fungsional dengan kontras tinggi (`backdrop-blur-[16px]` + latar semi-opak) |
| **Teks / Slogan Robotik SaaS** (*"Supercharge your wealth with AI"*) | Bahasa manusiawi, singkat, ramah, dan membumi (*"Pantau arus kas harianmu."*) |
| **Ikon Sparkle / Bintang / Robot Tanpa Fungsi** | Ikon grafis Lucide minimalis yang murni fungsional (`Wallet`, `ArrowRight`, `CreditCard`) |
| **Warna Warni Pelangi Acak** | Aksen warna dipakai **sangat hemat** hanya untuk semantik data keuangan |

---

## 2. Design Tokens (Palet Warna)

Semua token warna terdaftar di CSS variables [`resources/css/app.css`](file:///d:/Belajar/MoneyTrack/moneytrack-api/resources/css/app.css).

### A. Light Theme (Default)
```css
/* Latar Belakang & Permukaan */
--background:     #F5F1EA;       /* Warm cream / alabaster (bukan putih kertas silau) */
--surface:        #FFFFFF;       /* Putih solid untuk kartu fokus/modal */
--glass-surface:  rgba(255, 255, 255, 0.55); /* Kaca semi-transparan */
--glass-border:   rgba(255, 255, 255, 0.35); /* Garis batas kaca lembut */

/* Warna Brand & Aksi */
--primary:        #C2632A;       /* Terracotta / Rust Clay (Hanya untuk tombol utama & brand) */
--primary-hover:  #A34F1E;
--secondary:      #2B2724;       /* Deep warm charcoal / espresso (teks utama) */
--muted:          #6B6560;       /* Warm taupe / abu-abu hangat (label & teks pendukung) */

/* Semantik Data Finansial (Hanya untuk mewakili arus uang) */
--income:         #4B7B5D;       /* Sage Green (uang masuk / surplus) */
--income-soft:    rgba(75, 123, 93, 0.12);
--expense:        #B54A3F;       /* Brick / Rust Red (uang keluar / defisit) */
--expense-soft:   rgba(181, 74, 63, 0.12);
--saving:         #3B6E71;       /* Deep Muted Teal (tabungan / mutasi transfer) */
--saving-soft:    rgba(59, 110, 113, 0.12);
```

### B. Dark Theme
```css
--background:     #171412;       /* Deep warm black */
--surface:        #211D1A;       /* Dark charcoal surface */
--glass-surface:  rgba(33, 29, 26, 0.55);
--glass-border:   rgba(255, 255, 255, 0.08);

--primary:        #E08544;       /* Terracotta terang untuk kontras gelap */
--primary-hover:  #F2A066;
--secondary:      #F5F1EA;
--muted:          #A39C94;

--income:         #7FB690;
--expense:        #D97364;
--saving:         #6FA8AB;
```

---

## 3. Tipografi

MoneyTrack memadukan **dua font berkarakter kuat**:

| Peran | Font Family | Bobot (Weight) | Contoh Penggunaan | Aturan Khusus |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Heading** | `Fraunces` | 600 (SemiBold) | Judul Halaman (`h1`), Judul Modal | Selalu anggun, berjarak renggang, editorial |
| **Body & UI** | `Inter` | 400, 500 | Label Form, Isi Tabel, Deskripsi | Bersih, sangat mudah dibaca pada ukuran kecil |
| **Angka Finansial** | `Inter` | 600, 700 | Nominal Saldo, Ringkasan Statistik | **WAJIB** memakai `tabular-nums` agar angka rata |

> [!IMPORTANT]
> **Aturan Tabular Nums:**  
> Semua angka mata uang di tabel dan kartu statistik wajib memiliki kelas CSS `tabular-nums` (atau `font-variant-numeric: tabular-nums`). Ini mencegah angka rupiah bergoyang (*jumping*) saat nilai diperbarui.

---

## 4. Radius, Kedalaman & Material Kaca

### Border Radius Hierarchy
* **Layar Penuh / Sidebar / Modal Besar:** `rounded-[24px]` (24px)
* **Kartu Data / Tabel Container:** `rounded-2xl` (16px)
* **Form Input, Tombol & Select:** `rounded-xl` (12px)
* **Badge / Tag / Pill:** `rounded-full` (999px)

### Efek Glassmorphism yang Benar
Gunakan utilitas Tailwind berikut untuk membuat material kaca MoneyTrack:
```html
className="rounded-2xl border border-white/35 bg-white/55 backdrop-blur-[16px] backdrop-saturate-[140%] shadow-[0_8px_32px_rgba(43,39,36,0.06)]"
```
* **Kuncinya:** Gunakan saturasi 140% dan blur 16px agar warna hangat latar belakang tetap berpendar lembut tanpa mengaburkan teks di atasnya.

---

## 5. Komponen UI Standar

### A. Tombol (`Button`)
* **Primary (Aksi Utama):** Background `#C2632A`, teks putih. Dipakai untuk simpan form atau buka modal ("Catat Transfer", "Tambah Transaksi").
* **Secondary (Batal / Netral):** Border `border-black/10`, background `bg-white/60`, teks `#2B2724`.
* **Danger (Hapus):** Border merah lembut `border-red-200/70`, background `bg-red-50/60`, teks `text-red-600`.

### B. Form Inputs (`Input` & `Select`)
* Background semi-transparan `bg-white/60`, border lembut `border-black/10`.
* Saat fokus: Border berubah ke aksen brand `focus:border-[#C2632A]` dengan ring lembut `focus:ring-[#C2632A]/20`.
* Label selalu kapital kecil berjarak renggang: `text-xs font-semibold uppercase tracking-wider text-[#6B6560]`.

### C. Kartu Statistik (`StatCard`)
* Memiliki aksen bar kecil di kiri atau badge warna semantik (`income`, `expense`, `saving`).
* Label kecil di atas (`text-xs text-[#6B6560]`), nominal besar di bawah (`text-2xl font-bold font-[Inter] tabular-nums`).

---

## 6. Format Angka & Tanggal Standar

* **Mata Uang:** Selalu gunakan helper `formatRupiah(amount)` dari [`resources/js/Utils/currency.ts`](file:///d:/Belajar/MoneyTrack/moneytrack-api/resources/js/Utils/currency.ts).
  * Format: `Rp 150.000` (tanpa desimal nol sen, titik pemisah ribuan).
  * Tipe Pemasukan: Ditampilkan dengan warna `--income` (`+Rp 150.000`).
  * Tipe Pengeluaran: Ditampilkan dengan warna `--expense` (`-Rp 50.000`).
* **Tanggal:** Selalu gunakan helper `formatDate(dateString)` dari [`resources/js/Utils/date.ts`](file:///d:/Belajar/MoneyTrack/moneytrack-api/resources/js/Utils/date.ts).
  * Format: `07 Okt 2026`.

---

## 7. Checklist Implementasi Fitur Baru
Setiap kali membuat halaman atau komponen baru (seperti Dashboard):
1. [ ] Apakah judul halaman menggunakan font **Fraunces**?
2. [ ] Apakah semua nominal uang memakai `tabular-nums` dan `formatRupiah`?
3. [ ] Apakah warna primer terracotta (`#C2632A`) hanya dipakai untuk navigasi/CTA, **bukan** untuk angka pemasukan/pengeluaran?
4. [ ] Apakah tidak ada gradien ungu / elemen AI generik yang masuk?
5. [ ] Apakah komponen kartu memakai kelas `Card` standar yang sudah ber-glassmorphism?
