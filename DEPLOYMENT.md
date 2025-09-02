# 🚀 Deployment Guide - Parking Reservation System

This guide covers deploying both frontend and backend to Vercel.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/)
- [Vercel CLI](https://vercel.com/cli) installed globally
- Git repository with your code

## 🔄 Deployment Order

**Important**: Deploy backend first, then frontend with backend URL.

---

## 🎯 Backend Deployment

### 1. Deploy Backend Service

```bash
cd back-end
npm install
vercel --prod
```

### 2. Note Your Backend URL

After deployment, Vercel will provide a URL like:

```
https://your-backend-xyz.vercel.app
```

### 3. Backend Configuration

The `vercel.json` is configured for:

- Node.js serverless functions
- WebSocket support via serverless functions
- Proper routing for API endpoints
- Seed data inclusion

---

## 🎨 Frontend Deployment

### 1. Configure Environment Variables

Before deploying, update the environment variables:

```bash
# In your Vercel dashboard or via CLI
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-xyz.vercel.app/api/v1

vercel env add NEXT_PUBLIC_WS_URL
# Enter: wss://your-backend-xyz.vercel.app/api/v1/ws
```

### 2. Deploy Frontend

```bash
cd front-end
npm install
vercel --prod
```

### 3. Frontend Configuration

The `vercel.json` includes:

- Next.js optimized build
- Security headers
- SPA routing configuration
- Environment variable mapping

---

## 🔧 Environment Variables Reference

### Frontend Environment Variables

```bash
# Production (set in Vercel dashboard)
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api/v1
NEXT_PUBLIC_WS_URL=wss://your-backend.vercel.app/api/v1/ws

# Development (in .env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000/api/v1/ws
```

### Backend Environment Variables

```bash
# Production (automatic in Vercel)
NODE_ENV=production
PORT=4000
```

---

## 🧪 Post-Deployment Testing

### 1. Test Backend API

```bash
# Check backend health
curl https://your-backend.vercel.app/api/v1/master/gates

# Expected response: Array of gates
```

### 2. Test Frontend Connection

1. Visit your frontend URL
2. Check browser console for WebSocket connection
3. Test login with seeded accounts:
   - Admin: `admin/admin123`
   - Employee: `employee/emp123`

### 3. Verify Real-Time Features

1. Open two browser tabs
2. Tab 1: Gate page
3. Tab 2: Admin dashboard
4. Perform check-in in Tab 1
5. Verify live updates in Tab 2

---

## 🚨 Common Issues & Solutions

### Issue: WebSocket Connection Failed

```bash
# Solution: Check WebSocket URL format
# Ensure wss:// for HTTPS domains
# Ensure ws:// for HTTP domains
```

### Issue: API Calls Failing

```bash
# Solution: Verify environment variables
vercel env ls

# Check API URL is accessible
curl https://your-backend.vercel.app/api/v1/master/gates
```

### Issue: CORS Errors

```bash
# Solution: Backend includes CORS middleware
# Verify backend deployment is successful
# Check browser network tab for actual error
```

---

## 📊 Monitoring & Logs

### Vercel Dashboard

- **Functions**: Monitor serverless function performance
- **Analytics**: Track frontend usage and performance
- **Logs**: View deployment and runtime logs

### Debug Commands

```bash
# View frontend logs
vercel logs your-frontend-url

# View backend logs
vercel logs your-backend-url

# Check function invocations
vercel functions list
```

---

## 🔄 CI/CD Setup (Optional)

### GitHub Integration

1. Connect repository to Vercel
2. Auto-deploy on push to main branch
3. Preview deployments for pull requests

### Environment Management

```bash
# Production environment
vercel env add NEXT_PUBLIC_API_URL production

# Preview environment
vercel env add NEXT_PUBLIC_API_URL preview

# Development environment
vercel env add NEXT_PUBLIC_API_URL development
```

---

## 🔐 Security Considerations

### Frontend Security

- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to browser
- Sensitive data should be handled on backend only
- HTTPS enforced in production

### Backend Security

- CORS properly configured
- No sensitive data in client responses
- JWT tokens for authentication
- Input validation on all endpoints

---

## 📈 Performance Optimization

### Frontend

- Next.js automatic code splitting
- Turbopack for fast builds
- Static generation where possible
- Image optimization via Next.js

### Backend

- Serverless functions for auto-scaling
- In-memory data for fast access
- WebSocket connection pooling
- Efficient data structures

---

## 🆘 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check WebSocket connection in browser dev tools
5. Review Vercel documentation for Node.js deployments

---

**Last Updated**: September 2025
**Vercel Configuration**: Optimized for serverless deployment
