// 房间类型
export interface Room {
  id: string;
  invite_code: string;
  creator_name: string;
  partner_name: string | null;
  created_at: string;
}

// 记录类型
export interface Record {
  id: string;
  room_id: string;
  author_role: 'creator' | 'partner';
  content: string;
  created_at: string;
}

// 正字统计
export interface ZhengCount {
  complete: number;  // 完整的正字数量
  strokes: number;   // 剩余笔画数（0-4）
  total: number;     // 总记录数
}

// 用户角色
export type UserRole = 'creator' | 'partner';
