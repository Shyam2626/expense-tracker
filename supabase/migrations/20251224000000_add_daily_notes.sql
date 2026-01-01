-- Create daily_notes table for general daily journaling
CREATE TABLE IF NOT EXISTS daily_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, note_date)
);

-- Enable RLS
ALTER TABLE daily_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_notes
CREATE POLICY "Users can view their own daily notes"
  ON daily_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily notes"
  ON daily_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily notes"
  ON daily_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily notes"
  ON daily_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_daily_notes_user_date ON daily_notes(user_id, note_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_note_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER daily_note_updated_at
  BEFORE UPDATE ON daily_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_note_updated_at();

