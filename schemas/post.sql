-- SQL schema for blog posts in Cloudflare D1
CREATE TABLE posttb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Index for faster lookups by author
CREATE INDEX idx_posttb_author_id ON posttb(author_id);

-- Index for faster lookups by status
CREATE INDEX idx_posttb_status ON posttb(status);