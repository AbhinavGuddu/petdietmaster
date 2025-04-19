'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbsUp, FaReply } from 'react-icons/fa6';

export interface Feedback {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  likes: number;
  reply?: string;
}

interface FeedbackListProps {
  feedbackItems: Feedback[];
  isLoading: boolean;
  error: string | null;
  onLike: (feedbackId: string) => void;
  onReply: (feedbackId: string, message: string) => void;
}

export default function FeedbackList({ 
  feedbackItems,
  isLoading, 
  error,
  onLike,
  onReply
}: FeedbackListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Sort feedback items by timestamp in descending order (most recent first)
  const sortedFeedbackItems = [...feedbackItems].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleReply = (feedbackId: string) => {
    if (replyMessage.trim()) {
      onReply(feedbackId, replyMessage);
      setReplyMessage('');
      setReplyingTo(null);
    }
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-purple-600 to-indigo-600',
      'bg-gradient-to-r from-pink-600 to-rose-600',
      'bg-gradient-to-r from-cyan-600 to-blue-600',
      'bg-gradient-to-r from-emerald-600 to-teal-600',
      'bg-gradient-to-r from-orange-600 to-red-600',
      'bg-gradient-to-r from-violet-600 to-fuchsia-600',
      'bg-gradient-to-r from-amber-600 to-yellow-600',
      'bg-gradient-to-r from-lime-600 to-green-600'
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!feedbackItems || feedbackItems.length === 0) {
    return (
      <div className="text-slate-400 p-4 text-center">
        No feedback available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <motion.div className="space-y-6">
        {sortedFeedbackItems.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-lg shadow-lg ${getGradientClass(index)}`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{feedback.name}</h3>
                <p className="text-white/90">{feedback.text}</p>
                <p className="text-sm text-white/70">{new Date(feedback.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 mt-4">
              <button
                onClick={() => onLike(feedback.id)}
                className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
              >
                <FaThumbsUp className="w-5 h-5" />
                <span className="font-medium">{feedback.likes}</span>
              </button>
              
              <button
                onClick={() => setReplyingTo(replyingTo === feedback.id ? null : feedback.id)}
                className="flex items-center space-x-2 text-white hover:text-emerald-300 transition-colors"
              >
                <FaReply className="w-5 h-5" />
                <span className="font-medium">Reply</span>
              </button>
            </div>
            
            {replyingTo === feedback.id && (
              <div className="mt-4">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  rows={2}
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReply(feedback.id)}
                    className="px-4 py-2 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}

            {feedback.reply && (
              <div className="mt-4 pl-4 border-l-4 border-white/30">
                <p className="text-white/90">
                  <span className="font-semibold text-white">Admin: </span>
                  {feedback.reply}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 