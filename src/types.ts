export type Role = 'user' | 'assistant' | 'system' | 'thinking' | 'function' | 'function_result';

export interface Word {
  text: string;
  visible: boolean;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
  words?: Word[];
  functionName?: string;
  functionArgs?: string;
  functionResult?: string;
  isSearchResult?: boolean;
}

export type ChatModel = string;

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'custom';
  description: string;
}

export interface ChatFolder {
  id: string;
  name: string;
  conversationIds: string[];
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}