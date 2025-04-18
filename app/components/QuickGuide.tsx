'use client';

import React, { useState } from 'react';
import { Calculator, AlertTriangle, FileText } from 'lucide-react';
import ToxicFoods from './ToxicFoods';
import PortionGuide from './PortionGuide';
import CalorieCalculator from './CalorieCalculator';

// Update toxic foods for all pet types
const toxicFoods = {
  dog: [
    { food: 'Chocolate', reason: 'Contains theobromine and caffeine which are toxic to dogs' },
    { food: 'Grapes/Raisins', reason: 'Can cause kidney failure' },
    { food: 'Onions/Garlic', reason: 'Can damage red blood cells and cause anemia' },
    { food: 'Xylitol (Artificial Sweetener)', reason: 'Can cause dangerous drop in blood sugar and liver failure' },
    { food: 'Macadamia Nuts', reason: 'Can cause weakness, depression, and hyperthermia' },
    { food: 'Raw/Undercooked Meat', reason: 'Risk of bacteria such as Salmonella and E. coli' },
    { food: 'Avocado', reason: 'Contains persin which can cause vomiting and diarrhea' },
    { food: 'Caffeine', reason: 'Can be fatal and cause restlessness, rapid breathing, and heart palpitations' }
  ],
  cat: [
    { food: 'Raw Fish', reason: 'Can contain harmful bacteria and thiaminase enzyme' },
    { food: 'Onions/Garlic', reason: 'Can damage red blood cells and cause anemia' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic to cats' },
    { food: 'Raw Eggs', reason: 'Risk of salmonella and can interfere with biotin absorption' },
    { food: 'Caffeine', reason: 'Can cause restlessness, rapid breathing, and heart palpitations' },
    { food: 'Dog Food', reason: 'Lacks essential nutrients that cats need' },
    { food: 'Milk/Dairy', reason: 'Most cats are lactose intolerant' },
    { food: 'Raw Dough', reason: 'Can expand in stomach and produce alcohol' }
  ],
  horse: [
    { food: 'Moldy/Spoiled Hay', reason: 'Can cause colic and respiratory issues' },
    { food: 'Lawn Clippings', reason: 'Can ferment and cause colic' },
    { food: 'Buttercups', reason: 'Toxic plant that can cause mouth blisters and colic' },
    { food: 'Treated Wood', reason: 'Contains chemicals harmful to horses' },
    { food: 'Nightshade Plants', reason: 'Highly toxic and can be fatal' },
    { food: 'Acorns', reason: 'Can cause digestive issues and kidney damage' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic' },
    { food: 'Bread Products', reason: 'Can cause choke and digestive issues' }
  ],
  cow: [
    { food: 'Moldy Feed', reason: 'Can contain mycotoxins that are harmful' },
    { food: 'Treated Wood', reason: 'Contains harmful chemicals' },
    { food: 'Wild Mushrooms', reason: 'Many varieties are toxic to cattle' },
    { food: 'Pesticide-Treated Plants', reason: 'Can contain harmful chemicals' },
    { food: 'Wilted Cherry Leaves', reason: 'Contains cyanide when wilted' },
    { food: 'Onions/Garlic', reason: 'Can cause anemia' },
    { food: 'Avocado', reason: 'All parts are toxic to cattle' },
    { food: 'Moldy Potatoes', reason: 'Can be toxic and cause digestive issues' }
  ],
  goat: [
    { food: 'Moldy Feed', reason: 'Can contain harmful mycotoxins' },
    { food: 'Azalea/Rhododendron', reason: 'Highly toxic to goats' },
    { food: 'Cherry Tree Parts', reason: 'Contains cyanide' },
    { food: 'Rhubarb Leaves', reason: 'Contains high levels of oxalic acid' },
    { food: 'Potato Leaves', reason: 'Contains solanine which is toxic' },
    { food: 'Avocado', reason: 'All parts are toxic to goats' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic' },
    { food: 'Treated Wood', reason: 'Contains harmful chemicals' }
  ],
  chicken: [
    { food: 'Avocado', reason: 'Contains persin which is toxic to birds' },
    { food: 'Green Potato Skins', reason: 'Contains solanine which is toxic' },
    { food: 'Moldy/Spoiled Feed', reason: 'Can contain harmful mycotoxins' },
    { food: 'Raw/Dry Beans', reason: 'Contains hemagglutinin which is toxic' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic' },
    { food: 'Salty Foods', reason: 'Can cause dehydration and kidney problems' },
    { food: 'Onions/Garlic', reason: 'Can cause anemia' },
    { food: 'Rhubarb Leaves', reason: 'Contains high levels of oxalic acid' }
  ],
  buffalo: [
    { food: 'Moldy Feed', reason: 'Can contain harmful mycotoxins' },
    { food: 'Pesticide-Treated Plants', reason: 'Contains harmful chemicals' },
    { food: 'Wild Mushrooms', reason: 'Many varieties are toxic' },
    { food: 'Wilted Cherry Leaves', reason: 'Contains cyanide when wilted' },
    { food: 'Treated Wood', reason: 'Contains harmful chemicals' },
    { food: 'Avocado', reason: 'All parts are toxic' },
    { food: 'Onions/Garlic', reason: 'Can cause anemia' },
    { food: 'Moldy Potatoes', reason: 'Can be toxic and cause digestive issues' }
  ],
  pig: [
    { food: 'Raw/Undercooked Meat', reason: 'Can contain harmful bacteria and parasites' },
    { food: 'Moldy Foods', reason: 'Can contain harmful mycotoxins' },
    { food: 'Raw Potatoes', reason: 'Contains solanine which is toxic' },
    { food: 'Onions/Garlic', reason: 'Can cause anemia' },
    { food: 'Avocado Pits/Skin', reason: 'Contains persin which is toxic' },
    { food: 'Raw Beans', reason: 'Contains lectins which are toxic' },
    { food: 'Fruit Pits/Seeds', reason: 'Can contain cyanide' },
    { food: 'Salty Snacks', reason: 'Can cause salt poisoning' }
  ],
  pigeon: [
    { food: 'Avocado', reason: 'Contains persin which is toxic to birds' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic' },
    { food: 'Salt', reason: 'Can cause severe dehydration and kidney damage' },
    { food: 'Onions/Garlic', reason: 'Can damage red blood cells' },
    { food: 'Apple Seeds', reason: 'Contains cyanide' },
    { food: 'Caffeine', reason: 'Can cause heart problems' },
    { food: 'Mushrooms', reason: 'Many varieties are toxic to birds' },
    { food: 'Raw Beans', reason: 'Contains hemagglutinin which is toxic' }
  ],
  parrot: [
    { food: 'Avocado', reason: 'Contains persin which is toxic to birds' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic' },
    { food: 'Caffeine', reason: 'Can cause cardiac issues' },
    { food: 'Onions/Garlic', reason: 'Can cause anemia' },
    { food: 'Salt', reason: 'Can cause dehydration and kidney problems' },
    { food: 'Apple Seeds', reason: 'Contains cyanide' },
    { food: 'Fruit Pits', reason: 'Can contain cyanide compounds' },
    { food: 'Alcohol', reason: 'Even small amounts can be fatal' }
  ],
  turtle: [
    { food: 'Dairy Products', reason: 'Cannot digest dairy properly' },
    { food: 'Processed Foods', reason: 'Contains additives and preservatives harmful to turtles' },
    { food: 'Raw Meat', reason: 'Risk of bacterial contamination' },
    { food: 'Bread', reason: 'No nutritional value and can cause bloating' },
    { food: 'Human Snacks', reason: 'Contains harmful additives and salt' },
    { food: 'Avocado', reason: 'Too high in fat and potentially toxic' },
    { food: 'Chocolate', reason: 'Contains theobromine which is toxic' },
    { food: 'Onions/Garlic', reason: 'Can be toxic to turtles' }
  ],
  fish: [
    { food: 'Bread', reason: 'Can cause bloating and swim bladder issues' },
    { food: 'Human Food Flakes', reason: 'Lacks proper nutrients and can pollute water' },
    { food: 'Untreated Tap Water', reason: 'Contains chlorine and heavy metals' },
    { food: 'Fatty Foods', reason: 'Can cause liver problems' },
    { food: 'Processed Foods', reason: 'Contains harmful preservatives' },
    { food: 'Raw Meat', reason: 'Can contain harmful bacteria' },
    { food: 'Dairy Products', reason: 'Cannot digest dairy' },
    { food: 'Sugary Foods', reason: 'Can cause digestive issues and water pollution' }
  ]
};

// Portion size guidelines
const portionGuides = {
  dog: [
    { weight: '1-10 lbs', dailyAmount: '1/4 - 1 cup' },
    { weight: '11-25 lbs', dailyAmount: '1 - 2 cups' },
    { weight: '26-50 lbs', dailyAmount: '2 - 4 cups' },
    { weight: '51-75 lbs', dailyAmount: '4 - 6 cups' },
    { weight: '76+ lbs', dailyAmount: '6+ cups' }
  ],
  cat: [
    { weight: '5-9 lbs', dailyAmount: '1/3 - 1/2 cup' },
    { weight: '10-14 lbs', dailyAmount: '1/2 - 2/3 cup' },
    { weight: '15+ lbs', dailyAmount: '2/3 - 1 cup' }
  ],
  // Add more pets as needed
};

// Add generic portion guidelines
const genericPortionGuides = {
  goat: [
    { weight: '1-20 lbs', dailyAmount: '0.5 - 1 lb hay' },
    { weight: '21-50 lbs', dailyAmount: '1 - 2 lbs hay' },
    { weight: '51-100 lbs', dailyAmount: '2 - 4 lbs hay' },
    { weight: '100+ lbs', dailyAmount: '4+ lbs hay' }
  ],
  horse: [
    { weight: '500-800 lbs', dailyAmount: '10-16 lbs hay' },
    { weight: '801-1000 lbs', dailyAmount: '16-20 lbs hay' },
    { weight: '1000+ lbs', dailyAmount: '20-25 lbs hay' }
  ],
  chicken: [
    { weight: 'Adult Layer', dailyAmount: '0.25-0.33 lbs feed' },
    { weight: 'Broiler', dailyAmount: '0.2-0.4 lbs feed' },
    { weight: 'Chick', dailyAmount: '0.1-0.15 lbs feed' }
  ],
  cow: [
    { weight: '400-800 lbs', dailyAmount: '15-20 lbs feed' },
    { weight: '801-1200 lbs', dailyAmount: '20-30 lbs feed' },
    { weight: '1200+ lbs', dailyAmount: '30-40 lbs feed' }
  ],
  buffalo: [
    { weight: '500-800 lbs', dailyAmount: '20-25 lbs feed' },
    { weight: '801-1200 lbs', dailyAmount: '25-35 lbs feed' },
    { weight: '1200+ lbs', dailyAmount: '35-45 lbs feed' }
  ],
  pig: [
    { weight: '10-50 lbs', dailyAmount: '2-4 lbs feed' },
    { weight: '51-150 lbs', dailyAmount: '4-7 lbs feed' },
    { weight: '150+ lbs', dailyAmount: '7-9 lbs feed' }
  ],
  pigeon: [
    { weight: 'Adult', dailyAmount: '1-1.5 oz feed' },
    { weight: 'Young', dailyAmount: '0.5-1 oz feed' }
  ],
  parrot: [
    { weight: 'Small (Budgie)', dailyAmount: '1-2 tbsp feed' },
    { weight: 'Medium (Cockatiel)', dailyAmount: '2-3 tbsp feed' },
    { weight: 'Large (Macaw)', dailyAmount: '3-4 tbsp feed' }
  ],
  turtle: [
    { weight: 'Small (< 4")', dailyAmount: '1-2 tbsp food' },
    { weight: 'Medium (4-8")', dailyAmount: '2-3 tbsp food' },
    { weight: 'Large (> 8")', dailyAmount: '3-4 tbsp food' }
  ],
  fish: [
    { weight: 'Small', dailyAmount: '2-3 pinches' },
    { weight: 'Medium', dailyAmount: '3-4 pinches' },
    { weight: 'Large', dailyAmount: '4-5 pinches' }
  ]
};

type Tab = 'toxic' | 'portion' | 'calculator';

const QuickGuide: React.FC<{ selectedPet: string }> = ({ selectedPet }) => {
  const [activeTab, setActiveTab] = useState<Tab>('toxic');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  
  const calculateDailyCalories = () => {
    if (!weight) return null;
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return null;

    let RER = 70 * Math.pow(weightNum, 0.75); // Resting Energy Requirement
    
    // Multiply by activity factor
    const activityFactors = {
      low: 1.2,
      moderate: 1.4,
      high: 1.6
    };
    
    return Math.round(RER * activityFactors[activityLevel as keyof typeof activityFactors]);
  };

  // Get pet-specific or generic toxic foods
  const getToxicFoods = () => {
    const petSpecificFoods = toxicFoods[selectedPet as keyof typeof toxicFoods];
    return petSpecificFoods || [];
  };

  return (
    <div className="mt-6 rounded-xl border-2 border-slate-700 shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('toxic')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'toxic'
                ? 'bg-red-600 text-white border-2 border-red-500 shadow-lg'
                : 'bg-red-500/20 text-red-200 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500'
            }`}
          >
            Toxic Foods
          </button>
          <button
            onClick={() => setActiveTab('portion')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'portion'
                ? 'bg-sky-600 text-white border-2 border-sky-500 shadow-lg'
                : 'bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 border-2 border-sky-500/50 hover:border-sky-500'
            }`}
          >
            Portion Guide
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'calculator'
                ? 'bg-violet-600 text-white border-2 border-violet-500 shadow-lg'
                : 'bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 border-2 border-violet-500/50 hover:border-violet-500'
            }`}
          >
            Calorie Calculator
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'toxic' && <ToxicFoods pet={selectedPet} />}
        {activeTab === 'portion' && <PortionGuide pet={selectedPet} />}
        {activeTab === 'calculator' && <CalorieCalculator pet={selectedPet} />}
      </div>
    </div>
  );
};

export default QuickGuide; 