import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Award, Check, Loader2 } from 'lucide-react';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { getDailyTaskConfig } from '@/data/dailyTaskConfigs';
import { useState } from 'react';

interface DailyTaskSectionProps {
  projectId: string;
  projectName: string;
}

const DailyTaskSection = ({ projectId, projectName }: DailyTaskSectionProps) => {
  const { isConnected } = useAccount();
  const { completeDailyTask, claimDailyBadge, getDailyStats } = useDailyTasks();
  const { toast } = useToast();
  const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set());

  const taskConfig = getDailyTaskConfig(projectId);
  const stats = getDailyStats(projectId);

  if (!taskConfig || !isConnected) {
    return null;
  }

  const handleTaskCompletion = async (taskType: string, displayName: string) => {
    setLoadingTasks(prev => new Set(prev).add(taskType));
    
    try {
      const result = await completeDailyTask(taskType as any, projectId);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: `${displayName} Completed!`,
          description: `Daily task completed for ${projectName}. Keep going!`,
        });
      }
    } finally {
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskType);
        return newSet;
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

  const totalRequired = taskConfig.taskTypes[0]?.totalRequired || 20;
  const progressPercentage = Math.min((stats.totalCompletions / totalRequired) * 100, 100);

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Daily Tasks</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Badge Progress</span>
            <span className="font-medium">{stats.totalCompletions}/{totalRequired}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {stats.badgeEligible && (
            <p className="text-xs text-primary font-medium">🎉 Badge ready to claim!</p>
          )}
        </div>

        {/* Daily Tasks */}
        <div className="space-y-3">
          {taskConfig.taskTypes.map((taskType) => {
            const isLoading = loadingTasks.has(taskType.type);
            const todayCount = getTodayCount(taskType.type, stats);
            const canDoTask = todayCount < taskType.maxPerDay;

            return (
              <div key={taskType.type} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{taskType.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{taskType.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      Today: {todayCount}/{taskType.maxPerDay} completed
                    </p>
                  </div>
                </div>
                <Button
                  variant={canDoTask ? "default" : "secondary"}
                  size="sm"
                  disabled={!canDoTask || isLoading}
                  onClick={() => handleTaskCompletion(taskType.type, taskType.displayName)}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : canDoTask ? (
                    "Complete"
                  ) : (
                    `${todayCount}/${taskType.maxPerDay}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Badge Claim Section */}
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
              <Button size="sm" onClick={handleClaimBadge}>
                Claim Badge
              </Button>
            ) : (
              <Badge variant="outline" className="text-xs">
                {totalRequired - stats.totalCompletions} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getTodayCount = (taskType: string, stats: any): number => {
  switch (taskType) {
    case 'dex_swap':
    case 'trade':
      return stats.todaysSwaps || 0;
    case 'daily_checkin':
      return stats.todaysCheckin ? 1 : 0;
    case 'borrow_pay_deposit':
    case 'long_short':
    case 'deploy':
      return stats.todaysSwaps || 0; // Using same counter for simplicity
    default:
      return 0;
  }
};

export default DailyTaskSection;