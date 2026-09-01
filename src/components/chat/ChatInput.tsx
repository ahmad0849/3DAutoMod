import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-t border-[#00ff8c]/10">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="text-gray-400 hover:text-[#00ff8c] transition-colors duration-200"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-black/40 rounded-lg px-4 py-2 text-white placeholder-gray-400 border border-[#00ff8c]/20 focus:border-[#00ff8c] focus:ring-1 focus:ring-[#00ff8c] transition-all duration-200"
        />
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#00ff8c] to-[#0066ff] text-black font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </form>
  );
};

export default ChatInput;