import { Router } from 'express';
import { AuthRequest, optionalAuth, cacheMiddleware } from '../middleware';

const router = Router();

// Get all quests/projects (cached for 5 minutes)
router.get('/', optionalAuth, cacheMiddleware(300), async (req: AuthRequest, res) => {
  try {
    // Mock quest data - replace with actual database query
    const quests = [
      {
        id: 'nitrodex',
        name: 'NitroDEX',
        description: 'High-performance decentralized exchange',
        logo: '/assets/nitrodex-logo.jpg',
        tasks: [
          { id: '1', platform: 'twitter', type: 'SOCIAL', title: 'Follow @nitrodex' },
          { id: '2', platform: 'discord', type: 'SOCIAL', title: 'Join Discord' },
          { id: '3', platform: 'onchain', type: 'ONCHAIN', title: 'Make a swap' }
        ]
      },
      // Add more quests as needed
    ];
    
    res.json({ quests });
  } catch (error) {
    console.error('Error getting quests:', error);
    res.status(500).json({ error: 'Failed to get quests' });
  }
});

// Get specific quest details
router.get('/:questId', optionalAuth, cacheMiddleware(300), async (req: AuthRequest, res) => {
  try {
    const { questId } = req.params;
    
    // Mock quest detail - replace with actual database query
    const quest = {
      id: questId,
      name: 'Mock Quest',
      description: 'Mock quest description',
      tasks: [],
      rewards: []
    };
    
    res.json({ quest });
  } catch (error) {
    console.error('Error getting quest details:', error);
    res.status(500).json({ error: 'Failed to get quest details' });
  }
});

export default router;