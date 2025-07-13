
import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message } from '../types';
import * as geminiService from '../services/geminiService';
import { Chat } from '@google/genai';

const CHAT_HISTORY_KEY = 'healthcare_chat_history';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedHistory) {
        setSessions(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [sessions]);

  const createNewSession = useCallback((): ChatSession => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const selectSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);
  
  const startNewChat = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  const sendMessage = useCallback(async (text: string, sessionId?: string) => {
    const targetSessionId = sessionId || activeSessionId;

    let session = sessions.find(s => s.id === targetSessionId);
    if (!session) {
      session = createNewSession();
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...session.messages, userMessage];
    const updatedSession = { ...session, messages: updatedMessages, title: session.title === 'New Chat' ? text.substring(0, 30) + '...' : session.title };
    
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    if (!activeSessionId) setActiveSessionId(updatedSession.id);

    setIsLoading(true);

    const chat = geminiService.startChat(updatedMessages);

    try {
      const stream = geminiService.sendMessageStream(chat, text);
      let fullResponse = '';
      
      const modelMessageId = crypto.randomUUID();
      let firstChunk = true;

      for await (const chunk of stream) {
        fullResponse += chunk;
        if (firstChunk) {
            setSessions(prev =>
                prev.map(s =>
                  s.id === updatedSession.id
                    ? { ...s, messages: [...s.messages, { id: modelMessageId, role: 'model', text: fullResponse, timestamp: Date.now() }] }
                    : s
                )
            );
            firstChunk = false;
        } else {
            setSessions(prev =>
                prev.map(s =>
                  s.id === updatedSession.id
                    ? { ...s, messages: s.messages.map(m => m.id === modelMessageId ? {...m, text: fullResponse} : m) }
                    : s
                )
            );
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? { ...s, messages: [...s.messages, errorMessage] } : s));
    } finally {
      setIsLoading(false);
    }
  }, [sessions, activeSessionId, createNewSession]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  return {
    sessions,
    activeSession,
    isLoading,
    selectSession,
    startNewChat,
    deleteSession,
    sendMessage,
  };
};
