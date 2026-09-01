import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, Clock } from 'lucide-react';

const CustomizationSummary = () => {
  const modifications = [
    { type: 'Paint', detail: 'Metallic Blue (Code: #3B82F6)', price: 1200 },
    { type: 'Wheels', detail: '19" Sport Alloy - Gunmetal', price: 2400 },
    { type: 'Tint', detail: 'Ceramic 35% All Windows', price: 800 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FF5733]/10"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="aspect-video rounded-lg bg-black/40 flex items-center justify-center">
            <Car size={64} className="text-[#00ff8c]" />
          </div>
        </div>

        <div className="md:w-2/3">
          <h2 className="text-2xl font-orbitron text-white mb-4">Customization Summary</h2>
          
          <div className="space-y-4">
            {modifications.map((mod, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[#FF5733]/10"
              >
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-[#00ff8c]" />
                  <div>
                    <p className="text-white font-medium">{mod.type}</p>
                    <p className="text-gray-400 text-sm">{mod.detail}</p>
                  </div>
                </div>
                <span className="text-[#00ff8c] font-orbitron">${mod.price}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-[#FF5733]/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#FF5733]" />
              <span className="text-white">Estimated Installation Time</span>
            </div>
            <span className="text-[#FF5733] font-orbitron">4-6 hours</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizationSummary;