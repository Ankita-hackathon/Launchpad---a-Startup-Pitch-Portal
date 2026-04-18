import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';

const AIChatbot = () => {
    // These define the variables that were "no-undef" before
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your Launchpad AI Mentor. How can I help?", isBot: true }
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
            // Updated to use 127.0.0.1 for local stability
            const res = await axios.post('http://127.0.0.1:5000/api/ai/chat', { message: currentInput });
            setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
        } catch (err) {
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-80 sm:w-96 h-[500px] rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-5 text-white flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg"><Bot size={20}/></div>
                                <h3 className="font-bold text-sm">Launchpad AI</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-800 p-2 rounded-full transition"><X size={20}/></button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.isBot ? 'bg-white text-slate-700 border border-slate-100' : 'bg-blue-600 text-white'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <Loader2 className="animate-spin text-blue-600" size={20} />
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-slate-100 rounded-xl px-4 py-2 outline-none"
                            />
                            <button type="submit" disabled={loading} className="p-2 bg-blue-600 text-white rounded-xl">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all ${isOpen ? 'bg-slate-900' : 'bg-blue-600'} text-white`}
            >
                {isOpen ? <X size={28}/> : <MessageCircle size={28}/>}
            </button>
        </div>
    );
};

export default AIChatbot;