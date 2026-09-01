import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const footerLinks = {
    Company: ['About Us', 'Careers', 'Press'],
    Services: ['3D Studio', 'Find Mechanics', 'Parts Shop'],
    Support: ['Contact Us', 'FAQ', 'Terms of Service'],
  };

  return (
    <footer className="bg-black border-t border-[#00ff8c]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Social */}
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-orbitron text-white">AutoMod</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transform your ride with our cutting-edge automotive customization platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-400 hover:text-[#00ff8c] transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-orbitron mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-[#00ff8c] transition-colors duration-200 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-[#00ff8c]/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-orbitron mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Subscribe to our newsletter</p>
            </div>
            <div className="flex w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-black/40 border border-[#00ff8c]/20 rounded-l-lg focus:outline-none focus:border-[#00ff8c] text-white placeholder-gray-400"
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-[#00ff8c] to-[#0066ff] text-black font-semibold rounded-r-lg hover:opacity-90 transition-opacity duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#00ff8c]/10 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AutoMod. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;