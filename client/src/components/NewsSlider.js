import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, Zap } from 'lucide-react';

const newsData = [
    { id: 1, tag: 'TECH', title: 'Generative AI in 2026', desc: 'How autonomous agents are scaling startups.', icon: <Zap size={16}/>, color: 'bg-yellow-500' },
    { id: 2, tag: 'FUNDING', title: 'Seed Rounds Up 40%', desc: 'Investors are shifting focus to sustainable energy.', icon: <TrendingUp size={16}/>, color: 'bg-green-500' },
    { id: 3, tag: 'GLOBAL', title: 'The Rise of India Hubs', desc: 'Bengaluru remains the top choice for SaaS founders.', icon: <Globe size={16}/>, color: 'bg-blue-500' },
];

const NewsSlider = () => {
    return (
        <div className="overflow-hidden py-4">
            <motion.div
                className="flex gap-6 w-max"
                animate={{ x: [0, -400] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
                {[...newsData, ...newsData].map((news, index) => (
                    <div key={index} className="w-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                        <div className={`flex items-center gap-2 text-white px-3 py-1 rounded-full text-[10px] font-bold w-max ${news.color}`}>
                            {news.icon} {news.tag}
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">{news.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{news.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default NewsSlider;