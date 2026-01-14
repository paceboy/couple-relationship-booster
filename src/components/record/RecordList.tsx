import type { Record } from '../../types';
import './Record.css';

interface RecordListProps {
  records: Record[];
  creatorName: string;
  partnerName: string;
  currentRole: 'creator' | 'partner';
}

export default function RecordList({
  records,
  creatorName,
  partnerName,
  currentRole,
}: RecordListProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  const getName = (role: 'creator' | 'partner') => {
    if (role === currentRole) return '我';
    return role === 'creator' ? creatorName : partnerName;
  };

  if (records.length === 0) {
    return (
      <div className="record-list empty">
        <p>还没有记录，快来添加第一条吧！</p>
      </div>
    );
  }

  return (
    <div className="record-list">
      <h3>最近记录</h3>
      <ul>
        {records.slice(0, 20).map((record) => (
          <li
            key={record.id}
            className={`record-item ${record.author_role === currentRole ? 'self' : 'other'}`}
          >
            <div className="record-author">{getName(record.author_role)}</div>
            <div className="record-content">{record.content}</div>
            <div className="record-time">{formatTime(record.created_at)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
