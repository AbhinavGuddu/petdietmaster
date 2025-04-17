'use client';

import { motion } from 'framer-motion';

interface ScanResultProps {
  result: any;
  onClose: () => void;
}

const ScanResultCard = ({ result, onClose }: ScanResultProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl bg-slate-800 rounded-lg overflow-hidden shadow-xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Scanned Product Analysis</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{result.foodName}</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              result.safetyLevel === 'Safe' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {result.safetyLevel}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-300">{result.explanation}</p>
          </div>

          {/* Nutritional Information */}
          {result.nutrition && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Nutritional Information</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(result.nutrition).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-slate-400 text-sm capitalize">{key}</div>
                    <div className="text-white font-medium">{value} {key === 'calories' ? 'kcal' : 'g'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Alternatives */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Safe Alternatives</h4>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1">
                  {result.alternatives.map((alt: string, index: number) => (
                    <li key={index} className="text-slate-300">{alt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ScanResultCard; 