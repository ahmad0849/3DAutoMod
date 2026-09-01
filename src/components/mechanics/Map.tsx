import React from 'react';
import { motion } from 'framer-motion';

const Map = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-[#1A1A1A] rounded-xl border border-[#00FF41]/10"
    >
      <div className="p-4 border-b border-[#00FF41]/10">
        <h2 className="text-white font-semibold">Mechanics Near You</h2>
      </div>
      <div className="p-4">
        <div className="w-full h-[calc(100vh-12rem)] bg-black/40 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Map Integration Coming Soon</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Map;