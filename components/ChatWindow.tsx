
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../types';
import { suggestionPrompts, HeartIcon, SendIcon } from '../constants';

interface ChatWindowProps {
  session: ChatSession | null;
  isLoading: boolean;
  onSendMessage: (text: string, sessionId?: string) => void;
}

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const formatText = (text: string) => {
    // Basic markdown for lists, bold, and italics. And the disclaimer hr.
    const html = text
      .replace(/^\s*[-*]\s(.*)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/---/g, '<hr class="my-4 border-slate-300 dark:border-slate-600" />')
      .replace(/\n/g, '<br />')
      .replace(/<br \/>(\s*<li)/g, '$1'); // Fix extra breaks before lists

    return { __html: html };
  };

  return <div dangerouslySetInnerHTML={formatText(content)} />;
};

const WelcomeView: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => (
  <div className="text-center max-w-4xl mx-auto px-4">
    <div className="inline-block p-4 bg-white dark:bg-slate-700 rounded-full shadow-lg mb-4">
        <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
          <HeartIcon className="w-10 h-10 text-white" />
        </div>
    </div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome to Healthcare Assistant</h2>
    <p className="text-slate-600 dark:text-slate-300 mb-8">
      I'm here to help answer your health-related questions. Get started by asking something or try one of the suggestions below.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {suggestionPrompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(prompt.title)}
          className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-500 dark:text-cyan-300 rounded-lg flex items-center justify-center">
            {prompt.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">{prompt.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{prompt.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const ChatInput: React.FC<{ onSendMessage: (text: string) => void, isLoading: boolean }> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSendMessage(input.trim());
        setInput('');
      }
    };
    
    return (
         <div className="px-6 pb-6 w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about symptoms, medications, wellness tips..."
                    disabled={isLoading}
                    className="w-full pl-4 pr-14 py-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow text-slate-800 dark:text-slate-200"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isLoading || !input.trim()
                        ? 'bg-slate-200 dark:bg-slate-600 cursor-not-allowed'
                        : 'bg-cyan-400 hover:bg-cyan-500 text-white'
                    }`}
                >
                    {isLoading ? 
                        <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> :
                        <SendIcon className="w-5 h-5" />
                    }
                </button>
            </form>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                This chatbot provides general health information. Always consult healthcare professionals for medical advice.
            </p>
        </div>
    )
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ session, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleSendMessage = (text: string) => {
    onSendMessage(text, session?.id);
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-50 to-white dark:from-cyan-900/20 dark:to-slate-900 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
            {!session ? (
                <div className="flex items-center justify-center h-full">
                    <WelcomeView onSuggestionClick={handleSendMessage} />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {session.messages.map((message, index) => (
                        <div key={message.id} className={`flex mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-4 rounded-2xl shadow-md prose dark:prose-invert prose-p:my-1 prose-li:my-0.5 ${
                                message.role === 'user'
                                ? 'bg-cyan-500 text-white rounded-br-lg'
                                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg border border-slate-200 dark:border-slate-600'
                            }`}>
                                <SimpleMarkdownRenderer content={message.text} />
                            </div>
                        </div>
                    ))}
                    {isLoading && session.messages.length > 0 && session.messages[session.messages.length-1].role === 'user' && (
                         <div className="flex mb-6 justify-start">
                             <div className="max-w-xl p-4 rounded-2xl shadow-md bg-white dark:bg-slate-700 rounded-bl-lg border border-slate-200 dark:border-slate-600">
                                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
