import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Award, ChevronRight } from 'lucide-react';

interface MechanicListProps {
  searchQuery: string;
  filters: {
    distance: number;
    rating: number;
    specialization: string;
    priceRange: [number, number];
    availability: string;
  };
}

const mechanics = [
  {
    id: 1,
    name: 'John Smith',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    specializations: ['Engine Specialist', 'Performance Tuning'],
    rating: 4.8,
    reviews: 127,
    distance: 3.2,
    certified: true,
  },
  // Add more mechanics here...
];

const MechanicList: React.FC<MechanicListProps> = ({ searchQuery, filters }) => {
  const filteredMechanics = mechanics.filter((mechanic) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      mechanic.name.toLowerCase().includes(query) ||
      mechanic.specializations.some((item) => item.toLowerCase().includes(query));
    const matchesDistance = mechanic.distance <= filters.distance;
    const matchesRating = mechanic.rating >= filters.rating;
    const matchesSpecialization =
      filters.specialization === 'all' ||
      mechanic.specializations.some((item) => item.toLowerCase().includes(filters.specialization.toLowerCase()));
    return matchesSearch && matchesDistance && matchesRating && matchesSpecialization;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredMechanics.map((mechanic) => (
        <motion.div
          key={mechanic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#00ff8c] rounded-xl p-6 border border-[#00ff8c]/10 hover:border-[#00ff8c]/30 transition-all duration-300"
        >
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={mechanic.image}
                alt={mechanic.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#00ff8c]/20"
              />
              {mechanic.certified && (
                <div className="absolute -top-2 -right-2 bg-[#00ff8c] rounded-full p-1">
                  <Award className="w-4 h-4 text-black" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{mechanic.name}</h3>
                <div className="flex items-center text-[#00ff8c]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1">{mechanic.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">({mechanic.reviews})</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {mechanic.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-1 text-xs rounded-full bg-[#00ff8c]/10 text-[#00ff8c]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{mechanic.distance}km away</span>
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-[#00FF41] hover:text-white transition-colors duration-200"
                >
                  <span className="text-sm">View Profile</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MechanicList;