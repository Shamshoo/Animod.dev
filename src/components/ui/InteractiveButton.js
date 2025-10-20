// src/components/ui/InteractiveButton.js
import { motion } from 'framer-motion';
import React from 'react';

export const InteractiveButton = ({ children, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }} // Subtle zoom on hover
      whileTap={{ scale: 0.95 }}   // "Pushes in" on click
      transition={{ type: 'spring', stiffness: 400, damping: 17 }} // A bouncy, responsive feel
      className="bg-accent text-white font-semibold py-2 px-4 rounded-md"
      {...props}
    >
      {children}
    </motion.button>
  );
};