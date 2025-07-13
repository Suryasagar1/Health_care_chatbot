
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { useChat } from './hooks/useChat';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const {
    sessions,
    activeSession,
    isLoading,
    selectSession,
    startNewChat,
    deleteSession,
    sendMessage
  } = useChat();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen flex antialiased text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSession?.id || null}
        onNewChat={startNewChat}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow 
          session={activeSession}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  );
};

export default App;
