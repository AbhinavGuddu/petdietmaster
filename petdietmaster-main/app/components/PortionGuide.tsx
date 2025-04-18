'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface Props {
  pet: string;
}

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
  horse: [
    { weight: '400-500 kg', dailyAmount: '10-12 kg hay' },
    { weight: '500-600 kg', dailyAmount: '12-14 kg hay' },
    { weight: '600+ kg', dailyAmount: '14-16 kg hay' }
  ],
  chicken: [
    { weight: 'Chick (0-4 weeks)', dailyAmount: '30-50g feed' },
    { weight: 'Grower (4-12 weeks)', dailyAmount: '50-80g feed' },
    { weight: 'Layer', dailyAmount: '100-120g feed' }
  ],
  cow: [
    { weight: '200-300 kg', dailyAmount: '6-8 kg feed' },
    { weight: '300-400 kg', dailyAmount: '8-10 kg feed' },
    { weight: '400+ kg', dailyAmount: '10-12 kg feed' }
  ],
  buffalo: [
    { weight: '300-400 kg', dailyAmount: '8-10 kg feed' },
    { weight: '400-500 kg', dailyAmount: '10-12 kg feed' },
    { weight: '500+ kg', dailyAmount: '12-15 kg feed' }
  ],
  pig: [
    { weight: '10-30 kg', dailyAmount: '1-2 kg feed' },
    { weight: '30-60 kg', dailyAmount: '2-3 kg feed' },
    { weight: '60+ kg', dailyAmount: '3-4 kg feed' }
  ],
  pigeon: [
    { weight: 'Young', dailyAmount: '15-20g feed' },
    { weight: 'Adult', dailyAmount: '30-40g feed' },
    { weight: 'Breeding', dailyAmount: '40-50g feed' }
  ],
  parrot: [
    { weight: 'Small (100-200g)', dailyAmount: '10-15g feed' },
    { weight: 'Medium (200-500g)', dailyAmount: '15-30g feed' },
    { weight: 'Large (500g+)', dailyAmount: '30-50g feed' }
  ],
  turtle: [
    { weight: 'Small (<100g)', dailyAmount: '5-10g food' },
    { weight: 'Medium (100-500g)', dailyAmount: '10-20g food' },
    { weight: 'Large (500g+)', dailyAmount: '20-30g food' }
  ],
  fish: [
    { weight: 'Small (<5cm)', dailyAmount: '2-3 times/day, tiny pinch' },
    { weight: 'Medium (5-10cm)', dailyAmount: '2 times/day, small pinch' },
    { weight: 'Large (>10cm)', dailyAmount: '1-2 times/day, medium pinch' }
  ]
};

const PortionGuide: React.FC<Props> = ({ pet }) => {
  const petGuide = portionGuides[pet as keyof typeof portionGuides] || [];
  const petName = pet.charAt(0).toUpperCase() + pet.slice(1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#e2e8f0] flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Portion Guide for {petName}s
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-[#1e1b4b] text-[#e2e8f0] border-2 border-[#312e81]">
                Weight/Age
              </th>
              <th className="text-left p-4 bg-[#1e1b4b] text-[#e2e8f0] border-2 border-[#312e81]">
                Daily Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {petGuide.map((guide, index) => (
              <tr key={index} className="hover:bg-[#1e1b4b] transition-colors">
                <td className="p-4 text-[#e2e8f0] border-2 border-[#312e81]">
                  {guide.weight}
                </td>
                <td className="p-4 text-[#e2e8f0] border-2 border-[#312e81]">
                  {guide.dailyAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortionGuide; 