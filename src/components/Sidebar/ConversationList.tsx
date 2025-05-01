import React from 'react';
import { useStore } from '../../store';
import { Trash2, MessageCircle, FolderPlus } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const ConversationList: React.FC = () => {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    deleteConversation 
  } = useStore();

  const sortedConversations = Array.from(conversations.entries())
    .sort(([, a], [, b]) => {
      const aDate = a.length > 0 ? new Date(parseInt(a[a.length - 1].id)) : new Date();
      const bDate = b.length > 0 ? new Date(parseInt(b[b.length - 1].id)) : new Date();
      return bDate.getTime() - aDate.getTime();
    });

  const getConversationTitle = (messages: any[]) => {
    if (messages.length === 0) {
      return "New Chat";
    }
    
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.substring(0, 25);
      return title.length < firstUserMessage.content.length 
        ? `${title}...` 
        : title;
    }
    
    return "New Chat";
  };

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
        <MessageCircle size={32} className="mb-2 opacity-50" />
        <p className="text-center text-sm">No conversations yet</p>
        <p className="text-center text-xs mt-1">Start a new chat to begin</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {sortedConversations.map(([id, messages]) => (
        <div 
          key={id}
          className={`flex items-center justify-between px-4 py-2 mx-2 my-1 rounded-md cursor-pointer group ${
            id === currentConversationId 
              ? 'bg-primary-100 dark:bg-primary-900/30' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => setCurrentConversation(id)}
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            <MessageCircle size={16} className="flex-shrink-0" />
            <span className="text-sm truncate">
              {getConversationTitle(messages)}
            </span>
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip content="Delete Chat">
              <button 
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(id);
                }}
              >
                <Trash2 size={14} className="text-gray-500" />
              </button>
            </Tooltip>
            <Tooltip content="Add to Folder">
              <button 
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Folder functionality would go here
                }}
              >
                <FolderPlus size={14} className="text-gray-500" />
              </button>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
};