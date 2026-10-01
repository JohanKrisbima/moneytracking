# 💰 MoneyTrack - Personal Finance Management

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Inertia.js-v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
</p>

**MoneyTrack** adalah aplikasi pencatatan keuangan pribadi modern berbasis web yang dibangun dengan pendekatan **Single Page Application (SPA)** menggunakan **Laravel 12**, **Inertia.js**, **React 19**, dan **TypeScript**. Aplikasi ini mengusung antarmuka premium bertema *modern glassmorphism* dengan responsivitas tinggi di berbagai perangkat (Desktop & Mobile).

---

## 🌟 Fitur Utama (Current Features)

### 1. 🔐 Autentikasi & Keamanan
- Sistem login aman dengan proteksi session dan middleware `auth` & `guest`.
- Multi-user isolation: seluruh data dompet, kategori, dan transaksi terikat kuat pada `user_id` yang sedang login.

### 2. 💳 Manajemen Dompet (Wallets - `/wallets`)
- **CRUD Lengkap**: Tambah, edit, dan hapus dompet sumber dana.
- **Multi-Tipe Dompet**: Mendukung tipe `Bank`, `E-Wallet`, `Cash (Uang Fisik)`, dan `Tabungan`.
- **DataTable Canggih**:
  - Pencarian realtime berbasis *debounce* pada nama dan tipe.
  - Sorting multi-arah (*Ascending*, *Descending*, *Reset*).
  - Filter cepat berbasis tab kategori dompet.
  - Paginasi data dinamis.
  - Responsif mobile: tabel dapat di-*scroll* horizontal dengan nyaman di layar HP.
- **Proteksi Relasi**: Dompet yang sudah memiliki riwayat transaksi/transfer dicegah dari penghapusan demi integritas data keuangan.

### 3. 🏷️ Manajemen Kategori (Categories - `/categories`)
- **CRUD Lengkap**: Tambah, edit, dan hapus pos pemasukan dan pengeluaran.
- **Tipe Kategori**: 
  - `expense` (Pengeluaran) dengan tema visual mawar/rose lembut.
  - `income` (Pemasukan) dengan tema visual emerald/hijau segar.
- **Validasi Cerdas**: Mencegah duplikasi nama kategori untuk tipe yang sama pada user yang sama.
- **Penguncian Tipe saat Edit**: Mencegah perubahan tipe kategori secara tidak sengaja untuk menjaga konsistensi transaksi historis.
- **Proteksi Transaksi**: Kategori yang sedang digunakan pada tabel transaksi dilindungi dari penghapusan.

### 4. 🎨 Komponen UI Reusable & Glassmorphic Design
- **Komponen Tabel Terstruktur**: `DataTable`, `DataTablePagination`, dan `DataTableFilterTabs`.
- **Komponen Form & Modal**: `Modal`, `Input`, `Select` (dengan fitur pencarian Select2 popover), dan `Button`.
- **SweetAlert2 Feedback**: Notifikasi toast dan modal dialog konfirmasi hapus data yang interaktif.
- **Layout Responsif**: Sidebar melayang bergaya kaca (*frosted glass*), Navbar modern, dan Card berbayang halus.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Backend Framework** | [Laravel 12](https://laravel.com/) (PHP 8.3+) |
| **Frontend Adapter** | [Inertia.js v2](https://inertiajs.com/) |
| **Frontend Library** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Table Engine** | [TanStack Table v8](https://tanstack.com/table) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Alerts & Dialogs** | [SweetAlert2](https://sweetalert2.github.io/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |

---

## 📁 Struktur Direktori Penting

```text
moneytrack-api/
├── app/
│   ├── Http/Controllers/
│   │   ├── CategoryController.php   # Logika CRUD Kategori (Index, Store, Update, Destroy)
│   │   ├── WalletController.php     # Logika CRUD Wallet
│   │   └── Auth/LoginController.php # Autentikasi Pengguna
│   └── Models/
│       ├── Category.php             # Relasi User & Transaksi
│       ├── Wallet.php               # Relasi User, Transaksi, & Transfer
│       ├── Transaction.php          # Transaksi Keuangan
│       └── User.php                 # Relasi Sentral Pengguna
├── resources/
│   └── js/
│       ├── Components/
│       │   ├── Category/            # CategoryColumns.tsx, CategoryFormModal.tsx
│       │   ├── Wallet/              # WalletColumns.tsx, WalletFormModal.tsx
│       │   ├── UI/                  # DataTable, Button, Input, Modal, Select, Card
│       │   └── Layouts/             # AppLayout, Sidebar, Navbar
│       ├── Hooks/
│       │   └── useSweetAlert.ts     # Hook reusable SweetAlert2
│       ├── Pages/
│       │   ├── Categories/Index.tsx # Halaman Utama Kategori
│       │   ├── Wallets/Index.tsx    # Halaman Utama Dompet
│       │   └── Dashboard/Index.tsx  # Halaman Dashboard
│       └── Types/
│           ├── category.ts          # Definisi Tipe TypeScript Kategori
│           └── wallet.ts            # Definisi Tipe TypeScript Wallet
└── routes/
    └── web.php                      # Definisi Web & Resource Routing
```

---

## 🚀 Panduan Instalasi & Menjalankan Project

### 1. Prasyarat Sistem
- PHP >= 8.3
- Composer >= 2.x
- Node.js >= 20.x & npm
- PostgreSQL atau MySQL

### 2. Kloning & Instalasi Dependensi
```bash
# Clone repositori
git clone https://github.com/JohanKrisbima/moneytracking.git
cd moneytrack-api

# Install dependensi PHP (Composer)
composer install

# Install dependensi JavaScript (npm)
npm install
```

### 3. Konfigurasi Environment
```bash
# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

Sesuaikan konfigurasi database pada berkas `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneytrack
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 4. Migrasi Database
```bash
php artisan migrate
```

### 5. Menjalankan Server Development
Buka 2 terminal terpisah atau jalankan script development:

**Terminal 1 (Backend Laravel):**
```bash
php artisan serve
```

**Terminal 2 (Frontend Vite):**
```bash
npm run dev
```

Aplikasi siap diakses di peramban: `http://localhost:8000`

---

## 🗺️ Roadmap Pengembangan Selanjutnya

- [x] Otentikasi Pengguna & Dashboard Layout
- [x] Modul Wallet (Dompet / Sumber Rekening)
- [x] Modul Kategori (Pos Pengeluaran & Sumber Pemasukan)
- [ ] Modul Pencatatan Transaksi (`/transactions`)
- [ ] Modul Anggaran / Uang Bulanan (`/monthly-incomes`)
- [ ] Modul Transfer Antar-Dompet (`/transfers`)
- [ ] Grafik Analisis & Laporan Ringkasan Pengeluaran (`/summary`)
- [ ] Fitur Ekspor Laporan (Excel / PDF)

---

## 📄 Lisensi
Project ini dikembangkan secara open-source di bawah lisensi [MIT License](LICENSE).
