# Panduan Setup Production & Migrasi Data — FITALENTA

Dokumen ini berisi panduan teknis langkah demi langkah untuk melakukan deployment sistem **FITALENTA** ke server production (VPS / Cloud), mencakup konfigurasi web server Nginx, konfigurasi database MySQL, migrasi data peserta dari sistem lama (ojetu & fitalenta), dan pengelolaan proses aplikasi.

---

## 1. Ikhtisar Arsitektur Sistem & Penggabungan Repository

Repository ini merupakan hasil **penggabungan (unifikasi)** dari dua repository terpisah sebelumnya:
1. **Website Profil Perusahaan** (`fitalenta.co.id` — sebelumnya berbasis **Laravel** dari repo `junlandaime/fitalenta`).
2. **Sistem Pendaftaran & Portal Peserta** (`registrasi.fitalenta.co.id` — sebelumnya berbasis **Express.js dan React**, dengan koneksi database MySQL menggunakan driver **`mysql2`** dari repo `junlandaime/ojetu`).

Kedua sistem tersebut kini disatukan ke dalam arsitektur monorepo modern:
- **Frontend (`client/`)**: Next.js App Router (React 19, TypeScript, Tailwind CSS) — menggabungkan tampilan publik fitalenta dan portal registrasi ojetu, berjalan di port `3000`.
- **Backend API (`server/`)**: Express.js + Prisma ORM + TypeScript — menyatukan logic API profil dan pendaftaran peserta, berjalan di port `5000`.
- **Database**: MySQL / MariaDB (kompatibel dengan schema MySQL dari ojetu lama).
- **Reverse Proxy**: Nginx + SSL Let's Encrypt (Certbot).
- **Process Manager**: PM2.

---

## 2. Prasyarat Server Production

Pastikan server production (misal: Ubuntu 22.04 LTS atau 24.04 LTS) telah terpasang:
- **Node.js**: v20.x atau v22.x LTS (`node -v`)
- **npm**: v10+ (`npm -v`)
- **MySQL Server**: v8.0+ atau **MariaDB Server**: v10.6+
- **Nginx Web Server**: `nginx -v`
- **PM2 Process Manager**: `npm install -g pm2`
- **Certbot (SSL)**: `apt install certbot python3-certbot-nginx -y`
- **Git**: `git --version`

---

## 3. Persiapan Database Production (MySQL)

Masuk ke MySQL sebagai root:
```bash
sudo mysql -u root -p
```

Jalankan perintah berikut untuk membuat database production dan user khusus dengan hak akses penuh:
```sql
CREATE DATABASE fitalenta_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'fitalenta_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'PasswordKuatDatabase2026!';
GRANT ALL PRIVILEGES ON fitalenta_prod.* TO 'fitalenta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. Konfigurasi Environment Variables

### A. Backend (`server/.env`)
Buat file `/var/www/fitalenta/server/.env` dengan konfigurasi database MySQL:

```env
PORT=5000
NODE_ENV=production
TRUST_PROXY=true

# Database MySQL Production (Kompatibel dengan MySQL2 / Prisma)
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=fitalenta_prod
DATABASE_USER=fitalenta_user
DATABASE_PASSWORD=PasswordKuatDatabase2026!

# URL Frontend & Cookie Security
CORS_ORIGIN=https://fitalenta.co.id
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=.fitalenta.co.id

# JWT Authentication
JWT_SECRET=super_secret_jwt_key_production_fitalenta_2026_secure
JWT_EXPIRES_IN=7d

# Password Default Seragam untuk Peserta Hasil Migrasi
DEFAULT_PARTICIPANT_PASSWORD=Fitalenta2026!

# Layanan Email (Resend / SMTP)
# URL Frontend untuk Tautan Aktivasi Email
CLIENT_URL=https://fitalenta.co.id

# Layanan Email: SMTP cPanel (100% Gratis - Rekomendasi Utama)
SMTP_HOST=mail.fitalenta.co.id
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@fitalenta.co.id
SMTP_PASS=PasswordEmailCpanelAnda
SMTP_REJECT_UNAUTHORIZED=false
AUTH_EMAIL_FROM="Fitalenta <noreply@fitalenta.co.id>"
CONTACT_EMAIL_FROM="Fitalenta <noreply@fitalenta.co.id>"
CONTACT_EMAIL_TO=info@fitalenta.co.id

# Alternatif: Resend API
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
MAIL_FROM="Fitalenta <noreply@fitalenta.co.id>"

