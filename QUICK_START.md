# Quick Start Guide - Enhanced Expense Tracker

## 🚀 Getting Started with New Features

### Step 1: Apply Database Migration

Choose one of these methods:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Open and run `supabase/migrations/20251206000000_add_income_and_carryover.sql`
5. Optionally run `supabase/migrations/20251206000001_seed_default_income_categories.sql`

#### Option B: Using Supabase CLI
```bash
cd /Users/shyam/Documents/myprojects/secure-vault-hub
supabase db push
```

### Step 2: Set Up Income Categories

1. Log into your expense tracker
2. Look for the **Dollar ($) icon** in the top-right header
3. Click it to open "Manage Income Categories"
4. Add your income sources, for example:
   - Salary
   - Stocks
   - Dividends
   - Freelancing
   - Rental Income
   - Business
   - Other

💡 **Tip**: If you had existing salary data, a "Salary" category was automatically created during migration!

### Step 3: Add Your First Income Entry

1. Click the **"Add Income"** button
2. Select a month (e.g., December)
3. Choose an income category (e.g., Salary)
4. Enter the amount
5. Click "Add Income"

📝 **Note**: You can add multiple income entries per month from different sources!

Example for December:
- Salary: ₹50,000
- Freelancing: ₹15,000
- Stocks: ₹5,000
- **Total December Income**: ₹70,000

### Step 4: Add Expenses with Details

1. Click **"Add Expense"** button
2. Fill in the details:
   - **Amount**: Required (e.g., 5000)
   - **Category**: Required (e.g., Food)
   - **Sub-category**: Optional (e.g., Groceries)
   - **Description**: Optional (e.g., "Monthly grocery shopping at BigMart")
   - **Date**: Required (defaults to today)
3. Click "Add Expense"

### Step 5: View Detailed Spending Breakdown

1. Scroll to **"Spending by Category"** card
2. Click on any category to expand it
3. See all expenses with:
   - Subcategory name
   - Description
   - Date
   - Amount

This makes it easy to remember exactly where your money went!

### Step 6: (Optional) Add Carryover

If you want to track savings/debts from previous months:

1. Click **"Manage Carryover"** button
2. Select a month
3. Enter amount:
   - **Positive number**: Savings from last month (e.g., +5000)
   - **Negative number**: Overspending from last month (e.g., -2000)
4. Click "Save Carryover"

Example: You saved ₹10,000 in November, so add +10000 as December's carryover.

### Step 7: Analyze Your Finances

Now enjoy the enhanced analytics:

#### Summary Cards (Top)
- **Total Income**: All income for the year
- **Total Spent**: All expenses for the year
- **Remaining**: Income - Expenses (includes carryover)

#### Monthly Overview Table
View month-by-month breakdown:
- Income (from all sources)
- Carryover (if any)
- Spent
- Saved (Income + Carryover - Spent)

#### Spending by Category (Pie Chart)
- See percentage breakdown
- Click categories to view expense details
- View subcategories and descriptions

#### Income vs Expenses Trend (Line Chart)
- Track monthly income, spending, and savings trends
- Spot patterns over time

#### Monthly Comparison (Bar Chart)
- Side-by-side comparison of income vs spending
- Easy to see which months you overspent

## 🎯 Pro Tips

### Income Management
- ✅ Add all income sources for accurate tracking
- ✅ Update monthly as you receive income
- ✅ Create categories that match your income types

### Expense Tracking
- ✅ Always add subcategories for better tracking (e.g., Food → Groceries, Dining Out)
- ✅ Add descriptions for large expenses to remember context
- ✅ Review expanded categories monthly to spot unnecessary spending

### Carryover Feature
- ✅ Use carryover only if you want month-to-month tracking
- ✅ Perfect for rolling over savings goals
- ✅ Helps track if you borrowed from next month's budget

### Analysis
- ✅ Check trend chart to see if spending is increasing/decreasing
- ✅ Use bar chart to identify your most expensive months
- ✅ Expand pie chart categories to find specific expenses to cut

## 🔧 Troubleshooting

### "No income categories" error
**Solution**: Create at least one income category before adding income.

### Carryover not showing in table
**Solution**: Carryover only shows if you've added it for that specific month.

### Old salary data not showing
**Solution**: Check the "Income" column in monthly overview. Your salary data was migrated automatically.

### Subcategories not appearing in Add Expense
**Solution**: First create subcategories in the Category Manager (Settings icon).

## 📱 Mobile Usage

All features work on mobile! The layout adapts automatically:
- Cards stack vertically
- Charts are scrollable
- Dialogs are full-screen on small devices

## 🎨 Customization

### Change Currency
Edit this in the component files:
```typescript
currency: "INR"  // Change to USD, EUR, etc.
```

### Change Year Range
In `YearSelector.tsx`:
```typescript
const startYear = 2025;  // Change to your preferred start year
```

## 📊 Example Monthly Flow

**January 2025**:
1. Add Income:
   - Salary: ₹45,000
   - Freelancing: ₹10,000
2. Add Expenses:
   - Rent: ₹15,000 (Housing → Rent)
   - Groceries: ₹8,000 (Food → Groceries)
   - Electricity: ₹2,000 (Utilities → Electricity)
3. View Results:
   - Income: ₹55,000
   - Spent: ₹25,000
   - Saved: ₹30,000
4. Carry Forward to February:
   - Add carryover of +30,000 in February

## 🆘 Need Help?

1. Check `MIGRATION_GUIDE.md` for detailed technical info
2. Check `CHANGELOG.md` for all features and changes
3. Review the Supabase dashboard to verify migration success
4. Check browser console for any error messages

---

**Enjoy your enhanced expense tracker!** 🎉

