import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Star, MapPin, Wrench, SortAsc } from 'lucide-react';

const BidFilters = ({ filters, onFiltersChange }) => {
  const handlePriceChange = (value) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#1A1A1A] rounded-xl p-6 border border-[#00ff8c]/10 sticky top-24"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-[#00ff8c]" />
        <h3 className="text-lg font-orbitron text-white">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="flex items-center space-x-2 text-white mb-2">
            <span>Price Range</span>
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange([0, parseInt(e.target.value)])}
            className="w-full accent-[#00ff8c]"
          />
          <div className="flex justify-between text-gray-400 text-sm">
            <span>$0</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center space-x-2 text-white mb-2">
            <MapPin className="w-4 h-4 text-[#00ff8c]" />
            <span>Location</span>
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="w-full bg-black/40 border border-[#00ff8c]/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Locations</option>
            <option value="5km">Within 5km</option>
            <option value="10km">Within 10km</option>
            <option value="20km">Within 20km</option>
          </select>
        </div>

        {/* Specialization */}
        <div>
          <label className="flex items-center space-x-2 text-white mb-2">
            <Wrench className="w-4 h-4 text-[#00ff8c]" />
            <span>Specialization</span>
          </label>
          <select
            value={filters.specialization}
            onChange={(e) => onFiltersChange({ ...filters, specialization: e.target.value })}
            className="w-full bg-black/40 border border-[#00ff8c]/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Specializations</option>
            <option value="paint">Custom Paint</option>
            <option value="performance">Performance Tuning</option>
            <option value="body">Body Work</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="flex items-center space-x-2 text-white mb-2">
            <Star className="w-4 h-4 text-[#00ff8c]" />
            <span>Minimum Rating</span>
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFiltersChange({ ...filters, minRating: rating })}
                className={`p-2 rounded ${
                  filters.minRating >= rating
                    ? 'text-[#00ff8c] bg-[#00ff8c]/10'
                    : 'text-gray-400 hover:text-[#00ff8c]'
                }`}
              >
                <Star className="w-4 h-4" fill={filters.minRating >= rating ? '#00ff8c' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="flex items-center space-x-2 text-white mb-2">
            <SortAsc className="w-4 h-4 text-[#00ff8c]" />
            <span>Sort By</span>
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
            className="w-full bg-black/40 border border-[#00ff8c]/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="match">Best Match</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default BidFilters;