import React from 'react';
import { Car, Wrench, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import FeatureCard from '../components/home/FeatureCard';
import Footer from '../components/layout/Footer';

const Home = () => {
  const features = [
    {
      icon: Car,
      title: '3D Customization',
      description: 'Visualize modifications in real-time with our advanced 3D modeling studio.',
      link: '/studio'
    },
    {
      icon: Wrench,
      title: 'Expert Installation',
      description: 'Connect with certified mechanics for professional installation services.',
      link: '/mechanics'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a community of car enthusiasts and share your custom builds.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Hero />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-orbitron text-white mb-4">Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the tools and features that make customizing your vehicle easier than ever.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;