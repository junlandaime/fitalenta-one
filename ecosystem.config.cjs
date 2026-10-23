module.exports = {
  apps: [
    {
      name: "fitalenta-api",
      cwd: "./server",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "350M",
      node_args: "--max-old-space-size=256",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    {
      name: "fitalenta-web",
      cwd: "./client",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "600M",
      node_args: "--max-old-space-size=512",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
