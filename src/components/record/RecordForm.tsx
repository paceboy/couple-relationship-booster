import { useState } from 'react';
import './Record.css';

interface RecordFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

const QUICK_TAGS = ['做饭', '洗碗', '打扫', '买礼物', '按摩', '陪伴', '接送', '做家务'];

export default function RecordForm({ onSubmit, onCancel }: RecordFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(content.trim());
    } finally {
      setSubmitting(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setContent((prev) => {
      if (prev) return prev + '、' + tag;
      return tag;
    });
  };

  return (
    <div className="record-form-container">
      <div className="record-form-header">
        <button className="cancel-btn" onClick={onCancel}>
          取消
        </button>
        <h2>记录一件事</h2>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!content.trim() || submitting}
        >
          {submitting ? '...' : '完成'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天我为 TA 做了..."
          maxLength={200}
          rows={4}
          autoFocus
        />

        <div className="quick-tags">
          <p className="tags-label">快捷标签</p>
          <div className="tags-list">
            {QUICK_TAGS.map((tag) => (
              <button key={tag} type="button" onClick={() => handleTagClick(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
