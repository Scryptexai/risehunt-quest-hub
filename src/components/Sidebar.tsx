import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Trophy, CheckCircle, Star, Calendar, Flame } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { projects } from '@/data/projects';

const Sidebar = () => {
  const { address, isConnected } = useAccount();
  const { progress, isConnected: hasProgress } = useUserProgress();
  const { dailyProgress } = useDailyTasks();

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to track your quest progress and earn badges.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedTasks = progress?.tasks.filter(t => t.status === 'completed').length || 0;
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const earnedBadges = progress?.badges.length || 0;
  const totalPoints = progress?.totalPoints || 0;
  
  // Daily tasks stats
  const totalDailyCompletions = dailyProgress.reduce((acc, p) => acc + p.total_completions, 0);
  const dailyBadgesEligible = dailyProgress.filter(p => p.total_completions >= 20 && !p.badge_claimed).length;
  const dailyBadgesClaimed = dailyProgress.filter(p => p.badge_claimed).length;

  const mockBadges = [
    { id: 'nitrodex', name: 'NitroDex Explorer', icon: '⚡', rarity: 'common' },
    { id: 'standard', name: 'Standard User', icon: '🛡️', rarity: 'rare' },
    { id: 'onchaingm', name: 'OnchainGM Supporter', icon: '🌅', rarity: 'epic' },
    { id: 'kingdom', name: 'Kingdom Defender', icon: '🏰', rarity: 'legendary' },
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
              <p className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Progress saved locally
            </div>
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

      {/* Daily Tasks Progress */}
      <Card className="bg-gradient-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Daily Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Daily Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background/50 border border-border text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-bold">{totalDailyCompletions}</span>
                </div>
                <p className="text-xs text-muted-foreground">Completions</p>
              </div>
              
              <div className="p-3 rounded-lg bg-background/50 border border-border text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold">{dailyBadgesClaimed}</span>
                </div>
                <p className="text-xs text-muted-foreground">Daily Badges</p>
              </div>
            </div>

            {dailyBadgesEligible > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {dailyBadgesEligible} Daily Badge{dailyBadgesEligible !== 1 ? 's' : ''} Ready!
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Check your daily tasks to claim
                </p>
              </div>
            )}
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
            {mockBadges.map((badge) => {
              const isEarned = progress?.badges.includes(badge.id);
              return (
                <div key={badge.id} className={`flex items-center space-x-3 p-2 rounded-lg border ${
                  isEarned ? 'bg-background/50 border-border' : 'bg-muted/30 border-muted grayscale'
                }`}>
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${!isEarned && 'text-muted-foreground'}`}>
                      {badge.name}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${isEarned ? getRarityColor(badge.rarity) : 'bg-muted'} text-white`}
                    >
                      {isEarned ? badge.rarity : 'locked'}
                    </Badge>
                  </div>
                  {isEarned && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              );
            })}
            
            <div className="text-xs text-center text-muted-foreground mt-3">
              Complete all project tasks to earn badges
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;