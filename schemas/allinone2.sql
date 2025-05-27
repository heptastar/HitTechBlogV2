-- all tables and indices can be done with command individually for remote and local: 
-- npx wrangler d1 execute htbblogd1imgpgdb250527 --remote --file schemas/allinone2.sql
-- npx wrangler d1 execute htbblogd1imgpgdb250527 --file schemas/allinone2.sql

-- ---------------------------------------  vvvv users table vvvv 

-- SQL schema for user authentication in Cloudflare D1
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  userrank INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups during login
CREATE INDEX idx_users_email ON users(email);

-- ---------------------------------------  vvvv posttb table vvvv 

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

-- ---------------------------------------  vvvv commenttb and indices vvvv
CREATE TABLE commenttb (id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER NOT NULL,content TEXT NOT NULL,user_id INTEGER,commenter_name TEXT,commenter_email TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,status TEXT DEFAULT 'published',FOREIGN KEY (post_id) REFERENCES posttb(id));

CREATE INDEX idx_commenttb_post_id ON commenttb(post_id);
CREATE INDEX idx_commenttb_status ON commenttb(status);

-- ---------------------------------------  vvvv search index vvvv

CREATE VIRTUAL TABLE IF NOT EXISTS posttb_fts USING FTS5(title,content, category,content='posttb',content_rowid='id',tokenize='unicode61');

CREATE TRIGGER IF NOT EXISTS posttb_ai AFTER INSERT ON posttb BEGIN INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;

CREATE TRIGGER IF NOT EXISTS posttb_ad AFTER DELETE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;END;

CREATE TRIGGER IF NOT EXISTS posttb_au AFTER UPDATE ON posttb BEGIN DELETE FROM posttb_fts WHERE rowid = old.id;INSERT INTO posttb_fts(rowid, title, content, category) VALUES (new.id, new.title, new.content, new.category);END;

-- ---------------------------------------  vvvv imgtb vvvv
CREATE TABLE imgtb (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imagev TEXT,
    imagename TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
