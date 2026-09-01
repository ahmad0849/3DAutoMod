import React from 'react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  mechanicId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = () => {
  return (
    <div className="p-6 border-b border-[#00ff8c]/10">
      <div className="flex items-center space-x-4">
        <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
          alt="Mechanic"
          className="w-16 h-16 rounded-full object-cover border-2 border-[#00ff8c]"
        />
        <div>
          <h2 className="text-2xl font-orbitron text-white">Mike Anderson</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff8c] animate-pulse" />
            <span className="text-gray-400">Expert in Car Customizations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;