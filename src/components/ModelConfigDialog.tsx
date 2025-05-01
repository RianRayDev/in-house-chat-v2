import React from 'react';
import { Dialog } from './ui/Dialog';
import { useStore } from '../store';
import { Info, RotateCcw } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface ModelConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModelConfigDialog: React.FC<ModelConfigDialogProps> = ({ open, onOpenChange }) => {
  const {
    temperature,
    maxTokens,
    topP,
    storeLogs,
    enableWebSearch,
    enableStreaming,
    setTemperature,
    setMaxTokens,
    setTopP,
    setStoreLogs,
    setEnableWebSearch,
    setEnableStreaming,
    resetModelConfig
  } = useStore();

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(parseFloat(e.target.value));
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxTokens(parseInt(e.target.value));
  };

  const handleTopPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopP(parseFloat(e.target.value));
  };

  const handleStoreLogsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreLogs(e.target.checked);
  };

  const handleWebSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableWebSearch(e.target.checked);
  };

  const handleStreamingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableStreaming(e.target.checked);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Model Configuration"
      description="Adjust advanced settings for the AI model"
    >
      <div className="space-y-6 pt-2">
        <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-5 space-y-6">
          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Temperature</label>
                <Tooltip content="Controls randomness: Lower values are more deterministic, higher values are more creative">
                  <div className="ml-1.5 flex items-center justify-center">
                    <Info size={14} className="text-blue-500 cursor-help opacity-80" />
                  </div>
                </Tooltip>
              </div>
              <span className="text-sm font-medium">{temperature.toFixed(2)}</span>
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(temperature / 2) * 100}%` }}
                    className="h-full bg-blue-500 rounded-full transition-all duration-100"
                  ></div>
                </div>
              </div>
              <div className="absolute inset-0">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={temperature}
                  onChange={handleTemperatureChange}
                  className="absolute w-full h-8 opacity-0 cursor-pointer z-20"
                />
              </div>
              <div
                className="absolute h-3 w-3 rounded-full bg-white border-2 border-blue-500 shadow-sm transition-transform duration-100 z-10"
                style={{
                  left: `calc(${(temperature / 2) * 100}% - 6px)`
                }}
              ></div>
            </div>
          </div>

          {/* Max Tokens Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Max tokens</label>
                <Tooltip content="Maximum number of tokens to generate. One token is roughly 4 characters for normal English text">
                  <div className="ml-1.5 flex items-center justify-center">
                    <Info size={14} className="text-blue-500 cursor-help opacity-80" />
                  </div>
                </Tooltip>
              </div>
              <span className="text-sm font-medium">{maxTokens}</span>
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(maxTokens / 4096) * 100}%` }}
                    className="h-full bg-blue-500 rounded-full transition-all duration-100"
                  ></div>
                </div>
              </div>
              <div className="absolute inset-0">
                <input
                  type="range"
                  min="1"
                  max="4096"
                  step="1"
                  value={maxTokens}
                  onChange={handleMaxTokensChange}
                  className="absolute w-full h-8 opacity-0 cursor-pointer z-20"
                />
              </div>
              <div
                className="absolute h-3 w-3 rounded-full bg-white border-2 border-blue-500 shadow-sm transition-transform duration-100 z-10"
                style={{
                  left: `calc(${(maxTokens / 4096) * 100}% - 6px)`
                }}
              ></div>
            </div>
          </div>

          {/* Top P Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Top P</label>
                <Tooltip content="Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered">
                  <div className="ml-1.5 flex items-center justify-center">
                    <Info size={14} className="text-blue-500 cursor-help opacity-80" />
                  </div>
                </Tooltip>
              </div>
              <span className="text-sm font-medium">{topP.toFixed(2)}</span>
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${topP * 100}%` }}
                    className="h-full bg-blue-500 rounded-full transition-all duration-100"
                  ></div>
                </div>
              </div>
              <div className="absolute inset-0">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={topP}
                  onChange={handleTopPChange}
                  className="absolute w-full h-8 opacity-0 cursor-pointer z-20"
                />
              </div>
              <div
                className="absolute h-3 w-3 rounded-full bg-white border-2 border-blue-500 shadow-sm transition-transform duration-100 z-10"
                style={{
                  left: `calc(${topP * 100}% - 6px)`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold mb-2">Enhanced Features</h3>

          {/* Web Search Checkbox */}
          <div className="flex items-center space-x-2 px-1">
            <input
              type="checkbox"
              id="enableWebSearch"
              checked={enableWebSearch}
              onChange={handleWebSearchChange}
              className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
              style={{ accentColor: 'rgb(59, 130, 246)' }}
            />
            <div className="flex items-center">
              <label htmlFor="enableWebSearch" className="text-sm font-medium">
                Enable Web Search
              </label>
              <Tooltip content="Allow the AI to search the web when it needs information">
                <div className="ml-1.5 flex items-center justify-center">
                  <Info size={14} className="text-blue-500 cursor-help opacity-80" />
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Streaming Checkbox */}
          <div className="flex items-center space-x-2 px-1">
            <input
              type="checkbox"
              id="enableStreaming"
              checked={enableStreaming}
              onChange={handleStreamingChange}
              className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
              style={{ accentColor: 'rgb(59, 130, 246)' }}
            />
            <div className="flex items-center">
              <label htmlFor="enableStreaming" className="text-sm font-medium">
                Enable Streaming
              </label>
              <Tooltip content="Show AI responses as they're being generated in real-time">
                <div className="ml-1.5 flex items-center justify-center">
                  <Info size={14} className="text-blue-500 cursor-help opacity-80" />
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Store Logs Checkbox - Grayed out but with working tooltip */}
          <div className="flex items-center space-x-2 opacity-50 pointer-events-none px-1">
            <input
              type="checkbox"
              id="storeLogs"
              checked={storeLogs}
              onChange={handleStoreLogsChange}
              className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
              style={{ accentColor: 'rgb(59, 130, 246)' }}
              disabled
            />
            <div className="flex items-center">
              <label htmlFor="storeLogs" className="text-sm font-medium cursor-not-allowed">
                Store logs
              </label>
              <div className="pointer-events-auto">
                <Tooltip content="Save conversation logs locally for debugging and analysis">
                  <div className="ml-1.5 flex items-center justify-center">
                    <Info size={14} className="text-blue-500 cursor-help opacity-80" />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={resetModelConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <RotateCcw size={14} />
            Reset to defaults
          </button>
        </div>
      </div>
    </Dialog>
  );
};
