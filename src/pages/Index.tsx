import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import ProjectOverviewCard from '@/components/ProjectOverviewCard';
import MyBadgesTab from '@/components/MyBadgesTab';
import Sidebar from '@/components/Sidebar';
import AdminPanel from '@/components/AdminPanel';
import { projects } from '@/data/projects';

const Index = () => {
  const [activeTab, setActiveTab] = useState('quests');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="quests" className="text-lg">
              Quest Board
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-lg">
              My Badges
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-lg">
              Admin Panel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Quest Board */}
              <div className="xl:col-span-3 space-y-8">
                {/* Active Quests Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Active Quests</h2>
                    <div className="text-sm text-muted-foreground">
                      {projects.length} Projects • {projects.reduce((acc, p) => acc + p.tasks.length, 0)} Tasks + Daily Tasks Available
                    </div>
                  </div>

                  {/* Project Overview Cards Grid with Daily Tasks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <ProjectOverviewCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1">
                <Sidebar />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-8">
            <MyBadgesTab />
          </TabsContent>

          <TabsContent value="admin" className="space-y-8">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
