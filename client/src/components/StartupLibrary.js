import React from 'react';
import { Book, Video, FileText, ExternalLink } from 'lucide-react';

const resources = [
    {
        id: 1,
        title: "The Lean Startup Guide",
        type: "PDF",
        desc: "Learn how to build a business without wasting time or money.",
        icon: <FileText className="text-orange-500" />,
        link: "https://www.startupclass.samaltman.com/" // Example Link
    },
    {
        id: 2,
        title: "Pitch Deck Masterclass",
        type: "Video",
        desc: "Watch how top founders present their ideas to VCs.",
        icon: <Video className="text-red-500" />,
        link: "https://www.youtube.com/watch?v=SB168N8L3r4" // Y-Combinator Pitch Video
    },
    {
        id: 3,
        title: "Legal Essentials",
        type: "Guide",
        desc: "Understand company registration and equity distribution.",
        icon: <Book className="text-blue-500" />,
        link: "https://www.ycombinator.com/library/4A-a-guide-to-incorporation"
    },
    {
        id: 4,
        title: "Product-Market Fit",
        type: "PDF",
        desc: "How to know if people actually want your product.",
        icon: <FileText className="text-green-500" />,
        link: "https://pmarchive.com/guide_to_startups_part4.html"
    }
];

const StartupLibrary = () => {
    // Function to handle opening links
    const handleOpen = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Startup Library</h2>
                <p className="text-slate-500">Expert-curated resources to help you scale your idea.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res) => (
                    <div key={res.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                                {res.icon}
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-600 uppercase">
                                {res.type}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{res.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{res.desc}</p>

                        {/* Updated Button with onClick */}
                        <button
                            onClick={() => handleOpen(res.link)}
                            className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all"
                        >
                            Open Resource <ExternalLink size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StartupLibrary;