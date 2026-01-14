import type { ZhengCount } from '../types';

// 计算正字数量
export function calculateZheng(recordCount: number): ZhengCount {
  return {
    complete: Math.floor(recordCount / 5),
    strokes: recordCount % 5,
    total: recordCount,
  };
}

// 获取当前笔画状态（用于动画）
// 正字的5笔：横、竖、横、竖、横
export function getStrokeState(strokes: number): boolean[] {
  return [
    strokes >= 1,  // 第1笔：横
    strokes >= 2,  // 第2笔：竖
    strokes >= 3,  // 第3笔：横
    strokes >= 4,  // 第4笔：竖
    strokes >= 5,  // 第5笔：横（完成）
  ];
}
