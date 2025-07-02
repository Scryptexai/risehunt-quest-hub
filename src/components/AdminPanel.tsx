import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    logoUrl: '',
    taskTitle: '',
    taskType: '',
    platform: '',
    actionLink: '',
    description: '',
    verificationType: '',
    rewardType: '',
    active: true
  });

  // Mock existing tasks data
  const existingTasks = [
    {
      id: '1',
      project: 'NitroDex',
      title: 'Follow on Twitter',
      type: 'SOCIAL',
      platform: 'Twitter',
      status: 'Active',
      reward: 'Badge NFT'
    },
    {
      id: '2',
      project: 'Standard Protocol',
      title: 'Join Discord',
      type: 'SOCIAL',
      platform: 'Discord',
      status: 'Active',
      reward: 'Badge NFT'
    },
    {
      id: '3',
      project: 'B3X',
      title: 'Try testnet',
      type: 'ON-CHAIN',
      platform: 'Custom',
      status: 'Active',
      reward: 'Badge NFT'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting task:', formData);
    // In real app, this would send to backend
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Add New Task Form */}
      <Card className="bg-gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Submit New Project Task</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., NitroDex"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                />
              </div>

              {/* Project Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Project Logo URL</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                />
              </div>

              {/* Task Title */}
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input
                  id="taskTitle"
                  placeholder="e.g., Follow on Twitter"
                  value={formData.taskTitle}
                  onChange={(e) => handleInputChange('taskTitle', e.target.value)}
                />
              </div>

              {/* Task Type */}
              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select onValueChange={(value) => handleInputChange('taskType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOCIAL">Social</SelectItem>
                    <SelectItem value="ON-CHAIN">On-chain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select onValueChange={(value) => handleInputChange('platform', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="onchain">On-chain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Link */}
              <div className="space-y-2">
                <Label htmlFor="actionLink">Action Link</Label>
                <Input
                  id="actionLink"
                  placeholder="https://x.com/project"
                  value={formData.actionLink}
                  onChange={(e) => handleInputChange('actionLink', e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Follow @project on Twitter for updates and announcements"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Verification Type */}
              <div className="space-y-2">
                <Label htmlFor="verificationType">Verification Type</Label>
                <Select onValueChange={(value) => handleInputChange('verificationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="twitter">Twitter API</SelectItem>
                    <SelectItem value="discord">Discord API</SelectItem>
                    <SelectItem value="onchain">On-chain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reward Type */}
              <div className="space-y-2">
                <Label htmlFor="rewardType">Reward Type</Label>
                <Select onValueChange={(value) => handleInputChange('rewardType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="badge">Badge NFT</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="both">Badge + Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Toggle */}
              <div className="space-y-2">
                <Label htmlFor="active">Active</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange('active', checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Tasks Table */}
      <Card className="bg-gradient-card border-primary/20">
        <CardHeader>
          <CardTitle>Existing Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Task Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.project}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={task.type === 'SOCIAL' ? 'secondary' : 'default'}>
                      {task.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.platform}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.reward}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
