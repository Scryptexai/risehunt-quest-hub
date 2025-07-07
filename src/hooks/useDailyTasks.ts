import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { projects, DailyTaskMeta } from '@/data/projects'; // NEW: Import projects and DailyTaskMeta
import { useToast } from '@/hooks/use-toast'; // NEW: Import useToast

// NEW: Define local storage keys
const DAILY_PROGRESS_STORAGE_KEY = 'risehunt_daily_progress';
const DAILY_COMPLETIONS_STORAGE_KEY = 'risehunt_daily_completions';

// NEW: Define interfaces for local storage data
export interface LocalDailyCompletion {
  id: string; // Unique ID for this completion instance
  projectId: string;
  dailyTaskId: string; // Refers to DailyTaskMeta.id
  completedAt: string; // ISO string date
}

export interface LocalDailyProgress {
  projectId: string;
  totalCompletions: number;
  currentStreak: number;
  lastCompletionDate: string; // YYYY-MM-DD
  badgeClaimed: boolean;
}

export const useDailyTasks = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast(); // NEW: Initialize toast
  const [dailyProgress, setDailyProgress] = useState<LocalDailyProgress[]>([]);
  const [todaysCompletions, setTodaysCompletions] = useState<LocalDailyCompletion[]>([]); // NEW: Changed to track specific completions today
  const [loading, setLoading] = useState(false);

  // Helper to create default progress for a new user/project
  const createDefaultLocalProgress = (projectId: string): LocalDailyProgress => ({
    projectId,
    totalCompletions: 0,
    currentStreak: 0,
    lastCompletionDate: '',
    badgeClaimed: false,
  });

  // Load progress and completions from localStorage
  const loadDailyData = () => {
    if (!address || !isConnected) {
      setDailyProgress([]);
      setTodaysCompletions([]);
      return;
    }

    const userAddress = address.toLowerCase();

    // Load all users' daily progress
    const storedProgress = localStorage.getItem(DAILY_PROGRESS_STORAGE_KEY);
    let allUsersProgress: { [key: string]: LocalDailyProgress[] } = {};
    if (storedProgress) {
      try {
        allUsersProgress = JSON.parse(storedProgress);
      } catch (e) {
        console.error("Failed to parse daily progress from localStorage", e);
      }
    }
    setDailyProgress(allUsersProgress[userAddress] || []);

    // Load all users' daily completions
    const storedCompletions = localStorage.getItem(DAILY_COMPLETIONS_STORAGE_KEY);
    let allUsersCompletions: { [key: string]: LocalDailyCompletion[] } = {};
    if (storedCompletions) {
      try {
        allUsersCompletions = JSON.parse(storedCompletions);
      } catch (e) {
        console.error("Failed to parse daily completions from localStorage", e);
      }
    }

    const todayDate = new Date().toISOString().split('T')[0];
    // Filter completions for current user and today only
    const usersTodaysCompletions = (allUsersCompletions[userAddress] || []).filter(
      comp => comp.completedAt.startsWith(todayDate) // Assuming completedAt is ISO string
    );
    setTodaysCompletions(usersTodaysCompletions);
  };

  // Save progress and completions to localStorage
  const saveDailyData = (
    newDailyProgress: LocalDailyProgress[],
    newTodaysCompletions: LocalDailyCompletion[]
  ) => {
    if (!address) return;
    const userAddress = address.toLowerCase();

    // Save daily progress
    const storedProgress = localStorage.getItem(DAILY_PROGRESS_STORAGE_KEY);
    let allUsersProgress = storedProgress ? JSON.parse(storedProgress) : {};
    allUsersProgress[userAddress] = newDailyProgress;
    localStorage.setItem(DAILY_PROGRESS_STORAGE_KEY, JSON.stringify(allUsersProgress));
    setDailyProgress(newDailyProgress);

    // Save daily completions (keep only last 2 days' data to avoid excessive growth)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const storedCompletions = localStorage.getItem(DAILY_COMPLETIONS_STORAGE_KEY);
    let allUsersCompletions = storedCompletions ? JSON.parse(storedCompletions) : {};
    const filteredCompletions = (allUsersCompletions[userAddress] || []).filter(
        (comp: LocalDailyCompletion) => comp.completedAt >= twoDaysAgo
    );
    allUsersCompletions[userAddress] = [...filteredCompletions, ...newTodaysCompletions.filter(comp => !filteredCompletions.some(fc => fc.id === comp.id))];
    localStorage.setItem(DAILY_COMPLETIONS_STORAGE_KEY, JSON.stringify(allUsersCompletions));
    setTodaysCompletions(newTodaysCompletions);
  };

  // Complete a daily task
  const completeDailyTask = async (dailyTaskMeta: DailyTaskMeta, projectId: string) => { // NEW: Pass DailyTaskMeta
    if (!address) return { error: 'No wallet connected' };
    setLoading(true);

    try {
      const userAddress = address.toLowerCase();
      const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // 1. Check daily limit
      const currentDailyCompletionsForThisTask = todaysCompletions.filter(
        comp => comp.projectId === projectId && comp.dailyTaskId === dailyTaskMeta.id
      ).length;

      if (currentDailyCompletionsForThisTask >= dailyTaskMeta.dailyLimit) {
        setLoading(false);
        return { error: `Daily limit reached for "${dailyTaskMeta.title}" (${dailyTaskMeta.dailyLimit}/day)` };
      }

      // 2. Simulate verification delay
      toast({
        title: `Initiating verification for "${dailyTaskMeta.title}"`,
        description: `Please complete the action on ${dailyTaskMeta.platform.toUpperCase()}. We will verify automatically.`,
        duration: dailyTaskMeta.simulationDelayMs + 2000,
      });

      const verificationSuccess = await new Promise(resolve => setTimeout(() => {
        // Simulate success (e.g., 90% success rate for dummy)
        resolve(Math.random() > 0.1);
      }, dailyTaskMeta.simulationDelayMs));

      if (!verificationSuccess) {
        setLoading(false);
        toast({
          title: "Verification Failed",
          description: `Could not verify your "${dailyTaskMeta.title}". Please try again.`,
          variant: "destructive"
        });
        return { error: 'Verification failed' };
      }

      // 3. Record new daily completion
      const newCompletion: LocalDailyCompletion = {
        id: `${userAddress}-${projectId}-${dailyTaskMeta.id}-${Date.now()}`, // Unique ID for this completion
        projectId,
        dailyTaskId: dailyTaskMeta.id,
        completedAt: new Date().toISOString(),
      };
      const updatedTodaysCompletions = [...todaysCompletions, newCompletion];

      // 4. Update overall daily progress for the project
      let updatedDailyProgress = [...dailyProgress];
      let projectProgress = updatedDailyProgress.find(p => p.projectId === projectId);

      if (projectProgress) {
        const isConsecutiveDay = projectProgress.lastCompletionDate === 
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Only increment streak if it's a new day and consecutive, or if it's the same day
        const newStreak = projectProgress.lastCompletionDate === todayDate 
          ? projectProgress.currentStreak 
          : isConsecutiveDay 
            ? projectProgress.currentStreak + 1 
            : 1;

        projectProgress.totalCompletions += 1;
        projectProgress.currentStreak = newStreak;
        projectProgress.lastCompletionDate = todayDate;
      } else {
        // Create new progress entry for the project
        updatedDailyProgress.push(createDefaultLocalProgress(projectId));
        projectProgress = updatedDailyProgress[updatedDailyProgress.length - 1];
        projectProgress.totalCompletions = 1;
        projectProgress.currentStreak = 1;
        projectProgress.lastCompletionDate = todayDate;
      }
      
      saveDailyData(updatedDailyProgress, updatedTodaysCompletions);
      toast({
        title: "Daily Task Completed!",
        description: `"${dailyTaskMeta.title}" for ${projects.find(p => p.id === projectId)?.name} verified!`,
      });
      return { success: true };

    } catch (error) {
      console.error('Error completing daily task:', error);
      toast({
        title: "Error",
        description: "Failed to complete daily task. Please try again.",
        variant: "destructive"
      });
      return { error: 'Failed to complete task' };
    } finally {
      setLoading(false);
    }
  };

  // Claim daily badge
  const claimDailyBadge = async (projectId: string) => {
    if (!address) return { error: 'No wallet connected' };
    setLoading(true);

    let updatedDailyProgress = [...dailyProgress];
    let projectProgress = updatedDailyProgress.find(p => p.projectId === projectId);

    const dailyTaskMetas = projects.find(p => p.id === projectId)?.dailyTasks;
    if (!dailyTaskMetas || dailyTaskMetas.length === 0) {
        setLoading(false);
        return { error: 'No daily tasks defined for this project.' };
    }
    // For simplicity, assume all daily tasks in a project contribute to ONE daily badge
    // So we take the totalForBadge from the first dailyTaskMeta for this project
    const badgeRequirement = dailyTaskMetas[0].totalForBadge;

    if (!projectProgress || projectProgress.totalCompletions < badgeRequirement || projectProgress.badgeClaimed) {
      setLoading(false);
      return { error: 'Badge not eligible or already claimed' };
    }

    try {
      // Simulate NFT minting delay
      toast({
        title: "Claiming Badge...",
        description: `Your ${projects.find(p => p.id === projectId)?.name} Daily Badge NFT is being minted on Risechain.`,
        duration: 4000,
      });

      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate minting transaction

      projectProgress.badgeClaimed = true;
      saveDailyData(updatedDailyProgress, todaysCompletions); // Save updated progress
      
      toast({
        title: "Daily Badge Claimed!",
        description: `🎉 You've earned the ${projects.find(p => p.id === projectId)?.name} Daily Master NFT badge!`,
      });
      return { success: true };
    } catch (error) {
      console.error('Error claiming daily badge:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily badge.",
        variant: "destructive"
      });
      return { error: 'Failed to claim badge' };
    } finally {
      setLoading(false);
    }
  };

  // Get daily task stats for a project
  const getDailyStats = (projectId: string) => {
    const projectDailyProgress = dailyProgress.find(p => p.projectId === projectId);
    const dailyTaskMetas = projects.find(p => p.id === projectId)?.dailyTasks;

    if (!dailyTaskMetas || dailyTaskMetas.length === 0) {
        return {
            totalCompletions: 0,
            currentStreak: 0,
            badgeEligible: false,
            badgeClaimed: false,
            // Generic canDo property
            canDoAnyDailyTask: false,
            // Specific daily task counts and canDo status
            tasks: [],
            badgeRequirement: 0
        };
    }

    return {
      totalCompletions: projectDailyProgress?.totalCompletions || 0,
      currentStreak: projectDailyProgress?.currentStreak || 0,
      badgeClaimed: projectDailyProgress?.badgeClaimed || false,
      badgeRequirement: dailyTaskMetas[0].totalForBadge, // Assuming same requirement for all daily tasks in project
      badgeEligible: (projectDailyProgress?.totalCompletions || 0) >= dailyTaskMetas[0].totalForBadge && !(projectDailyProgress?.badgeClaimed || false),
      tasks: dailyTaskMetas.map(meta => {
        const completedToday = todaysCompletions.filter(
          comp => comp.projectId === projectId && comp.dailyTaskId === meta.id
        ).length;
        return {
          id: meta.id,
          title: meta.title,
          action: meta.action,
          link: meta.link,
          dailyLimit: meta.dailyLimit,
          completedToday,
          canCompleteToday: completedToday < meta.dailyLimit,
        };
      }),
    };
  };

  // Load data on component mount or address/connection change
  useEffect(() => {
    loadDailyData();
  }, [address, isConnected]);

  return {
    dailyProgress,
    todaysCompletions,
    loading,
    completeDailyTask,
    claimDailyBadge,
    getDailyStats,
    refreshData: loadDailyData
  };
};