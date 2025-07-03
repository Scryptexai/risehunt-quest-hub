import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export interface DailyTask {
  id: string;
  user_id: string;
  task_type: 'dex_swap' | 'daily_checkin';
  project_id: string;
  completed_at: string;
  streak_count: number;
  verification_data?: any;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  project_id: string;
  total_completions: number;
  current_streak: number;
  last_completion_date?: string;
  badge_claimed: boolean;
}

export const useDailyTasks = () => {
  const { address, isConnected } = useAccount();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's daily progress and today's tasks
  const fetchDailyData = async () => {
    if (!address || !isConnected) return;

    setLoading(true);
    try {
      // Fetch daily progress
      const { data: progress } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', address.toLowerCase());

      setDailyProgress(progress || []);

      // Fetch today's tasks
      const today = new Date().toISOString().split('T')[0];
      const { data: tasks } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', address.toLowerCase())
        .gte('completed_at', `${today}T00:00:00Z`)
        .lt('completed_at', `${today}T23:59:59Z`);

      setTodaysTasks((tasks || []) as DailyTask[]);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    }
    setLoading(false);
  };

  // Complete a daily task
  const completeDailyTask = async (taskType: 'dex_swap' | 'daily_checkin', projectId: string, verificationData?: any) => {
    if (!address) return { error: 'No wallet connected' };

    try {
      // Check if this task type was already completed today
      const today = new Date().toISOString().split('T')[0];
      const todaysTasksForType = todaysTasks.filter(
        t => t.task_type === taskType && t.project_id === projectId
      );

      // For DEX swaps, allow up to 5 per day
      if (taskType === 'dex_swap' && todaysTasksForType.length >= 5) {
        return { error: 'Daily DEX swap limit reached (5/day)' };
      }

      // For daily check-in, allow only 1 per day
      if (taskType === 'daily_checkin' && todaysTasksForType.length >= 1) {
        return { error: 'Daily check-in already completed today' };
      }

      // Add the daily task
      const { error: taskError } = await supabase
        .from('daily_tasks')
        .insert({
          user_id: address.toLowerCase(),
          task_type: taskType,
          project_id: projectId,
          verification_data: verificationData
        });

      if (taskError) throw taskError;

      // Update or create daily progress
      const existingProgress = dailyProgress.find(p => p.project_id === projectId);
      const today_date = new Date().toISOString().split('T')[0];
      
      if (existingProgress) {
        const newTotal = existingProgress.total_completions + 1;
        const isConsecutiveDay = existingProgress.last_completion_date === 
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const newStreak = existingProgress.last_completion_date === today_date 
          ? existingProgress.current_streak 
          : isConsecutiveDay 
            ? existingProgress.current_streak + 1 
            : 1;

        await supabase
          .from('daily_progress')
          .update({
            total_completions: newTotal,
            current_streak: newStreak,
            last_completion_date: today_date
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('daily_progress')
          .insert({
            user_id: address.toLowerCase(),
            project_id: projectId,
            total_completions: 1,
            current_streak: 1,
            last_completion_date: today_date
          });
      }

      // Refresh data
      await fetchDailyData();
      return { success: true };
    } catch (error) {
      console.error('Error completing daily task:', error);
      return { error: 'Failed to complete task' };
    }
  };

  // Claim badge after reaching 20 completions
  const claimDailyBadge = async (projectId: string) => {
    if (!address) return { error: 'No wallet connected' };

    const progress = dailyProgress.find(p => p.project_id === projectId);
    if (!progress || progress.total_completions < 20 || progress.badge_claimed) {
      return { error: 'Badge not eligible or already claimed' };
    }

    try {
      await supabase
        .from('daily_progress')
        .update({ badge_claimed: true })
        .eq('id', progress.id);

      await fetchDailyData();
      return { success: true };
    } catch (error) {
      return { error: 'Failed to claim badge' };
    }
  };

  // Get daily task stats for a project
  const getDailyStats = (projectId: string) => {
    const progress = dailyProgress.find(p => p.project_id === projectId);
    const todaysSwaps = todaysTasks.filter(t => t.task_type === 'dex_swap' && t.project_id === projectId).length;
    const todaysCheckin = todaysTasks.filter(t => t.task_type === 'daily_checkin' && t.project_id === projectId).length > 0;

    return {
      totalCompletions: progress?.total_completions || 0,
      currentStreak: progress?.current_streak || 0,
      badgeEligible: (progress?.total_completions || 0) >= 20 && !progress?.badge_claimed,
      badgeClaimed: progress?.badge_claimed || false,
      todaysSwaps,
      todaysCheckin,
      canSwap: todaysSwaps < 5,
      canCheckin: !todaysCheckin
    };
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchDailyData();
    }
  }, [address, isConnected]);

  return {
    dailyProgress,
    todaysTasks,
    loading,
    completeDailyTask,
    claimDailyBadge,
    getDailyStats,
    refreshData: fetchDailyData
  };
};