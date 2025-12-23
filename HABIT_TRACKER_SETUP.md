# 🎯 Habit Tracker Setup Guide

## Database Migration

Run this SQL migration in your Supabase SQL Editor:

```sql
-- File: supabase/migrations/20251223000000_add_habit_tracker.sql
-- Copy and paste the entire content from this file into Supabase SQL Editor
```

**Location**: `supabase/migrations/20251223000000_add_habit_tracker.sql`

## Features Implemented

### ✅ 1. Habit Categories
- Create custom habit categories
- Choose from 8 preset colors
- Add optional descriptions
- Edit and delete categories

### ✅ 2. Monthly Habit Grid
- **Checkbox (✓)**: Mark habit as completed
- **X Button**: Mark habit as NOT done (shows in red)
- Click X again to clear/remove the mark
- Sticky category column for easy scrolling
- Real-time updates

### ✅ 3. Total Column
- **✓ Count**: Shows completed habits (green)
- **✗ Count**: Shows not-done habits (red) - only if > 0
- Helps distinguish between "not tracked" and "intentionally skipped"

### ✅ 4. Analytics Dashboard
- **Overall Stats**: Total habits, completions, completion rate
- **Completion Rate by Habit**: Bar chart showing performance per habit
- **Monthly Trend**: Line chart showing completion trends
- **Best Streaks**: Horizontal bar chart of longest consecutive days
- **Habit Distribution**: Pie chart of completion distribution
- **Detailed Statistics Table**: Complete breakdown with all metrics

### ✅ 5. Navigation
- Switch between "Monthly View" and "Analytics" tabs
- Navigate between Expense Tracker and Habit Tracker
- Year selector: 2025 to current year + 1
- Month selector: Defaults to current month

## How to Use

### Step 1: Run the Migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy the content from `supabase/migrations/20251223000000_add_habit_tracker.sql`
3. Paste and run it

### Step 2: Access Habit Tracker
1. Login to your app
2. Click the "Habits" button in the header
3. Or navigate to `/habits`

### Step 3: Create Habit Categories
1. Click "Manage Categories"
2. Enter habit name (e.g., "Exercise", "Reading", "Meditation")
3. Add optional description
4. Choose a color
5. Click "Add Category"

### Step 4: Track Your Habits
1. Select year and month
2. For each day:
   - **Click checkbox (✓)**: Mark as completed
   - **Click X button**: Mark as NOT done (intentionally skipped)
   - **Leave empty**: Not tracked yet
3. View your totals in the rightmost column

### Step 5: View Analytics
1. Click "Analytics" tab
2. Review your:
   - Overall completion rate
   - Best performing habits
   - Monthly trends
   - Longest streaks
   - Detailed statistics

## Understanding the Counts

- **Empty cell**: Habit not tracked for that day
- **Green checkmark (✓)**: Habit completed
- **Red X**: Habit intentionally not done/skipped
- **Total column**:
  - ✓ X = Completed X days
  - ✗ Y = Skipped Y days (only shown if > 0)

## Tips

1. **Use X for intentional skips**: If you decide not to do a habit (rest day, sick, etc.), mark it with X to distinguish from "forgot to track"
2. **Review analytics monthly**: Check which habits need more focus
3. **Set realistic goals**: Start with 2-3 habits, then add more
4. **Track consistently**: Better to track daily than to backfill later

## Navigation Between Features

- **From Expenses → Habits**: Click "Habits" button in header
- **From Habits → Expenses**: Click "Expenses" button in header

## Database Tables

### `habit_categories`
- Stores your custom habit categories
- Each category has a name, color, and optional description

### `habit_entries`
- Stores daily habit tracking
- Each entry has: date, category, completed status (true/false)
- `completed = true`: Done ✓
- `completed = false`: Not done ✗
- No entry: Not tracked yet

## Future Enhancements (Optional)

- [ ] Add notes to individual habit entries
- [ ] Set habit goals (e.g., "5 times per week")
- [ ] Habit reminders/notifications
- [ ] Export habit data to CSV
- [ ] Habit templates/presets
- [ ] Weekly/monthly habit summaries via email

---

**Need help?** Check the code in:
- `src/pages/HabitTracker.tsx` - Main page
- `src/components/habits/` - All habit components
- `src/hooks/useHabitData.ts` - Data fetching logic

