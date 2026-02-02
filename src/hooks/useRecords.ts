import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Record } from '../types';

export function useRecords(roomId: string | null) {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRecordId, setNewRecordId] = useState<string | null>(null);

  // 获取初始数据
  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('t_records')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRecords(data as Record[]);
      }
      setLoading(false);
    };

    fetchRecords();
  }, [roomId]);

  // 实时订阅
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`records:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 't_records',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as Record;
            setRecords((prev) => [newRecord, ...prev]);
            setNewRecordId(newRecord.id);
            // 清除新记录标记
            setTimeout(() => setNewRecordId(null), 1000);
          } else if (payload.eventType === 'DELETE') {
            setRecords((prev) =>
              prev.filter((r) => r.id !== (payload.old as Record).id)
            );
          } else if (payload.eventType === 'UPDATE') {
            const updatedRecord = payload.new as Record;
            setRecords((prev) =>
              prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
            );
          }
        }
      )
      .subscribe();

    // 清理订阅
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 添加记录
  const addRecord = useCallback(
    async (content: string) => {
      if (!roomId) return null;

      const userRole = localStorage.getItem('userRole') as 'creator' | 'partner';

      const { data, error } = await supabase
        .from('t_records')
        .insert({
          room_id: roomId,
          author_role: userRole,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Record;
    },
    [roomId]
  );

  // 删除记录
  const deleteRecord = useCallback(async (recordId: string) => {
    const { error } = await supabase.from('t_records').delete().eq('id', recordId);

    if (error) throw error;
  }, []);

  // 更新记录
  const updateRecord = useCallback(async (recordId: string, content: string) => {
    const { data, error } = await supabase
      .from('t_records')
      .update({ content })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return data as Record;
  }, []);

  return {
    records,
    loading,
    addRecord,
    deleteRecord,
    updateRecord,
    newRecordId,
  };
}
