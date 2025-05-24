
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FocusContextType {
  focusModeEnabled: boolean;
  setFocusModeEnabled: (enabled: boolean) => void;
  whitelistedApps: string[];
  whitelistedWebsites: string[];
  customNotifications: Array<{
    id: string;
    name: string;
    message: string;
    active: boolean;
  }>;
  focusStats: {
    focusedToday: string;
    distractionsBlocked: number;
    focusScore: number;
  };
  addToWhitelist: (type: 'app' | 'website', item: string) => void;
  removeFromWhitelist: (type: 'app' | 'website', item: string) => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [whitelistedApps, setWhitelistedApps] = useState<string[]>([]);
  const [whitelistedWebsites, setWhitelistedWebsites] = useState<string[]>([]);
  const [customNotifications, setCustomNotifications] = useState<Array<{
    id: string;
    name: string;
    message: string;
    active: boolean;
  }>>([]);
  const [focusStats, setFocusStats] = useState({
    focusedToday: '0h 0m',
    distractionsBlocked: 0,
    focusScore: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (focusModeEnabled) {
      console.log('Focus mode activated - starting monitoring');
      // Simulate focus monitoring
      const interval = setInterval(() => {
        // Simulate detecting a non-whitelisted app
        const shouldTriggerNotification = Math.random() < 0.1; // 10% chance every 5 seconds
        
        if (shouldTriggerNotification) {
          const activeNotification = customNotifications.find(n => n.active);
          const message = activeNotification?.message || "You're outside your focus zone. Please return to your whitelisted applications.";
          
          toast({
            title: "Focus Break Detected",
            description: message,
            duration: 5000,
          });
          
          setFocusStats(prev => ({
            ...prev,
            distractionsBlocked: prev.distractionsBlocked + 1
          }));
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [focusModeEnabled, customNotifications, toast]);

  const addToWhitelist = (type: 'app' | 'website', item: string) => {
    if (type === 'app') {
      setWhitelistedApps(prev => [...prev, item]);
    } else {
      setWhitelistedWebsites(prev => [...prev, item]);
    }
  };

  const removeFromWhitelist = (type: 'app' | 'website', item: string) => {
    if (type === 'app') {
      setWhitelistedApps(prev => prev.filter(app => app !== item));
    } else {
      setWhitelistedWebsites(prev => prev.filter(website => website !== item));
    }
  };

  return (
    <FocusContext.Provider value={{
      focusModeEnabled,
      setFocusModeEnabled,
      whitelistedApps,
      whitelistedWebsites,
      customNotifications,
      focusStats,
      addToWhitelist,
      removeFromWhitelist
    }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};
