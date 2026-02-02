import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useRecords } from '../hooks/useRecords';
import { calculateZheng } from '../lib/zhengUtils';
import ZhengDisplay from '../components/zheng/ZhengDisplay';
import RecordForm from '../components/record/RecordForm';
import RecordList from '../components/record/RecordList';
import './MainPage.css';

export default function MainPage() {
  const navigate = useNavigate();
  const { room, leaveRoom } = useRoom();
  const roomId = localStorage.getItem('roomId');
  const userRole = localStorage.getItem('userRole') as 'creator' | 'partner';
  const { records, loading, addRecord, deleteRecord, updateRecord, newRecordId } = useRecords(roomId);
  const [showForm, setShowForm] = useState(false);
  const [showRecords, setShowRecords] = useState(false);

  // 如果没有房间ID，跳转到首页
  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
  }, [roomId, navigate]);

  // 分别计算双方的记录
  const { creatorCount, partnerCount } = useMemo(() => {
    const creator = records.filter((r) => r.author_role === 'creator').length;
    const partner = records.filter((r) => r.author_role === 'partner').length;
    return {
      creatorCount: calculateZheng(creator),
      partnerCount: calculateZheng(partner),
    };
  }, [records]);

  const handleAddRecord = async (content: string) => {
    await addRecord(content);
    setShowForm(false);
  };

  const handleLeave = () => {
    if (confirm('确定要退出房间吗？')) {
      leaveRoom();
      navigate('/');
    }
  };

  if (loading || !room) {
    return (
      <div className="main-page loading">
        <p>加载中...</p>
      </div>
    );
  }

  const myName = userRole === 'creator' ? room.creator_name : room.partner_name;
  const partnerName = userRole === 'creator' ? room.partner_name : room.creator_name;

  // 判断谁付出更多
  const myCount = userRole === 'creator' ? creatorCount : partnerCount;
  const theirCount = userRole === 'creator' ? partnerCount : creatorCount;
  const diff = myCount.total - theirCount.total;

  if (showForm) {
    return (
      <div className="main-page">
        <RecordForm onSubmit={handleAddRecord} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="main-page">
      <header className="main-header">
        <button className="menu-btn" onClick={handleLeave}>
          退出
        </button>
        <h1>我们的正字</h1>
        <button className="history-btn" onClick={() => setShowRecords(!showRecords)}>
          {showRecords ? '返回' : '记录'}
        </button>
      </header>

      {showRecords ? (
        <RecordList
          records={records}
          creatorName={room.creator_name}
          partnerName={room.partner_name || '等待加入'}
          currentRole={userRole}
          onDelete={deleteRecord}
          onUpdate={updateRecord}
        />
      ) : (
        <>
          <div className="zheng-comparison">
            {/* 对方的正字 */}
            <div className="zheng-section other">
              <h2>{partnerName || '等待加入'}</h2>
              <ZhengDisplay
                count={theirCount}
                color="#6b9fff"
                animateNew={!!newRecordId}
              />
            </div>

            <div className="vs-divider">
              <span>VS</span>
            </div>

            {/* 我的正字 */}
            <div className="zheng-section self">
              <h2>{myName}（我）</h2>
              <ZhengDisplay
                count={myCount}
                color="#ff6b6b"
                animateNew={!!newRecordId}
              />
            </div>
          </div>

          {/* 比较结果 */}
          <div className="comparison-result">
            {diff > 0 && (
              <p className="ahead">
                你比 TA 多付出 <strong>{diff}</strong> 件事！继续加油！
              </p>
            )}
            {diff < 0 && (
              <p className="behind">
                TA 比你多付出 <strong>{Math.abs(diff)}</strong> 件事，要努力追上哦！
              </p>
            )}
            {diff === 0 && myCount.total > 0 && (
              <p className="equal">你们的付出一样多，真棒！</p>
            )}
          </div>

          <button className="add-record-btn" onClick={() => setShowForm(true)}>
            + 记录一件事
          </button>
        </>
      )}
    </div>
  );
}
