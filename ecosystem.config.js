module.exports = {
  apps: [
    {
      name: "leikapui-sales-dashboard",
      script: "npm",
      args: "start",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      // PM2 specific settings
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      // Environment variables
      env_file: ".env.production",
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "git@github.com:remruata2/leikapuisales.git",
      path: "/var/www/leikapui-sales-dashboard",
      "pre-deploy-local": "",
      "post-deploy":
        "npm ci && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
