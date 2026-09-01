import React from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, Cog, Maximize, Sticker, RotateCcw, Box } from 'lucide-react';

interface ToolboxSidebarProps {
  onView3DClick: () => void;
  onWheelsClick: () => void;
  onPaintClick: () => void;
  onResetClick: () => void;
}

const tools = [
  { icon: Box, color: '#00F0FF', label: '3D View' },
  { icon: Paintbrush, color: '#FF00E5', label: 'Paint' },
  { icon: Cog, color: '#00F0FF', label: 'Wheels' },
  { icon: Maximize, color: '#00FF94', label: 'Mirrors' },
  { icon: Sticker, color: '#FFB800', label: 'Decals' },
  { icon: RotateCcw, color: '#FF3D00', label: 'Reset' },
];

const ToolboxSidebar: React.FC<ToolboxSidebarProps> = ({ onView3DClick, onWheelsClick, onPaintClick, onResetClick }) => {
  const handleToolClick = (label: string) => {
    if (label === '3D View') {
      onView3DClick();
    } else if (label === 'Wheels') {
      onWheelsClick();
    } else if (label === 'Paint') {
      onPaintClick();
    } else if (label === 'Reset') {
      onResetClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-20 bg-black/30 backdrop-blur-md border-l border-[#00F0FF]/10"
    >
      <div className="h-full flex flex-col items-center py-4 space-y-6">
        {tools.map(({ icon: Icon, color, label }) => (
          <motion.button
            key={label}
            onClick={() => handleToolClick(label)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(45deg, ${color}20, transparent)`,
                boxShadow: `0 0 20px ${color}10`
              }}
            >
              <Icon
                size={24}
                className="text-white transition-colors duration-200"
                style={{ filter: `drop-shadow(0 0 8px ${color})` }}
              />
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-black rounded text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {label}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ToolboxSidebar;