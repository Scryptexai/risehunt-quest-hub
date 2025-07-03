import { Project } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Award, Clock, CheckCircle, Zap, Calendar, Flame, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';

interface ProjectOverviewCardProps {
  project: Project;
}

const ProjectOverviewCard = ({ project }: ProjectOverviewCardProps) => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { getProjectStats } = useUserProgress();
  const { completeDailyTask, claimDailyBadge, getDailyStats, loading } = useDailyTasks();
  const { toast } = useToast();
  
  const { completed: completedTasks, total: totalTasks, progress: progressPercentage } = getProjectStats(project.id, project.tasks.length);
  const isCompleted = completedTasks === totalTasks;
  const dailyStats = getDailyStats(project.id);

  const handleEnterQuest = () => {
    navigate(`/project/${project.id}`);
  };

  const handleDailySwap = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to complete daily tasks.",
        variant: "destructive"
      });
      return;
    }

    const result = await completeDailyTask('dex_swap', project.id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "DEX Swap Completed!",
        description: `Daily swap completed for ${project.name}. Progress: ${dailyStats.totalCompletions + 1}/20`,
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

    const result = await completeDailyTask('daily_checkin', project.id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Daily Check-in Complete!",
        description: `Daily check-in completed for ${project.name}. Keep the streak going!`,
      });
    }
  };

  const handleClaimBadge = async () => {
    const result = await claimDailyBadge(project.id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Badge Claimed!",
        description: `🎉 You've earned the ${project.name} Daily Master NFT badge!`,
      });
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-quest cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={project.logo} 
                alt={`${project.name} logo`} 
                className="w-14 h-14 rounded-xl object-cover border border-primary/20 group-hover:border-primary/40 transition-colors"
              />
              {isCompleted && (
                <div className="absolute -top-1 -right-1">
                  <CheckCircle className="w-5 h-5 text-green-400 bg-background rounded-full" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-primary/30">
              {totalTasks} Task{totalTasks !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isCompleted ? (
                <Award className="w-4 h-4 text-primary" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {isCompleted ? 'Quest Completed!' : 'Quest Progress'}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isCompleted 
                  ? 'bg-gradient-primary shadow-glow' 
                  : 'bg-primary/60'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Task Types Preview */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {project.tasks.slice(0, 3).map((task, index) => (
                <Badge 
                  key={index}
                  variant={task.type === 'SOCIAL' ? 'secondary' : 'default'}
                  className="text-xs px-2 py-1"
                >
                  {task.platform.toUpperCase()}
                </Badge>
              ))}
              {project.tasks.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{project.tasks.length - 3}
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant={isCompleted ? "default" : "quest"} 
            size="sm"
            onClick={handleEnterQuest}
            className="group-hover:scale-105 transition-transform"
          >
            {isCompleted ? 'View Quest' : 'Enter Quest'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Daily Tasks Section */}
        {isConnected && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Daily Tasks</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {dailyStats.totalCompletions}/20 for NFT
              </span>
            </div>
            
            <Progress value={(dailyStats.totalCompletions / 20) * 100} className="h-1" />
            
            <div className="grid grid-cols-2 gap-2">
              {/* DEX Swap */}
              <div className="flex items-center justify-between p-2 rounded-md bg-background/50 border border-border">
                <div className="flex items-center space-x-2">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span className="text-xs">Swap {dailyStats.todaysSwaps}/5</span>
                </div>
                <Button
                  variant={dailyStats.canSwap ? "default" : "secondary"}
                  size="sm"
                  disabled={!dailyStats.canSwap || loading}
                  onClick={handleDailySwap}
                  className="h-6 px-2 text-xs"
                >
                  {dailyStats.canSwap ? "Swap" : "Done"}
                </Button>
              </div>
              
              {/* Daily Check-in */}
              <div className="flex items-center justify-between p-2 rounded-md bg-background/50 border border-border">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3 text-green-500" />
                  <span className="text-xs">Check-in</span>
                </div>
                <Button
                  variant={dailyStats.canCheckin ? "default" : "secondary"}
                  size="sm"
                  disabled={!dailyStats.canCheckin || loading}
                  onClick={handleDailyCheckin}
                  className="h-6 px-2 text-xs"
                >
                  {dailyStats.todaysCheckin ? <Check className="w-3 h-3" /> : "Check"}
                </Button>
              </div>
            </div>
            
            {dailyStats.badgeEligible && (
              <div className="flex items-center justify-center p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Button size="sm" onClick={handleClaimBadge} disabled={loading} className="h-6 text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Claim Daily Badge
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Regular Quest Reward Preview */}
        {isCompleted && (
          <div className="flex items-center justify-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 text-sm">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Quest Badge NFT Unlocked</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectOverviewCard;