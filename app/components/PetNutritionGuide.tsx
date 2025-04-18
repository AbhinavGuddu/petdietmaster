'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NutritionGuideProps {
  petType: string;
  isOpen: boolean;
  onClose: () => void;
}

interface PetNutritionInfo {
  [key: string]: {
    range: string;
    sources: string[];
  };
}

interface PetNutritionData {
  [key: string]: PetNutritionInfo;
}

interface DailyNeed {
  nutrient: string;
  amount: string;
  description: string;
}

interface PetData {
  dailyNeeds: DailyNeed[];
  mealFrequency: {
    [key: string]: string;
  };
  tips: string[];
}

interface NutritionData {
  [key: string]: PetData;
}

const nutritionData: NutritionData = {
  dog: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '18-25%', description: 'Essential for muscle maintenance and growth' },
      { nutrient: 'Fat', amount: '8-15%', description: 'Provides energy and supports coat health' },
      { nutrient: 'Carbohydrates', amount: '30-70%', description: 'Energy source and fiber for digestion' },
      { nutrient: 'Calcium', amount: '1.0-1.8%', description: 'Important for bone health' },
      { nutrient: 'Water', amount: '60ml/kg', description: 'Daily water intake requirement' }
    ],
    mealFrequency: {
      puppy: '3-4 times daily',
      adult: '2 times daily',
      senior: '2-3 times daily'
    },
    tips: [
      'Feed according to size and activity level',
      'Maintain consistent feeding schedule',
      'Avoid table scraps',
      'Monitor weight regularly',
      'Adjust portions based on activity'
    ]
  },
  cat: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '26-30%', description: 'Critical for muscle maintenance' },
      { nutrient: 'Fat', amount: '20-24%', description: 'Energy source and coat health' },
      { nutrient: 'Taurine', amount: '0.1-0.2%', description: 'Essential amino acid for heart health' },
      { nutrient: 'Water', amount: '40-60ml/kg', description: 'Daily water requirement' }
    ],
    mealFrequency: {
      kitten: '3-4 times daily',
      adult: '2-3 times daily',
      senior: '2-4 times daily'
    },
    tips: [
      'Feed small portions frequently',
      'Provide fresh water daily',
      'Include wet food in diet',
      'Monitor weight changes',
      'Consider indoor vs outdoor needs'
    ]
  },
  goat: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '14-16%', description: 'Essential for growth and milk production' },
      { nutrient: 'Fiber', amount: '12-18%', description: 'Crucial for digestive health' },
      { nutrient: 'Calcium', amount: '0.6-0.8%', description: 'Important for bone health and milk production' },
      { nutrient: 'Water', amount: '2-4L/day', description: 'Clean, fresh water requirement' }
    ],
    mealFrequency: {
      kid: '4-5 times daily',
      adult: '2-3 times daily',
      lactating: '3-4 times daily'
    },
    tips: [
      'Provide quality hay or pasture',
      'Supplement with minerals',
      'Avoid sudden feed changes',
      'Keep feeding areas clean',
      'Monitor body condition'
    ]
  },
  horse: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '10-12%', description: 'Essential for muscle maintenance' },
      { nutrient: 'Fiber', amount: '20-30%', description: 'Critical for digestive health' },
      { nutrient: 'Carbohydrates', amount: '30-40%', description: 'Energy source for activity' },
      { nutrient: 'Water', amount: '20-40L/day', description: 'Fresh water requirement' }
    ],
    mealFrequency: {
      foal: '4-6 times daily',
      adult: '2-3 times daily',
      senior: '3-4 times daily'
    },
    tips: [
      'Feed little and often',
      'Provide constant access to hay',
      'Maintain feeding schedule',
      'Include grazing time',
      'Monitor weight and condition'
    ]
  },
  chicken: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '16-18%', description: 'Essential for egg production' },
      { nutrient: 'Calcium', amount: '3.5-4%', description: 'Critical for egg shell formation' },
      { nutrient: 'Grit', amount: '1-2%', description: 'Aids in digestion' },
      { nutrient: 'Water', amount: '500ml/day', description: 'Clean water requirement' }
    ],
    mealFrequency: {
      chick: '5-6 times daily',
      layer: 'Constant access',
      broiler: 'Constant access'
    },
    tips: [
      'Provide layer feed for egg-laying hens',
      'Ensure access to grit',
      'Keep feed dry and fresh',
      'Include scratch grains',
      'Monitor egg production'
    ]
  },
  cow: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '16-18%', description: 'Essential for milk production' },
      { nutrient: 'Fiber', amount: '25-35%', description: 'Important for rumen health' },
      { nutrient: 'Energy', amount: '65-70%', description: 'TDN (Total Digestible Nutrients)' },
      { nutrient: 'Water', amount: '40-100L/day', description: 'Fresh water requirement' }
    ],
    mealFrequency: {
      calf: '2-3 times daily',
      adult: 'Constant access',
      lactating: 'Constant access'
    },
    tips: [
      'Provide quality forage',
      'Balance grain feeding',
      'Maintain mineral access',
      'Monitor milk production',
      'Regular feeding schedule'
    ]
  },
  buffalo: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '11-14%', description: 'For growth and maintenance' },
      { nutrient: 'Fiber', amount: '25-30%', description: 'Essential for digestion' },
      { nutrient: 'Minerals', amount: '2-3%', description: 'For overall health' },
      { nutrient: 'Water', amount: '30-50L/day', description: 'Clean water requirement' }
    ],
    mealFrequency: {
      calf: '3-4 times daily',
      adult: '2-3 times daily',
      working: '3-4 times daily'
    },
    tips: [
      'Provide green fodder',
      'Include mineral supplements',
      'Regular watering schedule',
      'Balance concentrate feed',
      'Monitor health condition'
    ]
  },
  pig: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '16-18%', description: 'Essential for growth' },
      { nutrient: 'Energy', amount: '3200-3400 kcal/kg', description: 'For daily activities' },
      { nutrient: 'Fiber', amount: '3-7%', description: 'Aids digestion' },
      { nutrient: 'Water', amount: '2-6L/day', description: 'Clean water requirement' }
    ],
    mealFrequency: {
      piglet: '4-5 times daily',
      grower: '3 times daily',
      adult: '2-3 times daily'
    },
    tips: [
      'Feed based on growth stage',
      'Maintain clean feeding area',
      'Provide balanced feed',
      'Monitor weight gain',
      'Regular feeding schedule'
    ]
  },
  pigeon: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '15-17%', description: 'For health and feather condition' },
      { nutrient: 'Carbohydrates', amount: '60-70%', description: 'Energy source' },
      { nutrient: 'Grit', amount: '1-2%', description: 'For digestion' },
      { nutrient: 'Water', amount: '30-60ml/day', description: 'Fresh water requirement' }
    ],
    mealFrequency: {
      squab: '2-3 times daily',
      adult: '2 times daily',
      breeding: '3 times daily'
    },
    tips: [
      'Provide varied seed mix',
      'Include mineral grit',
      'Fresh water daily',
      'Clean feeding area',
      'Monitor breeding pairs'
    ]
  },
  parrot: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '12-15%', description: 'For feather and muscle health' },
      { nutrient: 'Fat', amount: '4-6%', description: 'Energy source' },
      { nutrient: 'Vitamins', amount: 'Varied', description: 'Essential for health' },
      { nutrient: 'Water', amount: '20-30ml/day', description: 'Fresh water requirement' }
    ],
    mealFrequency: {
      chick: '3-4 times daily',
      adult: '2-3 times daily',
      breeding: '3-4 times daily'
    },
    tips: [
      'Offer varied fresh fruits',
      'Include vegetables daily',
      'Provide quality pellets',
      'Avoid avocado and chocolate',
      'Regular feeding schedule'
    ]
  },
  turtle: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '20-40%', description: 'Species-dependent requirement' },
      { nutrient: 'Calcium', amount: '2-3%', description: 'For shell health' },
      { nutrient: 'Vitamins', amount: 'Varied', description: 'Essential for health' },
      { nutrient: 'Water', amount: 'Constant access', description: 'Clean water requirement' }
    ],
    mealFrequency: {
      juvenile: '1-2 times daily',
      adult: '4-5 times weekly',
      breeding: 'Daily'
    },
    tips: [
      'Provide UV lighting',
      'Include calcium supplements',
      'Offer varied diet',
      'Maintain water quality',
      'Monitor shell health'
    ]
  },
  fish: {
    dailyNeeds: [
      { nutrient: 'Protein', amount: '30-45%', description: 'Species-dependent requirement' },
      { nutrient: 'Fat', amount: '5-10%', description: 'Energy source' },
      { nutrient: 'Minerals', amount: '1-2%', description: 'For overall health' },
      { nutrient: 'Water Quality', amount: 'pH 6.5-7.5', description: 'Optimal water conditions' }
    ],
    mealFrequency: {
      fry: '4-6 times daily',
      juvenile: '2-3 times daily',
      adult: '1-2 times daily'
    },
    tips: [
      'Feed small portions',
      'Remove uneaten food',
      'Maintain water quality',
      'Vary diet types',
      'Monitor feeding behavior'
    ]
  }
};

