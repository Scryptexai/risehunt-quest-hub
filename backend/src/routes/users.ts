import { Router } from 'express';
import { AuthRequest, authenticateToken, cacheMiddleware } from '../middleware';
import { CacheService } from '../config/redis';

const router = Router();

// Get user profile
router.get('/profile', authenticateToken, cacheMiddleware(300), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Get user activities
    const activities = await CacheService.getUserActivities(userId, 10);
    
    const profile = {
      id: userId,
      address: req.user!.address,
      lastActivity: activities[0]?.timestamp || null,
      totalActivities: activities.length
    };
    
    res.json({ profile });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, cacheMiddleware(180), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Get user activities
    const activities = await CacheService.getUserActivities(userId, 1000);
    
    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const todayActivities = activities.filter(a => a.date.startsWith(today)).length;
    const weekActivities = activities.filter(a => a.date >= thisWeek).length;
    
    const taskCompletions = activities.filter(a => 
      a.activity.includes('completed_daily_task')
    ).length;
    
    const badgesClaimed = activities.filter(a => 
      a.activity.includes('claimed_badge')
    ).length;
    
    const stats = {
      todayActivities,
      weekActivities,
      totalTaskCompletions: taskCompletions,
      totalBadgesClaimed: badgesClaimed,
      accountAge: activities.length > 0 ? 
        Math.floor((Date.now() - activities[activities.length - 1].timestamp) / (24 * 60 * 60 * 1000)) : 0
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

export default router;