import React from 'react';
import { Book, Video, FileText, ExternalLink, Library } from 'lucide-react';
import { motion } from 'framer-motion';

const resources = [
  {
    id: 1,
    title: "The Lean Startup Guide",
    type: "PDF",
    desc: "Learn how to build a business without wasting time or money.",
    icon: <FileText size={22} />,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    link: "https://www.startupclass.samaltman.com/"
  },
  {
    id: 2,
    title: "Pitch Deck Masterclass",
    type: "Video",
    desc: "Watch how top founders present their ideas to VCs.",
    icon: <Video size={22} />,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
    link: "https://www.youtube.com/watch?v=SB168N8L3r4"
  },
  {
    id: 3,
    title: "Legal Essentials",
    type: "Guide",
    desc: "Understand company registration and equity distribution.",
    icon: <Book size={22} />,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    link: "https://www.ycombinator.com/library/4A-a-guide-to-incorporation"
  },
  {
    id: 4,
    title: "Product-Market Fit",
    type: "PDF",
    desc: "How to know if people actually want your product.",
    icon: <FileText size={22} />,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    link: "https://pmarchive.com/guide_to_startups_part4.html"
  }
];

const typeColors = {
  PDF:   "bg-orange-500/10 border border-orange-500/20 text-orange-400",
  Video: "bg-red-500/10 border border-red-500/20 text-red-400",
  Guide: "bg-blue-500/10 border border-blue-500/20 text-blue-400",
};

const StartupLibrary = () => {
  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
          <Library size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Startup Library</h2>
          <p className="text-zinc-500 text-sm">Expert-curated resources to help you scale your idea.</p>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res, i) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-zinc-950 border border-white/10 hover:border-white/20 p-6 rounded-3xl group transition-all duration-300 flex flex-col"
          >
            {/* Top row: icon + type badge */}
            <div className="flex justify-between items-start mb-5">
              <div className={`p-3 border rounded-2xl ${res.iconBg} ${res.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {res.icon}
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest ${typeColors[res.type] || typeColors.Guide}`}>
                {res.type}
              </span>
            </div>

            {/* Content */}
            <h3 className="font-bold text-white text-base mb-2 tracking-tight">{res.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">{res.desc}</p>

            {/* CTA */}
            <button
              onClick={() => handleOpen(res.link)}
              className="mt-5 flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all group-hover:gap-3"
            >
              Open Resource <ExternalLink size={13} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StartupLibrary;