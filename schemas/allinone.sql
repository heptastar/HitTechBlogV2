-- used to execute sql on local machine for users table
npx wrangler d1 execute htbblogd1imgpgdb250520 --file schemas/schema.sql

-- used to execute sql on remote Cloudflare D1 for users table
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --file schemas/schema.sql

-- used to execute sql on local and remote database for posttb table
npx wrangler d1 execute htbblogd1imgpgdb250520 --file schemas/post.sql
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --file schemas/post.sql

-- used to create commenttb table for blog post's comment on remote database
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE TABLE commenttb (id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER NOT NULL,content TEXT NOT NULL,user_id INTEGER,commenter_name TEXT,commenter_email TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,status TEXT DEFAULT 'published',FOREIGN KEY (post_id) REFERENCES posttb(id));"

-- used to create commenttb table for blog post's comment on local database
npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE TABLE commenttb (id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER NOT NULL,content TEXT NOT NULL,user_id INTEGER,commenter_name TEXT,commenter_email TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,status TEXT DEFAULT 'published',FOREIGN KEY (post_id) REFERENCES posttb(id));"

-- used to create index for faster queries on post_id on remote db
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE INDEX idx_commenttb_post_id ON commenttb(post_id);"

-- used to create index for faster queries on post_id on local db
npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE INDEX idx_commenttb_post_id ON commenttb(post_id);"

-- Index for status filtering for remote db
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE INDEX idx_commenttb_status ON commenttb(status);"

-- Index for status filtering for local db
npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE INDEX idx_commenttb_status ON commenttb(status);"

-- Create a virtual table using FTS5 extension for full-text search
-- This table will index the title, content, and category fields from posttb
-- used to create virtual tables for remote and local db
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE VIRTUAL TABLE IF NOT EXISTS posttb_fts USING FTS5(title,content, category,content='posttb',content_rowid='id',tokenize='unicode61');"

npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE VIRTUAL TABLE IF NOT EXISTS posttb_fts USING FTS5(title,content, category,content='posttb',content_rowid='id',tokenize='unicode61');"

-- Create triggers to keep the FTS index in sync with the posttb table
-- Trigger for INSERT operations
-- the following commands are used for remote and local dbs
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE TRIGGER IF NOT EXISTS posttb_ai AFTER INSERT ON posttb BEGIN INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;"

npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE TRIGGER IF NOT EXISTS posttb_ai AFTER INSERT ON posttb BEGIN INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;"

-- Trigger for DELETE operations
-- the following commands are used for remote and local dbs
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE TRIGGER IF NOT EXISTS posttb_ad AFTER DELETE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;END;"

npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE TRIGGER IF NOT EXISTS posttb_ad AFTER DELETE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;END;"

-- Trigger for UPDATE operations
-- the following commands are used for remote and local dbs
npx wrangler d1 execute htbblogd1imgpgdb250520 --remote --command "CREATE TRIGGER IF NOT EXISTS posttb_au AFTER UPDATE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;"

npx wrangler d1 execute htbblogd1imgpgdb250520 --command "CREATE TRIGGER IF NOT EXISTS posttb_au AFTER UPDATE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;"