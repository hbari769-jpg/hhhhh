import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { AestificLogo, AestificArchIcon } from './AestificLogo';

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onLogIn: () => void;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  onLogIn,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-md bg-white dark:bg-[#09090b] text-zinc-900 dark:text-white rounded-3xl border border-zinc-200 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.35)] p-7 sm:p-9 text-center overflow-hidden z-10"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Subtle Ambient Halo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-zinc-200/50 dark:from-white/10 to-transparent blur-2xl pointer-events-none" />

            {/* Header Icon / Logo */}
            <div className="flex flex-col items-center justify-center mb-6 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-3 shadow-inner">
                <AestificArchIcon size={26} className="text-zinc-900 dark:text-white" />
              </div>
              <AestificLogo size="sm" variant="mark-only" />
            </div>

            {/* Title & Message */}
            <h2
              className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2.5 leading-snug"
              style={{ fontFamily: "'Comfortaa', cursive, sans-serif" }}
            >
              Sign up to continue your flow
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-7 leading-relaxed">
              You've reached your free guest limit of 5 messages. Create your free account to keep chatting without interruption.
            </p>

            {/* Prominent Sign Up CTA */}
            <div className="flex flex-col items-center gap-3 w-full">
              <button
                onClick={() => {
                  onClose();
                  onSignUp();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/10 dark:shadow-white/5 hover:scale-[1.01] active:scale-[0.99]"
                style={{ fontFamily: "'Comfortaa', cursive, sans-serif" }}
              >
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Option: Log In */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                <span>Already have an account?</span>
                <button
                  onClick={() => {
                    onClose();
                    onLogIn();
                  }}
                  className="font-medium text-zinc-900 dark:text-white hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuestLimitModal;
