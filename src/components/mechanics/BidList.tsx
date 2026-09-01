import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Award, ChevronRight } from 'lucide-react';

const mockMechanics = [
  {
    id: 1,
    name: 'Mike Anderson',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    rating: 4.8,
    reviews: 156,
    specializations: ['Custom Paint', 'Performance Tuning'],
    distance: '3.2 km',
    quote: 4200,
    timeline: '4-5 days',
    certified: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    rating: 4.9,
    reviews: 203,
    specializations: ['Body Work', 'Custom Modifications'],
    distance: '5.1 km',
    quote: 4500,
    timeline: '3-4 days',
    certified: true,
  }
];

const BidList = ({ filters, onSelectMechanic }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {mockMechanics.map((mechanic, index) => (
        <motion.div
          key={mechanic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.3,
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#39FF14]/10 hover:border-[#39FF14]/30 transition-all duration-300 shadow-lg hover:shadow-[#39FF14]/20"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="relative">
                <img
                  src={mechanic.photo}
                  alt={mechanic.name}
                  className="w-full aspect-square rounded-xl object-cover"
                />
                {mechanic.certified && (
                  <div className="absolute -top-2 -right-2 bg-[#39FF14] rounded-full p-1.5 shadow-lg shadow-[#39FF14]/20">
                    <Award className="w-5 h-5 text-black" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-3/4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-orbitron text-white">{mechanic.name}</h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-[#39FF14] fill-current" />
                  <span className="text-white">{mechanic.rating}</span>
                  <span className="text-gray-400">({mechanic.reviews})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{mechanic.distance}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{mechanic.timeline}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {mechanic.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#39FF14]/10">
                <div>
                  <span className="text-gray-400">Quote</span>
                  <p className="text-2xl font-orbitron text-[#39FF14]">${mechanic.quote}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectMechanic(mechanic)}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#39FF14] rounded-lg text-black font-medium hover:bg-[#39FF14]/90 transition-colors duration-200 shadow-lg shadow-[#39FF14]/20"
                >
                  <span>Select Mechanic</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BidList;