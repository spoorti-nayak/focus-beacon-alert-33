
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  message: string;
  active: boolean;
}

export const CustomRules = () => {
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleMessage, setNewRuleMessage] = useState('');
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const { toast } = useToast();

  const createRule = () => {
    if (newRuleName.trim() && newRuleMessage.trim()) {
      const newRule: NotificationRule = {
        id: Date.now().toString(),
        name: newRuleName.trim(),
        message: newRuleMessage.trim(),
        active: true
      };
      setRules([...rules, newRule]);
      setNewRuleName('');
      setNewRuleMessage('');
      toast({
        title: "Rule Created",
        description: `${newRule.name} notification rule has been created.`,
      });
    }
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const deleteRule = (id: string) => {
    const ruleToDelete = rules.find(rule => rule.id === id);
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: `${ruleToDelete?.name} has been deleted.`,
    });
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
            Set up a custom message to show when non-whitelisted apps are detected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Notification name..."
            value={newRuleName}
            onChange={(e) => setNewRuleName(e.target.value)}
          />

          <Textarea
            placeholder="Custom message to display when focus is broken..."
            value={newRuleMessage}
            onChange={(e) => setNewRuleMessage(e.target.value)}
            rows={3}
          />

          <Button onClick={createRule} className="w-full">
            Create Notification Rule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Active Notification Rules
          </CardTitle>
          <CardDescription>
            Manage your custom notification messages for focus breaks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No custom notifications created yet</p>
                <p className="text-sm text-gray-400">When focus mode is active without custom rules, a default notification will be shown</p>
              </div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rule.message}</p>
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
    </div>
  );
};
