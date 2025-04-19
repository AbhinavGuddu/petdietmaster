'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackList from './FeedbackList';

interface Feedback {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  likes: number;
  reply?: string;
}

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, message: string) => void;
}

export default function FeedbackForm({ isOpen, onClose, onSubmit }: FeedbackFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setFeedbackItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFeedback();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          name,
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setName('');
      setMessage('');
      fetchFeedback();
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setShowFeedback(true);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLike = async (feedbackId: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'like',
          feedbackId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like feedback');
      }

      fetchFeedback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleReply = async (feedbackId: string, message: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reply',
          feedbackId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reply to feedback');
      }

      fetchFeedback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 rounded-lg w-full max-w-7xl mx-4 h-[90vh] overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-6 bg-slate-800">
                <h2 className="text-xl font-semibold text-white">
                  {showFeedback ? 'Feedback' : 'Share Your Feedback'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-emerald-500/20 text-emerald-300 p-4 rounded-lg mb-6 text-center font-medium"
                  >
                    Thank you for submitting feedback ❤️
                  </motion.div>
                )}

                {showFeedback ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Form
                      </button>
                    </div>
                    <FeedbackList
                      feedbackItems={feedbackItems}
                      isLoading={isLoading}
                      error={error}
                      onLike={handleLike}
                      onReply={handleReply}
                    />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowFeedback(true)}
                        className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        View Feedback
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 