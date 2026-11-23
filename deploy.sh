#!/usr/bin/env bash
set -e

# Pastikan file lock & maintenance server dibersihkan saat script selesai atau diinterupsi
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCK_FILE="$APP_DIR/.deploying"
MAINT_PID=""

stop_maintenance() {
    if [ -n "$MAINT_PID" ] && kill -0 "$MAINT_PID" 2>/dev/null; then
        kill "$MAINT_PID" 2>/dev/null || true
        wait "$MAINT_PID" 2>/dev/null || true
    fi
    MAINT_PID=""
}

cleanup() {
    stop_maintenance
    rm -f "$LOCK_FILE"
}

touch "$LOCK_FILE"
trap cleanup EXIT

echo "=========================================="
echo "  FITALENTA ZERO-DOWNTIME DEPLOYMENT      "
echo "=========================================="

# 1. Pastikan Node.js 20 CloudLinux aktif di PATH
if [ -d "/opt/alt/alt-nodejs20/root/usr/bin" ]; then
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
fi

echo "[1/5] Menangani potensi konflik lokal & Menarik kode terbaru..."
# Hindari kegagalan git pull karena package-lock.json lokal tersentuh npm di server
git checkout -- server/package-lock.json client/package-lock.json 2>/dev/null || true
git -c pack.threads=1 -c pack.windowMemory=10m fetch origin main
git reset --hard origin/main

echo "[2/5] Memperbarui Prisma & Build Backend (Express)..."
cd server
node prisma/seeds/apply-role-migration.js || true
node prisma/seeds/seed-galleries.js || true
node prisma/seeds/seed-testimonials-clients-services.js || true
node prisma/seeds/clean-content.js || true
npm run build || true
cd ..

echo "[3/5] Melakukan build Next.js frontend (PM2 tetap melayani pengunjung)..."
cd client
# Tidak menghapus seluruh .next agar chunk lama tetap aktif; hanya bersihkan cache webpack agar tidak memicu OOM
rm -rf .next/cache/webpack
export RAYON_NUM_THREADS=1
export UV_THREADPOOL_SIZE=1
export NEXT_CPU_NUM=1
export NODE_OPTIONS="--max-old-space-size=1280 --v8-pool-size=1"
if ! npx next build --webpack; then
    echo "[!] Build terhenti saat PM2 aktif. Menghentikan fitalenta-web sementara & menyalakan halaman maintenance..."
    cd ..
    npx pm2 stop fitalenta-web 2>/dev/null || true
    PORT=3000 node --max-old-space-size=32 "$APP_DIR/maintenance-server.mjs" &
    MAINT_PID=$!
    cd client
    npx next build --webpack
fi
cd ..

stop_maintenance

echo "[4/5] Melakukan reload PM2 (pergantian instan tanpa downtime)..."
npx pm2 start ecosystem.config.cjs 2>/dev/null || true
npx pm2 reload ecosystem.config.cjs || npx pm2 restart all
npx pm2 save
chmod +x keep-alive.sh 2>/dev/null || true

echo "[5/5] Status PM2 terkini:"
npx pm2 status

echo "=========================================="
echo "  DEPLOY SUKSES & WEBSITE TETAP AKTIF!   "
echo "=========================================="
