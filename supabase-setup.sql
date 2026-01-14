-- 感情加温器 - Supabase 数据库初始化脚本
-- 在 Supabase 控制台的 SQL Editor 中运行此脚本

-- 1. 创建 rooms 表（房间）
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code VARCHAR(6) UNIQUE NOT NULL,
  creator_name VARCHAR(50) NOT NULL,
  partner_name VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 records 表（记录）
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  author_role VARCHAR(10) NOT NULL CHECK (author_role IN ('creator', 'partner')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_rooms_invite_code ON rooms(invite_code);
CREATE INDEX IF NOT EXISTS idx_records_room_id ON records(room_id);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at DESC);

-- 4. 启用 Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略（允许匿名访问）
-- rooms 表策略
CREATE POLICY "Allow all operations on rooms" ON rooms
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- records 表策略
CREATE POLICY "Allow all operations on records" ON records
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. 启用实时订阅（Realtime）
-- 需要在 Supabase 控制台 Database > Replication 中开启 records 表的 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE records;

-- 完成！
-- 接下来请在 .env.local 文件中配置你的 Supabase URL 和 Anon Key
