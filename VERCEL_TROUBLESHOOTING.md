# Vercel Deployment Troubleshooting Guide

## 🚨 Getting 401 Authentication Required Error?

This is **Vercel's deployment protection**, not your API's authentication. Here's how to fix it:

---

## ✅ **Solution 1: Disable Deployment Protection**

### **Step-by-Step:**

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select your project** (hajigarhmart-backend)
3. Click **Settings** (top navigation)
4. Click **Deployment Protection** (left sidebar)
5. Under "Protection Level":
   - Select **"Standard Protection"** (recommended for free tier)
   - OR select **"Disabled"** for completely public access
6. Click **Save**
7. **Important:** Go to **Deployments** tab and click **Redeploy**

---

## ✅ **Solution 2: Check Environment Variables**

Make sure you've added ALL required environment variables in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add these (if missing):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hajigarhmart
JWT_SECRET=your_super_secure_secret_key_here
JWT_EXPIRE=30d
PORT=5000
```

3. Click **Save**
4. **Redeploy** your project

---

## 🧪 **Testing After Fix**

### **Test 1: Root Endpoint**
```bash
curl https://your-project.vercel.app/
```

**Expected Response:**
```json
{
  "message": "HajigarhMart Backend API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/health",
    "api": "/api",
    "documentation": "See README.md"
  }
}
```

### **Test 2: Health Check**
```bash
curl https://your-project.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### **Test 3: Register User**
```bash
curl -X POST https://your-project.vercel.app/api/users/register \
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

## 🔍 **Other Common Vercel Issues**

### **Issue 1: 404 Not Found**
**Cause:** Incorrect URL or route not defined
**Solution:** 
- Check you're using the correct path: `/api/users/register` not `/register`
- Verify `vercel.json` exists and is correct

### **Issue 2: 500 Internal Server Error**
**Cause:** Server crash or MongoDB connection failure
**Solution:**
1. Check Vercel logs: Dashboard → Your Project → Deployments → Click latest → View Function Logs
2. Common causes:
   - MongoDB connection string incorrect
   - Missing environment variables
   - MongoDB Atlas IP whitelist doesn't include `0.0.0.0/0`

### **Issue 3: CORS Error**
**Cause:** Frontend can't access backend due to CORS
**Solution:**
- Add your frontend URL to Vercel environment variables:
  ```
  FRONTEND_URL=https://your-frontend.vercel.app
  ```
- Redeploy

### **Issue 4: Timeout Error (10 seconds)**
**Cause:** Vercel free tier has 10-second timeout
**Solution:**
- Optimize your queries
- OR upgrade to Vercel Pro ($20/month for 60s timeout)
- OR migrate to Render/Railway (recommended)

### **Issue 5: MongoDB Connection Issues**
**Cause:** Cannot connect to MongoDB Atlas
**Solution:**
1. **Check IP Whitelist:**
   - Go to MongoDB Atlas
   - Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)

2. **Check Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/hajigarhmart
   ```
   - Replace `<username>` and `<password>` with actual values
   - No angle brackets in actual string

3. **Check Database User:**
   - MongoDB Atlas → Database Access
   - Ensure user has "Read and Write" permissions

---

## 📊 **View Vercel Logs**

To debug issues:

1. Go to Vercel Dashboard
2. Click your project
3. Click **Deployments** tab
4. Click on the latest deployment
5. Click **View Function Logs**
6. Look for error messages

---

## 🔄 **Redeploy After Changes**

**Method 1: Via GitHub**
```bash
git add .
git commit -m "Fix deployment issues"
git push
```
Vercel will auto-redeploy.

**Method 2: Manual Redeploy**
1. Vercel Dashboard → Your Project
2. Deployments tab
3. Click "..." on latest deployment
4. Click "Redeploy"

---

## 🎯 **Quick Checklist**

Before deployment, ensure:
- [ ] `vercel.json` exists in root
- [ ] MongoDB Atlas is set up
- [ ] MongoDB IP whitelist includes `0.0.0.0/0`
- [ ] All environment variables are set in Vercel
- [ ] Deployment Protection is disabled or set to Standard
- [ ] Code is pushed to GitHub
- [ ] Latest commit is deployed

---

## 🆘 **Still Having Issues?**

### **Check These Common Mistakes:**

1. ❌ **Wrong URL:** Using `http://` instead of `https://`
2. ❌ **Missing `/api`:** Calling `/users/register` instead of `/api/users/register`
3. ❌ **Old deployment:** Browser cache - try incognito mode
4. ❌ **Wrong method:** Using GET instead of POST
5. ❌ **Missing headers:** Not including `Content-Type: application/json`

### **Get Help:**
1. Check Vercel Function Logs (most important!)
2. Test locally first: `npm run dev`
3. Compare local vs production behavior
4. Check MongoDB Atlas logs

---

## 💡 **Pro Tip: Use Postman/Thunder Client**

Instead of curl, use a proper API client:

**Postman:**
1. Create new request
2. Method: POST
3. URL: `https://your-project.vercel.app/api/users/register`
4. Headers: `Content-Type: application/json`
5. Body: Raw JSON
6. Send

This gives you better error messages and debugging info.

---

## 🚀 **Alternative: Deploy to Render**

If Vercel is giving too many issues, consider Render:

```bash
# It's much simpler for backend APIs!
1. Push to GitHub
2. Go to Render.com
3. New → Web Service
4. Connect GitHub repo
5. Add environment variables
6. Deploy!
```

**No authentication issues, no timeouts, just works!** ✅

---

## 📞 Support

- Vercel Discord: https://vercel.com/discord
- Render Discord: https://discord.gg/render
- MongoDB Support: https://support.mongodb.com

---

**Good luck with your deployment!** 🚀


