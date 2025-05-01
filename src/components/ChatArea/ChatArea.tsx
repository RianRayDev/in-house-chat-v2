import React, { useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { ThinkingIndicator } from './ThinkingIndicator';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { Infinity } from 'lucide-react';
import { Settings } from '../Sidebar/Settings';

interface ChatAreaProps {
  sidebarVisible: boolean;
  toggleSidebar: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  sidebarVisible,
  toggleSidebar
}) => {
  const {
    currentConversationId,
    conversations,
    sendMessage
  } = useStore();

  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = currentConversationId
    ? conversations.get(currentConversationId) || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage(content);
    }
  };

  return (
    <div className="flex-1 flex h-full relative overflow-hidden">
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
        <Settings />
      </div>

      <div className="flex-1 flex flex-col">
        <ChatHeader
          conversationId={currentConversationId}
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-1 overflow-y-auto py-4">
          <div className="max-w-3xl mx-auto px-4">
            {messages.length > 0 ? (
              <MessageList
                messages={messages}
                messagesEndRef={messagesEndRef}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col items-center justify-center text-center p-4"
                >
                  <div className={`p-3 rounded-full mb-4 ${
                    theme === 'dark' ? 'bg-primary-900/20' : 'bg-primary-50'
                  }`}>
                    <Infinity size={32} className="text-primary-500" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome to infiniCHAT</h2>
                  <p className="text-gray-500 max-w-md mb-8">
                    Ask me anything or try one of these examples:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                    {['Explain quantum computing in simple terms',
                      'Write a poem about artificial intelligence',
                      'How do I make a HTTP request in JavaScript?',
                      'Create a weekly meal plan with recipes'
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="p-3 text-sm text-left rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};