const getPetNutritionInfo = (petType: string): PetNutritionInfo => {
  const nutritionInfo: PetNutritionData = {
    dog: {
      protein: {
        range: '14% to 16%',
        sources: [
          'Chicken (Murga)',
          'Fish (Rohu, Katla)',
          'Eggs (Anda)',
          'Paneer (in moderation)',
          'Dahi (Curd)'
        ]
      },
      fat: {
        range: '5% to 8%',
        sources: [
          'Ghee (in small amounts)',
          'Coconut oil',
          'Mustard oil (in small amounts)',
          'Egg yolks',
          'Peanut butter (unsweetened)'
        ]
      },
      fiber: {
        range: '2% to 4%',
        sources: [
          'Pumpkin (Kaddu)',
          'Sweet potatoes (Shakarkandi)',
          'Carrots (Gajar)',
          'Green beans (Sem)',
          'Bottle gourd (Lauki)'
        ]
      },
      calcium: {
        range: '0.5% to 0.8%',
        sources: [
          'Curd (Dahi)',
          'Paneer',
          'Sesame seeds (Til)',
          'Ragi flour'
        ]
      },
      phosphorus: {
        range: '0.4% to 0.7%',
        sources: [
          'Chicken',
          'Fish',
          'Eggs',
          'Lentils (Dal)'
        ]
      }
    },
    cat: {
      protein: {
        range: '26% to 30%',
        sources: [
          'Chicken (Murga)',
          'Fish (Rohu, Katla)',
          'Eggs (Anda)',
          'Paneer (in small amounts)'
        ]
      },
      fat: {
        range: '9% to 12%',
        sources: [
          'Ghee (in small amounts)',
          'Coconut oil',
          'Egg yolks',
          'Peanut butter (unsweetened)'
        ]
      },
      fiber: {
        range: '1% to 3%',
        sources: [
          'Pumpkin (Kaddu)',
          'Carrots (Gajar)',
          'Green beans (Sem)',
          'Bottle gourd (Lauki)'
        ]
      },
      taurine: {
        range: '0.1% to 0.2%',
        sources: [
          'Chicken',
          'Fish',
          'Eggs',
          'Paneer'
        ]
      },
      calcium: {
        range: '0.6% to 1%',
        sources: [
          'Curd (Dahi)',
          'Paneer',
          'Sesame seeds (Til)',
          'Ragi flour'
        ]
      }
    },
    goat: {
      protein: {
        range: '12% to 16%',
        sources: [
          'Bajra (Pearl millet)',
          'Jowar (Sorghum)',
          'Maize (Makka)',
          'Groundnut cake',
          'Soybean meal'
        ]
      },
      fiber: {
        range: '15% to 20%',
        sources: [
          'Wheat straw',
          'Rice straw',
          'Green fodder (Berseem)',
          'Lucerne (Alfalfa)'
        ]
      },
      calcium: {
        range: '0.3% to 0.5%',
        sources: [
          'Mineral mixture',
          'Bone meal',
          'Limestone powder',
          'Shell grit'
        ]
      },
      phosphorus: {
        range: '0.2% to 0.4%',
        sources: [
          'Dicalcium phosphate',
          'Bone meal',
          'Mineral mixture',
          'Groundnut cake'
        ]
      },
      copper: {
        range: '10-20 ppm',
        sources: [
          'Mineral mixture',
          'Copper sulfate',
          'Groundnut cake',
          'Soybean meal'
        ]
      }
    },
    horse: {
      protein: {
        range: '10% to 12%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Soybean meal',
          'Linseed meal'
        ]
      },
      fiber: {
        range: '15% to 20%',
        sources: [
          'Grass hay',
          'Alfalfa hay',
          'Fresh grass',
          'Beet pulp'
        ]
      },
      calcium: {
        range: '0.3% to 0.5%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Calcium supplements',
          'Mineral blocks'
        ]
      },
      phosphorus: {
        range: '0.2% to 0.4%',
        sources: [
          'Grain mixes',
          'Legume hay',
          'Mineral supplements',
          'Bone meal'
        ]
      },
      magnesium: {
        range: '0.1% to 0.3%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Magnesium supplements',
          'Mineral blocks'
        ]
      }
    },
    chicken: {
      protein: {
        range: '16% to 20%',
        sources: [
          'Soybean meal',
          'Fish meal',
          'Meat and bone meal',
          'Sunflower meal',
          'Peas'
        ]
      },
      calcium: {
        range: '3.5% to 4%',
        sources: [
          'Oyster shell',
          'Limestone',
          'Calcium supplements',
          'Bone meal'
        ]
      },
      phosphorus: {
        range: '0.4% to 0.6%',
        sources: [
          'Dicalcium phosphate',
          'Meat and bone meal',
          'Fish meal',
          'Mineral supplements'
        ]
      },
      fiber: {
        range: '3% to 5%',
        sources: [
          'Wheat bran',
          'Oat hulls',
          'Alfalfa meal',
          'Sunflower hulls'
        ]
      },
      methionine: {
        range: '0.3% to 0.4%',
        sources: [
          'Soybean meal',
          'Fish meal',
          'Methionine supplements',
          'Sunflower meal'
        ]
      }
    },
    cow: {
      protein: {
        range: '12% to 16%',
        sources: [
          'Alfalfa hay',
          'Soybean meal',
          'Cottonseed meal',
          'Brewer\'s grains',
          'Legume hay'
        ]
      },
      fiber: {
        range: '15% to 20%',
        sources: [
          'Grass hay',
          'Alfalfa hay',
          'Corn silage',
          'Fresh grass'
        ]
      },
      calcium: {
        range: '0.4% to 0.6%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Calcium supplements',
          'Mineral blocks'
        ]
      },
      phosphorus: {
        range: '0.2% to 0.4%',
        sources: [
          'Grain mixes',
          'Legume hay',
          'Mineral supplements',
          'Bone meal'
        ]
      },
      magnesium: {
        range: '0.2% to 0.3%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Magnesium supplements',
          'Mineral blocks'
        ]
      }
    },
    buffalo: {
      protein: {
        range: '12% to 16%',
        sources: [
          'Alfalfa hay',
          'Soybean meal',
          'Cottonseed meal',
          'Brewer\'s grains',
          'Legume hay'
        ]
      },
      fiber: {
        range: '15% to 20%',
        sources: [
          'Grass hay',
          'Alfalfa hay',
          'Corn silage',
          'Fresh grass'
        ]
      },
      calcium: {
        range: '0.4% to 0.6%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Calcium supplements',
          'Mineral blocks'
        ]
      },
      phosphorus: {
        range: '0.2% to 0.4%',
        sources: [
          'Grain mixes',
          'Legume hay',
          'Mineral supplements',
          'Bone meal'
        ]
      },
      magnesium: {
        range: '0.2% to 0.3%',
        sources: [
          'Alfalfa hay',
          'Legume hay',
          'Magnesium supplements',
          'Mineral blocks'
        ]
      }
    },
    pig: {
      protein: {
        range: '14% to 18%',
        sources: [
          'Soybean meal',
          'Fish meal',
          'Meat and bone meal',
          'Peas',
          'Canola meal'
        ]
      },
      fiber: {
        range: '3% to 5%',
        sources: [
          'Wheat bran',
          'Oat hulls',
          'Alfalfa meal',
          'Beet pulp'
        ]
      },
      calcium: {
        range: '0.6% to 0.8%',
        sources: [
          'Limestone',
          'Dicalcium phosphate',
          'Bone meal',
          'Calcium supplements'
        ]
      },
      phosphorus: {
        range: '0.4% to 0.6%',
        sources: [
          'Dicalcium phosphate',
          'Meat and bone meal',
          'Fish meal',
          'Mineral supplements'
        ]
      },
      lysine: {
        range: '0.7% to 1%',
        sources: [
          'Soybean meal',
          'Fish meal',
          'Lysine supplements',
          'Meat and bone meal'
        ]
      }
    },
    pigeon: {
      protein: {
        range: '12% to 16%',
        sources: [
          'Peas',
          'Lentils',
          'Soybeans',
          'Sunflower seeds',
          'Hemp seeds'
        ]
      },
      fat: {
        range: '3% to 5%',
        sources: [
          'Sunflower seeds',
          'Safflower seeds',
          'Hemp seeds',
          'Flax seeds'
        ]
      },
      fiber: {
        range: '3% to 5%',
        sources: [
          'Oats',
          'Barley',
          'Wheat',
          'Millet'
        ]
      },
      calcium: {
        range: '0.8% to 1%',
        sources: [
          'Oyster shell',
          'Grit',
          'Calcium supplements',
          'Mineral blocks'
        ]
      },
      phosphorus: {
        range: '0.4% to 0.6%',
        sources: [
          'Peas',
          'Lentils',
          'Mineral supplements',
          'Grit'
        ]
      }
    },
    parrot: {
      protein: {
        range: '12% to 15%',
        sources: [
          'Nuts (almonds, walnuts)',
          'Seeds (sunflower, pumpkin)',
          'Legumes',
          'Cooked eggs',
          'Cooked chicken (in moderation)'
        ]
      },
      fat: {
        range: '4% to 6%',
        sources: [
          'Nuts',
          'Seeds',
          'Avocado (in small amounts)',
          'Coconut'
        ]
      },
      fiber: {
        range: '3% to 5%',
        sources: [
          'Fresh fruits',
          'Vegetables',
          'Whole grains',
          'Leafy greens'
        ]
      },
      calcium: {
        range: '0.5% to 0.8%',
        sources: [
          'Dark leafy greens',
          'Broccoli',
          'Calcium supplements',
          'Cuttlebone'
        ]
      },
      vitaminA: {
        range: '5000-8000 IU/kg',
        sources: [
          'Carrots',
          'Sweet potatoes',
          'Dark leafy greens',
          'Red peppers'
        ]
      }
    },
    turtle: {
      protein: {
        range: '25% to 35%',
        sources: [
          'Earthworms',
          'Mealworms',
          'Crickets',
          'Small fish',
          'Shrimp'
        ]
      },
      calcium: {
        range: '1.5% to 2%',
        sources: [
          'Calcium supplements',
          'Cuttlebone',
          'Calcium-rich vegetables',
          'Calcium-dusted insects'
        ]
      },
      phosphorus: {
        range: '0.8% to 1%',
        sources: [
          'Whole prey items',
          'Calcium supplements',
          'Mineral blocks'
        ]
      },
      fiber: {
        range: '2% to 4%',
        sources: [
          'Dark leafy greens',
          'Vegetables',
          'Aquatic plants',
          'Fruits (in moderation)'
        ]
      },
      vitaminD3: {
        range: '400-800 IU/kg',
        sources: [
          'UVB lighting',
          'Vitamin D3 supplements',
          'Whole prey items'
        ]
      }
    },
    fish: {
      protein: {
        range: '30% to 40%',
        sources: [
          'Fish meal',
          'Shrimp meal',
          'Squid meal',
          'Bloodworms',
          'Brine shrimp'
        ]
      },
      fat: {
        range: '5% to 8%',
        sources: [
          'Fish oil',
          'Krill oil',
          'Algae oil',
          'Spirulina'
        ]
      },
      fiber: {
        range: '2% to 4%',
        sources: [
          'Spirulina',
          'Algae',
          'Vegetable matter',
          'Plant-based flakes'
        ]
      },
      calcium: {
        range: '0.5% to 1%',
        sources: [
          'Calcium supplements',
          'Cuttlebone',
          'Calcium-rich vegetables',
          'Mineral blocks'
        ]
      },
      phosphorus: {
        range: '0.4% to 0.8%',
        sources: [
          'Fish meal',
          'Shrimp meal',
          'Mineral supplements',
          'Whole prey items'
        ]
      }
    }
  };

  return nutritionInfo[petType] || nutritionInfo.dog;
};

