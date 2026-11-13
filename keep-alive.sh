#!/usr/bin/env bash

# Pastikan HOME terdefinisi untuk cron
export HOME="${HOME:-/home/u1722546}"

# Muat environment user jika ada
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" >/dev/null 2>&1
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" >/dev/null 2>&1

# Pastikan Node.js 20 CloudLinux dan npm global aktif di PATH
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$HOME/.npm-global/bin:$HOME/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Tentukan direktori aplikasi
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR" || exit 1

# Jangan lakukan auto-heal jika proses deploy sedang berjalan
if [ -f "$APP_DIR/.deploying" ]; then
    exit 0
fi

LOG_FILE="$APP_DIR/keep-alive.log"

# Cari binary PM2 yang tersedia
PM2_CMD=""
if command -v pm2 >/dev/null 2>&1; then
    PM2_CMD="pm2"
elif [ -x "$HOME/.npm-global/bin/pm2" ]; then
    PM2_CMD="$HOME/.npm-global/bin/pm2"
elif [ -x "/opt/alt/alt-nodejs20/root/usr/bin/pm2" ]; then
    PM2_CMD="/opt/alt/alt-nodejs20/root/usr/bin/pm2"
elif command -v npx >/dev/null 2>&1; then
    PM2_CMD="npx --yes pm2"
fi

# Cek apakah Next.js (port 3000) dan Express (port 5000) merespons
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://127.0.0.1:3000" 2>/dev/null)
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://127.0.0.1:5000/api/health" 2>/dev/null)

# Evaluasi jika service mati (000, string kosong, atau error >= 500)
if [ -z "$WEB_STATUS" ] || [ "$WEB_STATUS" = "000" ] || [ "$WEB_STATUS" -ge 500 ] 2>/dev/null || \
   [ -z "$API_STATUS" ] || [ "$API_STATUS" = "000" ] || [ "$API_STATUS" -ge 500 ] 2>/dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Service down/error detected (Web: $WEB_STATUS, API: $API_STATUS). Restarting PM2 with '${PM2_CMD}'..." >> "$LOG_FILE"
    
    if [ -n "$PM2_CMD" ]; then
        # Coba resurrect dari saved dump terlebih dahulu, jika gagal jalankan ecosystem
        $PM2_CMD resurrect >> "$LOG_FILE" 2>&1 || $PM2_CMD start ecosystem.config.cjs >> "$LOG_FILE" 2>&1 || $PM2_CMD restart all >> "$LOG_FILE" 2>&1
        $PM2_CMD save >> "$LOG_FILE" 2>&1
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: PM2 command not found in PATH!" >> "$LOG_FILE"
    fi
    
    # Batasi log file agar tidak membengkak (maksimal 100 baris terakhir)
    tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" 2>/dev/null && mv "$LOG_FILE.tmp" "$LOG_FILE" 2>/dev/null || true
fi
