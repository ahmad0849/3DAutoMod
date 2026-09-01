import React from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  sender: 'user' | 'mechanic';
  content: string;
  timestamp: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="h-[50vh] overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-xl p-4 ${
              message.sender === 'user'
                ? 'bg-[#00ff8c]/10 text-white ml-auto'
                : 'bg-[#0066ff]/10 text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs text-gray-400 mt-2 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatHistory;