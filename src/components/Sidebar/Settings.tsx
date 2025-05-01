import React from 'react';
import { useTheme } from '../ThemeProvider';
import { Moon, Sun, Info, HelpCircle } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <Tooltip content={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-800"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </Tooltip>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-2">
            <a 
              href="#" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 flex items-center gap-2"
            >
              <Info size={14} />
              About
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 flex items-center gap-2"
            >
              <HelpCircle size={14} />
              Help & FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};