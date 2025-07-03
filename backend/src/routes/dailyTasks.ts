import { Router } from 'express';
import { AuthRequest, authenticateToken, cacheMiddleware } from '../middleware';
import { CacheService } from '../config/redis';
import { DatabaseService } from '../config/database';

const router = Router();

// Complete daily task
router.post('/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { taskType, projectId, verificationData } = req.body;
    const userId = req.user!.id;
    
    // Validate input
    if (!taskType || !projectId) {
      return res.status(400).json({ error: 'Task type and project ID are required' });
    }
    
    if (!['dex_swap', 'daily_checkin'].includes(taskType)) {
      return res.status(400).json({ error: 'Invalid task type' });
    }
    
    // Check rate limiting
    const canComplete = await CacheService.checkDailyTaskLimit(userId, projectId, taskType);
    if (!canComplete) {
      const maxLimit = taskType === 'dex_swap' ? 5 : 1;
      return res.status(429).json({ 
        error: `Daily limit reached. You can only complete ${maxLimit} ${taskType} task(s) per day.` 
      });
    }
    
    // Record the task
    await DatabaseService.recordDailyTask(userId, taskType, projectId, verificationData);
    
    // Clear user progress cache
    await CacheService.del(`user_progress:${userId}`);
    
    // Track activity
    await CacheService.trackUserActivity(userId, `completed_daily_task:${taskType}:${projectId}`);
    
    res.json({ success: true, message: 'Daily task completed successfully' });
  } catch (error) {
    console.error('Error completing daily task:', error);
    res.status(500).json({ error: 'Failed to complete daily task' });
  }
});

// Get user's daily progress
router.get('/progress', authenticateToken, cacheMiddleware(60), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Try to get from cache first
    const cacheKey = `user_progress:${userId}`;
    let progress = await CacheService.get(cacheKey);
    
    if (!progress) {
      progress = await DatabaseService.getUserProgress(userId);
      await CacheService.set(cacheKey, progress, 300); // Cache for 5 minutes
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Error getting user progress:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

// Claim daily badge
router.post('/claim-badge', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user!.id;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const result = await DatabaseService.claimBadge(userId, projectId);
    
    if (!result) {
      return res.status(400).json({ error: 'Badge not eligible or already claimed' });
    }
    
    // Clear cache
    await CacheService.del(`user_progress:${userId}`);
    
    // Track activity
    await CacheService.trackUserActivity(userId, `claimed_badge:${projectId}`);
    
    res.json({ success: true, message: 'Badge claimed successfully', badge: result });
  } catch (error) {
    console.error('Error claiming badge:', error);
    res.status(500).json({ error: 'Failed to claim badge' });
  }
});

// Get user activity history
router.get('/activity', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const activities = await CacheService.getUserActivities(userId, limit);
    
    res.json({ activities });
  } catch (error) {
    console.error('Error getting user activities:', error);
    res.status(500).json({ error: 'Failed to get user activities' });
  }
});

// Get daily stats for a project
router.get('/stats/:projectId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    
    // Get today's tasks from cache/database
    const today = new Date().toISOString().split('T')[0];
    const swapKey = `daily_limit:${userId}:${projectId}:dex_swap:${today}`;
    const checkinKey = `daily_limit:${userId}:${projectId}:daily_checkin:${today}`;
    
    const [swapCount, checkinCount] = await Promise.all([
      CacheService.get(swapKey),
      CacheService.get(checkinKey)
    ]);
    
    const stats = {
      todaysSwaps: parseInt(swapCount as string) || 0,
      todaysCheckin: parseInt(checkinCount as string) > 0,
      canSwap: (parseInt(swapCount as string) || 0) < 5,
      canCheckin: !(parseInt(checkinCount as string) > 0)
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Error getting daily stats:', error);
    res.status(500).json({ error: 'Failed to get daily stats' });
  }
});

export default router;