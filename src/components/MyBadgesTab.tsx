import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ExternalLink, Wallet } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAccount } from 'wagmi';
import { projects } from '@/data/projects';

const MyBadgesTab = () => {
  const { isConnected } = useAccount();
  const { progress } = useUserProgress();

  if (!isConnected) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Connect Wallet to View Badges</h3>
            <p className="text-muted-foreground">
              Connect your wallet to see your earned NFT badges
            </p>
          </div>
        </div>
      </div>
    );
  }

  const earnedBadges = projects.filter(project => 
    progress?.badges.includes(project.id)
  );

  if (earnedBadges.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold mb-2">No Badges Yet</h3>
            <p className="text-muted-foreground">
              Complete quests to earn NFT badges and see them here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My NFT Badges</h2>
        <div className="text-sm text-muted-foreground">
          {earnedBadges.length} Badge{earnedBadges.length !== 1 ? 's' : ''} Earned
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earnedBadges.map((project) => (
          <Card key={project.id} className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="relative">
                <img 
                  src={project.badgeImage} 
                  alt={`${project.name} NFT Badge`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-gradient-primary text-white border-0">
                    <Award className="w-3 h-3 mr-1" />
                    Earned
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Quest Master Badge
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Earned from completing all {project.tasks.length} tasks
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('#', '_blank')}
                  className="h-8 px-3 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View on Explorer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBadgesTab;