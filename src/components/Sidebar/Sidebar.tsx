import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store';
import { ConversationList } from './ConversationList';
import { Plus, Infinity } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface SidebarProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, toggleVisibility }) => {
  const { startNewConversation } = useStore();

  const handleNewChat = () => {
    startNewConversation();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-72 h-full flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center mb-4">
              <Infinity size={24} className="text-primary-500 mr-2" />
              <h1 className="text-xl font-bold text-primary-500">infiniCHAT</h1>
            </div>
            <Tooltip content="Start New Chat">
              <button
                onClick={handleNewChat}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>New Chat</span>
              </button>
            </Tooltip>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ConversationList />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};