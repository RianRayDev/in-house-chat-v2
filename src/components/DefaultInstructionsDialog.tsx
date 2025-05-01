import React from 'react';
import { Dialog } from './ui/Dialog';
import { DEFAULT_INSTRUCTIONS } from '../constants/defaultInstructions';
import ReactMarkdown from 'react-markdown';

interface DefaultInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DefaultInstructionsDialog: React.FC<DefaultInstructionsDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Default AI Instructions"
      description="These instructions are automatically sent to the AI with the first message in each conversation to ensure high-quality, well-formatted responses."
    >
      <div className="mt-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-200/70 dark:border-gray-700/50 shadow-sm">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <div className={`mb-8 ${children === 'Response Formatting Guidelines' ? 'mt-1' : 'mt-6'}`}>
                  <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-5 font-poppins">{children}</h1>
                  <div className="w-full h-px bg-gray-200/70 dark:bg-gray-700/50 mt-4"></div>
                </div>
              ),
              h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-7 font-poppins">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3 mt-6 font-poppins">{children}</h3>,
              p: ({ children }) => <p className="mb-3 text-gray-600 dark:text-gray-400 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mb-5 ml-6 space-y-2 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="mb-5 ml-6 list-decimal space-y-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1 text-gray-600 dark:text-gray-400 leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-700 dark:text-gray-300">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-600 dark:text-gray-400">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="pl-4 border-l-4 border-gray-300/70 dark:border-gray-600/50 italic text-gray-600 dark:text-gray-400 my-4 py-1">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100/80 dark:bg-gray-800/60 px-2 py-0.5 rounded text-sm font-mono text-gray-600 dark:text-gray-400">
                  {children}
                </code>
              ),
            }}
          >
            {DEFAULT_INSTRUCTIONS}
          </ReactMarkdown>

          <div className="mt-6 pt-4 border-t border-gray-200/70 dark:border-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Note:</strong> To save on token usage, a condensed version of these instructions is sent to the AI, and only with the first message in each conversation.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
