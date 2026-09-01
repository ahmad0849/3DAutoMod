import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, link }) => {
  const Content = () => (
    <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-[#39FF14]/10 hover:border-[#39FF14]/30 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#0066ff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6 text-black" />
      </div>
      <h3 className="text-xl font-orbitron text-white mb-2 group-hover:text-[#39FF14] transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  );

  if (link) {
    return (
      <Link to={link}>
        <motion.div whileHover={{ y: -5 }}>
          <Content />
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Content />
    </motion.div>
  );
};

export default FeatureCard;