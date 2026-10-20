<div align="center">

# FITALENTA

**Company profile, CMS, dan sistem pendaftaran program pelatihan & penempatan kerja ke Jepang.**

![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A5%2020.19-339933?logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL%20%2F%20MariaDB-4479A1?logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Struktur Repositori](#struktur-repositori)
- [Prasyarat](#prasyarat)
- [Memulai (Development)](#memulai-development)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Database](#database)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Peran Pengguna & Hak Akses](#peran-pengguna--hak-akses)
- [Ringkasan API](#ringkasan-api)
- [Alur Bisnis](#alur-bisnis)
- [Skrip yang Tersedia](#skrip-yang-tersedia)
- [Pengujian API Manual](#pengujian-api-manual)
- [Deployment ke Production](#deployment-ke-production)
- [Keamanan](#keamanan)
- [Troubleshooting](#troubleshooting)
- [Konvensi Pengembangan](#konvensi-pengembangan)
- [Lisensi](#lisensi)

---

## Tentang Proyek

FITALENTA adalah aplikasi web untuk **PT FAST Indo Talenta** (Bandung) yang menggabungkan tiga hal dalam satu repositori:

1. **Website company profile** (publik): profil perusahaan, program, layanan, event, artikel, galeri, testimoni, dan formulir kontak.
2. **Portal peserta**: pendaftar membuat akun, mendaftar program, mengunggah dokumen, memantau status seleksi/penempatan, membayar (termasuk cicilan), dan menerima notifikasi.
3. **Panel pengelola**: **admin** mengelola program, seleksi & penempatan, pembayaran, laporan keuangan, dan pengguna; **editor** mengelola konten website lewat CMS.

Repositori ini adalah monorepo sederhana dengan dua aplikasi yang berdiri sendiri: `client` (Next.js) dan `server` (Express REST API).

## Fitur

### Website publik
- Beranda, About, daftar & detail **program**, **layanan**, **event**, **artikel**, dan **galeri**.
- Section pakar (*experts*) di beranda dan anggota tim di halaman About, keduanya dikelola dari CMS.
- Formulir kontak dengan pembatasan laju (*rate limit*) dan CAPTCHA.
- Pencatatan jumlah dilihat (*view*) untuk event, artikel, dan layanan.

### Autentikasi
- Registrasi dengan **verifikasi email**, login, logout, lupa & reset password, dan ganti password.
- Sesi memakai **JWT di cookie `httpOnly`** (bukan `localStorage`).
- **Cloudflare Turnstile** pada registrasi, login, kirim ulang verifikasi, dan lupa password.
- Rate limiting berlapis (per IP dan per akun/email) pada endpoint sensitif.
- Pengalihan otomatis berdasarkan peran lewat `proxy.ts` Next.js.

### Portal peserta (`user`)
- Dashboard ringkasan status pendaftaran, pembayaran, dan notifikasi.
- Pendaftaran program dengan unggah dokumen (pas foto, sertifikat N4 dan SSW opsional), validasi NIK dan nomor telepon.
- Pembayaran: ringkasan tagihan, detail, unggah bukti bayar, dan unduh **invoice PDF**.
- Notifikasi dalam aplikasi dan pengelolaan profil.

### Panel admin (`admin`)
- Dashboard dengan ringkasan, filter, dan daftar pendaftaran beserta detailnya.
- Manajemen **program** dan kategori program (kuota, biaya pelatihan/keberangkatan, rencana cicilan, status).
- **Seleksi & penempatan**: ubah status seleksi dan tahap penempatan peserta; peserta otomatis dinotifikasi.
- **Pembayaran**: buat tagihan (cicilan 2–6 kali), terbitkan invoice, verifikasi bukti bayar, unduh invoice PDF.
- **Laporan keuangan**: ringkasan, ekspor dan impor **Excel (.xlsx)** (maks. 5 MB / 500 baris), serta template impor.
- Manajemen **pengguna** (CRUD akun admin, editor, dan peserta).

### CMS (`editor` dan `admin`)
- Artikel, event, galeri, layanan, testimoni, **pakar**, dan **anggota tim** (lengkap dengan unggah gambar, urutan tampil, dan status aktif).
- Endpoint tambahan di API untuk mitra, perusahaan, lowongan (*job*), dan pesan kontak.

## Tech Stack

| Lapisan | Teknologi |
| --- | --- |
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix UI), TanStack Query 5, Zustand, Zod 4, Axios, lucide-react |
| **Backend** | Node.js, Express 5, TypeScript, express-validator, JWT, bcryptjs, Multer, express-rate-limit, Morgan |
| **Database** | MySQL / MariaDB melalui Prisma 7 (`@prisma/adapter-mariadb`) |
| **Layanan eksternal** | Resend (email), Cloudflare Turnstile (CAPTCHA) |
| **Dokumen** | PDFKit (invoice PDF), ExcelJS (laporan keuangan) |
| **Tooling** | tsx (dev server), esbuild (bundle server), ESLint 9 |

## Arsitektur

```mermaid
flowchart LR
    Browser["Browser"] -->|HTML / RSC| Next["Next.js client<br/>:3000"]
    Browser -->|"XHR + cookie access_token"| API["Express API<br/>:5000 /api"]
    Next -->|"SSR fetch (data publik)"| API
    Next -->|"proxy.ts: GET /auth/me"| API
    API --> DB[("MySQL / MariaDB")]
    API --> Files["/uploads (disk)"]
    API --> Resend["Resend (email)"]
    API --> CF["Cloudflare Turnstile"]
```

Catatan penting:

- Halaman publik di-render di server dan mengambil data dari API dengan cache (`revalidate`).
- `src/proxy.ts` di client memeriksa sesi dengan memanggil `GET /api/auth/me` (meneruskan cookie) lalu mengalihkan pengguna sesuai perannya.
- File unggahan disimpan di disk server (`server/uploads/`) dan disajikan pada path `/uploads`.

## Struktur Repositori

```text
fitalenta/
├── client/                      # Aplikasi Next.js (frontend)
│   ├── src/
│   │   ├── app/                 # Route (App Router)
│   │   │   ├── (front)/         #   website publik
│   │   │   ├── (auth)/          #   login, register, verifikasi, reset password
│   │   │   ├── (user)/          #   portal peserta
│   │   │   ├── admin/           #   panel admin
│   │   │   └── editor/          #   CMS editor
│   │   ├── components/          # ui (shadcn), common, sections, admin, editor
│   │   ├── services/            # Pemanggil API (Axios / fetch)
│   │   ├── hooks/               # Hook TanStack Query & utilitas
│   │   ├── schemas/             # Validasi form (Zod)
│   │   ├── types/               # Tipe TypeScript
│   │   ├── constants/           # Konfigurasi & label
│   │   ├── helpers/             # Fungsi pembantu murni
│   │   ├── store/               # State global (Zustand)
│   │   ├── lib/                 # Axios, provider, util
│   │   └── proxy.ts             # Penjaga rute berbasis peran
│   └── .env.example
│
├── server/                      # REST API (Express)
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── routes/              # Definisi route (publik, user/, admin/)
│   │   ├── controllers/         # Handler HTTP
│   │   ├── services/            # Logika bisnis & akses data
│   │   ├── validators/          # Aturan express-validator
│   │   ├── middlewares/         # authenticate, authorize, upload, rate limit, turnstile, error handler
│   │   ├── config/              # Konfigurasi domain (pembayaran, registrasi, akses, dll.)
│   │   └── errors/ utils/       # Error terstruktur & util
│   ├── prisma/
│   │   ├── schema.prisma        # Skema database
│   │   ├── migrations/          # Riwayat migrasi
│   │   ├── data/                # Data JSON untuk seeding
│   │   └── seed-*.ts            # Skrip seeding
│   ├── assets/invoice/          # Logo & tanda tangan untuk invoice PDF
│   ├── http/                    # Koleksi request .http untuk uji API
│   ├── prisma7.config.ts        # Konfigurasi Prisma 7
│   └── .env.example
│
└── README.md
```

## Prasyarat

| Kebutuhan | Versi |
| --- | --- |
| Node.js | **20.19+**, 22.12+, atau 24+ (batas ditentukan Prisma 7; Next.js 16 membutuhkan minimal 20.9) |
| npm | Bawaan Node.js |
| MySQL atau MariaDB | Server aktif dan bisa diakses |
| Akun Resend | Untuk email verifikasi, reset password, dan kontak (API key) |
| Cloudflare Turnstile | Opsional saat development (tersedia *test key*), **wajib** di production |

## Memulai (Development)

### 1. Kloning repositori

```bash
git clone <url-repositori> fitalenta
cd fitalenta
```

### 2. Siapkan backend

```bash
cd server
npm install
cp .env.example .env        # lalu isi sesuai bagian "Konfigurasi Environment"
```

Buat database kosong terlebih dahulu (nama harus sama dengan `DATABASE_NAME`):

```sql
CREATE DATABASE fitalenta_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Lalu generate Prisma Client dan jalankan migrasi:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Isi data awal (lihat [Seeding](#seeding)), kemudian jalankan server:

```bash
npm run dev                 # http://localhost:5000
```

Pastikan berjalan: buka `http://localhost:5000/api/health`.

### 3. Siapkan frontend

Di terminal lain:

```bash
cd client
npm install
cp .env.example .env
npm run dev                 # http://localhost:3000
```

### 4. Masuk ke aplikasi

Setelah menjalankan `seed:admin`, akun berikut tersedia (verifikasi email sudah terisi):

| Peran | Email | Password |
| --- | --- | --- |
| Admin | `admin@fitalenta.id` | `Admin@123` |
| Editor | `editor@fitalenta.id` | `Editor@123` |

> ⚠️ Kredensial di atas hanya untuk development. **Ganti atau hapus** sebelum aplikasi dipakai di lingkungan nyata.

## Konfigurasi Environment

Semua variabel dibaca dari berkas `.env` di masing-masing folder. **Jangan pernah meng-commit `.env`**; `.env.example` dijadikan acuan.

### `server/.env`

| Variabel | Wajib | Deskripsi |
| --- | :---: | --- |
| `PORT` | – | Port API. Default `5000`. |
| `NODE_ENV` | – | `development` atau `production`. Pada `production`, cookie berstatus `secure` dan Turnstile menjadi wajib. |
| `TRUST_PROXY` | – | Isi `1` jika API berada di belakang reverse proxy (nginx/Cloudflare) agar IP klien terbaca benar untuk rate limit. Kosongkan jika tidak. |
| `DATABASE_URL` | ✅ | URL koneksi untuk Prisma CLI (migrasi), mis. `mysql://USER:PASSWORD@localhost:3306/fitalenta_db`. |
| `DATABASE_HOST` `DATABASE_PORT` `DATABASE_USER` `DATABASE_PASSWORD` `DATABASE_NAME` | ✅ | Parameter koneksi untuk adapter MariaDB yang dipakai aplikasi dan skrip seed. **Harus konsisten dengan `DATABASE_URL`.** |
| `JWT_SECRET` | ✅ | Kunci penandatanganan token, minimal 32 karakter acak. |
| `JWT_EXPIRES_IN` | – | Masa berlaku token, mis. `7d`. |
| `CORS_ORIGIN` | ✅ | Origin frontend yang diizinkan (tanpa slash di akhir), mis. `http://localhost:3000`. |
| `CLIENT_URL` | ✅ | URL frontend untuk tautan di email (verifikasi, reset password). |
| `RESEND_API_KEY` | ✅ | API key Resend. |
| `CONTACT_EMAIL_TO` | ✅ | Alamat penerima pesan dari formulir kontak. |
| `CONTACT_EMAIL_FROM` | ✅ | Pengirim email kontak. |
| `AUTH_EMAIL_FROM` | – | Pengirim email autentikasi. Kosong berarti memakai `CONTACT_EMAIL_FROM`. |
| `TURNSTILE_SECRET_KEY` | ✅ prod | Secret key Turnstile. Di production **wajib**; bila kosong, registrasi/login ditolak dengan HTTP 503. |

Membuat `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Kunci uji Turnstile (selalu lolos, hanya untuk development):

- Site key (client): `1x00000000000000000000AA`
- Secret key (server): `1x0000000000000000000000000000000AA`

> Domain `onboarding@resend.dev` hanya untuk pengujian. Di production gunakan domain pengirim yang sudah diverifikasi di Resend.

### `client/.env`

| Variabel | Wajib | Deskripsi |
| --- | :---: | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL API termasuk `/api`, mis. `http://localhost:5000/api`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ | Site key Turnstile. |

> Variabel `NEXT_PUBLIC_*` ditanam saat **build**. Ubah nilainya berarti harus build ulang.

## Database

Skema ada di `server/prisma/schema.prisma` (provider `mysql`). Prisma Client di-generate ke `server/generated/prisma` dan tidak masuk Git, sehingga `npm run prisma:generate` wajib dijalankan setelah `npm install` dan setiap skema berubah.

Model utama:

| Domain | Model |
| --- | --- |
| Pengguna | `User` (peran `admin`, `editor`, `user`) |
| Konten | `Category`, `Event`, `Article`, `Service`, `Gallery`, `HeroSlide`, `Testimonial`, `Client`, `TeamMember` (`type`: `expert` / `team`), `UniversityPartner`, `Company`, `Job`, `ContactMessage`, `Setting` |
| Statistik | `EventView`, `ArticleView`, `ServiceView`, `Visitor` |
| Program & pendaftaran | `ProgramCategory`, `Program`, `Registration`, `RegistrationStatusHistory`, `SelectionStatus`, `PlacementStatus` |
| Pembayaran | `Payment`, `PaymentHistory` |
| Notifikasi | `Notification` (tipe `info`, `warning`, `success`, `error`) |

### Migrasi

```bash
npm run prisma:migrate          # development: membuat/menerapkan migrasi
npm run prisma:studio           # GUI untuk melihat data
```

Di production gunakan `npx prisma migrate deploy` (hanya menerapkan migrasi yang sudah ada, tidak membuat yang baru).

### Seeding

Skrip seed bersifat idempoten (memakai *upsert*/pencocokan), sehingga aman dijalankan ulang. Jalankan dari folder `server/`:

```bash
npm run seed:admin                                      # akun admin & editor
npx tsx prisma/seed-programs.ts                         # kategori & program pelatihan
npx tsx prisma/seed-events-articles.ts                  # event & artikel (dari prisma/data/*.json)
npx tsx prisma/seed-team-members.ts                     # pakar/anggota tim
npx tsx prisma/seed-testimonials-clients-services.ts    # testimoni, klien, layanan
npx tsx prisma/seed-featured.ts                         # tandai artikel unggulan (jalankan setelah event & artikel)
```

Seeder tim (`seed-team-members.ts`) tidak mengisi kolom `type`, sehingga seluruh data awal berstatus `expert` (nilai default).

## Menjalankan Aplikasi

| Perintah | Lokasi | Fungsi |
| --- | --- | --- |
| `npm run dev` | `server/` | API dengan *hot reload* di `http://localhost:5000` |
| `npm run dev` | `client/` | Frontend di `http://localhost:3000` |

Jalankan keduanya bersamaan. Frontend memanggil API sesuai `NEXT_PUBLIC_API_URL`, dan API hanya menerima request dari `CORS_ORIGIN`.

## Peran Pengguna & Hak Akses

| Peran | Area | Kemampuan |
| --- | --- | --- |
| `user` | `/dashboard`, `/pendaftaran`, `/pembayaran`, `/notifikasi`, `/profil` | Mendaftar program, membayar, memantau status |
| `editor` | `/editor/*` | Mengelola konten website (CMS) |
| `admin` | `/admin/*` dan `/editor/*` | Seluruh fitur: program, seleksi, pembayaran, laporan keuangan, pengguna, dan CMS |

Penegakan dilakukan di dua lapis: **`proxy.ts`** (pengalihan halaman di client) dan **middleware `authenticate` + `authorize`** (otorisasi sebenarnya di API). Endpoint modul keuangan dan pendaftaran hanya untuk `admin`; endpoint konten menerima `admin` dan `editor`.

Rute rumah setiap peran: `admin` → `/admin/dashboard`, `editor` → `/editor/dashboard`, `user` → `/dashboard`.

## Alur Bisnis

```mermaid
flowchart TD
    A[Daftar akun] --> B[Verifikasi email]
    B --> C[Login]
    C --> D[Daftar program<br/>+ unggah dokumen]
    D --> E{Seleksi oleh admin}
    E -->|Tidak lolos| X[Selesai + notifikasi]
    E -->|Lolos| F[Tahap penempatan<br/>proses → lolos → ditempatkan]
    D --> G[Admin membuat tagihan<br/>lunas atau cicilan 2–6x]
    G --> H[Admin menerbitkan invoice]
    H --> I[Peserta membayar<br/>dan unggah bukti]
    I --> J[Admin verifikasi pembayaran]
    J --> K[Laporan keuangan]
    E -. notifikasi .-> N[(Notifikasi peserta)]
    J -. notifikasi .-> N
```

Ringkasan status:

- **Seleksi**: `menunggu` → `lolos` / `tidak_lolos`.
- **Penempatan**: `proses` → `lolos` → `ditempatkan`.
- **Pembayaran**: `pending`, `installment_1`…`installment_6`, `paid`, `overdue`, `cancelled`. Invoice berstatus `draft` atau `issued`.
- **Kode otomatis**: pendaftaran berprefiks `FTL` (per tahun), invoice `INV`, dan kwitansi `RCP` (per bulan).

## Skrip yang Tersedia

### `server/`

| Skrip | Perintah | Fungsi |
| --- | --- | --- |
| `dev` | `tsx watch src/index.ts` | Server development dengan *hot reload* |
| `typecheck` | `tsc` | Pemeriksaan tipe tanpa output |
| `build` | typecheck lalu `esbuild` | Bundel ke `dist/index.js` (ESM) |
| `start` | `node dist/index.js` | Menjalankan hasil build |
| `prisma:generate` | `prisma generate` | Membuat Prisma Client |
| `prisma:migrate` | `prisma migrate dev` | Migrasi (development) |
| `prisma:studio` | `prisma studio` | GUI database |
| `seed:admin` | `tsx prisma/seed-admin.ts` | Seed akun admin & editor |

### `client/`

| Skrip | Perintah | Fungsi |
| --- | --- | --- |
| `dev` | `next dev` | Server development |
| `build` | `next build` | Build production (termasuk pengecekan tipe) |
| `start` | `next start` | Menjalankan hasil build |
| `lint` | `eslint` | Linting |

## Pengujian API Manual

Folder `server/http/` berisi koleksi request berformat `.http` (kompatibel dengan ekstensi *REST Client* di VS Code dan HTTP Client JetBrains) untuk alur registrasi, pembayaran, program, seleksi & penempatan, laporan keuangan, dan dashboard admin. Variabel `@baseUrl` di dalamnya menunjuk ke `http://localhost:5000/api`.

Untuk memeriksa kualitas kode sebelum commit:

```bash
cd server && npm run typecheck
cd client && npm run lint && npx tsc --noEmit
```

## Deployment ke Production

Daftar periksa:

1. **Environment**
   - Set `NODE_ENV=production` di server.
   - Isi `TURNSTILE_SECRET_KEY` asli dan `NEXT_PUBLIC_TURNSTILE_SITE_KEY` asli.
   - Gunakan `JWT_SECRET` baru yang acak dan panjang. Jangan memakai nilai contoh.
   - `CORS_ORIGIN` dan `CLIENT_URL` harus berisi domain frontend yang sebenarnya.
   - Isi `TRUST_PROXY=1` bila berada di belakang nginx atau Cloudflare.
2. **Database**: terapkan migrasi dengan `npx prisma migrate deploy`.
3. **Backend**
   ```bash
   cd server
   npm ci
   npm run prisma:generate
   npm run build
   npm start
   ```
4. **Frontend**
   ```bash
   cd client
   npm ci
   npm run build
   npm start
   ```
5. **Domain & cookie**: cookie sesi memakai `SameSite=Strict` dan `Secure` di production. Frontend dan API harus berada di **situs yang sama (same-site)**, misalnya `app.contoh.com` dan `api.contoh.com`, serta diakses lewat **HTTPS**. Bila berbeda situs, cookie tidak akan terkirim dan login akan gagal.
6. **Gambar**: tambahkan hostname API produksi ke `images.remotePatterns` di `client/next.config.ts` (saat ini berisi `www.fitalenta.co.id` dan `localhost:5000`).
7. **File unggahan**: `server/uploads/` ada di disk dan tidak masuk Git. Simpan pada *volume* yang persisten dan sertakan dalam backup, karena berisi dokumen peserta dan bukti pembayaran.
8. **Akun awal**: ganti password akun seed atau jangan jalankan `seed:admin` di production dengan kredensial bawaan.

## Keamanan

- Password di-hash dengan **bcrypt**; token sesi di cookie `httpOnly` + `SameSite=Strict` + `Secure` (production).
- **Rate limiting** pada kontak, registrasi, login (per IP dan per akun), lupa/reset/ganti password, dan verifikasi email.
- **CAPTCHA** Turnstile pada formulir sensitif; di production layanan menolak request bila secret belum diset.
- Validasi input dengan **express-validator** di server dan **Zod** di client.
- Unggahan dibatasi tipe MIME dan ukuran (gambar maks. 5 MB; impor Excel maks. 5 MB dan 500 baris).
- Otorisasi berbasis peran ditegakkan di server pada setiap endpoint terlindungi.

Menemukan celah keamanan? Mohon laporkan secara privat kepada pemilik repositori dan jangan membuka *issue* publik.

## Troubleshooting

| Gejala | Penyebab & solusi |
| --- | --- |
| `Cannot find module '../generated/prisma/client'` | Prisma Client belum dibuat. Jalankan `npm run prisma:generate` di `server/`. |
| Migrasi gagal terhubung ke database | Periksa `DATABASE_URL`; pastikan database sudah dibuat dan kredensialnya sama dengan `DATABASE_*`. |
| Server jalan tapi query gagal | `DATABASE_HOST/USER/PASSWORD/NAME` berbeda dari `DATABASE_URL`. Samakan keduanya. |
| Browser menolak request (CORS) | `CORS_ORIGIN` harus persis sama dengan origin frontend (tanpa slash di akhir). |
| Login berhasil tapi langsung dikeluarkan | Cookie tidak terkirim: periksa HTTPS dan same-site di production, atau `NEXT_PUBLIC_API_URL` yang salah. |
| `503 Layanan verifikasi tidak tersedia` | `NODE_ENV=production` tetapi `TURNSTILE_SECRET_KEY` kosong. |
| Gambar tidak tampil di Next.js | Host belum terdaftar di `images.remotePatterns` pada `next.config.ts`. |
| Email verifikasi tidak masuk | Periksa `RESEND_API_KEY` dan domain pengirim; `onboarding@resend.dev` hanya untuk uji coba. |
| `next build` gagal pada pengecekan tipe | Jalankan `npx tsc --noEmit` untuk melihat daftar lengkap; pastikan tidak ada berkas lama yang tertinggal setelah refaktor. |

## Konvensi Pengembangan

- **Bahasa**: kode dan nama berkas dalam bahasa Inggris; teks antarmuka dan pesan API dalam bahasa Indonesia. URL area peserta memakai istilah Indonesia (`/pembayaran`, `/notifikasi`, `/profil`).
- **Alur di client**: `services` (panggilan API) → `hooks` (TanStack Query) → `components`/`app`. Tipe di `types/`, validasi form di `schemas/`, konstanta di `constants/`, fungsi murni di `helpers/`.
- **Alur di server**: `routes` → `validators` → `controllers` → `services`. Logika bisnis dan akses data berada di `services`; konfigurasi domain di `config/`.
- **Alias impor** di client: `@/*` memetakan ke `src/*`.
- **Database**: setiap perubahan skema harus lewat migrasi Prisma (`npm run prisma:migrate`) dan berkas migrasi di-commit.
- **Pesan commit** (disarankan): [Conventional Commits](https://www.conventionalcommits.org/), mis. `feat(editor): tambah tab anggota tim`, `fix(auth): perbaiki redirect setelah login`.
- **Sebelum membuat PR**: pastikan `npm run typecheck` (server) serta `npm run lint` dan `npx tsc --noEmit` (client) lulus.

## Lisensi

Repositori ini belum menyertakan berkas `LICENSE`. Hubungi pemilik repositori sebelum menggunakan, menyalin, atau mendistribusikan ulang kode ini.

---

<div align="center">

Dibuat untuk **FITALENTA — PT FAST Indo Talenta**<br/>
Gedung Science and Techno Park ITB, Jl. Ganesa No. 15E, Bandung 40132

</div>
