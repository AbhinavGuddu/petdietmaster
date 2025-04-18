'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaReply } from 'react-icons/fa6';

interface Feedback {
  id: string;
  text: string;
  name: string;
  email: string;
  timestamp: string;
  likes?: number;
  reply?: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
  isLoading?: boolean;
  error?: string | null;
  isAdmin?: boolean;
  onReply?: (feedbackId: string, reply: string) => void;
  onLike?: (feedbackId: string) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ 
  feedbacks, 
  isLoading, 
  error, 
  isAdmin = false,
  onReply,
  onLike 
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [likedFeedbacks, setLikedFeedbacks] = useState<Set<string>>(new Set());

  const getGravatarUrl = (email: string | undefined) => {
    if (!email) {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=40';
    }
    const hash = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`;
  };

  const handleReply = (feedbackId: string) => {
    if (replyingTo === feedbackId) {
      if (replyText.trim() && onReply) {
        onReply(feedbackId, replyText);
        setReplyText('');
      }
      setReplyingTo(null);
    } else {
      setReplyingTo(feedbackId);
    }
  };

  const handleLike = (feedbackId: string) => {
    if (onLike) {
      onLike(feedbackId);
      setLikedFeedbacks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(feedbackId)) {
          newSet.delete(feedbackId);
        } else {
          newSet.add(feedbackId);
        }
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-slate-400 py-4">
        Loading feedback...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-slate-400 py-4">
        No feedback submissions yet.
      </div>
    );
  }

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
              
              {/* Reply section */}
              {feedback.reply && (
                <div className="mt-3 pl-4 border-l-2 border-slate-600">
                  <p className="text-slate-400 text-sm">Admin Reply:</p>
                  <p className="text-slate-300 text-sm">{feedback.reply}</p>
                </div>
              )}

              {/* Reply form for admin */}
              {isAdmin && replyingTo === feedback.id && (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-sky-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => handleLike(feedback.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    likedFeedbacks.has(feedback.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                  }`}
                >
                  <FaHeart className="w-4 h-4" />
                  <span className="text-xs">{feedback.likes || 0}</span>
                </button>
                
                {isAdmin && (
                  <button
                    onClick={() => handleReply(feedback.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-sky-500 transition-colors"
                  >
                    <FaReply className="w-4 h-4" />
                    <span className="text-xs">Reply</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeedbackList; 