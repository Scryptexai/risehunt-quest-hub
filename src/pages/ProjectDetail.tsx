import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, MessageCircle, Send, Globe, Zap, Check, Clock, ArrowLeft, Award, Sparkles, Loader2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { updateTaskStatus, getTaskProgress, addBadge, progress } = useUserProgress();
  const { toast } = useToast();
  const [verifyingTasks, setVerifyingTasks] = useState<Set<string>>(new Set());
  
  const project = projects.find(p => p.id === projectId);
  
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

  const completedTasks = project.tasks.filter(task => {
    const progress = getTaskProgress(task.id);
    return progress?.status === 'completed';
  }).length;
  const allTasksCompleted = completedTasks === project.tasks.length;
  const badgeClaimed = progress?.badges.includes(project.id);

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

  const handleTaskAction = async (taskId: string, task: any) => {
    const currentStatus = getTaskStatus(task);
    
    if (currentStatus === 'incomplete') {
      // Open the task link and start verification
      window.open(task.link, '_blank');
      
      // Start verification process
      setVerifyingTasks(prev => new Set(prev).add(taskId));
      updateTaskStatus(taskId, project.id, 'in_progress');
      
      toast({
        title: "Verifying...",
        description: "Please complete the action. We're automatically verifying your progress.",
      });

      // Simulate verification based on task criteria
      try {
        await new Promise(resolve => setTimeout(resolve, task.verificationCriteria.simulationDelayMs));
        
        // Simulate success/failure based on success rate
        const isSuccess = Math.random() < task.verificationCriteria.successRate;
        
        if (isSuccess) {
          updateTaskStatus(taskId, project.id, 'completed');
          toast({
            title: "Task Completed!",
            description: `Great job! ${task.reward} earned.`,
          });
        } else {
          updateTaskStatus(taskId, project.id, 'incomplete');
          toast({
            title: "Verification Failed",
            description: "Please try again. Make sure you've completed the required action.",
            variant: "destructive"
          });
        }
      } catch (error) {
        updateTaskStatus(taskId, project.id, 'incomplete');
        toast({
          title: "Verification Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      } finally {
        setVerifyingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }
    }
  };

  const handleClaimBadge = () => {
    addBadge(project.id);
    toast({
      title: "Badge claimed!",
      description: `You've earned the ${project.name} badge NFT!`,
    });
  };

  const getTaskStatus = (task: any) => {
    const progress = getTaskProgress(task.id);
    return progress?.status || 'incomplete';
  };

  const getStatusButton = (task: any) => {
    const status = getTaskStatus(task);
    const isVerifying = verifyingTasks.has(task.id);
    
    switch (status) {
      case 'completed':
        return (
          <Button variant="badge" size="sm" disabled>
            <Check className="w-4 h-4" />
            Completed
          </Button>
        );
      case 'in_progress':
        return (
          <Button variant="secondary" size="sm" disabled>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying...
          </Button>
        );
      default:
        return (
          <Button 
            variant="quest" 
            size="sm"
            onClick={() => handleTaskAction(task.id, task)}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Start Task'
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
                  {completedTasks}/{project.tasks.length} Tasks Completed
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
          {/* Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quest Tasks</h2>
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
                          </p>
                          <div className="text-xs text-primary font-medium">
                            Reward: {task.reward}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {getStatusButton(task)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* NFT Badge Section */}
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
                    className={`w-full h-40 rounded-lg border-2 border-primary/20 overflow-hidden transition-all duration-500 ${
                      allTasksCompleted && !badgeClaimed
                        ? 'shadow-glow' 
                        : !allTasksCompleted 
                        ? 'grayscale blur-sm' 
                        : ''
                    }`}
                  >
                    <img 
                      src={project.badgeImage} 
                      alt={`${project.name} NFT Badge`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay for locked state */}
                    {!allTasksCompleted && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            {project.tasks.length - completedTasks} tasks remaining
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Sparkles effect for completed state */}
                    {allTasksCompleted && !badgeClaimed && (
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                    )}
                    
                    {/* Claimed indicator */}
                    {badgeClaimed && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-background rounded-full p-1">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{completedTasks}/{project.tasks.length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedTasks / project.tasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                <Button 
                  className="w-full" 
                  disabled={!allTasksCompleted || badgeClaimed}
                  variant={allTasksCompleted && !badgeClaimed ? "default" : "outline"}
                  onClick={allTasksCompleted && !badgeClaimed ? handleClaimBadge : undefined}
                >
                  {badgeClaimed ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Badge Claimed
                    </>
                  ) : allTasksCompleted ? (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Claim Badge NFT
                    </>
                  ) : (
                    'Complete all tasks to claim'
                  )}
                </Button>

                {allTasksCompleted && !badgeClaimed && (
                  <div className="text-xs text-center text-muted-foreground">
                    🎉 Congratulations! You've completed all tasks for {project.name}
                  </div>
                )}
                
                {badgeClaimed && (
                  <div className="text-xs text-center text-muted-foreground">
                    ✅ Badge successfully claimed and added to your collection
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