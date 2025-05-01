import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, FileImage, Wand2, Search, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { Tooltip } from '../ui/Tooltip';
import { Dialog } from '../ui/Dialog';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

interface CanvasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (options: any) => void;
}

const CanvasDialog: React.FC<CanvasDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [width, setWidth] = useState('512');
  const [height, setHeight] = useState('512');
  const [photoUrl, setPhotoUrl] = useState('');
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('90');

  const handleSubmit = () => {
    onSubmit({
      canvas_size: {
        width: parseInt(width),
        height: parseInt(height)
      },
      photo_url: photoUrl,
      streaming_enabled: true,
      generation_options: {
        format,
        quality: parseInt(quality)
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Canvas Settings"
      description="Configure canvas and photo generation settings"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="input mt-1"
              min="64"
              max="1024"
              step="64"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input mt-1"
              min="64"
              max="1024"
              step="64"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Photo URL</label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="input mt-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="input mt-1"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Quality</label>
            <input
              type="number"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="input mt-1"
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Generate
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showCanvas, setShowCanvas] = useState(false);
  const {
    isLoadingResponse,
    error,
    hasApiKey,
    forceWebSearch,
    toggleForceWebSearch
  } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoadingResponse) return;

    onSendMessage(message);
    setMessage('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCanvasSubmit = (options: any) => {
    const prompt = `Using the canvas with size ${options.canvas_size.width}x${options.canvas_size.height}, ${
      options.photo_url ? `analyzing the image at ${options.photo_url}, ` : ''
    }generate content in ${options.generation_options.format} format with ${options.generation_options.quality}% quality.`;

    setMessage(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={hasApiKey ? "Message" : "Please add your API key in settings to start chatting"}
        className="w-full p-3 pr-24 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        rows={1}
        disabled={isLoadingResponse || !hasApiKey}
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Tooltip content="Upload Image">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileImage size={16} className="text-gray-500" />
            </button>
          </Tooltip>
          <Tooltip content="Take Photo">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Camera size={16} className="text-gray-500" />
            </button>
          </Tooltip>
          <Tooltip content="Canvas & Generation">
            <button
              type="button"
              onClick={() => setShowCanvas(true)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Wand2 size={16} className="text-gray-500" />
            </button>
          </Tooltip>
          <Tooltip content={forceWebSearch ? "Web Search Enabled" : "Enable Web Search"}>
            <button
              type="button"
              className={`p-1.5 rounded-md ${
                forceWebSearch
                  ? 'bg-primary-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={toggleForceWebSearch}
            >
              <Search size={16} className={forceWebSearch ? 'text-white' : 'text-gray-500'} />
            </button>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Shift + Enter for new line
          </span>
          <Tooltip content="Send Message (Enter)">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              className={`p-1.5 rounded-md ${
                message.trim() && !isLoadingResponse && hasApiKey
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 cursor-not-allowed'
              }`}
              disabled={!message.trim() || isLoadingResponse || !hasApiKey}
            >
              <Send size={16} />
            </motion.button>
          </Tooltip>
        </div>
      </div>

      <CanvasDialog
        open={showCanvas}
        onOpenChange={setShowCanvas}
        onSubmit={handleCanvasSubmit}
      />
    </form>
  );
};