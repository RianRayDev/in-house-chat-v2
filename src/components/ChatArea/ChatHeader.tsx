import React, { useState } from 'react';
import { useStore } from '../../store';
import { Menu, Share2, Settings } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { Tooltip } from '../ui/Tooltip';
import { SettingsDialog } from '../SettingsDialog';

interface ChatHeaderProps {
  conversationId: string | null;
  sidebarVisible: boolean;
  toggleSidebar: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  conversationId, 
  sidebarVisible,
  toggleSidebar
}) => {
  const { conversations } = useStore();
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  
  const getConversationTitle = () => {
    if (!conversationId) return "New Chat";
    
    const messages = conversations.get(conversationId) || [];
    
    if (messages.length === 0) {
      return "New Chat";
    }
    
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.substring(0, 40);
      return title.length < firstUserMessage.content.length 
        ? `${title}...` 
        : title;
    }
    
    return "New Chat";
  };

  return (
    <>
      <div className={`py-2 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 ${
        theme === 'light' 
          ? 'bg-white bg-opacity-80 backdrop-blur-sm' 
          : 'bg-gray-900 bg-opacity-80 backdrop-blur-sm'
      }`}>
        <div className="flex items-center gap-2">
          <Tooltip content="Toggle Sidebar">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu size={18} />
            </button>
          </Tooltip>
          <h2 className="font-medium text-sm truncate max-w-[200px]">
            {getConversationTitle()}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Share Chat">
            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Share2 size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Settings">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </>
  );
};