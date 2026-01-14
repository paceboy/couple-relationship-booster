import { useMemo } from 'react';
import ZhengCharacter from './ZhengCharacter';
import type { ZhengCount } from '../../types';
import './ZhengDisplay.css';

interface ZhengDisplayProps {
  count: ZhengCount;
  color?: string;
  animateNew?: boolean;
}

export default function ZhengDisplay({
  count,
  color = '#333',
  animateNew = false,
}: ZhengDisplayProps) {
  // 生成正字数组
  const zhengArray = useMemo(() => {
    const arr = [];

    // 完整的正字
    for (let i = 0; i < count.complete; i++) {
      arr.push({ strokes: 5, index: i });
    }

    // 未完成的正字（如果有剩余笔画）
    if (count.strokes > 0) {
      arr.push({ strokes: count.strokes, index: count.complete });
    }

    return arr;
  }, [count]);

  if (zhengArray.length === 0) {
    return (
      <div className="zheng-display empty">
        <div className="empty-placeholder">
          <ZhengCharacter strokes={0} color="#ddd" size={50} />
        </div>
        <p className="empty-text">还没有记录</p>
      </div>
    );
  }

  return (
    <div className="zheng-display">
      <div className="zheng-grid">
        {zhengArray.map((item, idx) => (
          <ZhengCharacter
            key={idx}
            strokes={item.strokes}
            color={color}
            animate={animateNew && idx === zhengArray.length - 1}
            size={50}
          />
        ))}
      </div>
      <p className="total-count">共 {count.total} 件事</p>
    </div>
  );
}
