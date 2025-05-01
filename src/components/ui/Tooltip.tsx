import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={5}
            className="z-50"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <div className="px-3 py-1.5 text-xs text-white bg-gray-800 border border-gray-700 border-opacity-70 rounded-md">
                {content}
              </div>
              <div
                className="absolute w-3 h-3 bg-gray-800 border-t border-l border-gray-700 border-opacity-70 transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"
                style={{ zIndex: -1 }}
              />
            </motion.div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};