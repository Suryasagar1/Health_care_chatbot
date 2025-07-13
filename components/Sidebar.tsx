
import React from 'react';
import { ChatSession } from '../types';
import { HeartIcon, PlusIcon, ChatBubbleIcon, TrashIcon } from '../constants';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession, isDarkMode, setIsDarkMode }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/70 backdrop-blur-sm border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 w-80">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-lg">Healthcare Assistant</h1>
          </div>
        </div>
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Chat</span>
        </button>
        
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-6 mb-2">Chat History</h2>
        
        {sessions.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
            <ChatBubbleIcon className="w-12 h-12 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs">Start a conversation to see it here</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sessions.map(session => (
              <li key={session.id}>
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex justify-between items-center group ${
                    activeSessionId === session.id ? 'bg-cyan-100 dark:bg-cyan-900/50' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate text-sm font-medium">{session.title}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                        className="p-1 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label="Delete chat"
                      >
                          <TrashIcon className="w-4 h-4" />
                      </button>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex justify-between items-center">
          <span>Total Chats</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{sessions.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Active Session</span>
          <span className={`font-semibold px-2 py-0.5 rounded-full ${activeSessionId ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
            {activeSessionId ? 'Active' : 'Idle'}
          </span>
        </div>
      </div>
    </div>
  );
};
