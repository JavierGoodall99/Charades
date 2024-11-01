import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface GameCardProps {
  word: string;
  onCorrect: () => void;
  onSkip: () => void;
  onExit: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ word, onCorrect, onSkip, onExit }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        exit={{ rotateX: -90 }}
        className="w-full aspect-video bg-white rounded-xl shadow-xl p-8 flex flex-col items-center justify-center"
      >
        <button
          onClick={onExit}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Exit game"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold text-center mb-8">{word}</h2>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            Skip
          </button>
          <button
            onClick={onCorrect}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            Correct!
          </button>
        </div>
      </motion.div>
    </div>
  );
};