module.exports = {
  apps: [
    {
      name: "fitalenta-backend",
      cwd: "./server",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    {
      name: "fitalenta-frontend",
      cwd: "./client",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
