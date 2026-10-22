#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  FITALENTA AUTOMATED DEPLOYMENT SCRIPT   "
echo "=========================================="

# 1. Pastikan Node.js 20 CloudLinux aktif di PATH
if [ -d "/opt/alt/alt-nodejs20/root/usr/bin" ]; then
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
fi

echo "[1/4] Menarik kode terbaru dari GitHub..."
git pull origin main

echo "[2/4] Melakukan build Next.js frontend (mode hemat RAM)..."
cd client
export RAYON_NUM_THREADS=1
export UV_THREADPOOL_SIZE=1
export NEXT_CPU_NUM=1
export NODE_OPTIONS="--max-old-space-size=1536"
npx next build --webpack
cd ..

echo "[3/4] Memastikan PM2 online & me-restart aplikasi..."
npx pm2 restart ecosystem.config.cjs

echo "[4/4] Menampilkan status PM2 terkini..."
npx pm2 status

echo "=========================================="
echo "  DEPLOY SELESAI & WEBSITE AKTIF!         "
echo "=========================================="
