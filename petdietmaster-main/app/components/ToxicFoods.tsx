'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ToxicFood {
  food: string;
  reason: string;
  riskLevel: string;
  symptoms: string;
  notes: string;
  safeBreeds?: string[];
  unsafeBreeds?: string[];
  safeAgeRange?: string;
  geminiAssessment?: string;
}

const toxicFoods: Record<string, ToxicFood[]> = {
  dog: [
    { 
      food: 'Dairy Products', 
      reason: 'While not toxic, many dogs are lactose intolerant. Tolerance varies by breed and individual dog.',
      riskLevel: 'Moderate',
      symptoms: 'Diarrhea, vomiting, stomach upset',
      notes: 'Some dogs can handle small amounts, while others are highly sensitive. Start with tiny amounts if introducing.',
      safeBreeds: ['Labrador Retriever', 'Golden Retriever', 'German Shepherd'],
      unsafeBreeds: ['West Highland Terrier', 'Irish Setter', 'Border Collie'],
      safeAgeRange: '6 months and older',
      geminiAssessment: 'Generally safe in small amounts for most adult dogs, but monitor for lactose intolerance symptoms.'
    },
    { 
      food: 'Rice', 
      reason: 'Generally safe but some dogs have grain sensitivities or allergies.',
      riskLevel: 'Low to Moderate',
      symptoms: 'Itching, digestive issues, skin problems in sensitive dogs',
      notes: 'Common in breeds like West Highland Terriers, Irish Setters. Consult vet if your breed is prone to grain sensitivity.',
      safeBreeds: ['Labrador Retriever', 'Golden Retriever', 'Boxer'],
      unsafeBreeds: ['West Highland Terrier', 'Irish Setter', 'Bulldog'],
      safeAgeRange: 'All ages',
      geminiAssessment: 'Safe for most dogs when cooked properly, but monitor grain-sensitive breeds closely.'
    },
    {
      food: 'Curry Leaves',
      reason: 'Can cause severe digestive issues. Sensitivity varies by size and breed.',
      riskLevel: 'High',
      symptoms: 'Vomiting, diarrhea, lethargy',
      notes: 'Small breeds are generally more sensitive. Avoid completely if your dog has a sensitive stomach.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds, especially small breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Avoid completely.'
    },
    {
      food: 'Masala Spices',
      reason: 'Many Indian spices can cause gastric irritation. Tolerance varies by dog.',
      riskLevel: 'High',
      symptoms: 'Stomach upset, vomiting, diarrhea',
      notes: 'Even small amounts can be problematic. Particularly risky for breeds prone to digestive issues.'
    },
    {
      food: 'Mango',
      reason: 'Flesh is generally safe but seeds and pit are toxic. Skin can cause issues in some dogs.',
      riskLevel: 'Moderate',
      symptoms: 'Choking (from pit), digestive blockage, potential cyanide poisoning from seed',
      notes: 'Remove pit and skin before feeding. Avoid completely if your dog has history of swallowing things whole.'
    }
  ],
  cat: [
    { 
      food: 'Raw Fish (Indian Markets)', 
      reason: 'May contain thiaminase and harmful bacteria',
      riskLevel: 'High',
      symptoms: 'Thiamine deficiency, neurological issues, bacterial infection',
      notes: 'Never feed raw fish. If giving fish, ensure it is thoroughly cooked.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Always cook fish thoroughly.'
    },
    { 
      food: 'Milk/Lassi', 
      reason: 'Most cats are lactose intolerant',
      riskLevel: 'Moderate',
      symptoms: 'Diarrhea, vomiting, stomach upset',
      notes: 'Despite popular belief, adult cats cannot digest dairy well. Some cats may tolerate small amounts.'
    },
    { 
      food: 'Curry Leaves', 
      reason: 'Can cause digestive issues',
      riskLevel: 'Moderate',
      symptoms: 'Vomiting, diarrhea, stomach discomfort',
      notes: 'Cats are particularly sensitive to essential oils in curry leaves.'
    },
    { 
      food: 'Masala Tea', 
      reason: 'Contains caffeine which is toxic',
      riskLevel: 'High',
      symptoms: 'Restlessness, rapid breathing, heart palpitations, muscle tremors',
      notes: 'Even small amounts of caffeine can be dangerous for cats.'
    },
    { 
      food: 'Ghee', 
      reason: 'High fat content can cause pancreatitis',
      riskLevel: 'High',
      symptoms: 'Vomiting, diarrhea, abdominal pain, lethargy',
      notes: 'Even small amounts can trigger pancreatitis in sensitive cats.'
    }
  ],
  goat: [
    { 
      food: 'Moldy Feed', 
      reason: 'Can contain harmful mycotoxins',
      riskLevel: 'High',
      symptoms: 'Neurological issues, liver damage, respiratory problems',
      notes: 'Goats are particularly sensitive to mycotoxins. Even small amounts can be fatal.'
    },
    { 
      food: 'Azalea/Rhododendron', 
      reason: 'Highly toxic to goats',
      riskLevel: 'High',
      symptoms: 'Excessive salivation, weakness, difficulty breathing, potential heart issues',
      notes: 'Even small amounts can be lethal. Keep goats away from these plants completely.'
    },
    { 
      food: 'Cherry Tree Parts', 
      reason: 'Contains cyanide',
      riskLevel: 'High',
      symptoms: 'Difficulty breathing, bright red gums, convulsions, collapse',
      notes: 'Wilted leaves are particularly dangerous. All parts except ripe fruit are toxic.'
    },
    { 
      food: 'Rhubarb Leaves', 
      reason: 'Contains high levels of oxalic acid',
      riskLevel: 'High',
      symptoms: 'Kidney damage, tremors, salivation, weakness',
      notes: 'The leaves contain concentrated oxalic acid which can cause severe kidney damage.'
    }
  ],
  horse: [
    { 
      food: 'Neem Leaves', 
      reason: 'Can be toxic in large quantities',
      riskLevel: 'Moderate',
      symptoms: 'Digestive upset, colic, potential neurological issues',
      notes: 'While some horses may tolerate small amounts, best to avoid completely.'
    },
    { 
      food: 'Jamun Seeds', 
      reason: 'Can cause digestive blockage',
      riskLevel: 'High',
      symptoms: 'Colic, constipation, potential intestinal blockage',
      notes: 'Seeds can be particularly dangerous due to their size and hardness.'
    },
    { 
      food: 'Mango Leaves', 
      reason: 'Can cause colic and digestive issues',
      riskLevel: 'Moderate',
      symptoms: 'Colic, diarrhea, abdominal pain',
      notes: 'Fresh leaves are more problematic than dried ones.'
    }
  ],
  fish: [
    { 
      food: 'Leftover Roti', 
      reason: 'Can cause water pollution and bloating',
      riskLevel: 'Moderate',
      symptoms: 'Water quality issues, fish stress, potential ammonia spikes',
      notes: 'Bread products can quickly foul water and cause health issues.'
    },
    { 
      food: 'Spiced Food', 
      reason: 'Can damage gills and affect water quality',
      riskLevel: 'High',
      symptoms: 'Gill irritation, labored breathing, stress',
      notes: 'Spices can burn sensitive gill tissue and make it hard for fish to breathe.'
    },
    { 
      food: 'Dal Water', 
      reason: 'Can alter water pH and harm fish',
      riskLevel: 'High',
      symptoms: 'pH stress, breathing problems, lethargy',
      notes: 'Even small amounts can significantly impact water chemistry.'
    }
  ],
  rabbit: [
    { 
      food: 'Tulsi Leaves', 
      reason: 'Can be toxic in large amounts',
      riskLevel: 'Moderate',
      symptoms: 'Digestive issues, lethargy, potential organ damage',
      notes: 'While some rabbits may nibble without immediate issues, long-term consumption can be harmful.'
    },
    { 
      food: 'Raw Dal', 
      reason: 'Contains anti-nutrients harmful to rabbits',
      riskLevel: 'High',
      symptoms: 'Bloating, gas, digestive upset, potential blockages',
      notes: 'Rabbits cannot properly digest legumes. Can cause serious digestive issues.'
    },
    { 
      food: 'Curry Leaves', 
      reason: 'Can cause digestive issues',
      riskLevel: 'Moderate',
      symptoms: 'Stomach upset, reduced appetite, diarrhea',
      notes: 'Essential oils in curry leaves can be particularly problematic for rabbits.'
    },
    { 
      food: 'Betel Leaves', 
      reason: 'Can be toxic to rabbits',
      riskLevel: 'High',
      symptoms: 'Neurological issues, digestive problems, potential organ damage',
      notes: 'Contains compounds that can be highly toxic to rabbits. Avoid completely.'
    }
  ],
  bird: [
    { 
      food: 'Chili Powder', 
      reason: 'Can cause respiratory issues',
      riskLevel: 'High',
      symptoms: 'Respiratory distress, sneezing, eye irritation',
      notes: 'Birds have sensitive respiratory systems. Avoid all powder spices.'
    },
    { 
      food: 'Masala Mixtures', 
      reason: 'Contains harmful spices',
      riskLevel: 'High',
      symptoms: 'Digestive upset, respiratory issues, potential organ damage',
      notes: 'Many spices in masalas can be toxic to birds.'
    },
    { 
      food: 'Tea Leaves', 
      reason: 'Contains caffeine which is toxic',
      riskLevel: 'High',
      symptoms: 'Increased heart rate, anxiety, tremors, seizures',
      notes: 'Birds are extremely sensitive to caffeine. Avoid all caffeinated products.'
    }
  ],
  chicken: [
    {
      food: 'Moldy/Spoiled Feed',
      reason: 'Contains mycotoxins that are highly toxic to chickens',
      riskLevel: 'High',
      symptoms: 'Reduced appetite, lethargy, neurological issues',
      notes: 'Even small amounts of moldy feed can be fatal to chickens.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Always provide fresh feed.'
    },
    {
      food: 'Avocado',
      reason: 'Contains persin which is toxic to chickens',
      riskLevel: 'High',
      symptoms: 'Respiratory distress, fluid around heart, death',
      notes: 'All parts of avocado including pit, skin, and flesh are toxic.'
    },
    {
      food: 'Raw/Dried Beans',
      reason: 'Contains hemagglutinin which is toxic to chickens',
      riskLevel: 'High',
      symptoms: 'Severe digestive issues, lethargy, possible death',
      notes: 'Beans must be thoroughly cooked to be safe.'
    }
  ],
  cow: [
    {
      food: 'Onions/Garlic',
      reason: 'Can cause anemia and blood cell damage',
      riskLevel: 'High',
      symptoms: 'Weakness, reduced appetite, red-colored urine',
      notes: 'Both fresh and dried forms are toxic. Can be fatal in large amounts.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Avoid completely.'
    },
    {
      food: 'Moldy/Spoiled Feed',
      reason: 'Contains harmful mycotoxins',
      riskLevel: 'High',
      symptoms: 'Liver damage, reduced milk production, neurological issues',
      notes: 'Even small amounts can affect milk production and overall health.'
    },
    {
      food: 'Raw Potatoes',
      reason: 'Contains solanine which is toxic',
      riskLevel: 'High',
      symptoms: 'Digestive issues, weakness, neurological problems',
      notes: 'Green or sprouted potatoes are particularly dangerous.'
    }
  ],
  buffalo: [
    {
      food: 'Moldy Hay/Feed',
      reason: 'Contains dangerous mycotoxins',
      riskLevel: 'High',
      symptoms: 'Liver damage, reduced appetite, neurological issues',
      notes: 'Buffaloes are particularly sensitive to certain types of mold toxins.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Always provide fresh feed.'
    },
    {
      food: 'Pesticide-treated Plants',
      reason: 'Contains harmful chemicals',
      riskLevel: 'High',
      symptoms: 'Tremors, excessive salivation, difficulty breathing',
      notes: 'Keep buffaloes away from recently sprayed areas.'
    },
    {
      food: 'Fermented Feed',
      reason: 'Can cause acidosis if consumed in large amounts',
      riskLevel: 'Moderate',
      symptoms: 'Digestive issues, reduced rumination, lethargy',
      notes: 'Must be properly fermented and introduced gradually.'
    }
  ],
  pig: [
    {
      food: 'Raw/Undercooked Meat',
      reason: 'Risk of parasites and bacterial infection',
      riskLevel: 'High',
      symptoms: 'Parasitic infection, digestive issues, fever',
      notes: 'Never feed raw meat or kitchen scraps containing raw meat.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Always cook meat thoroughly.'
    },
    {
      food: 'Moldy Feed',
      reason: 'Contains mycotoxins toxic to pigs',
      riskLevel: 'High',
      symptoms: 'Reduced growth, organ damage, reproductive issues',
      notes: 'Pigs are particularly sensitive to certain mold toxins.'
    },
    {
      food: 'Raw Potatoes',
      reason: 'Contains solanine which is toxic',
      riskLevel: 'High',
      symptoms: 'Nausea, diarrhea, breathing problems',
      notes: 'Green or sprouted potatoes are especially dangerous.'
    }
  ],
  pigeon: [
    {
      food: 'Avocado',
      reason: 'Contains persin which is toxic to birds',
      riskLevel: 'High',
      symptoms: 'Respiratory distress, weakness, heart problems',
      notes: 'All parts of avocado are toxic to pigeons.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Avoid completely.'
    },
    {
      food: 'Salted Foods',
      reason: 'Cannot process high amounts of salt',
      riskLevel: 'High',
      symptoms: 'Excessive thirst, dehydration, kidney damage',
      notes: 'Even small amounts of salt can be dangerous.'
    },
    {
      food: 'Caffeine Products',
      reason: 'Toxic to birds cardiovascular system',
      riskLevel: 'High',
      symptoms: 'Increased heart rate, hyperactivity, seizures',
      notes: 'Includes tea, coffee, and chocolate.'
    }
  ],
  parrot: [
    {
      food: 'Avocado',
      reason: 'Contains persin which is highly toxic',
      riskLevel: 'High',
      symptoms: 'Difficulty breathing, heart failure, sudden death',
      notes: 'All parts including fruit, pit, and skin are toxic.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All breeds'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any breed or age. Avoid completely.'
    },
    {
      food: 'Onions/Garlic',
      reason: 'Can cause hemolytic anemia',
      riskLevel: 'High',
      symptoms: 'Weakness, breathing problems, pale gums',
      notes: 'Both raw and cooked forms are toxic.'
    },
    {
      food: 'Chocolate',
      reason: 'Contains theobromine and caffeine',
      riskLevel: 'High',
      symptoms: 'Vomiting, diarrhea, seizures, heart problems',
      notes: 'Even small amounts can be fatal.'
    }
  ],
  turtle: [
    {
      food: 'Dairy Products',
      reason: 'Cannot digest lactose',
      riskLevel: 'High',
      symptoms: 'Severe digestive issues, diarrhea',
      notes: 'Turtles lack the enzymes to process dairy.',
      safeBreeds: ['None'],
      unsafeBreeds: ['All species'],
      safeAgeRange: 'Not recommended for any age',
      geminiAssessment: 'Not safe for any species or age. Avoid completely.'
    },
    {
      food: 'Processed Human Foods',
      reason: 'Contains harmful additives and preservatives',
      riskLevel: 'High',
      symptoms: 'Liver problems, shell deformities, vitamin deficiencies',
      notes: 'Stick to species-appropriate turtle food and vegetables.'
    },
    {
      food: 'High-Protein Meats',
      reason: 'Can cause shell and organ problems',
      riskLevel: 'Moderate',
      symptoms: 'Shell deformities, kidney problems, gout',
      notes: 'Most pet turtles need a primarily vegetarian diet.'
    }
  ]
};

