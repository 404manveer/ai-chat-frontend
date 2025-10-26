"use client"
import React, { useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";

const Page = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let socketinstance = io("https://ai-chat-backend-delta.vercel.app/");
    setSocket(socketinstance);
     socketinstance.on('ai-message-response', (response)=>{
     setMessages( (messages) =>[...messages, { sender: 'ai', text: response }])
     } )
  
  }, []);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    socket.emit('ai-message',input);

   
   

    setInput('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="flex flex-col w-full max-w-xl h-[80vh] bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-400 text-white font-bold text-2xl">
          AI Chat
        </div>
        {/* Chat Window */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-base shadow
                  ${msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input Box */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 px-6 py-4 bg-white border-t"
        >
          <input
            type="text"
            className="flex-1 placeholder:text-zinc-400 text-zinc-600 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;