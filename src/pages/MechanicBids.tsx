import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CustomizationSummary from '../components/mechanics/CustomizationSummary';
import BidList, { type MechanicBid } from '../components/mechanics/BidList';
import BidFilters from '../components/mechanics/BidFilters';
import SelectionModal from '../components/mechanics/SelectionModal';

const MechanicBids = () => {
  const [selectedMechanic, setSelectedMechanic] = useState<MechanicBid | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    location: 'all',
    specialization: 'all',
    minRating: 0,
    sortBy: 'match'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CustomizationSummary />
        
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <BidList
              filters={filters}
              onSelectMechanic={setSelectedMechanic}
            />
          </div>
          
          <div className="lg:w-1/4">
            <BidFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>
      </div>

      {selectedMechanic && (
        <SelectionModal
          mechanic={selectedMechanic}
          onClose={() => setSelectedMechanic(null)}
        />
      )}
    </motion.div>
  );
};

export default MechanicBids;