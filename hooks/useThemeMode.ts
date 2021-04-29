import { useEffect, useState } from 'react';

export const useThemeMode = () => {
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>();

  useEffect(() => {
    if (currentMode === 'dark' && !document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    } else if (currentMode === 'light' && document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    }
  }, [currentMode]);

  useEffect(() => {
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark').matches)
    ) {
      setCurrentMode('dark');
    } else {
      setCurrentMode('light');
    }
  }, [currentMode]);

  const setDarkMode = () => {
    if (currentMode !== 'dark') {
      setCurrentMode('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const setLightMode = () => {
    if (currentMode !== 'light') {
      setCurrentMode('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const setOSPreferenceMode = () => {
    if (window.matchMedia('(prefers-color-scheme: dark').matches) {
      setCurrentMode('dark');
    } else {
      setCurrentMode('light');
    }
    localStorage.removeItem('theme');
  };

  const getCurrentMode = () => currentMode;

  return {
    currentMode,
    getCurrentMode,
    setDarkMode,
    setLightMode,
    setOSPreferenceMode,
  };
};
