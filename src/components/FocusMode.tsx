
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFocus } from '@/contexts/FocusContext';

interface FocusModeProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const FocusMode = ({ isEnabled, onToggle }: FocusModeProps) => {
  const { whitelistedApps, customNotifications, healthReminders, focusStats } = useFocus();

  const activeCustomNotifications = customNotifications.filter(n => n.active).length;
  const activeHealthReminders = healthReminders.filter(r => r.active).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Focus Mode Settings
          </CardTitle>
          <CardDescription>
            Configure how Focus Mode monitors and blocks distracting applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Enable Focus Mode</h3>
              <p className="text-sm text-gray-600">Monitor active apps and trigger notifications for distractions</p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={onToggle} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Whitelisted Apps</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Applications allowed during focus</p>
              <div className="text-2xl font-bold text-green-600">{whitelistedApps.length}</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Custom Notifications</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Active custom notifications</p>
              <div className="text-2xl font-bold text-blue-600">{activeCustomNotifications}</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium">Health Reminders</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Active health reminders</p>
              <div className="text-2xl font-bold text-purple-600">{activeHealthReminders}</div>
            </div>
          </div>

          {isEnabled && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Focus Mode Active</span>
              </div>
              <p className="text-sm text-green-700">
                Monitoring active applications and ready to send notifications for distractions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus Session Activity</CardTitle>
          <CardDescription>Real-time monitoring status and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isEnabled ? (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">Focus Mode Running</p>
                    <p className="text-sm text-green-600">Actively monitoring for distractions</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="font-medium">Focus Mode Inactive</p>
                    <p className="text-sm text-gray-600">Enable focus mode to start monitoring</p>
                  </div>
                </div>
                <Badge variant="secondary">Inactive</Badge>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{focusStats.distractionsBlocked}</div>
                <div className="text-xs text-orange-700">Distractions Detected</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{whitelistedApps.length}</div>
                <div className="text-xs text-blue-700">Whitelisted Apps</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
