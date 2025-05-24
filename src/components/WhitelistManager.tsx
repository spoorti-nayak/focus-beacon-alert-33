
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Globe, Monitor } from 'lucide-react';

export const WhitelistManager = () => {
  const [newApp, setNewApp] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [whitelistedApps] = useState([
    'Visual Studio Code',
    'Slack',
    'Notion',
    'Terminal'
  ]);
  const [whitelistedWebsites] = useState([
    'github.com',
    'stackoverflow.com',
    'docs.google.com'
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Whitelisted Applications
          </CardTitle>
          <CardDescription>
            Applications that are allowed during Focus Mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add application name..."
              value={newApp}
              onChange={(e) => setNewApp(e.target.value)}
            />
            <Button>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {whitelistedApps.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Monitor className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{app}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Whitelisted Websites
          </CardTitle>
          <CardDescription>
            Websites that are allowed during Focus Mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add website URL..."
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
            />
            <Button>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {whitelistedWebsites.map((website, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <Globe className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">{website}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
