import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Trophy, CheckCircle, Star } from 'lucide-react';

const Sidebar = () => {
  // Mock data - in real app this would come from user state
  const completedTasks = 7;
  const totalTasks = 15;
  const earnedBadges = 4;
  const totalPoints = 1250;

  const mockBadges = [
    { id: '1', name: 'Early Supporter', icon: '🚀', rarity: 'common' },
    { id: '2', name: 'Community Builder', icon: '🏗️', rarity: 'rare' },
    { id: '3', name: 'DeFi Explorer', icon: '⚡', rarity: 'epic' },
    { id: '4', name: 'Social Butterfly', icon: '🦋', rarity: 'legendary' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <Card className="bg-gradient-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>My Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <p className="text-sm text-muted-foreground">Connected Wallet</p>
              <p className="font-mono text-sm">0x1234...abcd</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Switch Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="bg-gradient-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>My Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Task Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tasks Completed</span>
                <span className="font-medium">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background/50 border border-border text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-lg font-bold">{earnedBadges}</span>
                </div>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
              
              <div className="p-3 rounded-lg bg-background/50 border border-border text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold">{totalPoints}</span>
                </div>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      <Card className="bg-gradient-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Earned Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBadges.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-3 p-2 rounded-lg bg-background/50 border border-border">
                <div className="text-2xl">{badge.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{badge.name}</p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getRarityColor(badge.rarity)} text-white`}
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              </div>
            ))}
            
            <Button variant="outline" size="sm" className="w-full mt-3">
              View All Badges
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;