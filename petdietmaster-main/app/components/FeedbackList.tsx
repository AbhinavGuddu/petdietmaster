'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Feedback {
  id: string;
  text: string;
  name: string;
  email: string;
  timestamp: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  const getGravatarUrl = (email: string | undefined) => {
    if (!email) {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=40';
    }
    const hash = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`;
  };

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback, index) => (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:bg-slate-700/70 transition-colors"
        >
          <div className="flex items-start gap-3">
            <img
              src={getGravatarUrl(feedback.email)}
              alt={feedback.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">{feedback.name}</h4>
                <p className="text-slate-400 text-xs">
                  {new Date(feedback.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="text-slate-300 text-sm mt-1">{feedback.text}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeedbackList; 