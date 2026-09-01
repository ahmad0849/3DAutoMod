import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }}
      />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl sm:text-6xl font-orbitron font-bold text-white mb-6">
          Transform Your
          <span className="bg-gradient-to-r from-[#00ff8c] to-[#0066ff] text-transparent bg-clip-text"> Ride</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-8">
          Customize your vehicle in our state-of-the-art 3D studio. Visualize modifications before making them real.
        </p>

        <Link to="/studio">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#00ff8c] to-[#0066ff] rounded-full text-black font-bold text-lg shadow-lg hover:shadow-[#00ff8c]/20 transition-shadow duration-300"
          >
            Start Customizing
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-[1]"></div>
    </div>
  );
};

export default Hero;