# Cloudflare Turnstile (Captcha)
TURNSTILE_SECRET_KEY=0x4AAAAAAxxxxxxxxxxxxxxxxxxxx
```

### B. Frontend (`client/.env.local` atau `client/.env.production`)
Buat file `/var/www/fitalenta/client/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://fitalenta.co.id/api
NEXT_PUBLIC_ASSET_URL=https://fitalenta.co.id
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAxxxxxxxxxxxxxxxxxxxx
```

---

## 5. Clone, Install, dan Build Aplikasi

Lakukan clone proyek ke direktori web server (misal `/var/www/fitalenta`):
```bash
cd /var/www
git clone https://github.com/.../fitalenta.git fitalenta
cd /var/www/fitalenta
```

### A. Setup Backend Server
```bash
cd /var/www/fitalenta/server
npm install

# 1. Jalankan generator dan migrasi database Prisma ke MySQL
npm run prisma:generate
npx prisma migrate deploy

# 2. Buat direktori penyimpanan upload dan atur hak akses
mkdir -p uploads/articles uploads/events uploads/gallery uploads/team-members uploads/testimonials uploads/registrations uploads/payment-proofs
chmod -R 775 uploads

# 3. Build bundle backend Express
npm run build

# 4. Seed Akun Admin Awal (Super Admin & Editor)
npm run seed:admin
```
> **Akun Default Hasil Seed:**
> - Super Admin: `admin@fitalenta.id` / Password: `Admin@123`
> - Editor: `editor@fitalenta.id` / Password: `Editor@123`
> *(Segera ubah password setelah pertama kali login).*

### B. Setup Frontend Client
```bash
cd /var/www/fitalenta/client
npm install
npm run build
```

---

## 6. Prosedur Pemigrasian Data Peserta Lama (Dari Database MySQL ojetu)

Karena sistem pendaftaran lama **ojetu** dibangun menggunakan **Express dan React** dengan database MySQL (`mysql2`), struktur data peserta dapat dimigrasikan dengan sangat mudah.

### Metode A: Menggunakan Dump Query SQL (Paling Direkomendasikan)
1. Ekspor data peserta dari database MySQL `ojetu` lama menggunakan query SQL berikut:

```sql
SELECT 
    u.name AS name,
    u.email AS email,
    u.phone AS phone,
    r.nik AS nik,
    r.gender AS gender,
    r.birth_place AS birth_place,
    r.birth_date AS birth_date,
    r.address AS address,
    r.last_education AS last_education,
    r.major AS major,
    r.education_institution AS education_institution,
    r.current_activity AS current_activity,
    r.marital_status AS marital_status,
    r.parent_phone AS parent_phone,
    r.parent_relationship AS parent_relationship,
    r.ktp_province_code AS ktp_province_code,
    r.ktp_province_name AS ktp_province_name,
    r.ktp_city_code AS ktp_city_code,
    r.ktp_city_name AS ktp_city_name,
    r.ktp_address AS ktp_address,
    r.domicile_province_code AS domicile_province_code,
    r.domicile_province_name AS domicile_province_name,
    r.domicile_city_code AS domicile_city_code,
    r.domicile_city_name AS domicile_city_name,
    r.domicile_address AS domicile_address,
    r.photo_path AS photo_path,
    r.n4_certificate_path AS n4_certificate_path,
    r.ssw_certificate_path AS ssw_certificate_path,
    r.registration_code AS registration_code,
    r.registration_status AS registration_status,
    r.created_at AS created_at
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
WHERE u.role = 'user' OR u.role IS NULL;
```

2. Simpan hasil export tersebut dalam format JSON pada path:
   ```bash
   /var/www/fitalenta/server/prisma/data/legacy-participants.json
   ```

3. *(Opsional)* Salin berkas upload foto/dokumen dari folder uploads Express `ojetu` lama ke server baru:
   ```bash
   cp -r /path/to/ojetu/uploads/* /var/www/fitalenta/server/uploads/registrations/
   ```

4. Jalankan script migrasi otomatis:
   ```bash
   cd /var/www/fitalenta/server
   npm run migrate:participants
   ```

### Metode B: Migrasi Langsung Menggunakan Driver `mysql2`
Jika Anda ingin menarik data langsung dari instance database MySQL lama tanpa mengekspor ke file JSON, Anda dapat menggunakan script Node.js dengan driver `mysql2`. Buat skrip sementara (misal: `migrate-direct-mysql2.mjs`):

```javascript
import mysql from "mysql2/promise";
import fs from "fs";

async function dumpLegacyOjetu() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password_db_ojetu_lama",
    database: "ojetu_db_lama",
  });

  const [rows] = await connection.execute(`
    SELECT u.name, u.email, u.phone, r.*
    FROM users u
    LEFT JOIN registrations r ON u.id = r.user_id
  `);

  fs.writeFileSync(
    "./prisma/data/legacy-participants.json",
    JSON.stringify(rows, null, 2)
  );
  console.log(`Berhasil mengekstrak ${rows.length} data peserta dari database MySQL ojetu lama!`);
  await connection.end();
}

dumpLegacyOjetu();
```
Setelah file JSON tercipta, cukup jalankan:
```bash
npm run migrate:participants
```

---

## 7. Fitur Reset & Verifikasi Password Seragam Peserta

Setelah migrasi selesai, semua akun peserta lama (`role: "user"`) diseragamkan password-nya ke password default yang sama agar seluruh peserta lama dapat langsung masuk tanpa kendala perbedaan enkripsi password dari sistem lama.

### A. Eksekusi Reset Password Massal
1. Tentukan password seragam di `server/.env`:
   ```env
   DEFAULT_PARTICIPANT_PASSWORD=Fitalenta2026!
   ```
2. Jalankan perintah:
   ```bash
   cd /var/www/fitalenta/server
   npm run reset:passwords
   ```
3. **Hasil Eksekusi:**
   - Semua akun dengan `role: "user"` akan di-hash menggunakan bcrypt dengan password `Fitalenta2026!`.
   - Akun Admin dan Editor **tidak** terpengaruh.

### B. Uji Verifikasi Sample Password di Production
Untuk memastikan tanpa keraguan bahwa akun peserta di database production benar-benar cocok dengan password baru tersebut, jalankan skrip verifikasi bawaan:

1. **Uji Sampel 5 Akun Acak:**
   ```bash
   npm run verify:passwords
   ```
   *(Menampilkan status `[VALID]` atau `[GAGAL]` pada 5 peserta acak)*

2. **Uji Email Peserta Tertentu:**
   ```bash
   npx tsx src/scripts/verify-participant-passwords.ts nama_email_peserta@example.com
   ```

### C. Instruksi Pengumuman untuk Peserta
> *"Peserta yang telah mendaftar di sistem sebelumnya (ojetu) dapat masuk menggunakan email terdaftar masing-masing dengan password seragam: **`Fitalenta2026!`**. Setelah masuk ke dashboard peserta, silakan perbarui password Anda pada menu Profil."*

---

## 8. Konfigurasi Nginx & Penanganan Subdomain Lama

Karena sistem `ojetu` sebelumnya beralamat di `registrasi.fitalenta.co.id` dan website utama di `fitalenta.co.id`, Nginx dikonfigurasi untuk menangani penggabungan ini dengan mulus (mengarahkan URL subdomain lama langsung ke halaman `/pendaftaran` di sistem baru).

Buat file konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/fitalenta.conf
```

Isi konfigurasi Nginx:

```nginx
# 1. Subdomain registrasi.fitalenta.co.id (Eks-Ojetu)
# Mengarahkan langsung seluruh pengunjung ke form pendaftaran di sistem baru
server {
    listen 80;
    listen [::]:80;
    server_name registrasi.fitalenta.co.id;
    return 301 https://fitalenta.co.id/pendaftaran;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name registrasi.fitalenta.co.id;

    ssl_certificate /etc/letsencrypt/live/fitalenta.co.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitalenta.co.id/privkey.pem;

    return 301 https://fitalenta.co.id/pendaftaran;
}

# 2. Domain Utama: fitalenta.co.id
server {
    listen 80;
    listen [::]:80;
    server_name fitalenta.co.id www.fitalenta.co.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fitalenta.co.id www.fitalenta.co.id;

    ssl_certificate /etc/letsencrypt/live/fitalenta.co.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitalenta.co.id/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Batas ukuran upload (KTP, sertifikat, bukti pembayaran)
    client_max_body_size 25M;

    # A. Backend API Express (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # B. Berkas Statis Unggahan (/uploads)
    location /uploads/ {
        alias /var/www/fitalenta/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }

    # C. Frontend Next.js (Port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/fitalenta.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Pasang SSL Certbot:
```bash
sudo certbot --nginx -d fitalenta.co.id -d www.fitalenta.co.id -d registrasi.fitalenta.co.id
```

---

## 9. Manajemen Proses PM2 (`ecosystem.config.cjs`)

Gunakan file [ecosystem.config.cjs](file:///d:/MAGANG-FITALENTA/fitalenta/ecosystem.config.cjs) yang telah tersedia di root proyek:

```bash
cd /var/www/fitalenta
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Perintah pemantauan PM2:
```bash
pm2 status          # Cek status proses frontend dan backend
pm2 logs            # Cek log runtime aplikasi
pm2 reload all      # Restart aplikasi tanpa downtime
```

---

## 10. Prosedur Update Kode di Server Production

Setiap kali melakukan push pembaruan kode ke repository Git, jalankan langkah berikut di server production:

```bash
cd /var/www/fitalenta

# 1. Ambil update kode terbaru
git pull origin main

# 2. Build Backend Server
cd server
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run build

# 3. Build Frontend Client
cd ../client
npm install
npm run build

# 4. Reload proses PM2
cd /var/www/fitalenta
pm2 reload ecosystem.config.cjs
```
