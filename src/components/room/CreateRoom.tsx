import { useState } from 'react';
import './Room.css';

interface CreateRoomProps {
  onSubmit: (name: string) => Promise<void>;
  loading: boolean;
  onBack: () => void;
}

export default function CreateRoom({ onSubmit, loading, onBack }: CreateRoomProps) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit(name.trim());
  };

  return (
    <div className="room-form">
      <button className="back-btn" onClick={onBack}>
        ← 返回
      </button>
      <h2>创建房间</h2>
      <p className="hint">输入你的昵称，创建后分享邀请码给 TA</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的昵称"
          maxLength={20}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !name.trim()}>
          {loading ? '创建中...' : '创建房间'}
        </button>
      </form>
    </div>
  );
}
