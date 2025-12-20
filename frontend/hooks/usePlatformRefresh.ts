import { useEffect } from 'react';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';

export const usePlatformRefresh = () => {
  const { refreshSettings } = usePlatformSettings();

  useEffect(() => {
    // Listen for platform settings updates
    const handleSettingsUpdate = () => {
      refreshSettings();
    };

    // Listen for custom event
    window.addEventListener('platformSettingsUpdated', handleSettingsUpdate);

    // Listen for storage changes (in case settings are updated in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'platformSettingsUpdated') {
        refreshSettings();
      }
    });

    return () => {
      window.removeEventListener('platformSettingsUpdated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, [refreshSettings]);

  const triggerRefresh = () => {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('platformSettingsUpdated'));
    
    // Also set localStorage to trigger refresh in other tabs
    localStorage.setItem('platformSettingsUpdated', Date.now().toString());
    localStorage.removeItem('platformSettingsUpdated');
  };

  return { triggerRefresh };
};