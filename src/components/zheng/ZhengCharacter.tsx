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
        d="M 15 15 L 85 15"
        className={`stroke ${displayStrokes >= 1 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第2笔：中短竖（从上横往下到底） */}
      <path
        d="M 50 15 L 50 85"
        className={`stroke ${displayStrokes >= 2 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第3笔：右短横（从中短竖向右） */}
      <path
        d="M 50 52 L 80 52"
        className={`stroke ${displayStrokes >= 3 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第4笔：左短竖（在左边，从中横位置往下） */}
      <path
        d="M 30 52 L 30 85"
        className={`stroke ${displayStrokes >= 4 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />

      {/* 第5笔：下横 */}
      <path
        d="M 15 85 L 85 85"
        className={`stroke ${displayStrokes >= 5 ? 'visible' : ''}`}
        style={{ stroke: color }}
      />
    </svg>
  );
}
