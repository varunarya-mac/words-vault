-- Migration: Add user authentication and Row Level Security
-- This migration adds user_id to all tables and enables RLS for multi-user support

-- ============================================
-- ADD user_id COLUMN TO ALL TABLES
-- ============================================

-- Add user_id to words table
ALTER TABLE words ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to idioms table
ALTER TABLE idioms ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to tags table
ALTER TABLE tags ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- Remove unique constraint on name (allow same tag name for different users)
ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_name_key;
-- Add unique constraint per user
ALTER TABLE tags ADD CONSTRAINT tags_name_user_unique UNIQUE (name, user_id);

-- Add user_id to quiz_history table
ALTER TABLE quiz_history ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to review_schedule table
ALTER TABLE review_schedule ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- Update unique constraint to include user_id
ALTER TABLE review_schedule DROP CONSTRAINT IF EXISTS review_schedule_item_type_item_id_key;
ALTER TABLE review_schedule ADD CONSTRAINT review_schedule_user_item_unique UNIQUE (user_id, item_type, item_id);

-- ============================================
-- ADD INDEXES FOR user_id
-- ============================================

CREATE INDEX IF NOT EXISTS idx_words_user_id ON words(user_id);
CREATE INDEX IF NOT EXISTS idx_idioms_user_id ON idioms(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_review_schedule_user_id ON review_schedule(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE idioms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_schedule ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES FOR WORDS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own words" ON words;
CREATE POLICY "Users can view their own words" ON words
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own words" ON words;
CREATE POLICY "Users can insert their own words" ON words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own words" ON words;
CREATE POLICY "Users can update their own words" ON words
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own words" ON words;
CREATE POLICY "Users can delete their own words" ON words
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CREATE RLS POLICIES FOR IDIOMS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own idioms" ON idioms;
CREATE POLICY "Users can view their own idioms" ON idioms
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own idioms" ON idioms;
CREATE POLICY "Users can insert their own idioms" ON idioms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own idioms" ON idioms;
CREATE POLICY "Users can update their own idioms" ON idioms
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own idioms" ON idioms;
CREATE POLICY "Users can delete their own idioms" ON idioms
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CREATE RLS POLICIES FOR TAGS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own tags" ON tags;
CREATE POLICY "Users can view their own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tags" ON tags;
CREATE POLICY "Users can insert their own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tags" ON tags;
CREATE POLICY "Users can update their own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tags" ON tags;
CREATE POLICY "Users can delete their own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CREATE RLS POLICIES FOR QUIZ_HISTORY
-- ============================================

DROP POLICY IF EXISTS "Users can view their own quiz history" ON quiz_history;
CREATE POLICY "Users can view their own quiz history" ON quiz_history
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz history" ON quiz_history;
CREATE POLICY "Users can insert their own quiz history" ON quiz_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own quiz history" ON quiz_history;
CREATE POLICY "Users can update their own quiz history" ON quiz_history
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own quiz history" ON quiz_history;
CREATE POLICY "Users can delete their own quiz history" ON quiz_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CREATE RLS POLICIES FOR REVIEW_SCHEDULE
-- ============================================

DROP POLICY IF EXISTS "Users can view their own review schedule" ON review_schedule;
CREATE POLICY "Users can view their own review schedule" ON review_schedule
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own review schedule" ON review_schedule;
CREATE POLICY "Users can insert their own review schedule" ON review_schedule
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own review schedule" ON review_schedule;
CREATE POLICY "Users can update their own review schedule" ON review_schedule
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own review schedule" ON review_schedule;
CREATE POLICY "Users can delete their own review schedule" ON review_schedule
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN words.user_id IS 'References the authenticated user who owns this word';
COMMENT ON COLUMN idioms.user_id IS 'References the authenticated user who owns this idiom';
COMMENT ON COLUMN tags.user_id IS 'References the authenticated user who owns this tag';
COMMENT ON COLUMN quiz_history.user_id IS 'References the authenticated user who took this quiz';
COMMENT ON COLUMN review_schedule.user_id IS 'References the authenticated user who owns this review schedule';
