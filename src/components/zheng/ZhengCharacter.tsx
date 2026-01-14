import { useEffect, useState } from 'react';
import './ZhengCharacter.css';

interface ZhengCharacterProps {
  strokes: number; // 当前笔画数（0-5）
  animate?: boolean; // 是否播放动画
  color?: string; // 笔画颜色
  size?: number; // 尺寸
}

export default function ZhengCharacter({
  strokes,
  animate = false,
  color = '#333',
  size = 60,
}: ZhengCharacterProps) {
  const [animatedStrokes, setAnimatedStrokes] = useState(animate ? 0 : strokes);

  useEffect(() => {
    if (animate && strokes > 0) {
      setAnimatedStrokes(0);
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setAnimatedStrokes(current);
        if (current >= strokes) {
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    } else {
      setAnimatedStrokes(strokes);
    }
  }, [animate, strokes]);

  const displayStrokes = animate ? animatedStrokes : strokes;

  return (
    <svg
      viewBox="0 0 100 100"
      className="zheng-character"
      width={size}
      height={size}
    >
      {/* 第1笔：上横 */}
      <path
        d="M 15 20 L 85 20"
        className={`stroke ${displayStrokes >= 1 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第2笔：左竖 */}
      <path
        d="M 30 20 L 30 80"
        className={`stroke ${displayStrokes >= 2 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第3笔：中横 */}
      <path
        d="M 15 50 L 85 50"
        className={`stroke ${displayStrokes >= 3 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第4笔：右竖 */}
      <path
        d="M 70 20 L 70 80"
        className={`stroke ${displayStrokes >= 4 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第5笔：下横 */}
      <path
        d="M 15 80 L 85 80"
        className={`stroke ${displayStrokes >= 5 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />
    </svg>
  );
}
