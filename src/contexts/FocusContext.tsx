
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CustomNotification {
  id: string;
  name: string;
  message: string;
  type: 'text' | 'image' | 'video';
  content?: string; // For image URL or video URL
  active: boolean;
}

interface HealthReminder {
  id: string;
  type: 'posture' | 'hydration' | 'eyecare';
  interval: number; // in minutes
  message: string;
  active: boolean;
}

interface FocusContextType {
  focusModeEnabled: boolean;
  setFocusModeEnabled: (enabled: boolean) => void;
  whitelistedApps: string[];
  customNotifications: CustomNotification[];
  healthReminders: HealthReminder[];
  focusStats: {
    focusedToday: string;
    distractionsBlocked: number;
    focusScore: number;
  };
  addToWhitelist: (item: string) => void;
  removeFromWhitelist: (item: string) => void;
  addCustomNotification: (notification: Omit<CustomNotification, 'id'>) => void;
  updateCustomNotification: (id: string, updates: Partial<CustomNotification>) => void;
  removeCustomNotification: (id: string) => void;
  addHealthReminder: (reminder: Omit<HealthReminder, 'id'>) => void;
  updateHealthReminder: (id: string, updates: Partial<HealthReminder>) => void;
  removeHealthReminder: (id: string) => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [whitelistedApps, setWhitelistedApps] = useState<string[]>([]);
  const [customNotifications, setCustomNotifications] = useState<CustomNotification[]>([]);
  const [healthReminders, setHealthReminders] = useState<HealthReminder[]>([
    {
      id: '1',
      type: 'posture',
      interval: 30,
      message: 'Time to check your posture! Sit up straight and adjust your position.',
      active: false
    },
    {
      id: '2',
      type: 'hydration',
      interval: 60,
      message: 'Stay hydrated! Take a moment to drink some water.',
      active: false
    },
    {
      id: '3',
      type: 'eyecare',
      interval: 20,
      message: 'Give your eyes a break! Look at something 20 feet away for 20 seconds.',
      active: false
    }
  ]);
  const [focusStats, setFocusStats] = useState({
    focusedToday: '0h 0m',
    distractionsBlocked: 0,
    focusScore: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (focusModeEnabled) {
      console.log('Focus mode activated - starting monitoring');
      
      // Focus monitoring interval
      const focusInterval = setInterval(() => {
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

      // Health reminders intervals
      const healthIntervals = healthReminders
        .filter(reminder => reminder.active)
        .map(reminder => {
          return setInterval(() => {
            toast({
              title: `${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Reminder`,
              description: reminder.message,
              duration: 5000,
            });
          }, reminder.interval * 60 * 1000);
        });

      return () => {
        clearInterval(focusInterval);
        healthIntervals.forEach(interval => clearInterval(interval));
      };
    }
  }, [focusModeEnabled, customNotifications, healthReminders, toast]);

  const addToWhitelist = (item: string) => {
    setWhitelistedApps(prev => [...prev, item]);
  };

  const removeFromWhitelist = (item: string) => {
    setWhitelistedApps(prev => prev.filter(app => app !== item));
  };

  const addCustomNotification = (notification: Omit<CustomNotification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString()
    };
    setCustomNotifications(prev => [...prev, newNotification]);
  };

  const updateCustomNotification = (id: string, updates: Partial<CustomNotification>) => {
    setCustomNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, ...updates } : notif
    ));
  };

  const removeCustomNotification = (id: string) => {
    setCustomNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const addHealthReminder = (reminder: Omit<HealthReminder, 'id'>) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString()
    };
    setHealthReminders(prev => [...prev, newReminder]);
  };

  const updateHealthReminder = (id: string, updates: Partial<HealthReminder>) => {
    setHealthReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  };

  const removeHealthReminder = (id: string) => {
    setHealthReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  return (
    <FocusContext.Provider value={{
      focusModeEnabled,
      setFocusModeEnabled,
      whitelistedApps,
      customNotifications,
      healthReminders,
      focusStats,
      addToWhitelist,
      removeFromWhitelist,
      addCustomNotification,
      updateCustomNotification,
      removeCustomNotification,
      addHealthReminder,
      updateHealthReminder,
      removeHealthReminder
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
