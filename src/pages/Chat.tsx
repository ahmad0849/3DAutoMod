import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import ChatHeader from '../components/chat/ChatHeader';
import ChatHistory from '../components/chat/ChatHistory';
import ChatInput from '../components/chat/ChatInput';
import CustomizationSummary from '../components/mechanics/CustomizationSummary';

const Chat = () => {
  const { mechanicId } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mechanic',
      content: "Hello! I've reviewed your customization request. Would you like to discuss the details?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="w-[70%]">
            <div className="bg-[#1A1A1A] rounded-xl border border-[#00ff8c]/10">
              <ChatHeader mechanicId={mechanicId} />
              <ChatHistory messages={messages} />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
          
          <div className="w-[30%] sticky top-24">
            <CustomizationSummary />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;