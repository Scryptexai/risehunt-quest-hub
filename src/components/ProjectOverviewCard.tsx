
import { Project } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Award, Clock, Check, Sparkles } from 'lucide-react'; // Removed CheckCircle, Zap, Calendar, Flame
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
// Removed useDailyTasks import as it's no longer needed in this component

interface ProjectOverviewCardProps {
  project: Project;
}

const ProjectOverviewCard = ({ project }: ProjectOverviewCardProps) => {
  const navigate = useNavigate();
  const { isConnected } = useAccount(); // Keep for conditional display if needed elsewhere
  const { getProjectStats, progress } = useUserProgress();
  const { toast } = useToast();
  
  const { completed: completedTasks, total: totalTasks, progress: progressPercentage } = getProjectStats(project.id, project.tasks.length);
  const allTasksCompleted = completedTasks === totalTasks;
  
  // Determine if this project's main badge is claimed
  const isProjectBadgeClaimed = progress?.badges.includes(project.id); 

  let overallStatusBadge = null;
  if (isProjectBadgeClaimed) {
    overallStatusBadge = <Badge variant="badge" className="bg-primary text-primary-foreground">Claimed</Badge>;
  } else if (allTasksCompleted) {
    overallStatusBadge = <Badge variant="default" className="bg-green-500 text-white">Completed</Badge>;
  } else if (completedTasks > 0) {
    overallStatusBadge = <Badge variant="outline" className="text-blue-400 border-blue-400">In Progress</Badge>;
  } else {
    overallStatusBadge = <Badge variant="outline">New Quest</Badge>;
  }


  const handleEnterQuest = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <Card className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-quest cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14"> {/* Set fixed size for badge image for 1:1 ratio */}
              <img 
                src={project.logo} 
                alt={`${project.name} logo`} 
                className="w-full h-full rounded-xl object-cover border border-primary/20 group-hover:border-primary/40 transition-colors"
              />
              {/* No CheckCircle here, as the badge preview below will show overall status */}
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
            {overallStatusBadge}
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
              {allTasksCompleted ? (
                <Award className="w-4 h-4 text-primary" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {allTasksCompleted ? 'Quest Completed!' : 'Quest Progress'}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                allTasksCompleted 
                  ? 'bg-gradient-primary shadow-glow' 
                  : 'bg-primary/60'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Task Types Preview */}
        <div className="flex items-center justify-between pt-2">
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
          
          <Button 
            variant={allTasksCompleted && !isProjectBadgeClaimed ? "default" : "quest"}
            size="sm"
            onClick={handleEnterQuest}
            className="group-hover:scale-105 transition-transform"
          >
            {allTasksCompleted && !isProjectBadgeClaimed ? 'View Quest' : 'Enter Quest'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Regular Quest Reward Preview (NFT Badge Preview) */}
        {isConnected && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Quest Badge NFT</span>
              </div>
              {isProjectBadgeClaimed ? (
                <Badge variant="default" className="text-xs">
                  <Check className="w-3 h-3 mr-1" /> Claimed
                </Badge>
              ) : allTasksCompleted ? (
                <Badge variant="default" className="bg-green-500 text-white text-xs">
                  Ready to Claim!
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {project.tasks.length - completedTasks} tasks remaining
                </Badge>
              )}
            </div>
            <div className={`relative w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden 
              ${allTasksCompleted && !isProjectBadgeClaimed ? 'bg-gradient-primary shadow-glow' : 'bg-muted/50 grayscale'}`}>
              <img 
                src={project.badgeImage} 
                alt={`${project.name} Badge`} 
                className={`w-full h-full object-cover transition-all duration-500 
                  ${allTasksCompleted && !isProjectBadgeClaimed ? '' : 'blur-sm opacity-50'}` 
                }
              />
              {!allTasksCompleted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm p-4">
                  <Clock className="w-8 h-8 text-muted-foreground mb-2" />
                  <div className="text-sm font-medium text-center text-muted-foreground">
                    Complete all {project.tasks.length - completedTasks} tasks to reveal
                  </div>
                </div>
              )}
              {allTasksCompleted && !isProjectBadgeClaimed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-4">
                  <Sparkles className="w-8 h-8 text-primary mb-2 animate-pulse" />
                  <div className="text-sm font-medium text-center text-primary">
                    Badge Unlocked!
                  </div>
                </div>
              )}
              {isProjectBadgeClaimed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-4">
                  <Check className="w-8 h-8 text-green-500 mb-2" />
                  <div className="text-sm font-medium text-center text-green-500">
                    Badge Claimed!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectOverviewCard;