import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-indigo-600"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <div className="mt-2 text-center text-2xl font-bold">
        {timeLeft}s
      </div>
    </div>
  );
};