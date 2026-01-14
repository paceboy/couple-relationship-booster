import { useState } from 'react';
import './Room.css';

interface JoinRoomProps {
  onSubmit: (code: string, name: string) => Promise<void>;
  loading: boolean;
  onBack: () => void;
}

export default function JoinRoom({ onSubmit, loading, onBack }: JoinRoomProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    await onSubmit(code.trim().toUpperCase(), name.trim());
  };

  return (
    <div className="room-form">
      <button className="back-btn" onClick={onBack}>
        ← 返回
      </button>
      <h2>加入房间</h2>
      <p className="hint">输入 TA 分享给你的邀请码</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="输入6位邀请码"
          maxLength={6}
          disabled={loading}
          className="invite-code-input"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的昵称"
          maxLength={20}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !code.trim() || !name.trim()}>
          {loading ? '加入中...' : '加入房间'}
        </button>
      </form>
    </div>
  );
}
