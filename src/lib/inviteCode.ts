// 生成6位邀请码（排除易混淆字符如 0/O, 1/I/L）
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateInviteCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

// 验证邀请码格式
export function isValidInviteCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
}
