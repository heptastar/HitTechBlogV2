CREATE TABLE commenttb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER,
  commenter_name TEXT,
  commenter_email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'published',
  FOREIGN KEY (post_id) REFERENCES posttb(id)
);

-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE TABLE commenttb (id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER NOT NULL,content TEXT NOT NULL,user_id INTEGER,commenter_name TEXT,commenter_email TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,status TEXT DEFAULT 'published',FOREIGN KEY (post_id) REFERENCES posttb(id));"
-- Index for faster queries on post_id
-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE INDEX idx_commenttb_post_id ON commenttb(post_id);"

-- Index for status filtering
-- npx wrangler d1 execute htbdb250515 --remote --command "CREATE INDEX idx_commenttb_status ON commenttb(status);"