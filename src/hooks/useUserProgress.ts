import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface TaskProgress {
  taskId: string;
  projectId: string;
  status: 'incomplete' | 'in_progress' | 'completed';
  completedAt?: string;
  verificationData?: any;
}

export interface UserProgress {
  walletAddress: string;
  tasks: TaskProgress[];
  badges: string[];
  totalPoints: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'risehunt_user_progress';

export const useUserProgress = () => {
  const { address, isConnected } = useAccount();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    if (!address || !isConnected) {
      setProgress(null);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const allProgress = JSON.parse(stored);
        const userProgress = allProgress[address.toLowerCase()];
        setProgress(userProgress || createDefaultProgress(address));
      } catch (error) {
        console.error('Failed to parse stored progress:', error);
        setProgress(createDefaultProgress(address));
      }
    } else {
      setProgress(createDefaultProgress(address));
    }
  }, [address, isConnected]);

  // Save progress to localStorage
  const saveProgress = (newProgress: UserProgress) => {
    if (!address) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    let allProgress = {};
    
    if (stored) {
      try {
        allProgress = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored progress:', error);
      }
    }

    allProgress[address.toLowerCase()] = {
      ...newProgress,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    setProgress(newProgress);
  };

  // Update task status
  const updateTaskStatus = (taskId: string, projectId: string, status: TaskProgress['status'], verificationData?: any) => {
    if (!progress) return;

    const existingTaskIndex = progress.tasks.findIndex(t => t.taskId === taskId);
    const newTask: TaskProgress = {
      taskId,
      projectId,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
      verificationData,
    };

    let newTasks: TaskProgress[];
    if (existingTaskIndex >= 0) {
      newTasks = [...progress.tasks];
      newTasks[existingTaskIndex] = newTask;
    } else {
      newTasks = [...progress.tasks, newTask];
    }

    const newProgress: UserProgress = {
      ...progress,
      tasks: newTasks,
      totalPoints: progress.totalPoints + (status === 'completed' ? 10 : 0),
    };

    saveProgress(newProgress);
  };

  // Add badge
  const addBadge = (projectId: string) => {
    if (!progress || progress.badges.includes(projectId)) return;

    const newProgress: UserProgress = {
      ...progress,
      badges: [...progress.badges, projectId],
      totalPoints: progress.totalPoints + 50,
    };

    saveProgress(newProgress);
  };

  // Get task progress for a specific task
  const getTaskProgress = (taskId: string): TaskProgress | null => {
    return progress?.tasks.find(t => t.taskId === taskId) || null;
  };

  // Get project completion stats
  const getProjectStats = (projectId: string, totalTasks: number) => {
    if (!progress) return { completed: 0, total: totalTasks, progress: 0 };

    const completed = progress.tasks.filter(
      t => t.projectId === projectId && t.status === 'completed'
    ).length;

    return {
      completed,
      total: totalTasks,
      progress: (completed / totalTasks) * 100,
    };
  };

  return {
    progress,
    updateTaskStatus,
    addBadge,
    getTaskProgress,
    getProjectStats,
    isConnected: isConnected && !!progress,
  };
};

const createDefaultProgress = (walletAddress: string): UserProgress => ({
  walletAddress: walletAddress.toLowerCase(),
  tasks: [],
  badges: [],
  totalPoints: 0,
  lastUpdated: new Date().toISOString(),
});