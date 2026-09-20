```yaml
version: alpha
name: MoneyFlow Satria
description: >
  Dashboard money tracking pribadi bergaya glassmorphism dengan nuansa hangat,
  tenang, dan profesional — terinspirasi dari estetika editorial Anthropic
  (warm neutral, banyak ruang kosong, aksen warna dipakai hemat). Mendukung
  theme light dan dark. Alur data: User → Dashboard → sumber data (Uang
  Bulanan / Tabungan / Pengeluaran) → Perhitungan Bulanan → Sisa Uang.

themes:
  light:
    colors:
      background: "#F5F1EA"        # warm off-white, bukan putih murni
      surface: "#FFFFFF"
      glass-surface: "rgba(255, 255, 255, 0.55)"
      glass-border: "rgba(255, 255, 255, 0.35)"
      primary: "#C2632A"           # terracotta / clay — HANYA untuk brand & CTA
      primary-hover: "#A34F1E"
      secondary: "#2B2724"         # near-black hangat
      muted: "#6B6560"
      on-primary: "#FFFFFF"
      on-surface: "#2B2724"
      shadow: "rgba(43, 39, 36, 0.12)"
      # -- warna semantik data finansial (bukan brand color) --
      income: "#4B7B5D"            # sage green — uang masuk
      income-soft: "rgba(75, 123, 93, 0.12)"
      expense: "#B54A3F"           # rust red — uang keluar
      expense-soft: "rgba(181, 74, 63, 0.12)"
      saving: "#3B6E71"            # teal muted — tabungan (netral, bukan +/-)
      saving-soft: "rgba(59, 110, 113, 0.12)"

  dark:
    colors:
      background: "#171412"        # near-black hangat
      surface: "#211D1A"
      glass-surface: "rgba(33, 29, 26, 0.55)"
      glass-border: "rgba(255, 255, 255, 0.08)"
      primary: "#E08544"           # terracotta lebih terang buat kontras gelap
      primary-hover: "#F2A066"
      secondary: "#F5F1EA"
      muted: "#A39C94"
      on-primary: "#171412"
      on-surface: "#F5F1EA"
      shadow: "rgba(0, 0, 0, 0.45)"
      income: "#7FB690"
      income-soft: "rgba(127, 182, 144, 0.14)"
      expense: "#D97364"
      expense-soft: "rgba(217, 115, 100, 0.14)"
      saving: "#6FA8AB"
      saving-soft: "rgba(111, 168, 171, 0.14)"

typography:
  h1:
    fontFamily: "Fraunces"
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.15
  h2:
    fontFamily: "Fraunces"
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Inter"
    fontSize: 1rem
    lineHeight: 1.6
  caption:
    fontFamily: "Inter"
    fontSize: 0.875rem
    lineHeight: 1.5
    color: "{colors.muted}"
  stat-number:
    fontFamily: "Inter"
    fontSize: 1.75rem
    fontWeight: 600
    fontVariantNumeric: tabular-nums   # wajib, biar angka rupiah rata & tidak "loncat"
    lineHeight: 1.2

rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 999px

spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px

glass:
  blur: 16px
  saturation: 140%
  borderWidth: 1px

elevation:
  card: "0 8px 32px {colors.shadow}"
  modal: "0 16px 48px {colors.shadow}"

components:
  dashboard-nav:
    backgroundColor: "{colors.glass-surface}"
    backdropFilter: "blur({glass.blur}) saturate({glass.saturation})"
    border-bottom: "{glass.borderWidth} solid {colors.glass-border}"
    padding: "{spacing.sm} {spacing.md}"

  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    fontWeight: 600

  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"

  source-card:
    # kartu untuk 3 sumber data: monthly_incomes / savings / transactions
    backgroundColor: "{colors.glass-surface}"
    border: "{glass.borderWidth} solid {colors.glass-border}"
    backdropFilter: "blur({glass.blur}) saturate({glass.saturation})"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    boxShadow: "{elevation.card}"

  stat-card:
    # kartu untuk Total Income / Total Saving / Total Expense
    backgroundColor: "{colors.glass-surface}"
    border: "{glass.borderWidth} solid {colors.glass-border}"
    backdropFilter: "blur({glass.blur}) saturate({glass.saturation})"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    accentBar: "4px solid {accent}"   # {accent} diisi: income | expense | saving

  summary-card:
    # kartu "Sisa Uang" — hasil akhir, paling menonjol di halaman
    backgroundColor: "{colors.surface}"
    border: "{glass.borderWidth} solid {colors.glass-border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    boxShadow: "{elevation.modal}"
    textColor: "{colors.primary}"     # satu-satunya angka yang boleh pakai primary
```

---

## Overview

Dashboard money tracking pribadi. Alur informasinya mengikuti hierarki:
**Dashboard → 3 sumber data → Perhitungan Bulanan → Sisa Uang**. Aksen warna
brand (terracotta) dipakai hemat hanya untuk navigasi, tombol, dan kartu
hasil akhir — bukan untuk mewakili data. Data finansial (income/expense/
saving) punya warna semantik sendiri supaya user bisa membaca kondisi
keuangan sekilas tanpa baca angka dulu.

## Colors

- **primary** — brand, tombol, link, kartu ringkasan akhir. *Jangan* dipakai
  untuk merepresentasikan angka transaksi.
- **income / income-soft** — sage green. Dipakai di `source-card`
  `monthly_incomes` dan `stat-card` Total Income (accent bar + angka).
- **expense / expense-soft** — rust red. Dipakai di `source-card`
  `transactions` dan `stat-card` Total Expense.
