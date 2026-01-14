import { useState } from 'react';
import './Room.css';

interface InviteCodeProps {
  code: string;
  onContinue: () => void;
}

export default function InviteCode({ code, onContinue }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案：选择文本
      const input = document.querySelector('.code-display') as HTMLElement;
      if (input) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  return (
    <div className="invite-code-container">
      <h2>房间创建成功！</h2>
      <p className="hint">将以下邀请码分享给 TA</p>

      <div className="code-display" onClick={handleCopy}>
        {code}
      </div>

      <button className="copy-btn" onClick={handleCopy}>
        {copied ? '已复制！' : '点击复制'}
      </button>

      <p className="waiting-hint">等待 TA 加入后一起开始记录...</p>

      <button className="continue-btn" onClick={onContinue}>
        进入房间
      </button>
    </div>
  );
}
