import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateInviteCode } from '../lib/inviteCode';
import type { Room } from '../types';

export function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 恢复房间状态
  useEffect(() => {
    const roomId = localStorage.getItem('roomId');
    if (roomId) {
      loadRoom(roomId);
    }
  }, []);

  // 加载房间信息
  const loadRoom = async (roomId: string) => {
    const { data, error } = await supabase
      .from('t_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (!error && data) {
      setRoom(data as Room);
    }
  };

  // 创建房间
  const createRoom = useCallback(async (creatorName: string) => {
    setLoading(true);
    setError(null);

    try {
      let inviteCode = generateInviteCode();
      let attempts = 0;

      // 确保邀请码唯一
      while (attempts < 5) {
        const { data: existing } = await supabase
          .from('t_rooms')
          .select('id')
          .eq('invite_code', inviteCode)
          .single();

        if (!existing) break;
        inviteCode = generateInviteCode();
        attempts++;
      }

      const { data, error: dbError } = await supabase
        .from('t_rooms')
        .insert({ invite_code: inviteCode, creator_name: creatorName })
        .select()
        .single();

      if (dbError) throw dbError;

      const roomData = data as Room;
      setRoom(roomData);

      // 保存到本地存储
      localStorage.setItem('roomId', roomData.id);
      localStorage.setItem('userRole', 'creator');
      localStorage.setItem('userName', creatorName);

      return roomData;
    } catch (err) {
      const message = err instanceof Error ? err.message : '创建房间失败';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 加入房间
  const joinRoom = useCallback(async (inviteCode: string, partnerName: string) => {
    setLoading(true);
    setError(null);

    try {
      // 查找房间
      const { data: foundRoom, error: findError } = await supabase
        .from('t_rooms')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (findError || !foundRoom) {
        throw new Error('邀请码无效');
      }

      // 检查是否为创建者重新进入
      if (foundRoom.creator_name === partnerName) {
        setRoom(foundRoom as Room);
        localStorage.setItem('roomId', foundRoom.id);
        localStorage.setItem('userRole', 'creator');
        localStorage.setItem('userName', partnerName);
        return foundRoom as Room;
      }

      // 检查是否为伴侣重新进入
      if (foundRoom.partner_name && foundRoom.partner_name === partnerName) {
        setRoom(foundRoom as Room);
        localStorage.setItem('roomId', foundRoom.id);
        localStorage.setItem('userRole', 'partner');
        localStorage.setItem('userName', partnerName);
        return foundRoom as Room;
      }

      // 房间已有其他伴侣
      if (foundRoom.partner_name) {
        throw new Error('该房间已满');
      }

      // 新伴侣加入，更新房间
      const { data, error: updateError } = await supabase
        .from('t_rooms')
        .update({ partner_name: partnerName })
        .eq('id', foundRoom.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const roomData = data as Room;
      setRoom(roomData);

      localStorage.setItem('roomId', roomData.id);
      localStorage.setItem('userRole', 'partner');
      localStorage.setItem('userName', partnerName);

      return roomData;
    } catch (err) {
      const message = err instanceof Error ? err.message : '加入房间失败';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 退出房间
  const leaveRoom = useCallback(() => {
    localStorage.removeItem('roomId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setRoom(null);
  }, []);

  return {
    room,
    createRoom,
    joinRoom,
    leaveRoom,
    loading,
    error,
  };
}
