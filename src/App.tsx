import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Studio from './pages/Studio';
import LoginForm from './components/auth/LoginForm';
import MechanicBids from './pages/MechanicBids';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-16"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/mechanics" element={<MechanicBids />} />
              <Route path="/chat/:mechanicId" element={<Chat />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              borderRadius: '8px',
              border: '1px solid rgba(0, 240, 255, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#00F0FF',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF3D00',
                secondary: '#000',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;