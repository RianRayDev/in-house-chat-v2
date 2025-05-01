import React, { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { useStore } from '../store';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Key, Search, Info, BookOpen } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';
import { ModelConfigDialog } from './ModelConfigDialog';
import { DefaultInstructionsDialog } from './DefaultInstructionsDialog';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { theme, toggleTheme } = useTheme();
  const { setApiKey, availableModels, currentModel, setCurrentModel, apiKey, error } = useStore();
  const [newApiKey, setNewApiKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSaveApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey);
      setNewApiKey('');
    }
  };

  const filteredModels = availableModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Manage your chat preferences and API settings."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Key size={16} />
            OpenAI API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder={apiKey ? '••••••••' : 'Enter your API key'}
              className="flex-1 input text-sm py-1.5"
            />
            <button
              onClick={handleSaveApiKey}
              className="btn btn-primary text-sm py-1.5 px-3"
              disabled={!newApiKey.trim()}
            >
              Save
            </button>
          </div>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          <p className="text-xs text-gray-500">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input pl-10 text-sm py-1.5 mb-2"
            />
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setCurrentModel(model.id)}
                className={`w-full flex flex-col p-2 pl-3 rounded-lg transition-colors relative ${
                  currentModel === model.id
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-full text-left">
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{model.description}</div>
                </div>

                <div className="absolute right-2 top-0 bottom-0 flex flex-col items-center justify-between py-1.5">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentModel === model.id ? 'scale-100' : 'scale-75'
                    }`}
                    style={{
                      backgroundColor: currentModel === model.id ? '#0dae54' : '#dedede',
                      transition: 'background-color 0.3s, transform 0.3s'
                    }}
                  />
                  {currentModel === model.id && (
                    <Tooltip content="Configure Model Settings">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowModelConfig(true);
                        }}
                        className="transition-colors mt-1"
                        style={{ color: '#9ea4b0' }}
                      >
                        <Info size={10} />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowInstructions(true)}
            className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            <BookOpen size={16} />
            View Default AI Instructions
          </button>
          <p className="text-xs text-gray-500 mt-1">
            These instructions are sent with every message to ensure high-quality responses.
          </p>
        </div>
      </div>

      {/* Model Configuration Dialog */}
      <ModelConfigDialog
        open={showModelConfig}
        onOpenChange={setShowModelConfig}
      />

      {/* Default Instructions Dialog */}
      <DefaultInstructionsDialog
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
    </Dialog>
  );
};