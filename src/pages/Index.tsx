
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FocusMode } from '@/components/FocusMode';
import { WhitelistManager } from '@/components/WhitelistManager';
import { CustomRules } from '@/components/CustomRules';
import { FocusProvider, useFocus } from '@/contexts/FocusContext';
import { Eye, Shield, Settings, Bell } from 'lucide-react';

const IndexContent = () => {
  const { focusModeEnabled, setFocusModeEnabled, focusStats } = useFocus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Eye className="h-10 w-10 text-blue-600" />
            Attention Please!
          </h1>
          <p className="text-xl text-gray-600">Stay focused and productive with smart monitoring</p>
        </div>

        {/* Quick Status Card */}
        <Card className="mb-8 border-2 border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Focus Status</CardTitle>
                <CardDescription>Monitor your productivity in real-time</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={focusModeEnabled ? "default" : "secondary"} className="text-sm px-3 py-1">
                  {focusModeEnabled ? "Focus Mode Active" : "Focus Mode Inactive"}
                </Badge>
                <Switch
                  checked={focusModeEnabled}
                  onCheckedChange={setFocusModeEnabled}
                  className="scale-125"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{focusStats.focusedToday}</div>
                <div className="text-sm text-green-700">Focused Today</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{focusStats.distractionsBlocked}</div>
                <div className="text-sm text-orange-700">Distractions Blocked</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{focusStats.focusScore}%</div>
                <div className="text-sm text-blue-700">Focus Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="focus" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="focus" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Focus Mode
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              App Whitelist
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications & Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="focus">
            <FocusMode isEnabled={focusModeEnabled} onToggle={setFocusModeEnabled} />
          </TabsContent>

          <TabsContent value="whitelist">
            <WhitelistManager />
          </TabsContent>

          <TabsContent value="rules">
            <CustomRules />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <FocusProvider>
      <IndexContent />
    </FocusProvider>
  );
};

export default Index;
