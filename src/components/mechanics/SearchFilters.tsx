import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Tag } from 'lucide-react';

interface FilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    distance: number;
    rating: number;
    specialization: string;
    priceRange: [number, number];
    availability: string;
  };
  onFiltersChange: (filters: FilterProps['filters']) => void;
}

const SearchFilters: React.FC<FilterProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}) => {
  const specializations = [
    'All',
    'Engine Specialist',
    'Body Work',
    'Electronics',
    'Performance Tuning',
    'General Repair'
  ];

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, distance: parseInt(e.target.value) });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search mechanics by name or specialization..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-black/40 rounded-lg border border-[#00FF41]/20 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] text-white placeholder-gray-400 transition-all duration-300"
        />
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Distance Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-white text-sm">
            <Tag className="h-4 w-4 mr-2 text-[#00FF41]" />
            Distance (km)
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={filters.distance}
            onChange={handleDistanceChange}
            className="w-full accent-[#00FF41]"
          />
          <div className="text-gray-400 text-sm">{filters.distance}km</div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-white text-sm">
            <Star className="h-4 w-4 mr-2 text-[#00FF41]" />
            Minimum Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`p-2 rounded ${
                  filters.rating >= rating
                    ? 'text-[#00FF41] bg-[#00FF41]/10'
                    : 'text-gray-400 hover:text-[#00FF41]'
                }`}
              >
                <Star className="h-4 w-4" fill={filters.rating >= rating ? '#00FF41' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* Specialization Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-white text-sm">
            <Filter className="h-4 w-4 mr-2 text-[#00FF41]" />
            Specialization
          </label>
          <select
            value={filters.specialization}
            onChange={(e) => onFiltersChange({ ...filters, specialization: e.target.value })}
            className="w-full bg-black/40 border border-[#00FF41]/20 rounded-lg px-3 py-2 text-white focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41]"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec.toLowerCase()}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-white text-sm">
            <Clock className="h-4 w-4 mr-2 text-[#00FF41]" />
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) => onFiltersChange({ ...filters, availability: e.target.value })}
            className="w-full bg-black/40 border border-[#00FF41]/20 rounded-lg px-3 py-2 text-white focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41]"
          >
            <option value="any">Any Time</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilters;