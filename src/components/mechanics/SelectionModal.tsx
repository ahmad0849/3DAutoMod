import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SelectionModal = ({ mechanic, onClose }) => {
  const navigate = useNavigate();

  const handleProceedToBooking = () => {
    navigate(`/chat/${mechanic.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1A1A1A] rounded-xl p-6 max-w-lg w-full relative border border-[#FF5733]/20"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-orbitron text-white mb-6">Confirm Selection</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={mechanic.photo}
                alt={mechanic.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-medium text-white">{mechanic.name}</h3>
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{mechanic.distance}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Timeline</span>
                </div>
                <p className="text-white font-medium">{mechanic.timeline}</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Quote</span>
                </div>
                <p className="text-[#FF5733] font-orbitron">${mechanic.quote}</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#FF5733]/10">
              <motion.button
                onClick={handleProceedToBooking}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#00ff8c] to-[#0066ff] text-black font-medium rounded-lg hover:opacity-90 transition-colors duration-200"
              >
                Proceed to Booking
              </motion.button>
              <button
                onClick={onClose}
                className="w-full mt-3 py-3 bg-transparent text-white hover:text-[#00ff8c] transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionModal;