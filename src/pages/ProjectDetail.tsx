import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, MessageCircle, Send, Globe, Zap, Check, Clock, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { projects } from '@/data/projects';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [taskStatuses, setTaskStatuses] = useState<Record<string, 'incomplete' | 'verify' | 'completed'>>({});
  
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

  const completedTasks = project.tasks.filter(task => 
    (taskStatuses[task.id] || task.status) === 'completed'
  ).length;
  const allTasksCompleted = completedTasks === project.tasks.length;

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

  const handleTaskAction = (taskId: string, action: 'start' | 'verify') => {
    if (action === 'start') {
      setTaskStatuses(prev => ({ ...prev, [taskId]: 'verify' }));
    } else if (action === 'verify') {
      setTaskStatuses(prev => ({ ...prev, [taskId]: 'completed' }));
    }
  };

  const getTaskStatus = (task: any) => {
    return taskStatuses[task.id] || task.status;
  };

  const getStatusButton = (task: any) => {
    const status = getTaskStatus(task);
    switch (status) {
      case 'completed':
        return (
          <Button variant="badge" size="sm" disabled>
            <Check className="w-4 h-4" />
            Completed
          </Button>
        );
      case 'verify':
        return (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handleTaskAction(task.id, 'verify')}
          >
            <Clock className="w-4 h-4" />
            Verify
          </Button>
        );
      default:
        return (
          <Button 
            variant="quest" 
            size="sm"
            onClick={() => handleTaskAction(task.id, 'start')}
          >
            Start Task
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
                        <Button
                          variant={getPlatformVariant(task.platform) as any}
                          size="sm"
                          onClick={() => window.open(task.link, '_blank')}
                        >
                          {getPlatformIcon(task.platform)}
                          <span className="ml-2">
                            {task.platform === 'onchain' ? 'Launch' : 
                             task.platform === 'website' ? 'Visit' : 
                             task.platform === 'twitter' ? 'Follow' : 'Join'}
                          </span>
                        </Button>
                        
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
                    className={`w-full h-40 rounded-lg border-2 border-primary/20 flex items-center justify-center transition-all duration-500 ${
                      allTasksCompleted 
                        ? 'bg-gradient-primary shadow-glow' 
                        : 'bg-muted/50 grayscale blur-sm'
                    }`}
                  >
                    <div className="text-center">
                      <Award className={`w-12 h-12 mx-auto mb-2 ${allTasksCompleted ? 'text-white' : 'text-muted-foreground'}`} />
                      <div className={`font-bold ${allTasksCompleted ? 'text-white' : 'text-muted-foreground'}`}>
                        {project.name}
                      </div>
                      <div className={`text-sm ${allTasksCompleted ? 'text-white/80' : 'text-muted-foreground'}`}>
                        Quest Master
                      </div>
                    </div>
                  </div>
                  
                  {!allTasksCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/20">
                        <div className="text-sm font-medium text-center">
                          {project.tasks.length - completedTasks} tasks remaining
                        </div>
                      </div>
                    </div>
                  )}

                  {allTasksCompleted && (
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                  )}
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
                  disabled={!allTasksCompleted}
                  variant={allTasksCompleted ? "default" : "outline"}
                >
                  {allTasksCompleted ? (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Claim Badge NFT
                    </>
                  ) : (
                    'Complete all tasks to claim'
                  )}
                </Button>

                {allTasksCompleted && (
                  <div className="text-xs text-center text-muted-foreground">
                    🎉 Congratulations! You've completed all tasks for {project.name}
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