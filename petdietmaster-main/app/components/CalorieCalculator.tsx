'use client';

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface Props {
  pet: string;
}

const CalorieCalculator: React.FC<Props> = ({ pet }) => {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const calculateDailyCalories = () => {
    if (!weight) return null;
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return null;

    let RER = 70 * Math.pow(weightNum, 0.75); // Base Resting Energy Requirement

    // Pet-specific activity factors and calculations
    const calculations = {
      dog: {
        low: 1.2,
        moderate: 1.4,
        high: 1.8
      },
      cat: {
        low: 1.2,
        moderate: 1.4,
        high: 1.6
      },
      horse: {
        low: 1.2,
        moderate: 1.4,
        high: 1.6
      },
      chicken: {
        low: 1.0,
        moderate: 1.2,
        high: 1.4
      },
      cow: {
        low: 1.1,
        moderate: 1.3,
        high: 1.5
      },
      buffalo: {
        low: 1.1,
        moderate: 1.3,
        high: 1.5
      },
      pig: {
        low: 1.1,
        moderate: 1.3,
        high: 1.5
      },
      pigeon: {
        low: 1.0,
        moderate: 1.2,
        high: 1.4
      },
      parrot: {
        low: 1.0,
        moderate: 1.2,
        high: 1.4
      },
      turtle: {
        low: 0.8,
        moderate: 1.0,
        high: 1.2
      },
      fish: {
        low: 0.8,
        moderate: 1.0,
        high: 1.2
      }
    };

    const petFactors = calculations[pet as keyof typeof calculations];
    if (!petFactors) return null;

    const factor = petFactors[activityLevel as keyof typeof petFactors];
    return Math.round(RER * factor);
  };

  const getWeightUnit = () => {
    const largeAnimals = ['horse', 'cow', 'buffalo'];
    const smallAnimals = ['pigeon', 'parrot', 'turtle', 'fish'];
    
    if (largeAnimals.includes(pet)) return 'kg';
    if (smallAnimals.includes(pet)) return 'g';
    return 'lbs';
  };

  const weightUnit = getWeightUnit();
  const petName = pet.charAt(0).toUpperCase() + pet.slice(1);
  const calories = calculateDailyCalories();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#e2e8f0] flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        Daily Calorie Calculator for {petName}s
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[#e2e8f0] font-medium mb-2">
            {petName}'s Weight (in {weightUnit})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 bg-[#1e2842] border-2 border-[#312e81] rounded-lg focus:outline-none focus:border-[#4338ca] text-[#e2e8f0] placeholder-[#94a3b8]"
            placeholder={`Enter weight in ${weightUnit}`}
          />
        </div>

        <div>
          <label className="block text-[#e2e8f0] font-medium mb-2">
            Activity Level
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-4 py-2 bg-[#1e2842] border-2 border-[#312e81] rounded-lg focus:outline-none focus:border-[#4338ca] text-[#e2e8f0]"
          >
            <option value="low" className="bg-[#1e2842]">Low (Senior/Less Active)</option>
            <option value="moderate" className="bg-[#1e2842]">Moderate (Adult/Normal Activity)</option>
            <option value="high" className="bg-[#1e2842]">High (Young/Very Active)</option>
          </select>
        </div>

        {calories && (
          <div className="bg-[#1e2842] p-4 rounded-lg border-2 border-[#312e81]">
            <p className="text-center text-[#e2e8f0] font-semibold">
              Recommended Daily Calories: {calories} kcal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator; 