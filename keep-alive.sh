#!/usr/bin/env bash

# Pastikan Node.js 20 CloudLinux aktif di PATH
if [ -d "/opt/alt/alt-nodejs20/root/usr/bin" ]; then
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
fi

# Tentukan direktori aplikasi
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR" || exit 1

LOG_FILE="$APP_DIR/keep-alive.log"

# Cek apakah Next.js (port 3000) dan Express (port 5000) merespons
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://127.0.0.1:3000" 2>/dev/null || echo "000")
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://127.0.0.1:5000/api/health" 2>/dev/null || echo "000")

# Jika salah satu service mati (HTTP code 000 atau koneksi ditolak)
if [ "$WEB_STATUS" = "000" ] || [ "$API_STATUS" = "000" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Service down detected (Web: $WEB_STATUS, API: $API_STATUS). Restarting PM2..." >> "$LOG_FILE"
    npx pm2 start ecosystem.config.cjs || npx pm2 restart all
    npx pm2 save
    
    # Batasi log file agar tidak membengkak (maksimal 100 baris terakhir)
    tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi
