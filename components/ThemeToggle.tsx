
import React from 'react';
import { SunIcon, MoonIcon } from '../constants';

interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="flex items-center space-x-2">
      <SunIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 bg-gray-200 dark:bg-gray-700"
      >
        <span
          className={`${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-slate-300 shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </button>
      <MoonIcon className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-gray-400'}`} />
    </div>
  );
};
