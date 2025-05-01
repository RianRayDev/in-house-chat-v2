import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { Key, X } from 'lucide-react';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const { setApiKey: storeSetApiKey } = useStore();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    
    // Simple validation for OpenAI API key format (starts with "sk-")
    if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-ant-')) {
      setError('API key should start with "sk-" (for OpenAI) or "sk-ant-" (for Anthropic)');
      return;
    }
    
    storeSetApiKey(apiKey);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Enter Your API Key</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              To use this chat app, you need to provide your own API key from OpenAI or Anthropic.
              Your key is stored only in your browser and never sent to our servers.
            </p>
            
            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-sm font-medium">
                API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-gray-400" />
                </div>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  className="input pl-10"
                  placeholder="sk-..."
                  autoComplete="off"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save API Key
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};