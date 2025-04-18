import React from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

type SafetyLevel = 'Safe' | 'Caution' | 'Unsafe' | 'Error';

interface NutritionalInfo {
  protein: number;
  fats: number;
  carbs: number;
  fiber: number;
  calories: number;
  vitamins: string[];
}

interface AnalysisResult {
  foodName: string;
  safetyLevel: SafetyLevel;
  explanation: string;
  nutrition: NutritionalInfo;
  healthBenefits: string[];
  risks: string[];
  alternatives: string[];
}

export interface ResultsProps {
  result: AnalysisResult;
  onClose: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <IoClose size={24} />
      </button>
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Results</h2>
      
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg mb-2">Food Item</h3>
          <p className="text-gray-700">{result.foodName}</p>
        </div>

        <div className={`p-4 rounded-lg ${
          result.safetyLevel === 'Safe' ? 'bg-green-50' :
          result.safetyLevel === 'Caution' ? 'bg-yellow-50' :
          result.safetyLevel === 'Unsafe' ? 'bg-red-50' : 'bg-gray-50'
        }`}>
          <h3 className="font-medium text-lg mb-2">Safety Status</h3>
          <p className={`font-semibold ${
            result.safetyLevel === 'Safe' ? 'text-green-600' :
            result.safetyLevel === 'Caution' ? 'text-yellow-600' :
            result.safetyLevel === 'Unsafe' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {result.safetyLevel}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg mb-2">Explanation</h3>
          <p className="text-gray-700">{result.explanation}</p>
        </div>

        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg mb-2">Nutritional Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Calories: <span className="font-medium">{result.nutrition.calories}</span></p>
              <p className="text-gray-600">Protein: <span className="font-medium">{result.nutrition.protein}g</span></p>
              <p className="text-gray-600">Fats: <span className="font-medium">{result.nutrition.fats}g</span></p>
            </div>
            <div>
              <p className="text-gray-600">Carbs: <span className="font-medium">{result.nutrition.carbs}g</span></p>
              <p className="text-gray-600">Fiber: <span className="font-medium">{result.nutrition.fiber}g</span></p>
            </div>
          </div>
          {result.nutrition.vitamins.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-600">Vitamins:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.nutrition.vitamins.map((vitamin, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {vitamin}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {result.healthBenefits.length > 0 && (
          <div className="p-4 rounded-lg bg-green-50">
            <h3 className="font-medium text-lg mb-2">Health Benefits</h3>
            <ul className="list-disc list-inside text-gray-700">
              {result.healthBenefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {result.risks.length > 0 && (
          <div className="p-4 rounded-lg bg-red-50">
            <h3 className="font-medium text-lg mb-2">Potential Risks</h3>
            <ul className="list-disc list-inside text-gray-700">
              {result.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {result.alternatives.length > 0 && (
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="font-medium text-lg mb-2">Safe Alternatives</h3>
            <ul className="list-disc list-inside text-gray-700">
              {result.alternatives.map((alternative, index) => (
                <li key={index}>{alternative}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Results; 