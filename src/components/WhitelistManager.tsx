
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Globe, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WhitelistManager = () => {
  const [newApp, setNewApp] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [whitelistedApps, setWhitelistedApps] = useState<string[]>([]);
  const [whitelistedWebsites, setWhitelistedWebsites] = useState<string[]>([]);
  const { toast } = useToast();

  const addApp = () => {
    if (newApp.trim() && !whitelistedApps.includes(newApp.trim())) {
      setWhitelistedApps([...whitelistedApps, newApp.trim()]);
      setNewApp('');
      toast({
        title: "Application Added",
        description: `${newApp.trim()} has been added to the whitelist.`,
      });
    }
  };

  const removeApp = (appToRemove: string) => {
    setWhitelistedApps(whitelistedApps.filter(app => app !== appToRemove));
    toast({
      title: "Application Removed",
      description: `${appToRemove} has been removed from the whitelist.`,
    });
  };

  const addWebsite = () => {
    if (newWebsite.trim() && !whitelistedWebsites.includes(newWebsite.trim())) {
      setWhitelistedWebsites([...whitelistedWebsites, newWebsite.trim()]);
      setNewWebsite('');
      toast({
        title: "Website Added",
        description: `${newWebsite.trim()} has been added to the whitelist.`,
      });
    }
  };

  const removeWebsite = (websiteToRemove: string) => {
    setWhitelistedWebsites(whitelistedWebsites.filter(website => website !== websiteToRemove));
    toast({
      title: "Website Removed",
      description: `${websiteToRemove} has been removed from the whitelist.`,
    });
  };

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
              onKeyPress={(e) => e.key === 'Enter' && addApp()}
            />
            <Button onClick={addApp}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {whitelistedApps.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No applications whitelisted yet</p>
            ) : (
              whitelistedApps.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Monitor className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{app}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeApp(app)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
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
              onKeyPress={(e) => e.key === 'Enter' && addWebsite()}
            />
            <Button onClick={addWebsite}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {whitelistedWebsites.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No websites whitelisted yet</p>
            ) : (
              whitelistedWebsites.map((website, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <Globe className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">{website}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Allowed</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeWebsite(website)}>
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
