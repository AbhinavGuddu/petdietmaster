'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FaPaw } from 'react-icons/fa6';

interface BackgroundElement {
  id: string;
  type: 'footprint';
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
}

// Seeded random number generator for consistent values
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const PetFootprints: React.FC = () => {
  const footprints = Array.from({ length: 150 }, (_, i) => {
    const seed = i + 1; // Use index as seed for consistency
    return {
      id: i,
      x: seededRandom(seed) * 100,
      y: seededRandom(seed + 1) * 100,
      rotation: seededRandom(seed + 2) * 360,
      scale: 0.3 + seededRandom(seed + 3) * 0.7,
      delay: seededRandom(seed + 4) * 2,
    };
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {footprints.map((footprint) => (
        <motion.div
          key={footprint.id}
          className="absolute text-gray-400/10"
          style={{
            left: `${footprint.x.toFixed(4)}%`,
            top: `${footprint.y.toFixed(4)}%`,
            transform: `rotate(${footprint.rotation.toFixed(4)}deg) scale(${footprint.scale.toFixed(4)})`,
            opacity: 0
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{
            duration: 4,
            delay: footprint.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaPaw className="w-6 h-6" />
        </motion.div>
      ))}
    </div>
  );
};

export default PetFootprints; 