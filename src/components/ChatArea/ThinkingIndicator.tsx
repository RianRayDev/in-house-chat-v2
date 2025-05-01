import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Search, Globe } from 'lucide-react';
import { useStore } from '../../store';

export const ThinkingIndicator: React.FC = () => {
  const { isLoadingResponse, isSearchingWeb } = useStore();

  // Animation variants for smoother transitions
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {(isLoadingResponse || isSearchingWeb) && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mb-3 mt-1"
        >
          <div className="flex items-start">
            <motion.div
              variants={childVariants}
              className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mr-3 mt-1 relative overflow-hidden shadow-sm animate-float"
            >
              <Bot size={16} className="text-accent-600 dark:text-accent-400 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-200/30 to-transparent animate-shimmer"></div>
            </motion.div>
            <div className="flex-1">
              <div className="mb-2">
                {isSearchingWeb ? (
                  <div className="flex items-center">
                    <motion.div
                      variants={childVariants}
                      className="mr-2 text-blue-500 animate-float"
                    >
                      <Globe size={18} className="animate-spin-slow" />
                    </motion.div>
                    <motion.div
                      variants={childVariants}
                      className="text-blue-600 dark:text-blue-400 flex text-sm font-medium"
                    >
                      <span className="animate-pulse" style={{ animationDelay: '0ms' }}>S</span>
                      <span className="animate-pulse" style={{ animationDelay: '50ms' }}>e</span>
                      <span className="animate-pulse" style={{ animationDelay: '100ms' }}>a</span>
                      <span className="animate-pulse" style={{ animationDelay: '150ms' }}>r</span>
                      <span className="animate-pulse" style={{ animationDelay: '200ms' }}>c</span>
                      <span className="animate-pulse" style={{ animationDelay: '250ms' }}>h</span>
                      <span className="animate-pulse" style={{ animationDelay: '300ms' }}>i</span>
                      <span className="animate-pulse" style={{ animationDelay: '350ms' }}>n</span>
                      <span className="animate-pulse" style={{ animationDelay: '400ms' }}>g</span>
                      <span className="animate-pulse" style={{ animationDelay: '450ms' }}> </span>
                      <span className="animate-pulse" style={{ animationDelay: '500ms' }}>t</span>
                      <span className="animate-pulse" style={{ animationDelay: '550ms' }}>h</span>
                      <span className="animate-pulse" style={{ animationDelay: '600ms' }}>e</span>
                      <span className="animate-pulse" style={{ animationDelay: '650ms' }}> </span>
                      <span className="animate-pulse" style={{ animationDelay: '700ms' }}>w</span>
                      <span className="animate-pulse" style={{ animationDelay: '750ms' }}>e</span>
                      <span className="animate-pulse" style={{ animationDelay: '800ms' }}>b</span>
                      <motion.span
                        variants={childVariants}
                        className="ml-1 inline-flex items-center"
                      >
                        <motion.span variants={dotVariants} className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block opacity-70 mr-0.5 animate-[pulse_1s_ease-in-out_0s_infinite]" />
                        <motion.span variants={dotVariants} className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block opacity-70 mr-0.5 animate-[pulse_1s_ease-in-out_0.3s_infinite]" />
                        <motion.span variants={dotVariants} className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block opacity-70 animate-[pulse_1s_ease-in-out_0.6s_infinite]" />
                      </motion.span>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <motion.div
                      variants={childVariants}
                      className="text-gray-500 flex text-sm font-medium relative"
                    >
                      <span className="animate-pulse" style={{ animationDelay: '0ms' }}>T</span>
                      <span className="animate-pulse" style={{ animationDelay: '50ms' }}>h</span>
                      <span className="animate-pulse" style={{ animationDelay: '100ms' }}>i</span>
                      <span className="animate-pulse" style={{ animationDelay: '150ms' }}>n</span>
                      <span className="animate-pulse" style={{ animationDelay: '200ms' }}>k</span>
                      <span className="animate-pulse" style={{ animationDelay: '250ms' }}>i</span>
                      <span className="animate-pulse" style={{ animationDelay: '300ms' }}>n</span>
                      <span className="animate-pulse" style={{ animationDelay: '350ms' }}>g</span>
                      <motion.span
                        variants={childVariants}
                        className="ml-1 inline-flex items-center"
                      >
                        <motion.span variants={dotVariants} className="w-2 h-2 rounded-full bg-primary-500 inline-block opacity-70 mr-0.5 animate-[bounce_1.2s_ease-in-out_0s_infinite]" />
                        <motion.span variants={dotVariants} className="w-2 h-2 rounded-full bg-primary-500 inline-block opacity-70 mr-0.5 animate-[bounce_1.2s_ease-in-out_0.4s_infinite]" />
                        <motion.span variants={dotVariants} className="w-2 h-2 rounded-full bg-primary-500 inline-block opacity-70 mr-0.5 animate-[bounce_1.2s_ease-in-out_0.8s_infinite]" />
                      </motion.span>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