- **saving / saving-soft** — teal muted. Dipakai di `source-card` `savings`
  dan `stat-card` Total Saving. Sengaja bukan hijau/merah karena tabungan
  bukan "baik/buruk", tapi status netral.
- **-soft** variants dipakai sebagai background lembut di belakang ikon atau
  badge kecil, bukan untuk teks.

## Typography

- **Fraunces** untuk judul section (`h1`, `h2`) — "Dashboard", "Perhitungan
  Bulanan".
- **Inter** untuk body dan label.
- **stat-number** — token baru khusus angka besar (Total Income, Sisa Uang,
  dll). Wajib `font-variant-numeric: tabular-nums` supaya digit-digit rupiah
  berbaris rapi saat berubah, dan tidak "melompat" antar frame.

## Layout — mengikuti alur diagram

```
                    [ USER ]
                       |
                  [ DASHBOARD ]  (dashboard-nav, sticky, glass)
                       |
     ┌─────────────────┼─────────────────┐
[UANG BULANAN]    [TABUNGAN]        [PENGELUARAN]
 source-card       source-card       source-card
 accent: income    accent: saving    accent: expense
     |                  |                  |
     └─────────────────┼─────────────────┘
                       |
             [ PERHITUNGAN BULANAN ]   (h2, tanpa card — cuma header section)
                       |
     ┌─────────────────┼─────────────────┐
[Total Income]   [Total Saving]    [Total Expense]
  stat-card         stat-card         stat-card
     |                  |                  |
     └─────────────────┼─────────────────┘
                       |
                [ SISA UANG ]
               summary-card (paling menonjol, full-width,
               textColor primary, shadow elevation.modal)
```

- Section `Dashboard` di atas: grid 3 kolom untuk `source-card`, gap
  `{spacing.md}`.
- Section `Perhitungan Bulanan`: grid 3 kolom `stat-card`, ukuran lebih kecil
  dari `source-card` (ini turunan/hasil, bukan sumber data mentah).
- `summary-card` (Sisa Uang) selalu full-width dan sendirian di baris
  terakhir — satu-satunya elemen yang boleh pakai warna `primary` untuk
  angka, supaya mata user otomatis berhenti di situ sebagai kesimpulan akhir.
- Di mobile: semua grid 3 kolom turun jadi 1 kolom, urutan tetap sama
  (sumber data → total → sisa uang) supaya alur baca tidak berubah.

## Elevation & Depth (Glassmorphism)

- `source-card` dan `dashboard-nav` pakai kaca (`blur` + `glass-surface` +
  `glass-border`) — ini representasi "data mentah yang mengalir".
- `stat-card` pakai kaca juga tapi lebih flat (`elevation.card`, bukan
  `modal`) — turunan dari source-card, jadi visualnya harus terasa satu
  tingkat "lebih ringan".
- `summary-card` **sengaja tidak transparan** (`colors.surface` solid, bukan
  `glass-surface`) — ini satu-satunya kartu solid di halaman. Kontras ini
  yang bikin "Sisa Uang" terasa sebagai jawaban final, bukan sekadar kartu
  lain di antara kartu-kartu kaca.

## Shapes

- `source-card` & `summary-card`: sudut `{rounded.lg}` (24px) — elemen
  utama.
- `stat-card`: sudut `{rounded.md}` (16px) — turunan, sedikit lebih tegas.
- Tombol: `{rounded.full}` (pill).
- Accent bar di `stat-card` (4px solid, warna semantik) selalu di sisi kiri
  kartu — bukan dekorasi, tapi penanda kategori data.

## Components

- **dashboard-nav** — navbar sticky glass, logo + tanggal/periode aktif.
- **source-card** — 3 kartu di bagian atas: Uang Bulanan (`monthly_incomes`),
  Tabungan (`savings`), Pengeluaran (`transactions`). Tiap kartu menampilkan
  daftar entri singkat, bukan hanya total.
- **stat-card** — 3 kartu hasil kalkulasi: Total Income, Total Saving, Total
  Expense. Angka besar (`stat-number`) + accent bar sesuai kategori.
- **summary-card** — satu kartu solid di bawah: Sisa Uang. Ini kartu paling
  penting di halaman, hierarki visual tertinggi setelah dashboard-nav.
- **button-primary / button-primary-hover** — aksi utama (mis. "Tambah
  Transaksi"), satu per halaman.

## Number & Currency Rules

- Format Rupiah selalu `Rp` + pemisah ribuan titik, tanpa desimal (mis.
  `Rp 2.450.000`), kecuali konteks butuh sen.
- Semua angka finansial pakai token `stat-number` (`tabular-nums`) —
  termasuk di dalam `source-card`, tidak hanya `stat-card`.
- Expense boleh ditampilkan dengan prefix `-` memakai warna `expense`;
  income dengan `+` memakai warna `income`. Saving tidak pakai prefix +/-
  karena bukan pergerakan masuk/keluar dalam konteks bulan berjalan.

## Do's and Don'ts

- Do: pakai token reference (`{colors.primary}`, `{colors.income}`, dst)
  biar satu sumber kebenaran di kedua theme.
- Do: pisahkan warna brand (`primary`) dari warna data (`income` / `expense`
  / `saving`) — jangan pernah pakai `primary` untuk merepresentasikan angka
  transaksi biasa.
- Do: pakai `tabular-nums` di semua angka finansial.
- Don't: tambah warna semantik baru di luar `income`/`expense`/`saving`
  tanpa alasan kategori data baru yang jelas.
- Don't: buat `summary-card` transparan/glass — harus solid supaya kontras
  dengan kartu-kartu di atasnya.
- Don't: campur urutan alur (source → total → sisa uang) di layout apa pun,
  termasuk versi mobile.
