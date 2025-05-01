import React, { useState } from 'react';
import { Message } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useStore } from '../../store';
import { Bot, Copy, User, Pencil, Send, Search, Code, Terminal } from 'lucide-react';
import { ThinkingIndicator } from './ThinkingIndicator';

interface MessageListProps {
  messages: Message[];
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  onSendMessage?: (content: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef, onSendMessage }) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditedContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };

  const submitEdit = () => {
    if (onSendMessage && editedContent.trim()) {
      onSendMessage(editedContent);
      cancelEditing();
    }
  };

  const getAvatarByRole = (role: string) => {
    switch (role) {
      case 'user':
        return (
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <User size={16} className="text-primary-600 dark:text-primary-400" />
          </div>
        );
      case 'assistant':
        return (
          <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
            <Bot size={16} className="text-accent-600 dark:text-accent-400" />
          </div>
        );
      case 'function':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Code size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
        );
      case 'function_result':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Terminal size={16} className="text-green-600 dark:text-green-400" />
          </div>
        );
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderMarkdownComponents = {
    h1: ({ children }: any) => <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4 mt-6 pb-1 border-b border-gray-200/50 dark:border-gray-700/50">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3 mt-5">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 mt-4">{children}</h3>,
    p: ({ children }: any) => <p className="mb-3 text-gray-600 dark:text-gray-400 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="mb-4 ml-6 space-y-1 list-disc">{children}</ul>,
    ol: ({ children }: any) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
    li: ({ children }: any) => <li className="mb-1 text-gray-600 dark:text-gray-400"><span>{children}</span></li>,
    strong: ({ children }: any) => <strong className="font-semibold text-gray-700 dark:text-gray-300">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-600 dark:text-gray-400">{children}</em>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 dark:text-primary-400 hover:underline"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="pl-4 border-l-4 border-gray-200/70 dark:border-gray-700/50 italic text-gray-600 dark:text-gray-400 my-3">
        {children}
      </blockquote>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative mt-4 mb-6 group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => copyToClipboard(String(children))}
              className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <Copy size={14} />
            </button>
          </div>
          <div className="absolute top-0 right-0 bg-gray-700/80 text-gray-200 text-xs px-2 py-0.5 rounded-bl font-mono">
            {match[1]}
          </div>
          <SyntaxHighlighter
            style={dracula}
            language={match[1]}
            PreTag="div"
            {...props}
            customStyle={{
              borderRadius: '0.5rem',
              fontSize: '0.9em',
              padding: '1.5rem 1rem 1rem',
              border: '1px solid rgba(75, 85, 99, 0.2)',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
            } as any}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100/80 dark:bg-gray-800/60 px-1.5 py-0.5 rounded text-sm font-mono text-gray-600 dark:text-gray-400" {...props}>
          {children}
        </code>
      );
    },
  };

  const { isLoadingResponse } = useStore();

  return (
    <div className="space-y-5">
      {/* Show thinking indicator at the top when there's no assistant message yet */}
      {isLoadingResponse && !messages.some(msg => msg.role === 'assistant') && (
        <ThinkingIndicator />
      )}
      <AnimatePresence mode="sync">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
            className={`${message.role === 'user' ? 'flex justify-end' : ''}`}
          >
            {message.role === 'assistant' || message.role === 'function' || message.role === 'function_result' ? (
              <div className="w-full py-2 max-w-3xl">
                {message === messages[messages.length - 1] && isLoadingResponse && (
                  <ThinkingIndicator />
                )}

                {/* Function call message */}
                {message.role === 'function' && message.functionName && (
                  <div className="flex items-center mb-2">
                    <div className="mr-2">
                      {getAvatarByRole('function')}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                      Function call: <span className="font-bold">{message.functionName}</span>
                    </div>
                  </div>
                )}

                {/* Search result message */}
                {message.isSearchResult && (
                  <div className="flex items-center mb-2">
                    <div className="mr-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Search size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Web Search Results
                    </div>
                  </div>
                )}

                {/* Function result message */}
                {message.role === 'function_result' && !message.isSearchResult && (
                  <div className="flex items-center mb-2">
                    <div className="mr-2">
                      {getAvatarByRole('function_result')}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-mono">
                      Function result
                    </div>
                  </div>
                )}

                <div className={`max-w-none px-2 ${message.isSearchResult ? 'bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30' : ''}`}>
                  {message.role === 'function' && message.functionArgs ? (
                    <div className="relative mt-2 mb-4 group">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => copyToClipboard(message.functionArgs || '')}
                          className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={dracula}
                        language="json"
                        customStyle={{
                          borderRadius: '0.5rem',
                          fontSize: '0.9em',
                          padding: '1.5rem 1rem 1rem',
                          border: '1px solid rgba(75, 85, 99, 0.2)',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                        } as any}
                      >
                        {message.functionArgs}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown components={renderMarkdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-[85%] bg-gray-100/80 dark:bg-gray-800/30 rounded-2xl p-4 relative">
                {editingMessageId === message.id ? (
                  <div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEditing}
                        className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitEdit}
                        className="px-2 py-1 text-xs rounded bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1"
                      >
                        <Send size={12} /> Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-700 dark:text-gray-300">
                      {message.content}
                    </div>
                    <div className="flex justify-end gap-2 mt-2 opacity-70">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="p-1 rounded hover:bg-gray-200/70 dark:hover:bg-gray-700/50 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => startEditing(message)}
                        className="p-1 rounded hover:bg-gray-200/70 dark:hover:bg-gray-700/50 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
