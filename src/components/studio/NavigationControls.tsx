import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavigationControls = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-sm border-t border-[#00F0FF]/10">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <motion.div
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="flex items-center space-x-2 text-white hover:text-[#00F0FF] transition-colors duration-200"
          >
            <ChevronLeft size={20} />
            <span className="font-orbitron">Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/mechanics"
            className="flex items-center space-x-2 text-white hover:text-[#00F0FF] transition-colors duration-200"
          >
            <span className="font-orbitron">Find Mechanic</span>
            <ChevronRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NavigationControls;