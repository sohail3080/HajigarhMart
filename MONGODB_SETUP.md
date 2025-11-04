# MongoDB Atlas Setup Guide

## 🔴 Fixing "buffering timed out" Error

This error means your application **cannot connect to MongoDB**. Follow these steps:

---

## ✅ **Step 1: Whitelist Vercel IPs (MOST IMPORTANT)**

1. Go to **MongoDB Atlas:** https://cloud.mongodb.com
2. Select your cluster
3. Click **"Network Access"** (left sidebar)
4. Click **"+ ADD IP ADDRESS"** button
5. Click **"ALLOW ACCESS FROM ANYWHERE"**
6. Confirm `0.0.0.0/0` is added
7. Click **"Confirm"**
8. **Wait 2-3 minutes** for changes to propagate

**Why?** Vercel serverless functions use dynamic IPs, so you need to allow all IPs.

---

## ✅ **Step 2: Create Database User**

1. Click **"Database Access"** (left sidebar)
2. Click **"+ ADD NEW DATABASE USER"**
3. Authentication Method: **Password**
4. Username: `hajigarhuser` (or your choice)
5. Password: Create a **strong password** (no special characters: `@`, `:`, `/`)
6. Database User Privileges: **"Atlas admin"** OR **"Read and write to any database"**
7. Click **"Add User"**
8. **Wait 2-3 minutes**

---

## ✅ **Step 3: Get Correct Connection String**

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **4.1 or later**
6. Copy the connection string

**Example:**
```
mongodb+srv://hajigarhuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ✅ **Step 4: Format Connection String Correctly**

Replace `<password>` and add database name:

**Before:**
```
mongodb+srv://hajigarhuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://hajigarhuser:YourActualPassword@cluster0.xxxxx.mongodb.net/hajigarhmart?retryWrites=true&w=majority
```

**Important:**
- ✅ Remove `<` and `>` brackets
- ✅ Replace with actual password
- ✅ Add database name: `/hajigarhmart`
- ✅ If password has special characters, URL-encode them:
  - `@` → `%40`
  - `:` → `%3A`
  - `/` → `%2F`
  - `#` → `%23`
  - `?` → `%3F`

---

## ✅ **Step 5: Update Vercel Environment Variables**

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Find `MONGODB_URI`
4. Click **"Edit"**
5. Paste your corrected connection string
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"Redeploy"** on latest deployment

---

## ✅ **Step 6: Test Connection Locally First**

Before deploying, test locally:

1. Create `.env` file in your backend folder:
```env
MONGODB_URI=mongodb+srv://hajigarhuser:YourPassword@cluster0.xxxxx.mongodb.net/hajigarhmart?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
PORT=5000
```

2. Run locally:
```bash
npm run dev
```

3. Check console for:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: hajigarhmart
```

4. Test the API:
```bash
curl http://localhost:5000/health
```

If it works locally but not on Vercel, the issue is with IP whitelist or environment variables.

---

## 🔍 **Debugging in Vercel**

### **Check Function Logs:**

1. Vercel Dashboard → Your Project
2. **Deployments** tab
3. Click latest deployment
4. Click **"View Function Logs"**
5. Look for MongoDB connection errors

### **Common Error Messages:**

**Error: "MongoTimeoutError: Server selection timed out"**
- ❌ IP whitelist doesn't include `0.0.0.0/0`
- ❌ Cluster is paused

**Error: "Authentication failed"**
- ❌ Wrong username or password
- ❌ User doesn't have permissions

**Error: "ENOTFOUND"**
- ❌ Wrong cluster URL
- ❌ Connection string is malformed

---

## 🧪 **Test Your Connection String**

Use this Node.js script to test:

```javascript
// test-connection.js
const mongoose = require('mongoose');

const MONGODB_URI = 'your_connection_string_here';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected successfully!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  });
```

Run:
```bash
node test-connection.js
```

---

## 📋 **Complete Checklist**

Before deploying:
- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] Network Access includes `0.0.0.0/0`
- [ ] Database user exists with proper permissions
- [ ] Connection string is correct (no `<>` brackets)
- [ ] Database name is in connection string (`/hajigarhmart`)
- [ ] Password special characters are URL-encoded
- [ ] Connection works locally
- [ ] Environment variables are set in Vercel
- [ ] Latest code is deployed to Vercel

---

## 🆘 **Still Not Working?**

### **Option 1: Create Fresh Cluster**

Sometimes it's easier to start fresh:

1. MongoDB Atlas → Create new M0 (free) cluster
2. Name it: `hajigarhmart-prod`
3. Choose region closest to your users
4. Wait for cluster to be ready (5-10 minutes)
5. Set up Network Access and Database User
6. Get new connection string
7. Update Vercel environment variables

### **Option 2: Use MongoDB Connection String Generator**

Visit: https://www.mongodb.com/docs/manual/reference/connection-string/

### **Option 3: Contact Support**

- MongoDB Support: https://support.mongodb.com
- Vercel Discord: https://vercel.com/discord

---

## 💡 **Pro Tips**

1. **Use descriptive database names:** `/hajigarhmart-dev`, `/hajigarhmart-prod`
2. **Different clusters for dev/prod:** Free tier allows multiple M0 clusters
3. **Monitor your usage:** Check MongoDB Atlas metrics
4. **Set up backups:** Enable in Cloud Backup settings
5. **Create indexes:** For better query performance

---

## ✅ **Correct Connection String Format**

```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

**Example (actual values):**
```
mongodb+srv://hajigarhuser:SecurePass123@cluster0.ab1cd.mongodb.net/hajigarhmart?retryWrites=true&w=majority
```

**Parts:**
- `mongodb+srv://` - Protocol (use SRV for Atlas)
- `hajigarhuser` - Database username
- `SecurePass123` - Database password (URL-encoded if special chars)
- `cluster0.ab1cd.mongodb.net` - Your cluster URL
- `/hajigarhmart` - Database name
- `?retryWrites=true&w=majority` - Connection options

---

**Once you fix the IP whitelist, redeploy, and it should work!** 🚀