interface Props {
  pet: string;
}

const ToxicFoods: React.FC<Props> = ({ pet }) => {
  const petToxicFoods = toxicFoods[pet] || [];
  const petName = pet.charAt(0).toUpperCase() + pet.slice(1);

  // Pet-specific safety guidelines
  const petGuidelines = {
    dog: {
      variations: [
        `Food tolerance can vary significantly between individual dogs`,
        `Breed-specific sensitivities may affect reaction to certain foods`,
        `Size and age of your dog play important roles in food tolerance`,
        `Previous health conditions can impact food safety`
      ],
      specificWarnings: [
        `Consider your dog's specific breed sensitivities`,
        `Start with very small amounts when trying safe foods`,
        `Keep a food diary to track any reactions`,
        `Know your dog's allergies and health history`
      ]
    },
    cat: {
      variations: [
        `Cats are particularly sensitive to many foods that humans eat`,
        `Individual cats may react differently to certain foods`,
        `Age and health status affect food tolerance`,
        `Some breeds may have specific sensitivities`
      ],
      specificWarnings: [
        `Consider your cat's age and health condition`,
        `Introduce new foods one at a time`,
        `Monitor for any changes in behavior or appetite`,
        `Keep toxic plants out of reach`
      ]
    },
    chicken: {
      variations: [
        `Chickens have specific dietary needs and restrictions`,
        `Age and breed affect food tolerance`,
        `Laying status impacts nutritional requirements`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor egg production and quality`,
        `Watch for changes in droppings`,
        `Keep feed fresh and free from mold`,
        `Provide proper grit for digestion`
      ]
    },
    cow: {
      variations: [
        `Cows have complex digestive systems`,
        `Breed and age affect food tolerance`,
        `Lactation status impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor rumination and digestion`,
        `Watch for signs of bloat`,
        `Keep feed fresh and properly stored`,
        `Ensure proper mineral balance`
      ]
    },
    buffalo: {
      variations: [
        `Buffaloes have specific dietary requirements`,
        `Age and breed affect food tolerance`,
        `Lactation status impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor rumination and digestion`,
        `Watch for signs of digestive issues`,
        `Keep feed fresh and properly stored`,
        `Ensure proper mineral balance`
      ]
    },
    pig: {
      variations: [
        `Pigs have specific dietary needs`,
        `Age and breed affect food tolerance`,
        `Growth stage impacts nutritional requirements`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor growth and development`,
        `Watch for signs of digestive issues`,
        `Keep feed fresh and properly stored`,
        `Ensure proper protein balance`
      ]
    },
    pigeon: {
      variations: [
        `Pigeons have specific dietary requirements`,
        `Age and breed affect food tolerance`,
        `Breeding status impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor droppings and behavior`,
        `Watch for signs of digestive issues`,
        `Keep feed fresh and properly stored`,
        `Ensure proper grit and minerals`
      ]
    },
    parrot: {
      variations: [
        `Parrots have specific dietary needs`,
        `Species and age affect food tolerance`,
        `Breeding status impacts nutritional requirements`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor droppings and behavior`,
        `Watch for signs of digestive issues`,
        `Keep feed fresh and properly stored`,
        `Ensure proper vitamin and mineral balance`
      ]
    },
    turtle: {
      variations: [
        `Turtles have specific dietary requirements`,
        `Species and age affect food tolerance`,
        `Growth stage impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor shell health and growth`,
        `Watch for signs of digestive issues`,
        `Keep food fresh and properly stored`,
        `Ensure proper calcium and vitamin balance`
      ]
    },
    horse: {
      variations: [
        `Horses have sensitive digestive systems`,
        `Breed and age affect food tolerance`,
        `Activity level impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor for signs of colic`,
        `Watch for changes in behavior`,
        `Keep feed fresh and properly stored`,
        `Ensure proper mineral balance`
      ]
    },
    fish: {
      variations: [
        `Fish have specific dietary requirements`,
        `Species and size affect food tolerance`,
        `Water conditions impact nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor water quality regularly`,
        `Watch for changes in behavior`,
        `Keep food fresh and properly stored`,
        `Ensure proper feeding schedule`
      ]
    },
    rabbit: {
      variations: [
        `Rabbits have sensitive digestive systems`,
        `Breed and age affect food tolerance`,
        `Growth stage impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor droppings and behavior`,
        `Watch for signs of digestive issues`,
        `Keep feed fresh and properly stored`,
        `Ensure proper fiber intake`
      ]
    },
    bird: {
      variations: [
        `Birds have specific dietary requirements`,
        `Species and size affect food tolerance`,
        `Breeding status impacts nutritional needs`,
        `Previous health conditions can affect food safety`
      ],
      specificWarnings: [
        `Monitor droppings and behavior`,
        `Watch for signs of digestive issues`,
        `Keep feed fresh and properly stored`,
        `Ensure proper vitamin and mineral balance`
      ]
    }
  };

  const currentPetGuide = petGuidelines[pet as keyof typeof petGuidelines] || {
    variations: [
      `This pet has specific dietary requirements`,
      `Age and breed affect food tolerance`,
      `Health status impacts nutritional needs`,
      `Previous conditions can affect food safety`
    ],
    specificWarnings: [
      `Monitor health and behavior regularly`,
      `Watch for signs of digestive issues`,
      `Keep feed fresh and properly stored`,
      `Ensure proper nutritional balance`
    ]
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#e2e8f0] flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        Food Safety Guide for {petName}s
      </h3>

      <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400 mb-4">
        <p className="text-blue-900 text-sm font-semibold">
          ℹ️ Understanding Food Safety for {petName}s:
        </p>
        <ul className="list-disc list-inside mt-2 text-blue-800 text-sm space-y-1">
          {currentPetGuide.variations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3">
        {petToxicFoods.map((item, index) => (
          <div
            key={index}
            className="bg-[#1e1b4b] p-4 rounded-lg border-2 border-[#312e81] hover:border-[#4338ca] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-[#e2e8f0]">{item.food}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.riskLevel === 'High' ? 'bg-red-200 text-red-800' :
                item.riskLevel === 'Moderate' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
              }`}>
                {item.riskLevel} Risk
              </span>
            </div>
            <p className="text-[#cbd5e1] text-sm mb-2">{item.reason}</p>
            <div className="mt-2 space-y-2">
              <p className="text-[#cbd5e1] text-sm">
                <span className="font-semibold text-[#e2e8f0]">Symptoms:</span> {item.symptoms}
              </p>
              <p className="text-[#cbd5e1] text-sm">
                <span className="font-semibold text-[#e2e8f0]">Important Notes:</span> {item.notes}
              </p>
              {item.safeBreeds && (
                <p className="text-[#cbd5e1] text-sm">
                  <span className="font-semibold text-[#e2e8f0]">Safe for Breeds:</span> {item.safeBreeds.join(', ')}
                </p>
              )}
              {item.unsafeBreeds && (
                <p className="text-[#cbd5e1] text-sm">
                  <span className="font-semibold text-[#e2e8f0]">Unsafe for Breeds:</span> {item.unsafeBreeds.join(', ')}
                </p>
              )}
              {item.safeAgeRange && (
                <p className="text-[#cbd5e1] text-sm">
                  <span className="font-semibold text-[#e2e8f0]">Safe Age Range:</span> {item.safeAgeRange}
                </p>
              )}
              {item.geminiAssessment && (
                <p className="text-[#cbd5e1] text-sm">
                  <span className="font-semibold text-[#e2e8f0]">Safety Assessment:</span> {item.geminiAssessment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400 mt-6">
        <p className="text-yellow-900 text-sm">
          <span className="font-semibold">⚠️ Critical Safety Information for {petName}s:</span>
        </p>
        <ul className="list-disc list-inside mt-2 text-yellow-800 text-sm space-y-1">
          <li>Always consult your veterinarian before introducing new foods</li>
          {currentPetGuide.specificWarnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
        <div className="mt-4 bg-yellow-50 p-3 rounded">
          <p className="text-yellow-800 text-sm font-semibold">
            When to Contact Your Vet Immediately:
          </p>
          <ul className="list-disc list-inside mt-1 text-yellow-800 text-sm">
            <li>Difficulty breathing or swelling</li>
            <li>Severe vomiting or diarrhea</li>
            <li>Unusual lethargy or weakness</li>
            <li>Any concerning changes in behavior</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ToxicFoods; 