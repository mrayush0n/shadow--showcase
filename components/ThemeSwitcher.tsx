
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Icon } from './Icon';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: 'light_mode', label: 'Light' },
    { id: 'dark', icon: 'dark_mode', label: 'Dark' },
    { id: 'system', icon: 'contrast', label: 'Auto' },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
      {themes.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 flex-1
              ${isActive
                ? 'bg-white dark:bg-slate-700 text-aurora-600 dark:text-aurora-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }
            `}
            aria-label={`Switch to ${t.label} theme`}
          >
            <Icon
              name={t.icon}
              className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};