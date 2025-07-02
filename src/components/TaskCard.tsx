import { Project } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, MessageCircle, Send, Globe, Zap, Check, Clock, Award } from 'lucide-react';

interface TaskCardProps {
  project: Project;
}

const TaskCard = ({ project }: TaskCardProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'discord':
        return <MessageCircle className="w-4 h-4" />;
      case 'telegram':
        return <Send className="w-4 h-4" />;
      case 'website':
        return <Globe className="w-4 h-4" />;
      case 'onchain':
        return <Zap className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformVariant = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'twitter';
      case 'discord':
        return 'discord';
      case 'telegram':
        return 'telegram';
      case 'onchain':
        return 'onchain';
      default:
        return 'quest';
    }
  };

  const getStatusButton = (status: string) => {
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
          <Button variant="default" size="sm">
            <Clock className="w-4 h-4" />
            Verify
          </Button>
        );
      default:
        return (
          <Button variant="quest" size="sm">
            Complete Task
          </Button>
        );
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-quest">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={project.logo} 
              alt={`${project.name} logo`} 
              className="w-12 h-12 rounded-lg object-cover border border-primary/20"
            />
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {project.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tasks */}
        <div className="space-y-3">
          {project.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(task.platform)}
                  <span className="font-medium text-sm">{task.title}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={task.type === 'SOCIAL' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {task.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={getPlatformVariant(task.platform) as any}
                  size="sm"
                  onClick={() => window.open(task.link, '_blank')}
                >
                  {getPlatformIcon(task.platform)}
                  <span className="hidden sm:inline">
                    {task.platform === 'onchain' ? 'Launch App' : 
                     task.platform === 'website' ? 'Visit' : 
                     task.platform === 'twitter' ? 'Follow' : 
                     task.platform === 'discord' ? 'Join' : 
                     task.platform === 'telegram' ? 'Join' : 'Open'}
                  </span>
                </Button>
                
                {getStatusButton(task.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Rewards Preview */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>Complete all tasks to earn project badges</span>
          </div>
          <div className="text-sm font-medium text-primary">
            {project.tasks.length} Task{project.tasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;