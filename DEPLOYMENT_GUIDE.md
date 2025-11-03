# Deployment Guide - HajigarhMart Backend

## 🚀 Deploying to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas account (for cloud database)

---

## ⚠️ Important: Vercel Limitations for Backend APIs

**Vercel is primarily designed for frontend/JAMstack apps.** For backend APIs, there are some limitations:

### Limitations:
- ⏱️ **10-second timeout** on Hobby (free) plan
- 🔄 **Cold starts** - First request after inactivity is slower
- 📦 **50MB deployment size limit**
- 💾 **No persistent file storage** - Files uploaded won't persist
- 🔌 **Serverless architecture** - Not ideal for long-running processes

### ✅ **Better Alternatives for Backend:**
1. **Render** - https://render.com (Free tier, great for backends)
2. **Railway** - https://railway.app (Free $5 credit/month)
3. **Fly.io** - https://fly.io (Free tier available)
4. **DigitalOcean App Platform** - https://www.digitalocean.com/products/app-platform

---

## 📋 Step-by-Step Vercel Deployment

### Step 1: Set Up MongoDB Atlas

1. Go to https://mongodb.com/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0` (for Vercel serverless)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hajigarhmart
   ```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/hajigarhmart-backend.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

### Step 4: Set Environment Variables

In Vercel dashboard, add these environment variables:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
PORT=5000
```

### Step 5: Deploy

Click "Deploy" and wait for deployment to complete.

Your API will be available at: `https://your-project-name.vercel.app/api`

---

## 🧪 Testing Your Deployed API

```bash
# Health check
curl https://your-project-name.vercel.app/health

# Register user
curl -X POST https://your-project-name.vercel.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "customer"
  }'
```

---

## 🔧 Troubleshooting

### Issue: "Function execution timed out"
**Solution:** Optimize your queries or upgrade to Vercel Pro plan ($20/month for 60s timeout)

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string is correct
- Ensure database user has proper permissions

### Issue: "Module not found"
**Solution:** 
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Issue: Cold starts are slow
**Solution:** 
- Consider using a paid plan
- Or migrate to Render/Railway for better performance

---

## 📊 Alternative: Deploy to Render (Recommended)

Render is better suited for backend APIs:

### Render Deployment Steps:

1. **Create Render Account:** https://render.com
2. **Create New Web Service**
3. **Connect GitHub Repository**
4. **Configure:**
   - **Name:** hajigarhmart-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Plan:** Free

5. **Add Environment Variables** (same as Vercel)

6. **Deploy!**

**Advantages:**
- ✅ No timeout limits on free tier
- ✅ Better suited for APIs
- ✅ Persistent deployments
- ✅ Automatic SSL
- ✅ Easy to scale

Your API will be at: `https://hajigarhmart-backend.onrender.com/api`

---

## 🚀 Alternative: Deploy to Railway (Also Recommended)

Railway is excellent for full-stack apps:

### Railway Deployment Steps:

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize:**
   ```bash
   railway init
   ```

4. **Add MongoDB Plugin:**
   ```bash
   railway add --plugin mongodb
   ```
   This automatically creates and connects a MongoDB instance!

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Add Environment Variables:**
   ```bash
   railway variables set JWT_SECRET=your_secret_here
   railway variables set JWT_EXPIRE=30d
   ```

7. **Get URL:**
   ```bash
   railway domain
   ```

**Advantages:**
- ✅ Free $5 credit/month
- ✅ One-click MongoDB
- ✅ Automatic HTTPS
- ✅ Great for monorepos
- ✅ Built-in metrics

---

## 📱 Update Your Expo Frontend

After deployment, update your frontend API base URL:

```javascript
// config/api.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  __DEV__ 
    ? 'http://localhost:5000/api' 
    : 'https://your-backend-url.vercel.app/api';

export default API_BASE_URL;
```

---

## 🔒 Production Checklist

Before going live:
- [ ] Use strong JWT_SECRET (generate with: `openssl rand -base64 32`)
- [ ] Set up MongoDB Atlas with proper security
- [ ] Enable MongoDB Atlas backup
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CORS for your frontend domain
- [ ] Set up rate limiting
- [ ] Enable database indexes
- [ ] Test all API endpoints
- [ ] Set up CI/CD (optional)
- [ ] Configure custom domain (optional)

---

## 💡 My Recommendation

For your rural e-commerce platform with real-time delivery tracking:

**Best Choice: Railway or Render**
- More reliable for backend APIs
- Better for WebSocket connections (future)
- No timeout issues
- Free tier is sufficient to start

**Use Vercel for:** Your Expo Web version (frontend only)

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

Good luck with your deployment! 🚀

