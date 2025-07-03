import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Calendar, Award, Flame, Check } from 'lucide-react';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';

interface DailyTaskCardProps {
  projectId: string;
  projectName: string;
  projectLogo: string;
}

const DailyTaskCard = ({ projectId, projectName, projectLogo }: DailyTaskCardProps) => {
  const { isConnected } = useAccount();
  const { completeDailyTask, claimDailyBadge, getDailyStats, loading } = useDailyTasks();
  const { toast } = useToast();

  const stats = getDailyStats(projectId);

  const handleDailySwap = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to complete daily tasks.",
        variant: "destructive"
      });
      return;
    }

    const result = await completeDailyTask('dex_swap', projectId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "DEX Swap Completed!",
        description: `Daily swap completed for ${projectName}. Progress: ${stats.totalCompletions + 1}/20`,
      });
    }
  };

  const handleDailyCheckin = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to complete daily tasks.",
        variant: "destructive"
      });
      return;
    }

    const result = await completeDailyTask('daily_checkin', projectId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Daily Check-in Complete!",
        description: `Daily check-in completed for ${projectName}. Keep the streak going!`,
      });
    }
  };

  const handleClaimBadge = async () => {
    const result = await claimDailyBadge(projectId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Badge Claimed!",
        description: `🎉 You've earned the ${projectName} Daily Master NFT badge!`,
      });
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-card border-primary/20 opacity-60">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Daily Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to participate in daily tasks
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={projectLogo} 
            alt={`${projectName} logo`} 
            className="w-12 h-12 rounded-lg object-cover border border-primary/20"
          />
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{projectName} Daily</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </CardTitle>
            <CardDescription className="text-sm">
              Complete daily tasks to earn badges
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Badge Progress</span>
            <span className="font-medium">{stats.totalCompletions}/20</span>
          </div>
          <Progress value={(stats.totalCompletions / 20) * 100} className="h-2" />
          {stats.badgeEligible && (
            <p className="text-xs text-primary font-medium">🎉 Badge ready to claim!</p>
          )}
        </div>

        {/* Daily Tasks */}
        <div className="space-y-3">
          {/* DEX Swap Task */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium text-sm">DEX Swap</p>
                <p className="text-xs text-muted-foreground">
                  Daily: {stats.todaysSwaps}/5 completed
                </p>
              </div>
            </div>
            <Button
              variant={stats.canSwap ? "default" : "secondary"}
              size="sm"
              disabled={!stats.canSwap || loading}
              onClick={handleDailySwap}
            >
              {stats.canSwap ? "Swap" : `${stats.todaysSwaps}/5`}
            </Button>
          </div>

          {/* Daily Check-in Task */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-green-500" />
              <div>
                <p className="font-medium text-sm">Daily Check-in</p>
                <p className="text-xs text-muted-foreground">
                  Streak: {stats.currentStreak} days
                </p>
              </div>
            </div>
            <Button
              variant={stats.canCheckin ? "default" : "secondary"}
              size="sm"
              disabled={!stats.canCheckin || loading}
              onClick={handleDailyCheckin}
            >
              {stats.todaysCheckin ? <Check className="w-4 h-4" /> : "Check In"}
            </Button>
          </div>
        </div>

        {/* Badge Section */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Daily Master Badge</span>
            </div>
            {stats.badgeClaimed ? (
              <Badge variant="default" className="text-xs">
                <Check className="w-3 h-3 mr-1" />
                Claimed
              </Badge>
            ) : stats.badgeEligible ? (
              <Button size="sm" onClick={handleClaimBadge} disabled={loading}>
                Claim Badge
              </Button>
            ) : (
              <Badge variant="outline" className="text-xs">
                {20 - stats.totalCompletions} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTaskCard;