# Deployment Guide - GitHub & Supabase

## ✅ Step 1: Code is Already Pushed to GitHub

Your code has been successfully pushed to GitHub! 🎉

**Repository**: https://github.com/Shyam2626/expense-tracker.git

(Note: Repository was moved from `secure-vault-hub` to `expense-tracker`)

---

## 🗄️ Step 2: Apply Database Migration in Supabase

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on your project: `pntcpkkpqvwkandyepzj`

3. **Open SQL Editor**
   - In the left sidebar, click **SQL Editor**
   - Click **New Query**

4. **Run the Migration**
   - Copy the contents from: `supabase/migrations/20251206000000_add_income_and_carryover.sql`
   - Paste it into the SQL Editor
   - Click **Run** button
   - Wait for success message

5. **Verify Migration**
   - Go to **Database** → **Tables**
   - You should see new tables:
     - `income_categories`
     - `monthly_income`
     - `monthly_carryover`

### Option B: Using Supabase CLI

```bash
cd /Users/shyam/Documents/myprojects/secure-vault-hub
supabase db push
```

---

## 🔐 Step 3: Configure GitHub Secrets (Optional - For CI/CD)

If you want to set up automated deployments or CI/CD:

### 3.1 Get Your Supabase Credentials

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Find Your API Keys**
   - Go to **Settings** → **API**
   - You'll see:
     - **Project URL** (e.g., `https://pntcpkkpqvwkandyepzj.supabase.co`)
     - **anon public** key
     - **service_role** key (keep this secret!)

### 3.2 Add Secrets to GitHub

1. **Go to Your GitHub Repository**
   - Visit: https://github.com/Shyam2626/expense-tracker

2. **Navigate to Settings**
   - Click **Settings** tab
   - In left sidebar, click **Secrets and variables** → **Actions**

3. **Add Repository Secrets**
   - Click **New repository secret**
   - Add the following secrets one by one:

#### Required Secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your anon/public key | Supabase Dashboard → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Supabase Dashboard → Settings → API → service_role secret key |

**Example values:**
```
VITE_SUPABASE_URL=https://pntcpkkpqvwkandyepzj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Click "Add secret"** for each one

---

## 🚀 Step 4: Deploy Your Application

You have several deployment options:

### Option A: Deploy to Vercel (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Your Repository**
   - Click **Add New** → **Project**
   - Select `expense-tracker` repository
   - Click **Import**

3. **Configure Environment Variables**
   - In the "Configure Project" page
   - Add Environment Variables:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` = Your anon key

4. **Deploy**
   - Click **Deploy**
   - Wait for deployment to complete
   - You'll get a URL like: `https://expense-tracker-xyz.vercel.app`

5. **Update Supabase Site URL**
   - Go to Supabase Dashboard
   - Settings → Authentication → URL Configuration
   - Set **Site URL** to your Vercel URL
   - Add to **Redirect URLs**: `https://your-vercel-url.vercel.app/**`

### Option B: Deploy to Netlify

1. **Go to Netlify**
   - Visit: https://netlify.com
   - Sign in with GitHub

2. **Import Repository**
   - Click **Add new site** → **Import an existing project**
   - Select GitHub and authorize
   - Choose `expense-tracker` repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

5. **Deploy**
   - Click **Deploy site**
   - Update Supabase Site URL (as in Vercel step 5)

### Option C: Deploy to Your Own Server

```bash
# Build the project
npm run build

# Upload the 'dist' folder to your server
# Configure nginx/apache to serve the files
# Update Supabase Site URL to your domain
```

---

## 🔧 Step 5: Update Supabase Authentication Settings

After deployment, **IMPORTANT**:

1. **Go to Supabase Dashboard**
   - Settings → Authentication → URL Configuration

2. **Update Site URL**
   - Change from: `http://localhost:3000`
   - To: Your production URL (e.g., `https://your-app.vercel.app`)

3. **Add Redirect URLs**
   - Add your production URL with wildcard:
     - `https://your-app.vercel.app/**`
   - Keep localhost for development:
     - `http://localhost:8080/**`
     - `http://localhost:5173/**` (Vite default)

4. **Save Changes**

---

## ✅ Step 6: Test Your Deployment

1. **Visit Your Deployed Site**
   - Open your production URL

2. **Test User Registration**
   - Sign up with a new email
   - Check if confirmation email is sent
   - Verify email link points to production URL (not localhost)

3. **Test Income Categories**
   - Login to the app
   - Click the $ icon
   - Create income categories (Salary, Stocks, etc.)

4. **Test Adding Income**
   - Click "Add Income"
   - Add an income entry
   - Verify it appears in the monthly overview

5. **Test Adding Expenses**
   - Add expenses with subcategories and descriptions
   - Expand categories in the spending chart
   - Verify subcategories and descriptions appear

6. **Test Carryover**
   - Click "Manage Carryover"
   - Add a carryover amount
   - Verify it shows in monthly overview

7. **Test Charts**
   - Check that all charts render properly
   - Verify trend chart shows data
   - Verify comparison chart displays correctly

---

## 📋 Post-Deployment Checklist

- [ ] Migration applied successfully in Supabase
- [ ] New tables visible in Supabase dashboard
- [ ] GitHub secrets configured (if using CI/CD)
- [ ] Application deployed to production
- [ ] Environment variables set in deployment platform
- [ ] Supabase Site URL updated to production URL
- [ ] Redirect URLs configured in Supabase
- [ ] User registration tested (email links work)
- [ ] Income categories created and working
- [ ] Income entries can be added
- [ ] Expenses with subcategories work
- [ ] Carryover feature works
- [ ] All charts render correctly
- [ ] Mobile responsiveness checked

---

## 🐛 Troubleshooting

### Issue: Email links still point to localhost

**Solution**: 
- Go to Supabase → Settings → Authentication → URL Configuration
- Update "Site URL" to your production URL

### Issue: "relation does not exist" error

**Solution**: 
- Run the migration in Supabase SQL Editor
- Check if tables were created successfully

### Issue: Build fails with environment variable errors

**Solution**: 
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
- Restart the build

### Issue: CORS errors

**Solution**: 
- Add your production URL to Supabase → Settings → API → CORS

### Issue: Can't see new income categories option

**Solution**: 
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

---

## 🔄 Continuous Deployment Setup (Optional)

If you want automatic deployments on every push:

### For Vercel:
- Vercel automatically deploys on every push to `main` branch
- No additional setup needed

### For Netlify:
- Netlify automatically deploys on every push to `main` branch
- No additional setup needed

### For GitHub Actions:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
        run: npm run build
        
      # Add your deployment steps here (Vercel, Netlify, etc.)
```

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Verify all environment variables are set correctly
4. Check that migration was applied successfully
5. Review the `QUICK_START.md` for feature usage

---

## 🎉 Success!

Once all steps are complete, your enhanced expense tracker is live and ready to use!

**Key Features Now Available:**
- ✅ Multiple income sources with categories
- ✅ Detailed expense tracking with subcategories
- ✅ Month-to-month carryover
- ✅ Advanced analytics charts
- ✅ Production-ready authentication

Enjoy your new expense tracker! 🚀

