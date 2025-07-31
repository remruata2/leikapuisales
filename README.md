This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Leikapui Sales Dashboard

A Next.js dashboard for monitoring movie sales and transactions for Leikapui Studios.

## Features

- 📊 Real-time sales analytics
- 🎬 Top-selling movies tracking
- 📈 Sales trend charts
- 🔐 Secure admin authentication
- 📱 Responsive design
- ⚡ Optimized performance

## Environment Setup

### Development

```bash
# Copy environment template
cp .env.example .env.local

# Edit the API URL for development
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Production

```bash
# Production environment is configured in .env.production
NEXT_PUBLIC_API_URL=https://api.leikapuistudios.com
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your development API URL
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

The dashboard uses a separate authentication system from the main OTT application:

- **Admin Email**: `dashboard@leikapui.com`
- **Password**: `dashboard123`
- **Permissions**: `view_analytics`, `manage_transactions`

## Deployment

### Quick Deployment with PM2

```bash
./deploy.sh
```

### Manual PM2 Deployment

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Install all dependencies (including dev dependencies for build)
npm ci

# Build for production
NODE_ENV=production npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Or reload if already running
pm2 reload leikapui-sales-dashboard
```

### PM2 Management Commands

```bash
# View logs
pm2 logs leikapui-sales-dashboard

# Monitor processes
pm2 monit

# Stop the application
pm2 stop leikapui-sales-dashboard

# Restart the application
pm2 restart leikapui-sales-dashboard

# View all processes
pm2 list

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## API Endpoints

The dashboard connects to the following API endpoints:

- `GET /api/dashboard/overview` - Sales statistics
- `GET /api/dashboard/chart-data` - Chart data for trends
- `GET /api/dashboard/top-movies` - Top selling movies
- `GET /api/dashboard/recent-transactions` - Recent transactions
- `GET /api/dashboard/comparison` - Transaction vs purchase comparison

## Build Output

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      10 kB         110 kB
└ ○ /_not-found                            123 B        99.7 kB
```

## Tech Stack

- **Framework**: Next.js 15.4.5
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: JWT with separate dashboard tokens
- **API**: Express.js backend
- **Database**: MongoDB with Mongoose
- **Process Manager**: PM2
- **Port**: 3001 (Production)

## Security

- Separate authentication system from OTT app
- Dashboard-specific JWT tokens
- Admin-only access with role-based permissions
- Environment-specific API endpoints
