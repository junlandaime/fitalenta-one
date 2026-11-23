import http from "node:http";

const PORT = Number(process.env.PORT || 3000);

const HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="20" />
  <title>Pembaruan Sistem — FITALENTA</title>
  <style>
    :root {
      --primary: #162a4c;
      --primary-light: #234070;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #0f172a;
      --muted: #475569;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(180deg, #f1f5f9 0%, var(--bg) 100%);
      color: var(--text);
    }
    .card {
      width: 100%;
      max-width: 520px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 10px 30px rgba(22, 42, 76, 0.08);
      text-align: center;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 0.04em;
      color: var(--primary);
      margin-bottom: 20px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: #eff6ff;
      color: var(--primary);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 18px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2563eb;
      animation: pulse 1.6s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    h1 {
      font-size: 24px;
      line-height: 1.3;
      color: var(--primary);
      margin-bottom: 12px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: var(--muted);
      margin-bottom: 24px;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 10px;
      background: var(--primary);
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }
    .btn:hover { background: var(--primary-light); }
    .foot {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 13px;
      color: #64748b;
    }
    .foot a { color: var(--primary); text-decoration: none; font-weight: 500; }
    .foot a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <main class="card">
    <div class="brand">FITALENTA</div>
    <div class="badge"><span class="dot"></span>Sedang Pembaruan Sistem</div>
    <h1>Website Sedang Diperbarui</h1>
    <p>
      Kami sedang melakukan pembaruan layanan untuk meningkatkan pengalaman Anda.
      Halaman ini akan dimuat ulang secara otomatis dalam beberapa saat.
    </p>
    <div class="actions">
      <button class="btn" onclick="window.location.reload()">Muat Ulang Halaman</button>
    </div>
    <div class="foot">
      Butuh bantuan segera? Hubungi <a href="mailto:info@fitalenta.co.id">info@fitalenta.co.id</a>
    </div>
  </main>
</body>
</html>`;

const server = http.createServer((_req, res) => {
  res.writeHead(503, {
    "Content-Type": "text/html; charset=utf-8",
    "Retry-After": "60",
    "Cache-Control": "no-store, no-cache, must-revalidate",
  });
  res.end(HTML);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[maintenance] Mini maintenance server aktif di port ${PORT}`);
});