const PetNutritionGuide: React.FC<NutritionGuideProps> = ({ petType, isOpen, onClose }) => {
  const petData = nutritionData[petType as keyof typeof nutritionData];
  const nutritionInfo = getPetNutritionInfo(petType);

  if (!petData) return null;

  // Function to capitalize the first letter of each word
  const capitalizeWords = (str: string) => {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {capitalizeWords(petType)} Nutrition Guide
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-4">
                  Daily Nutritional Needs
                </h3>
                <div className="space-y-4">
                  {petData.dailyNeeds.map((item) => {
                    const nutrientInfo = nutritionInfo[item.nutrient.toLowerCase()];
                    return (
                      <div key={item.nutrient} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 capitalize">
                              {item.nutrient}
                            </h4>
                            <p className="text-sm text-slate-300">Required: {item.amount}</p>
                          </div>
                        </div>
                        {nutrientInfo && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-1">
                              Food Sources:
                            </p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                              {nutrientInfo.sources.map((source, idx) => (
                                <li key={idx} className="hover:text-sky-400 transition-colors duration-200">
                                  {source}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                  Meal Frequency
                </h3>
                <div className="bg-slate-700/50 p-4 rounded-lg space-y-3 border border-slate-600/50">
                  {Object.entries(petData.mealFrequency).map(([age, frequency]) => (
                    <div key={age} className="flex justify-between items-center">
                      <span className="text-slate-300 capitalize">{age}</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-medium">
                        {frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500 mb-4">
                  Feeding Tips
                </h3>
                <ul className="space-y-2">
                  {petData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300 hover:text-sky-400 transition-colors duration-200">
                      <svg className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetNutritionGuide; 