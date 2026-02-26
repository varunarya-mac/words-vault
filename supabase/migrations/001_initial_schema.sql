-- WordVault Database Schema
-- This schema creates all necessary tables for the vocabulary learning app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Words Table
CREATE TABLE IF NOT EXISTS words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  simplified_meaning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Idioms Table
CREATE TABLE IF NOT EXISTS idioms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idiom TEXT NOT NULL,
  meaning TEXT NOT NULL,
  origin TEXT,
  examples JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  simplified_meaning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz History Table
CREATE TABLE IF NOT EXISTS quiz_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('meaning_match', 'fill_blank', 'situation_match')),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review Schedule Table (Spaced Repetition)
CREATE TABLE IF NOT EXISTS review_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type TEXT NOT NULL CHECK (item_type IN ('word', 'idiom')),
  item_id UUID NOT NULL,
  easiness_factor REAL DEFAULT 2.5,
  repetition_count INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_type, item_id)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_words_created_at ON words(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_words_tags ON words USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_idioms_created_at ON idioms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_idioms_tags ON idioms USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_review_schedule_next_review ON review_schedule(next_review_at);
CREATE INDEX IF NOT EXISTS idx_review_schedule_item ON review_schedule(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_completed_at ON quiz_history(completed_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_words_updated_at
BEFORE UPDATE ON words
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_idioms_updated_at
BEFORE UPDATE ON idioms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some default tags
INSERT INTO tags (name, color) VALUES
  ('Academic', 'purple'),
  ('Business', 'blue'),
  ('Casual', 'green'),
  ('Formal', 'indigo'),
  ('Slang', 'pink'),
  ('Technical', 'cyan')
ON CONFLICT (name) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE words IS 'Stores vocabulary words with AI-generated meanings and examples';
COMMENT ON TABLE idioms IS 'Stores idioms and phrases with meanings, origins, and examples';
COMMENT ON TABLE tags IS 'Categorization tags for words and idioms';
COMMENT ON TABLE quiz_history IS 'Records of completed quiz sessions';
COMMENT ON TABLE review_schedule IS 'Spaced repetition schedule using SM-2 algorithm';
