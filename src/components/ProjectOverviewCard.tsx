import { Project } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Award, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';

interface ProjectOverviewCardProps {
  project: Project;
}

const ProjectOverviewCard = ({ project }: ProjectOverviewCardProps) => {
  const navigate = useNavigate();
  const { getProjectStats } = useUserProgress();
  
  const { completed: completedTasks, total: totalTasks, progress: progressPercentage } = getProjectStats(project.id, project.tasks.length);
  const isCompleted = completedTasks === totalTasks;

  const handleEnterQuest = () => {
    navigate(`/project/${project.id}`);
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

        {/* Reward Preview */}
        {isCompleted && (
          <div className="flex items-center justify-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 text-sm">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Badge NFT Unlocked</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectOverviewCard;