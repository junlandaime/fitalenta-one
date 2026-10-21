module.exports = {
  apps: [
    {
      name: "fitalenta-api",
      cwd: "./server",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "250M",
      node_args: "--max-old-space-size=200",
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
      autorestart: true,
      max_memory_restart: "450M",
      node_args: "--max-old-space-size=384",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
