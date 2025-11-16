# 🚀 Deployment Guide - Auctra

Complete guide for deploying Auctra to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain name configured
- [ ] Backup strategy in place
- [ ] Monitoring tools set up

---

## 🗄️ Database Deployment

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select region closest to your users
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Add new database user
   - Save username and password

4. **Setup Network Access**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs for security

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Backend .env**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auctra_db?retryWrites=true&w=majority
```

### Option 2: MongoDB on Railway

1. Create new MongoDB service in Railway
2. Copy connection string from variables
3. Update .env with Railway MongoDB URI

### Option 3: DigitalOcean MongoDB

1. Create MongoDB cluster
2. Add trusted sources
3. Download CA certificate (if needed)
4. Configure connection string

---

## 🖥️ Backend Deployment

### Option 1: Railway (Easiest)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize Project**
```bash
cd backend
railway init
```

4. **Add Environment Variables**
```bash
railway variables set MONGODB_URI=your-mongodb-uri
railway variables set JWT_SECRET=your-secret
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend.com
```

5. **Deploy**
```bash
railway up
```

6. **Get URL**
```bash
railway domain
```

### Option 2: Render

1. **Create Account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect GitHub repository
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**
   Add all variables from `.env.example`

4. **Deploy**
   Automatic on git push

### Option 3: DigitalOcean App Platform

1. **Create App**
```bash
doctl apps create --spec app.yaml
```

2. **app.yaml**
```yaml
name: auctra-backend
services:
  - name: api
    github:
      repo: your-username/auctra
      branch: main
      deploy_on_push: true
    source_dir: /backend
    build_command: npm install
    run_command: npm start
    envs:
      - key: DB_HOST
        value: ${db.HOSTNAME}
      - key: DB_USER
        value: ${db.USERNAME}
      - key: DB_PASSWORD
        value: ${db.PASSWORD}
      - key: DB_NAME
        value: ${db.DATABASE}
      - key: JWT_SECRET
        value: your-secret
      - key: NODE_ENV
        value: production
```

### Option 4: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create auctra-backend

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git subtree push --prefix backend heroku main
```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Configure**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://your-backend.railway.app/api",
    "VITE_SOCKET_URL": "https://your-backend.railway.app"
  }
}
```

4. **Production Deploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://your-backend.railway.app/api"
  VITE_SOCKET_URL = "https://your-backend.railway.app"
```

3. **Deploy**
```bash
cd frontend
netlify deploy --prod
```

### Option 3: Cloudflare Pages

1. **Connect GitHub**
   - Go to Cloudflare Pages dashboard
   - Connect repository

2. **Build Settings**
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `frontend`

3. **Environment Variables**
   Add in Cloudflare dashboard

### Option 4: GitHub Pages (Static)

```bash
cd frontend
npm run build

# Install gh-pages
npm install -D gh-pages

# Add to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

---

## 🔒 SSL/HTTPS Configuration

### Automatic (Recommended)
Most platforms provide automatic SSL:
- Vercel ✅
- Netlify ✅
- Railway ✅
- Render ✅

### Manual (Custom Server)

1. **Get SSL Certificate**
```bash
# Using Certbot
sudo certbot --nginx -d yourdomain.com
```

2. **Configure Nginx**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🌐 Domain Configuration

1. **Buy Domain** (Namecheap, Google Domains, etc.)

2. **Configure DNS**
```
Type    Name    Value                           TTL
A       @       your-server-ip                  3600
A       www     your-server-ip                  3600
CNAME   api     your-backend.railway.app        3600
```

3. **Update Environment Variables**
```env
FRONTEND_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

---

## 📊 Environment Variables

### Backend Production

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=super-secure-password
DB_NAME=auctra_prod
DB_PORT=3306

# JWT
JWT_SECRET=super-secure-random-string-change-this
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=5242880
```

### Frontend Production

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

---

## 🔍 Monitoring & Logging

### Option 1: Sentry (Error Tracking)

**Backend:**
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend:**
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### Option 2: LogRocket (Session Replay)

```javascript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

### Option 3: Custom Logging

**Backend:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## 📈 Performance Optimization

### Backend

1. **Enable Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

3. **Database Connection Pooling**
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  queueLimit: 0,
  // ...
});
```

### Frontend

1. **Code Splitting**
```javascript
const Home = lazy(() => import('./pages/Home'));
```

2. **Image Optimization**
```javascript
// Use WebP format
// Lazy load images
// Use CDN for static assets
```

3. **Bundle Analysis**
```bash
npm run build
npx vite-bundle-visualizer
```

---

## 🔐 Security Best Practices

### Production Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure JWT secret
- [ ] Enable CORS only for your domain
- [ ] Use environment variables
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use prepared SQL statements
- [ ] Enable helmet.js
- [ ] Set secure cookies
- [ ] Implement CSP headers
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Helmet.js Configuration

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

---

## 💾 Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mysqldump -u username -p password auctra_prod > backup_$DATE.sql

# Upload to S3
aws s3 cp backup_$DATE.sql s3://your-bucket/backups/
```

### Automated Backups

- Railway: Automatic backups
- PlanetScale: Automatic backups
- AWS RDS: Configure automated backups
- DigitalOcean: Enable daily backups

---

## 🚨 Rollback Plan

### Quick Rollback Steps

1. **Identify Issue**
```bash
# Check logs
railway logs
# or
heroku logs --tail
```

2. **Rollback Backend**
```bash
# Railway
railway rollback

# Heroku
heroku releases:rollback
```

3. **Rollback Frontend**
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

4. **Database Rollback**
```bash
# Restore from backup
mysql -u username -p database_name < backup_file.sql
```

---

## ✅ Post-Deployment Checklist

- [ ] Test all user flows
- [ ] Verify real-time features work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Verify SSL certificate
- [ ] Test payment processing (if applicable)
- [ ] Check error logging
- [ ] Monitor performance
- [ ] Verify backup system
- [ ] Test rollback procedure
- [ ] Update documentation
- [ ] Announce to users

---

## 📞 Support & Maintenance

### Monitoring Schedule
- Check error logs daily
- Review performance metrics weekly
- Update dependencies monthly
- Security audit quarterly
- Backup verification monthly

### Emergency Contacts
- DevOps team
- Database administrator
- Security team
- Customer support

---

**Your Auctra platform is now live! 🎉**

For issues or questions, refer to the troubleshooting section or contact support.
