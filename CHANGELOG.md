# Changelog - Expense Tracker Enhancement

## Version 2.0.0 - December 6, 2025

### 🎉 Major Features

#### 1. Income System (Replaces Salary)
- **Multiple Income Categories**: Now supports various income sources instead of just salary
  - Salary
  - Investments/Stocks
  - Freelancing
  - Business Income
  - Rental Income
  - And custom categories
- **Multiple Income Entries per Month**: Add different income sources for each month
- **Income Category Management**: Dedicated UI to create, view, and delete income categories

#### 2. Enhanced Expense Tracking
- **Subcategory Display**: Spending by Category chart now shows subcategories when you expand each category
- **Description Display**: View optional descriptions for each expense
- **Expandable Categories**: Click on any category to see detailed breakdown with:
  - Subcategory names
  - Expense descriptions
  - Transaction dates
  - Individual amounts

#### 3. Month-to-Month Carryover
- **Optional Carryover Feature**: Track savings or debts carried over between months
- **Flexible Values**: 
  - Positive values for savings brought forward
  - Negative values for previous month overspending
- **Monthly Tracking**: Set carryover for any month in the year
- **Visual Integration**: Carryover amounts shown in monthly overview table

#### 4. Advanced Analytics
- **Income vs Expenses Trend Chart**: Line chart showing monthly trends for:
  - Total Income
  - Total Spent
  - Amount Saved
- **Monthly Comparison Bar Chart**: Side-by-side comparison of income and expenses per month
- **Better Visual Analysis**: Easier to spot spending patterns and income fluctuations

#### 5. Improved UI/UX
- **Year Selector**: Now starts from 2025 (configurable for your data range)
- **Updated Monthly Overview**:
  - Income column (total from all sources)
  - Carryover column (optional)
  - Spent column
  - Saved column (Income + Carryover - Spent)
- **Updated Summary Cards**:
  - Total Income (instead of Total Salary)
  - Total Spent
  - Remaining balance
- **New Management Icons**:
  - Settings icon for expense categories
  - Dollar icon for income categories

### 📊 New Components

1. **AddIncomeDialog**: Add income entries with category selection
2. **IncomeCategoryManager**: Manage income categories
3. **CarryoverDialog**: Manage monthly carryover amounts
4. **TrendChart**: Line chart for income vs expenses trend
5. **MonthlyComparisonChart**: Bar chart for monthly comparison

### 🔄 Updated Components

1. **ExpenseTracker** (Main Page):
   - Added income management button
   - Added carryover management button
   - Added income category manager
   - Added new analysis charts
   - Updated to use new income system

2. **MonthlyOverview**:
   - Added Income column
   - Added Carryover column
   - Updated calculations to include carryover

3. **SpendingChart**:
   - Made categories expandable (accordion style)
   - Shows subcategory for each expense
   - Shows description for each expense
   - Shows date for each expense

4. **YearSummary**:
   - Changed "Total Salary" to "Total Income"
   - Updated calculations to include carryover

5. **YearSelector**:
   - Now starts from 2025
   - Dynamically extends to current year

### 🗄️ Database Changes

#### New Tables:
```sql
- income_categories: Store income category types
- monthly_income: Store income entries with categories
- monthly_carryover: Store optional monthly carryover amounts
```

#### Preserved Tables:
```sql
- monthly_salaries: Kept for backward compatibility
- expenses: Already had subcategory and description fields
- categories: Unchanged
- sub_categories: Unchanged
```

#### Migrations:
- `20251206000000_add_income_and_carryover.sql`: Main migration
- `20251206000001_seed_default_income_categories.sql`: Helper functions

### 🔧 Technical Improvements

1. **Type Safety**: Updated TypeScript types for all new tables
2. **Data Hook**: Enhanced `useExpenseData` hook to fetch:
   - Income entries
   - Income categories
   - Carryover data
3. **Backward Compatibility**: Old salary data automatically migrated
4. **RLS Policies**: Proper row-level security for all new tables

### 📝 Migration Notes

- Existing salary data is automatically migrated to the new income system
- A default "Salary" income category is created for existing users
- Old `monthly_salaries` table is preserved for rollback capability
- No data loss during migration

### 🎯 Usage

1. **Set Up Income Categories**:
   - Click the dollar ($) icon in the header
   - Add your income sources (Salary, Stocks, etc.)

2. **Add Income**:
   - Click "Add Income" button
   - Select month, category, and amount
   - You can add multiple income sources per month

3. **Add Expenses** (Enhanced):
   - Click "Add Expense" button
   - Select category and optional subcategory
   - Add optional description
   - View details in expandable spending chart

4. **Manage Carryover** (Optional):
   - Click "Manage Carryover" button
   - Set carryover amount for any month
   - Positive for savings, negative for debts

5. **Analyze Your Finances**:
   - View summary cards for quick overview
   - Check monthly overview table for detailed breakdown
   - Use trend chart to see patterns
   - Use bar chart for month-by-month comparison
   - Expand categories in spending chart for details

### 🚀 Performance

- All queries optimized with proper indexing
- Lazy loading for expanded expense details
- Efficient data fetching with React Query
- No performance degradation with new features

### 🐛 Bug Fixes

- Improved date handling for expenses across time zones
- Better currency formatting for large numbers
- Fixed edge cases in monthly calculations

### 📚 Documentation

- Added `MIGRATION_GUIDE.md` with detailed migration instructions
- Updated component documentation
- Added inline code comments for complex logic

---

## Breaking Changes

⚠️ **Component Prop Changes**:

If you have custom implementations, note these prop changes:

- `YearSummary`: `totalSalary` → `totalIncome`
- `MonthlyOverview`: `salaries` → `income`, added `carryovers`
- `SpendingChart`: added `subCategories` prop (required)

## Future Enhancements

Potential features for next version:
- Budget planning per category
- Recurring income/expense templates
- Export data to CSV/Excel
- Multi-year comparison charts
- Savings goals tracking
- Category-wise monthly budgets
- Email reports

---

**Full Changelog**: Comprehensive expense tracker upgrade from simple salary tracking to multi-source income management with advanced analytics.

