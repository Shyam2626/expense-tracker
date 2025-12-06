# Migration Guide - Income & Carryover Features

## Overview

This migration adds several new features to the expense tracker:

1. **Income Categories**: Convert "Salary" to "Income" with multiple categories (Salary, Stocks, Freelancing, etc.)
2. **Subcategory & Description Display**: Show subcategory and description details in the Spending by Category chart
3. **Month-to-Month Carryover**: Optional feature to carry over savings or debts from month to month
4. **New Analysis Charts**: Additional graphs for better financial analysis
5. **Year Selector Update**: Year dropdown now starts from 2025

## Database Changes

### New Tables Created:
- `income_categories`: Store different types of income sources
- `monthly_income`: Store income entries with category support (replaces monthly_salaries functionality)
- `monthly_carryover`: Store optional month-to-month carryover amounts

### Existing Tables:
- `monthly_salaries`: Kept for backward compatibility (will be deprecated)
- `expenses`: Already has subcategory and description fields
- `categories`: No changes
- `sub_categories`: No changes

## How to Apply Migration

### Step 1: Run the Migration

```bash
# If using Supabase CLI locally
supabase db push

# Or apply the migration file directly in Supabase Dashboard
# Go to SQL Editor and run the contents of:
# supabase/migrations/20251206000000_add_income_and_carryover.sql
```

### Step 2: Initialize Income Categories

After migration, each user should set up their income categories:

1. Log into the application
2. Click the Dollar Sign ($) icon in the header
3. Add income categories like:
   - Salary
   - Stocks/Investments
   - Freelancing
   - Rental Income
   - Business Income
   - Other

### Step 3: Migrate Existing Data

The migration automatically creates a "Salary" income category for existing users and migrates their salary data to the new `monthly_income` table.

## New Features

### 1. Income Management
- **Add Income**: Click "Add Income" button
- Select month, income category, and amount
- Multiple income sources per month supported

### 2. Carryover Management
- **Manage Carryover**: Click "Manage Carryover" button
- Add optional carryover amounts per month
- Positive values = savings brought forward
- Negative values = debts/overspending from previous month

### 3. Enhanced Spending View
- Click on any category in "Spending by Category" to expand
- View all expenses with:
  - Subcategory (if set)
  - Description (if provided)
  - Date
  - Amount

### 4. New Charts
- **Income vs Expenses Trend**: Line chart showing monthly trends
- **Monthly Income vs Spending**: Bar chart for month-by-month comparison

### 5. Updated Monthly Overview
Now shows:
- Income (total from all sources)
- Carryover (if any)
- Spent
- Saved (Income + Carryover - Spent)

## Component Changes

### New Components:
- `AddIncomeDialog.tsx`: Add income entries
- `IncomeCategoryManager.tsx`: Manage income categories
- `CarryoverDialog.tsx`: Manage monthly carryovers
- `TrendChart.tsx`: Income vs expenses trend line chart
- `MonthlyComparisonChart.tsx`: Monthly bar chart comparison

### Updated Components:
- `ExpenseTracker.tsx`: Main page with all new features
- `MonthlyOverview.tsx`: Shows income and carryover columns
- `SpendingChart.tsx`: Expandable categories with subcategory/description
- `YearSummary.tsx`: Shows "Total Income" instead of "Total Salary"
- `YearSelector.tsx`: Starts from 2025

### Updated Hooks:
- `useExpenseData.ts`: Fetches income, income categories, and carryovers

## Breaking Changes

⚠️ **Note**: The following props have been renamed:

### YearSummary Component
- `totalSalary` → `totalIncome`

### MonthlyOverview Component
- `salaries` → `income`
- Added: `carryovers` (required)

### SpendingChart Component
- Added: `subCategories` (required)

## Rollback

If you need to rollback:

1. The old `monthly_salaries` table is preserved
2. You can revert the component changes
3. To fully rollback, drop the new tables:

```sql
DROP TABLE IF EXISTS public.monthly_carryover CASCADE;
DROP TABLE IF EXISTS public.monthly_income CASCADE;
DROP TABLE IF EXISTS public.income_categories CASCADE;
```

## Support

For issues or questions, please check:
1. Supabase dashboard for successful migration
2. Browser console for any errors
3. Network tab to verify API calls to new tables

