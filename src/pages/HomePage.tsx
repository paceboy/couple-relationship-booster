import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import CreateRoom from '../components/room/CreateRoom';
import JoinRoom from '../components/room/JoinRoom';
import InviteCode from '../components/room/InviteCode';
import ZhengCharacter from '../components/zheng/ZhengCharacter';
import './HomePage.css';

type Mode = 'select' | 'create' | 'join' | 'invite';

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('select');
  const [inviteCode, setInviteCode] = useState('');
  const { createRoom, joinRoom, loading, error } = useRoom();
  const navigate = useNavigate();

  const handleCreate = async (name: string) => {
    const room = await createRoom(name);
    if (room) {
      setInviteCode(room.invite_code);
      setMode('invite');
    }
  };

  const handleJoin = async (code: string, name: string) => {
    const room = await joinRoom(code, name);
    if (room) {
      navigate('/main');
    }
  };

  const handleContinue = () => {
    navigate('/main');
  };

  return (
    <div className="home-page">
      {mode === 'select' && (
        <div className="welcome-container">
          <div className="logo">
            <ZhengCharacter strokes={5} color="#ff6b6b" size={80} animate />
          </div>
          <h1>感情加温器</h1>
          <p className="subtitle">记录彼此的付出，让爱看得见</p>

          <div className="mode-buttons">
            <button className="primary-btn" onClick={() => setMode('create')}>
              创建房间
            </button>
            <button className="secondary-btn" onClick={() => setMode('join')}>
              加入房间
            </button>
          </div>

          <p className="description">
            为对方做一件事，就画一笔正字
            <br />
            五笔一个正，看看谁付出更多
          </p>
        </div>
      )}

      {mode === 'create' && (
        <CreateRoom
          onSubmit={handleCreate}
          loading={loading}
          onBack={() => setMode('select')}
        />
      )}

      {mode === 'join' && (
        <JoinRoom
          onSubmit={handleJoin}
          loading={loading}
          onBack={() => setMode('select')}
        />
      )}

      {mode === 'invite' && (
        <InviteCode code={inviteCode} onContinue={handleContinue} />
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
