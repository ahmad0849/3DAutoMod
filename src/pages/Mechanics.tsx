import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MechanicList from '../components/mechanics/MechanicList';
import SearchFilters from '../components/mechanics/SearchFilters';
import Map from '../components/mechanics/Map';

const Mechanics = () => {
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    distance: 25,
    rating: 0,
    specialization: 'all',
    priceRange: [0, 1000],
    availability: 'any'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#121212] pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="mt-8 flex gap-6">
          <div className={`${isMapVisible ? 'w-[60%]' : 'w-full'} transition-all duration-300`}>
            <MechanicList searchQuery={searchQuery} filters={filters} />
          </div>

          {isMapVisible && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-[40%] sticky top-24 h-[calc(100vh-6rem)]"
            >
              <Map />
            </motion.div>
          )}
        </div>

        {/* Mobile Map Toggle */}
        <button
          onClick={() => setIsMapVisible(!isMapVisible)}
          className="fixed bottom-4 right-4 md:hidden bg-[#00FF41] text-black px-4 py-2 rounded-full font-medium shadow-lg shadow-[#00FF41]/20"
        >
          {isMapVisible ? 'Hide Map' : 'Show Map'}
        </button>
      </div>
    </motion.div>
  );
};

export default Mechanics;