# GitHub Pages Deployment - Step by Step

## 🚀 Quick Setup Guide (5 Minutes)

Follow these steps **exactly** to deploy your expense tracker to GitHub Pages.

---

## Step 1: Configure GitHub Secrets

### 1.1 Get Your Supabase Credentials

1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `pntcpkkpqvwkandyepzj`
3. Go to **Settings** (⚙️ icon in left sidebar) → **API**
4. Copy these two values:
   - **Project URL** (e.g., `https://pntcpkkpqvwkandyepzj.supabase.co`)
   - **anon public** key (long string starting with `eyJhbGc...`)

### 1.2 Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/Shyam2626/expense-tracker

2. Click **Settings** tab (top right)

3. In left sidebar, click **Secrets and variables** → **Actions**

4. Click **New repository secret** button

5. Add **First Secret**:

   - **Name**: `VITE_SUPABASE_URL`
   - **Secret**: Paste your Project URL (e.g., `https://pntcpkkpqvwkandyepzj.supabase.co`)
   - Click **Add secret**

6. Click **New repository secret** again

7. Add **Second Secret**:
   - **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Secret**: Paste your anon public key
   - Click **Add secret**

✅ **You should now have 2 secrets configured**

---

## Step 2: Enable GitHub Pages

1. Still in your repository **Settings**

2. In left sidebar, scroll down and click **Pages**

3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (not "Deploy from a branch")
4. That's it! No need to save, it auto-saves.

---

## Step 3: Trigger Deployment

### Option A: Automatic Deployment (Recommended)

The GitHub Action will automatically run when you push code. Since you just pushed:

1. Go to **Actions** tab in your repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Click on it to watch the progress
4. Wait for both "build" and "deploy" jobs to complete (green checkmarks ✓)

### Option B: Manual Deployment

If no workflow is running:

1. Go to **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow (left sidebar)
3. Click **Run workflow** button (right side)
4. Select **main** branch
5. Click **Run workflow**

---

## Step 4: Get Your Site URL

After deployment completes (2-3 minutes):

1. Go to **Settings** → **Pages**
2. At the top, you'll see: **"Your site is live at..."**
3. Your URL will be: `https://shyam2626.github.io/expense-tracker/`

🎉 **Click the URL to open your live site!**

---

## Step 5: Apply Database Migration

**IMPORTANT**: Before using the app, run the database migration:

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy the **entire contents** from your local file:
   ```
   supabase/migrations/20251206000000_add_income_and_carryover.sql
   ```
5. Paste into SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success" message

### Verify Migration:

- Go to **Database** → **Tables** in Supabase
- You should see new tables:
  - ✅ `income_categories`
  - ✅ `monthly_income`
  - ✅ `monthly_carryover`

---

## Step 6: Update Supabase Site URL

**CRITICAL**: Update authentication settings to use your GitHub Pages URL:

1. Go to **Supabase Dashboard**
2. **Settings** → **Authentication** → **URL Configuration**
3. Update **Site URL**:
   - Change from: `http://localhost:3000`
   - To: `https://shyam2626.github.io/expense-tracker/`
4. Update **Redirect URLs** - Add this line:
   ```
   https://shyam2626.github.io/expense-tracker/**
   ```
   (Keep your localhost URLs for development)
5. Click **Save**

---

## Step 7: Test Your Live Site

1. Open your site: `https://shyam2626.github.io/expense-tracker/`

2. **Test Registration**:

   - Click Sign Up
   - Enter email and password
   - Check email for confirmation link
   - ✅ Link should go to GitHub Pages URL (not localhost)

3. **Test Income Categories**:

   - Login
   - Click the **$** icon (top right)
   - Add categories: Salary, Stocks, etc.

4. **Test Adding Income**:

   - Click **Add Income**
   - Select month, category, amount
   - Click Save
   - ✅ Should appear in monthly overview

5. **Test Expenses**:
   - Add expense with subcategory and description
   - Expand category in chart
   - ✅ Should show details

---

## 📋 Complete Checklist

- [ ] Added `VITE_SUPABASE_URL` secret in GitHub
- [ ] Added `VITE_SUPABASE_PUBLISHABLE_KEY` secret in GitHub
- [ ] Enabled GitHub Pages with "GitHub Actions" source
- [ ] Workflow ran successfully (green checkmarks)
- [ ] Site is accessible at GitHub Pages URL
- [ ] Database migration applied in Supabase
- [ ] New tables visible in Supabase
- [ ] Supabase Site URL updated to GitHub Pages URL
- [ ] Redirect URLs configured in Supabase
- [ ] User registration tested (email links work)
- [ ] Income categories can be created
- [ ] Income can be added
- [ ] Expenses work with subcategories
- [ ] All charts display correctly

---

## 🔄 Future Updates

Every time you push to the `main` branch:

1. GitHub Actions automatically builds
2. Deploys to GitHub Pages
3. Your site updates in 2-3 minutes

**No manual steps needed!**

---

## 🐛 Troubleshooting

### Issue: Workflow fails with "secrets not found"

**Fix**:

1. Go to Settings → Secrets and variables → Actions
2. Verify both secrets exist and names are EXACTLY:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Re-run workflow from Actions tab

### Issue: Site shows 404 or blank page

**Fix**:

1. Make sure you selected "GitHub Actions" (not "Deploy from a branch")
2. Check Actions tab - workflow should have green checkmarks
3. Wait 2-3 minutes after deployment completes
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Email confirmation links go to localhost

**Fix**:

1. Go to Supabase → Settings → Authentication → URL Configuration
2. Update "Site URL" to: `https://shyam2626.github.io/expense-tracker/`
3. Save changes

### Issue: "relation does not exist" error

**Fix**:

1. Run the migration in Supabase SQL Editor
2. Check Database → Tables to verify new tables exist

### Issue: Login works but features don't load

**Fix**:

1. Check browser console (F12) for errors
2. Verify Supabase URL and key are correct in GitHub secrets
3. Re-run deployment workflow

---

## 🎉 Success!

Once all checkboxes are complete, your expense tracker is live at:

**🔗 https://shyam2626.github.io/expense-tracker/**

Share this URL with anyone to use your expense tracker!

---

## 📞 Need Help?

1. Check **Actions** tab for deployment errors
2. Check browser **Console** (F12) for frontend errors
3. Check **Supabase Logs** for database errors
4. Review `QUICK_START.md` for feature usage

---

**Enjoy your live expense tracker!** 🚀💰📊
