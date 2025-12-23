-- Create habit_categories table
CREATE TABLE IF NOT EXISTS habit_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create habit_entries table (daily tracking)
CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES habit_categories(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category_id, entry_date)
);

-- Enable RLS
ALTER TABLE habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habit_categories
CREATE POLICY "Users can view their own habit categories"
  ON habit_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit categories"
  ON habit_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit categories"
  ON habit_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit categories"
  ON habit_categories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for habit_entries
CREATE POLICY "Users can view their own habit entries"
  ON habit_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit entries"
  ON habit_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit entries"
  ON habit_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit entries"
  ON habit_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_habit_entries_user_date ON habit_entries(user_id, entry_date);
CREATE INDEX idx_habit_entries_category ON habit_entries(category_id);
CREATE INDEX idx_habit_categories_user ON habit_categories(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_habit_entry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER habit_entry_updated_at
  BEFORE UPDATE ON habit_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_entry_updated_at();

