'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Feedback {
  id: string;
  text: string;
  name: string;
  email: string;
  timestamp: string;
}

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      setError('Failed to load feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGravatarUrl = (email: string | undefined) => {
    if (!email) {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=40';
    }
    const hash = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="text-white text-center">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">User Feedback</h1>
        
        <div className="space-y-4">
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-start gap-4">
                <img
                  src={getGravatarUrl(feedback.email)}
                  alt={feedback.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{feedback.name}</h3>
                      <p className="text-slate-400 text-sm">{feedback.email}</p>
                    </div>
                    <span className="text-slate-400 text-sm">
                      {new Date(feedback.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300">{feedback.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {feedbacks.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No feedback submissions yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 