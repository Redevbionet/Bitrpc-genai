import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Message } from '../types';
import { Send, Bot, User, Bitcoin } from 'lucide-react';

const ChatAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your python-bitcoinrpc assistant. Ask me anything about installation, usage, or specific methods.", timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Transform messages for API (exclude the last one we just added for the call history usually, but here we pass full history)
    // Actually our service helper takes the history and the new message separately to be clean.
    // Let's filter only previous messages for history
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    
    const responseText = await chatWithAssistant(history, userMsg.content);
    
    const botMsg: Message = { role: 'model', content: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center space-x-3 shadow-sm">
        <div className="p-2 bg-bitcoin-500/10 rounded-full">
            <Bitcoin className="w-6 h-6 text-bitcoin-500" />
        </div>
        <div>
            <h2 className="font-bold text-white">Docs Assistant</h2>
            <p className="text-xs text-slate-500">Ask questions about the library</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-bitcoin-600'
            }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-bitcoin-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700">
                 <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                 </div>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center space-x-2 relative">
          <input
            type="text"
            className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-bitcoin-500 focus:border-transparent block w-full p-3 pr-12 outline-none transition-all placeholder:text-slate-600"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-bitcoin-600 text-white rounded-md hover:bg-bitcoin-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;