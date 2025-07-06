import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // NEW: Import Progress
import { Twitter, MessageCircle, Send, Globe, Zap, Check, Clock, ArrowLeft, Award, Sparkles, Loader2 } from 'lucide-react'; // Added Loader2, removed unnecessary imports
import { projects, Task, DailyTaskMeta } from '@/data/projects'; // NEW: Import Task and DailyTaskMeta
import { useUserProgress } from '@/hooks/useUserProgress';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react'; // NEW: Import useState
import { useDailyTasks } from '@/hooks/useDailyTasks'; // NEW: Import useDailyTasks

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { updateTaskStatus, getTaskProgress, addBadge, progress } = useUserProgress();
  const { toast } = useToast();
  const { completeDailyTask, getDailyStats, loading: dailyTasksLoading } = useDailyTasks(); // NEW: use useDailyTasks hook
  
  const project = projects.find(p => p.id === projectId);
  
  // NEW: State to manage loading status per main quest task during simulated verification
  const [mainTaskLoading, setMainTaskLoading] = useState<Record<string, boolean>>({});
  
  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button onClick={() => navigate('/')}>Back to Quest Hub</Button>
        </div>
      </div>
    );
  }

  const completedMainTasksCount = project.tasks.filter(task => {
    const taskProgress = getTaskProgress(task.id);
    return taskProgress?.status === 'completed';
  }).length;
  const allMainTasksCompleted = completedMainTasksCount === project.tasks.length;
  const isProjectBadgeClaimed = progress?.badges.includes(project.id); // Check if this project's main badge is claimed

  // NEW: Get daily task stats for this project
  const dailyStats = getDailyStats(project.id);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'discord': return <MessageCircle className="w-4 h-4" />;
      case 'telegram': return <Send className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      case 'onchain': return <Zap className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformVariant = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'twitter';
      case 'discord': return 'discord';
      case 'telegram': return 'telegram';
      case 'onchain': return 'onchain';
      default: return 'quest';
    }
  };

  // NEW: handleTaskAction for MAIN QUEST TASKS
  const handleMainTaskAction = async (task: Task) => {
    setMainTaskLoading(prev => ({ ...prev, [task.id]: true }));
    
    // 1. Update status to in_progress
    updateTaskStatus(task.id, project.id, 'in_progress');

    // 2. Show toast indicating verification is starting
    toast({
      title: `${task.type === 'ON-CHAIN' ? 'Initiating On-Chain verification' : 'Verifying Social Task'}`,
      description: `Please complete the action on ${task.platform.toUpperCase()}. We will verify automatically.`,
      duration: (task.verificationCriteria?.simulationDelayMs || 2500) + 1500, // Duration slightly longer than simulation
    });

    // 3. Simulate backend verification
    const verificationSuccess = await new Promise(resolve => setTimeout(() => {
      resolve(Math.random() > 0.1); // Simulate ~90% success rate
    }, task.verificationCriteria?.simulationDelayMs || 2500)); 

    setMainTaskLoading(prev => ({ ...prev, [task.id]: false }));

    if (verificationSuccess) {
      updateTaskStatus(task.id, project.id, 'completed');
      toast({
        title: "Task Completed!",
        description: `Great job! "${task.title}" has been verified.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Verification Failed",
        description: `Could not verify "${task.title}". Please ensure you completed the action correctly and try again.`,
        variant: "destructive"
      });
      updateTaskStatus(task.id, project.id, 'incomplete'); // Revert status on failure
    }
  };

  // NEW: handleDailyTaskAction for DAILY TASKS
  const handleDailyTaskAction = async (dailyTaskMeta: DailyTaskMeta) => {
    setMainTaskLoading(prev => ({ ...prev, [`daily-${dailyTaskMeta.id}`]: true })); // Use specific ID for daily tasks loading
    
    const result = await completeDailyTask(dailyTaskMeta, project.id); // Pass DailyTaskMeta
    
    setMainTaskLoading(prev => ({ ...prev, [`daily-${dailyTaskMeta.id}`]: false }));

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Daily Task Completed!",
        description: `Daily "${dailyTaskMeta.title}" for ${project.name} verified!`,
      });
    }
  };

  const handleClaimMainBadge = async () => {
    // Simulate NFT minting delay
    toast({
      title: "Claiming Badge...",
      description: "Your NFT badge is being minted on Risechain. This may take a moment.",
      duration: 5000,
    });

    await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate minting transaction

    addBadge(project.id);
    toast({
      title: "Badge Claimed!",
      description: `You've earned the ${project.name} badge NFT!`,
    });
  };

  const handleClaimDailyBadge = async () => {
    // This action is handled by useDailyTasks hook
    await completeDailyTask(dailyTasksLoading as any, project.id); // Call daily task completion for placeholder daily task
    // The actual claimDailyBadge is handled by useDailyTasks.claimDailyBadge
    // This button here should trigger that.
    await useDailyTasks().claimDailyBadge(project.id); // Directly call from the hook
  };


  const getTaskStatus = (task: Task): Task['status'] => {
    const progressStatus = getTaskProgress(task.id);
    return progressStatus?.status || 'incomplete';
  };

  const getMainQuestActionButton = (task: Task) => {
    const status = getTaskStatus(task);
    const isLoading = mainTaskLoading[task.id];

    if (status === 'completed') {
      return (
        <Button variant="badge" size="sm" disabled>
          <Check className="w-4 h-4" />
          Completed
        </Button>
      );
    } else {
      return (
        <Button 
          variant="quest" 
          size="sm"
          onClick={() => handleMainTaskAction(task)} // Call new handleMainTaskAction
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            <>
              Start Task
            </>
          )}
        </Button>
      );
    }
  };

  // Helper for Daily Task button state
  const getDailyTaskActionButton = (dailyTaskMeta: DailyTaskMeta) => {
    const taskStat = dailyStats.tasks.find(t => t.id === dailyTaskMeta.id);
    const isLoading = mainTaskLoading[`daily-${dailyTaskMeta.id}`];

    if (!taskStat || !taskStat.canCompleteToday) {
      return (
        <Button variant="secondary" size="sm" disabled>
          {taskStat ? `${taskStat.completedToday}/${taskStat.dailyLimit}` : 'Done'}
        </Button>
      );
    } else {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleDailyTaskAction(dailyTaskMeta)}
          disabled={isLoading || dailyTasksLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            dailyTaskMeta.action === 'check_in_game' ? 'Check In' : 'Complete'
          )}
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quest Hub
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <img 
              src={project.logo} 
              alt={`${project.name} logo`} 
              className="w-16 h-16 rounded-xl object-cover border border-primary/20"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {project.name} Quest
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {project.description}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="outline" className="border-primary/30">
                  {completedMainTasksCount}/{project.tasks.length} Tasks Completed
                </Badge>
                <a 
                  href={project.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Quest Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Main Quest Tasks</h2>
              <div className="text-sm text-muted-foreground">
                Complete all tasks to unlock your NFT badge
              </div>
            </div>

            <div className="space-y-4">
              {project.tasks.map((task, index) => (
                <Card key={task.id} className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getPlatformIcon(task.platform)}
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge 
                              variant={task.type === 'SOCIAL' ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              {task.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {task.description}
                            {task.verificationCriteria?.valueDisplay && 
                                <span className="ml-1 text-primary">({task.verificationCriteria.valueDisplay})</span>}
                          </p>
                          <div className="text-xs text-primary font-medium">
                            Reward: {task.reward}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {/* Always show the link button */}
                        <Button
                          variant={getPlatformVariant(task.platform) as any}
                          size="sm"
                          onClick={() => window.open(task.link, '_blank')}
                        >
                          {getPlatformIcon(task.platform)}
                          <span className="ml-2">
                            {task.platform === 'onchain' ? 'Launch App' : 
                             task.platform === 'website' ? 'Visit Site' : 
                             task.platform === 'twitter' ? 'Go to X' : 
                             task.platform === 'discord' ? 'Join Discord' : 
                             task.platform === 'telegram' ? 'Join Telegram' : 'Open'}
                          </span>
                        </Button>
                        
                        {getMainQuestActionButton(task)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* NEW: Daily Tasks Section - Moved here from homepage */}
            {project.dailyTasks && project.dailyTasks.length > 0 && (
                <div className="space-y-6 mt-8">
                    <Card className="bg-gradient-card border-primary/20">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <span>{project.name} Daily Tasks</span>
                            </CardTitle>
                            <CardDescription>
                                Complete these daily tasks to earn the "{project.name} Daily Master Badge".
                                Progress: {dailyStats.totalCompletions}/{dailyStats.badgeRequirement}
                            </CardDescription>
                            <Progress value={(dailyStats.totalCompletions / dailyStats.badgeRequirement) * 100} className="h-2 mt-2" />
                            {dailyStats.badgeEligible && (
                                <p className="text-xs text-primary font-medium mt-1">🎉 Badge ready to claim!</p>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {dailyStats.tasks.map((dailyTask) => (
                                <div key={dailyTask.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                                    <div className="flex items-center space-x-3">
                                        {getPlatformIcon(dailyTask.platform)} {/* Use icon based on platform for daily tasks */}
                                        <div>
                                            <p className="font-medium text-sm">{dailyTask.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Today: {dailyTask.completedToday}/{dailyTask.dailyLimit} completed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            variant={getPlatformVariant(dailyTask.platform) as any}
                                            size="sm"
                                            onClick={() => window.open(dailyTask.link, '_blank')}
                                        >
                                            {getPlatformIcon(dailyTask.platform)}
                                            <span className="ml-2">
                                                {dailyTask.platform === 'onchain' ? 'Launch App' : 'Visit Site'}
                                            </span>
                                        </Button>
                                        {getDailyTaskActionButton(dailyTask as DailyTaskMeta)} {/* Ensure type compatibility */}
                                    </div>
                                </div>
                            ))}
                            {dailyStats.badgeEligible && (
                                <div className="flex items-center justify-center p-2 bg-primary/10 rounded-lg border border-primary/20">
                                    <Button size="sm" onClick={useDailyTasks().claimDailyBadge.bind(null, project.id)} disabled={dailyTasksLoading}>
                                        <Award className="w-3 h-3 mr-1" />
                                        Claim Daily Badge
                                    </Button>
                                </div>
                            )}
                            {!dailyStats.badgeEligible && dailyStats.totalCompletions > 0 && (
                              <div className="text-xs text-center text-muted-foreground mt-3">
                                {dailyStats.badgeRequirement - dailyStats.totalCompletions} more daily completions for badge!
                              </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
          </div>

          {/* NFT Badge Section (Sidebar) */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-primary/20 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Quest Badge</span>
                </CardTitle>
                <CardDescription>
                  Complete all tasks to unlock your exclusive NFT badge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badge Preview */}
                <div className="relative">
                  <div 
                    className={`w-full aspect-square rounded-lg border-2 border-primary/20 flex items-center justify-center overflow-hidden transition-all duration-500 
                      ${allMainTasksCompleted && !isProjectBadgeClaimed ? 'bg-gradient-primary shadow-glow' : 'bg-muted/50 grayscale'}` // Apply grayscale if not completed/claimed
                    }
                  >
                    <img 
                      src={project.badgeImage} 
                      alt={`${project.name} Badge`} 
                      className={`w-full h-full object-cover transition-all duration-500 
                        ${allMainTasksCompleted && !isProjectBadgeClaimed ? '' : 'blur-sm opacity-50'}` // Blur and opacity for uncompleted/unclaimed
                      }
                    />
                    {!allMainTasksCompleted && ( // Overlay for uncompleted quests
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm p-4">
                        <Clock className="w-8 h-8 text-muted-foreground mb-2" />
                        <div className="text-sm font-medium text-center text-muted-foreground">
                          {project.tasks.length - completedMainTasksCount} tasks remaining to reveal
                        </div>
                      </div>
                    )}
                    {allMainTasksCompleted && !isProjectBadgeClaimed && ( // Overlay for completed but not claimed
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-4">
                        <Sparkles className="w-8 h-8 text-primary mb-2 animate-pulse" />
                        <div className="text-sm font-medium text-center text-primary">
                          Badge Unlocked!
                        </div>
                      </div>
                    )}
                    {isProjectBadgeClaimed && ( // Overlay for claimed badges
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-4">
                        <Check className="w-8 h-8 text-green-500 mb-2" />
                        <div className="text-sm font-medium text-center text-green-500">
                          Badge Claimed!
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {allMainTasksCompleted && !isProjectBadgeClaimed && (
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{completedMainTasksCount}/{project.tasks.length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedMainTasksCount / project.tasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                <Button 
                  className="w-full" 
                  disabled={!allMainTasksCompleted || isProjectBadgeClaimed} // Disable if not completed or already claimed
                  variant={allMainTasksCompleted && !isProjectBadgeClaimed ? "default" : "outline"}
                  onClick={allMainTasksCompleted && !isProjectBadgeClaimed ? handleClaimMainBadge : undefined}
                >
                  {isProjectBadgeClaimed ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Badge Claimed!
                    </>
                  ) : allMainTasksCompleted ? (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Claim Badge NFT
                    </>
                  ) : (
                    'Complete all tasks to claim'
                  )}
                </Button>

                {allMainTasksCompleted && !isProjectBadgeClaimed && (
                  <div className="text-xs text-center text-muted-foreground mt-3">
                    🎉 Congratulations! You've completed all tasks for {project.name}. Claim your badge!
                  </div>
                )}
                 {isProjectBadgeClaimed && (
                  <div className="text-xs text-center text-muted-foreground">
                    You have successfully claimed the {project.name} badge.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;