
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Image, Video, Clock, Bell } from 'lucide-react';

export const CustomRules = () => {
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleMessage, setNewRuleMessage] = useState('');
  const [rules] = useState([
    {
      id: 1,
      name: 'Hydration Reminder',
      message: 'Time to drink some water! 💧',
      interval: '30 minutes',
      active: true,
      hasMedia: false
    },
    {
      id: 2,
      name: 'Posture Check',
      message: 'Straighten your back and relax your shoulders',
      interval: '45 minutes',
      active: true,
      hasMedia: true
    },
    {
      id: 3,
      name: 'Eye Rest',
      message: 'Look away from your screen for 20 seconds',
      interval: '20 minutes',
      active: false,
      hasMedia: false
    }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Rule
          </CardTitle>
          <CardDescription>
            Set up custom notifications with text, images, or videos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rule name..."
              value={newRuleName}
              onChange={(e) => setNewRuleName(e.target.value)}
            />
            <div className="flex gap-2">
              <Input placeholder="Interval (minutes)" type="number" />
              <Button variant="outline">
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Custom message to display..."
            value={newRuleMessage}
            onChange={(e) => setNewRuleMessage(e.target.value)}
            rows={3}
          />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Image className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button variant="outline" className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Active Time Range</h4>
              <p className="text-sm text-gray-600">Set when this rule should be active</p>
            </div>
            <div className="flex gap-2">
              <Input type="time" defaultValue="09:00" className="w-24" />
              <span className="self-center">to</span>
              <Input type="time" defaultValue="17:00" className="w-24" />
            </div>
          </div>

          <Button className="w-full">Create Rule</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Active Rules
          </CardTitle>
          <CardDescription>
            Manage your custom notification rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant={rule.active ? "default" : "secondary"}>
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                    {rule.hasMedia && (
                      <Badge variant="outline">
                        <Image className="h-3 w-3 mr-1" />
                        Media
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{rule.message}</p>
                  <p className="text-xs text-gray-500">Every {rule.interval}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={rule.active} />
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
