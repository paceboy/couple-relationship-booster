import { useState } from 'react';
import type { Record } from '../../types';
import './Record.css';

interface RecordListProps {
  records: Record[];
  creatorName: string;
  partnerName: string;
  currentRole: 'creator' | 'partner';
  onDelete?: (recordId: string) => Promise<void>;
  onUpdate?: (recordId: string, content: string) => Promise<Record>;
}

export default function RecordList({
  records,
  creatorName,
  partnerName,
  currentRole,
  onDelete,
  onUpdate,
}: RecordListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleEdit = (record: Record) => {
    setEditingId(record.id);
    setEditContent(record.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim() || !onUpdate) return;

    setIsSubmitting(true);
    try {
      await onUpdate(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!onDelete) return;

    if (!confirm('确定要删除这条记录吗？')) return;

    try {
      await onDelete(recordId);
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
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
        {records.slice(0, 20).map((record) => {
          const isOwn = record.author_role === currentRole;
          const isEditing = editingId === record.id;

          return (
            <li
              key={record.id}
              className={`record-item ${isOwn ? 'self' : 'other'}`}
            >
              <div className="record-header">
                <div className="record-author">{getName(record.author_role)}</div>
                {isOwn && !isEditing && (
                  <div className="record-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(record)}
                      title="编辑"
                    >
                      编辑
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(record.id)}
                      title="删除"
                    >
                      删除
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button
                      className="cancel-edit-btn"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      取消
                    </button>
                    <button
                      className="save-edit-btn"
                      onClick={handleSaveEdit}
                      disabled={isSubmitting || !editContent.trim()}
                    >
                      {isSubmitting ? '保存中...' : '保存'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="record-content">{record.content}</div>
              )}

              <div className="record-time">{formatTime(record.created_at)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
