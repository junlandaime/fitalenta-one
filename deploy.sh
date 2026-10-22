#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  FITALENTA AUTOMATED DEPLOYMENT SCRIPT   "
echo "=========================================="

# 1. Pastikan Node.js 20 CloudLinux aktif di PATH
if [ -d "/opt/alt/alt-nodejs20/root/usr/bin" ]; then
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
fi

echo "[1/6] Menarik kode terbaru dari GitHub..."
git pull origin main

echo "[2/6] Mengosongkan RAM server (stop sementara PM2)..."
npx pm2 stop all || true

echo "[3/6] Memperbarui Prisma & Build Backend (Express)..."
cd server
npx prisma generate
node prisma/seeds/apply-role-migration.js || true
npm run build
cd ..

echo "[4/6] Melakukan build Next.js frontend (mode hemat RAM)..."
cd client
rm -rf .next
export RAYON_NUM_THREADS=1
export UV_THREADPOOL_SIZE=1
export NEXT_CPU_NUM=1
export NODE_OPTIONS="--max-old-space-size=1024"
npx next build --webpack
cd ..

echo "[5/6] Menyalakan kembali seluruh service di PM2..."
npx pm2 start ecosystem.config.cjs || npx pm2 restart all

echo "[6/6] Status PM2 terkini:"
npx pm2 status

echo "=========================================="
echo "  DEPLOY SELESAI & WEBSITE AKTIF!         "
echo "=========================================="
