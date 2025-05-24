
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bell, Trash2, FileImage, FileVideo, Type, Heart, Eye, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFocus } from '@/contexts/FocusContext';

export const CustomRules = () => {
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleMessage, setNewRuleMessage] = useState('');
  const [newRuleType, setNewRuleType] = useState<'text' | 'image' | 'video'>('text');
  const [newRuleContent, setNewRuleContent] = useState('');
  
  const { 
    customNotifications, 
    healthReminders,
    addCustomNotification, 
    updateCustomNotification, 
    removeCustomNotification,
    updateHealthReminder
  } = useFocus();
  const { toast } = useToast();

  const createRule = () => {
    if (newRuleName.trim() && newRuleMessage.trim()) {
      addCustomNotification({
        name: newRuleName.trim(),
        message: newRuleMessage.trim(),
        type: newRuleType,
        content: newRuleContent.trim() || undefined,
        active: true
      });
      
      setNewRuleName('');
      setNewRuleMessage('');
      setNewRuleContent('');
      setNewRuleType('text');
      
      toast({
        title: "Custom Notification Created",
        description: `${newRuleName.trim()} has been created.`,
      });
    }
  };

  const toggleRule = (id: string) => {
    const rule = customNotifications.find(r => r.id === id);
    if (rule) {
      updateCustomNotification(id, { active: !rule.active });
    }
  };

  const deleteRule = (id: string) => {
    const ruleToDelete = customNotifications.find(rule => rule.id === id);
    removeCustomNotification(id);
    toast({
      title: "Notification Deleted",
      description: `${ruleToDelete?.name} has been deleted.`,
    });
  };

  const toggleHealthReminder = (id: string) => {
    const reminder = healthReminders.find(r => r.id === id);
    if (reminder) {
      updateHealthReminder(id, { active: !reminder.active });
      toast({
        title: reminder.active ? "Reminder Disabled" : "Reminder Enabled",
        description: `${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} reminder has been ${reminder.active ? 'disabled' : 'enabled'}.`,
      });
    }
  };

  const getTypeIcon = (type: 'text' | 'image' | 'video') => {
    switch (type) {
      case 'image': return <FileImage className="h-4 w-4" />;
      case 'video': return <FileVideo className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const getHealthIcon = (type: 'posture' | 'hydration' | 'eyecare') => {
    switch (type) {
      case 'posture': return <Users className="h-4 w-4" />;
      case 'hydration': return <Heart className="h-4 w-4" />;
      case 'eyecare': return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Custom Notification
          </CardTitle>
          <CardDescription>
            Set up custom messages with different media types for focus breaks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Notification name..."
            value={newRuleName}
            onChange={(e) => setNewRuleName(e.target.value)}
          />

          <Select value={newRuleType} onValueChange={(value: 'text' | 'image' | 'video') => setNewRuleType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text Message
                </div>
              </SelectItem>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Image
                </div>
              </SelectItem>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <FileVideo className="h-4 w-4" />
                  Video
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Custom message to display when focus is broken..."
            value={newRuleMessage}
            onChange={(e) => setNewRuleMessage(e.target.value)}
            rows={3}
          />

          {(newRuleType === 'image' || newRuleType === 'video') && (
            <Input
              placeholder={`${newRuleType === 'image' ? 'Image' : 'Video'} URL...`}
              value={newRuleContent}
              onChange={(e) => setNewRuleContent(e.target.value)}
            />
          )}

          <Button onClick={createRule} className="w-full">
            Create Notification Rule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Custom Notifications
          </CardTitle>
          <CardDescription>
            Manage your custom notification messages for focus breaks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No custom notifications created yet</p>
                <p className="text-sm text-gray-400">When focus mode is active without custom rules, a default notification will be shown</p>
              </div>
            ) : (
              customNotifications.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(rule.type)}
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rule.message}</p>
                    {rule.content && (
                      <p className="text-xs text-blue-600 mt-1">Media: {rule.content}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={rule.active} 
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Reminders
          </CardTitle>
          <CardDescription>
            Enable periodic reminders for posture, hydration, and eye care
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getHealthIcon(reminder.type)}
                    <h4 className="font-medium capitalize">{reminder.type} Check</h4>
                    <Badge variant={reminder.active ? "default" : "secondary"}>
                      Every {reminder.interval} min
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{reminder.message}</p>
                </div>
                <Switch 
                  checked={reminder.active} 
                  onCheckedChange={() => toggleHealthReminder(reminder.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
