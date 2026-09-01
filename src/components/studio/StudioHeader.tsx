import React from 'react';
import { Box, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StudioHeader = () => {
  return (
    <header className="h-[15vh] bg-black/20 backdrop-blur-sm border-b border-[#00F0FF]/10">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Box className="h-8 w-8 text-[#00F0FF]" />
          <span className="ml-2 text-white font-orbitron text-xl">AutoMod Studio</span>
        </motion.div>

        <div className="flex items-center space-x-2 text-gray-400">
          <span>Home</span>
          <ChevronRight size={16} />
          <span>Studio</span>
          <ChevronRight size={16} />
          <span className="text-[#00F0FF]">3D Customization</span>
        </div>

        <div className="flex items-center">
          <div className="px-4 py-2 bg-black/40 rounded-full border border-[#00F0FF]/20">
            <span className="text-[#00F0FF] font-orbitron">Step 2: 3D Customization</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudioHeader;