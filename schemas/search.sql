-- SQL schema for full-text search in Cloudflare D1 (SQLite3)

-- Create a virtual table using FTS5 extension for full-text search
-- This table will index the title, content, and category fields from posttb
CREATE VIRTUAL TABLE IF NOT EXISTS posttb_fts USING FTS5(
  title,
  content, 
  category,
  content='posttb',
  content_rowid='id',
  tokenize='unicode61'
);

-- Create triggers to keep the FTS index in sync with the posttb table

-- Trigger for INSERT operations
CREATE TRIGGER IF NOT EXISTS posttb_ai AFTER INSERT ON posttb BEGIN
  INSERT INTO posttb_fts(rowid, title, content, category) 
  VALUES (new.id, new.title, new.content, new.category);
END;

-- Trigger for DELETE operations
CREATE TRIGGER IF NOT EXISTS posttb_ad AFTER DELETE ON posttb BEGIN
  DELETE FROM posttb_fts WHERE rowid = old.id;
END;

-- Trigger for UPDATE operations
CREATE TRIGGER IF NOT EXISTS posttb_au AFTER UPDATE ON posttb BEGIN
  DELETE FROM posttb_fts WHERE rowid = old.id;
  INSERT INTO posttb_fts(rowid, title, content, category) 
  VALUES (new.id, new.title, new.content, new.category);
END;

-- Example query to search posts (to be used in API endpoints):
-- SELECT p.* FROM posttb p
-- JOIN posttb_fts fts ON p.id = fts.rowid
-- WHERE posttb_fts MATCH 'search term'
-- ORDER BY rank;

-- -- command for the previous commands:
-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE VIRTUAL TABLE IF NOT EXISTS posttb_fts USING FTS5(title,content, category,content='posttb',content_rowid='id',tokenize='unicode61');"


-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE TRIGGER IF NOT EXISTS posttb_ai AFTER INSERT ON posttb BEGIN INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;"


-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE TRIGGER IF NOT EXISTS posttb_ad AFTER DELETE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;END;"


-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE TRIGGER IF NOT EXISTS posttb_au AFTER UPDATE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;"