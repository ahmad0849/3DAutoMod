import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Car, Home, Box, Users, MessageSquare, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    // Check for user data in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserData(user);
    }

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem('user');
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/studio', icon: <Car size={20} />, label: '3D Studio' },
    { path: '/mechanics', icon: <Users size={20} />, label: 'Find Mechanics' },
    { path: '/chat', icon: <MessageSquare size={20} />, label: 'Chat' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black border-b border-[#00ff8c]/10 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Box className="h-8 w-8 text-[#00ff8c]" />
            <span className="ml-2 text-white font-orbitron text-xl">AutoMod</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-[#00ff8c] bg-black/40 shadow-[0_0_10px_#00ff8c40]' 
                      : 'text-gray-300 hover:text-[#00ff8c] hover:bg-black/20'}`
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center px-3 py-2 text-[#00ff8c]">
                    <span className="mr-2">Welcome, {userData?.name}</span>
                    <span className="text-xs px-2 py-1 bg-[#00ff8c]/10 rounded-full">
                      {userData?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-[#00ff8c] hover:bg-black/20 transition-all duration-300"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-[#00ff8c] bg-black/40 shadow-[0_0_10px_#00ff8c40]' 
                      : 'text-gray-300 hover:text-[#00ff8c] hover:bg-black/20'}`
                  }
                >
                  <LogIn size={20} className="mr-2" />
                  Login/Signup
                </NavLink>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-black/20"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'text-[#00ff8c] bg-black/40 shadow-[0_0_10px_#00ff8c40]' 
                  : 'text-gray-300 hover:text-[#00ff8c] hover:bg-black/20'}`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <>
              <div className="px-3 py-2 text-[#00ff8c]">
                <span className="block">Welcome, {userData?.name}</span>
                <span className="text-xs px-2 py-1 bg-[#00ff8c]/10 rounded-full mt-1 inline-block">
                  {userData?.role}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-[#00ff8c] hover:bg-black/20"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'text-[#00ff8c] bg-black/40 shadow-[0_0_10px_#00ff8c40]' 
                  : 'text-gray-300 hover:text-[#00ff8c] hover:bg-black/20'}`
              }
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={20} className="mr-2" />
              Login/Signup
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;