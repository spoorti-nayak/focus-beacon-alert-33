
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Target, AlertTriangle } from 'lucide-react';

interface FocusModeProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const FocusMode = ({ isEnabled, onToggle }: FocusModeProps) => {
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
              <p className="text-sm text-gray-600">Monitor active apps and block distractions</p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={onToggle} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Session Timer</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Set focus session duration</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">25m</Button>
                <Button variant="outline" size="sm">45m</Button>
                <Button variant="outline" size="sm">60m</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Break Intervals</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Configure break reminders</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">5m</Button>
                <Button variant="outline" size="sm">10m</Button>
                <Button variant="outline" size="sm">15m</Button>
              </div>
            </div>
          </div>

          {isEnabled && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Focus Mode Active</span>
              </div>
              <p className="text-sm text-green-700">
                Monitoring active applications and ready to block distractions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Apps and websites accessed during focus sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-medium">VS</span>
                </div>
                <div>
                  <p className="font-medium">Visual Studio Code</p>
                  <p className="text-sm text-gray-600">Allowed - Whitelisted</p>
                </div>
              </div>
              <Badge variant="outline">Active 2h</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">Social Media Site</p>
                  <p className="text-sm text-red-600">Blocked - Not whitelisted</p>
                </div>
              </div>
              <Badge variant="destructive">Blocked</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
