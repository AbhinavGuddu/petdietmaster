'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Feedback {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  likes: number;
  reply?: string;
}

interface FeedbackListProps {
  feedbackItems: Feedback[];
  isLoading?: boolean;
  error?: string | null;
  onLike?: (feedbackId: string) => void;
  onReply?: (feedbackId: string, message: string) => void;
}

export default function FeedbackList({ 
  feedbackItems, 
  isLoading, 
  error,
  onLike,
  onReply 
}: FeedbackListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (isLoading) {
    return (
      <div className="text-center text-slate-400 py-8">
        Loading feedback...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        No feedback yet. Be the first to share!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbackItems.map((feedback, index) => (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-800 p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{feedback.name}</h3>
                <span className="text-slate-400 text-sm">
                  {new Date(feedback.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-300 mb-4">{feedback.text}</p>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLike?.(feedback.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{feedback.likes}</span>
                </button>
                
                <button
                  onClick={() => setReplyingTo(replyingTo === feedback.id ? null : feedback.id)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Reply
                </button>
              </div>

              {feedback.reply && (
                <div className="mt-4 pl-4 border-l-2 border-slate-700">
                  <p className="text-slate-400 text-sm">Reply:</p>
                  <p className="text-slate-300">{feedback.reply}</p>
                </div>
              )}

              {replyingTo === feedback.id && (
                <div className="mt-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-3 py-1 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (replyText.trim() && onReply) {
                          onReply(feedback.id, replyText);
                          setReplyText('');
                          setReplyingTo(null);
                        }
                      }}
                      className="px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 