import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Launchpad AI Mentor. Ask me anything about pitching, fundraising, or startup strategy.", isBot: true }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const currentInput = input;
    setMessages(prev => [...prev, { text: currentInput, isBot: false }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/ai/chat', { message: currentInput });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch {
      setMessages(prev => [...prev, { text: "AI is currently offline. Please check your server.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-80 sm:w-96 h-[520px] rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden mb-4 bg-zinc-950"
          >
            {/* Header */}
            <div className="bg-black/60 backdrop-blur-xl border-b border-white/8 px-5 py-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white tracking-tight">Launchpad AI</h3>
                  <p className="text-xs text-zinc-500">Your startup mentor</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${m.isBot
                      ? 'bg-zinc-900 border border-white/8 text-zinc-200'
                      : 'bg-purple-600 text-white'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-white/8 px-4 py-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="animate-spin text-purple-400" size={16} />
                    <span className="text-xs text-zinc-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-white/8 bg-black/40 backdrop-blur-xl flex gap-2 flex-shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-black border border-white/10 text-white placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                type="submit"
                disabled={loading}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all
          ${isOpen
            ? 'bg-zinc-900 border border-white/10 text-white'
            : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIChatbot;