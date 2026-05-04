import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import MentorProfile from "../pages/MentorProfile";
import StartupLibrary from "../components/StartupLibrary";
import { Eye, Send, Star } from "lucide-react";
import { motion } from "framer-motion";

const MentorDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pitches, setPitches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPitches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPitches = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/mentor/all-pitches",
        { headers: authHeaders }
      );
      setPitches(res.data || []);
    } catch (err) {
      console.error("Failed to load pitches", err);
    }
  };

  const submitReview = async (status) => {
    try {
      await axios.post(
        "http://localhost:5000/api/mentor/update-status",
        { pitchId: selectedPitch._id, status, feedback, rating: Number(rating) },
        { headers: authHeaders }
      );

      setSelectedPitch(null);
      setFeedback("");
      setRating(5);
      fetchPitches();
    } catch {
      alert("Failed to submit review");
    }
  };

  /* ================= AI CHAT ================= */
  const sendMentorMessage = async () => {
    if (!chatInput.trim()) return;

    const msg = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: msg }]);
    setChatInput("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message: msg },
        { headers: authHeaders }
      );
      setChatMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "ai", text: "AI unavailable" }]);
    }
  };

  const filtered = pitches.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = pitches.length;
  const approved = pitches.filter(p => p.status === "approved").length;
  const rejected = pitches.filter(p => p.status === "rejected").length;
  const pending = pitches.filter(p => p.status === "pending").length;

  return (
    <Layout
      userType="mentor"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >

      {/* ================= DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-10">

          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 text-white p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <h1 className="text-4xl font-black tracking-tight relative z-10">Welcome back 👋</h1>
            <p className="text-zinc-300 mt-2 relative z-10">Review student startup ideas and guide the next unicorn.</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <GlassCard title="Total Pitches" value={total} />
            <GlassCard title="Approved" value={approved} />
            <GlassCard title="Rejected" value={rejected} />
            <GlassCard title="Pending" value={pending} />
          </div>

        </div>
      )}

      {/* ================= STUDENT INSIGHTS ================= */}
      {activeTab === "mentor_insights" && (
        <div className="space-y-6">

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black tracking-tight">Student Submissions</h1>
            <input
              className="bg-black border border-white/10 text-white placeholder-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Search pitch..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-black/50 text-zinc-400 text-sm border-b border-white/8">
                <tr>
                  <th className="p-5 text-left font-semibold">Title</th>
                  <th className="font-semibold">Student</th>
                  <th className="font-semibold">AI Score</th>
                  <th className="font-semibold">Status</th>
                  <th className="font-semibold">Review</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-t border-white/5 hover:bg-white/3 transition">
                    <td className="p-5 font-semibold text-white">{p.title}</td>
                    <td className="text-zinc-400">{p.student_name}</td>
                    <td className="font-bold text-blue-400">{p.ai_score}%</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <button onClick={() => setSelectedPitch(p)} className="text-blue-400 hover:text-white transition-colors">
                        <Eye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ================= ANALYTICS ================= */}
      {activeTab === "mentor_analytics" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight">Analytics Overview</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard title="Total Reviews" value={total} />
            <GlassCard
              title="Approval Rate"
              value={total ? Math.round((approved / total) * 100) + "%" : "0%"}
            />
            <GlassCard
              title="Rejection Rate"
              value={total ? Math.round((rejected / total) * 100) + "%" : "0%"}
            />
          </div>
        </div>
      )}

      {/* ================= AI ASSISTANT ================= */}
      {activeTab === "mentor_ai" && (
        <div className="max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 tracking-tight">Mentor AI Assistant</h2>

          <div className="h-72 overflow-y-auto border border-white/8 rounded-xl p-4 mb-4 bg-black/50 space-y-2">
            {chatMessages.map((m, i) => (
              <div key={i} className="mb-2">
                <p className={`text-sm ${m.role === "user" ? "text-blue-400" : "text-zinc-300"}`}>
                  <b className="text-white">{m.role === "user" ? "You" : "AI"}:</b> {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-black border border-white/10 text-white placeholder-zinc-600 rounded-xl px-4 py-2 focus:border-blue-500 outline-none transition-all"
              placeholder="Ask AI something..."
            />
            <button onClick={sendMentorMessage} className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-xl transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {activeTab === "profile" && <MentorProfile token={token} />}

      {/* ================= LIBRARY ================= */}
      {activeTab === "library" && <StartupLibrary />}

      {/* ================= REVIEW MODAL ================= */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-zinc-950 border border-white/15 p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-5"
          >
            <h2 className="text-xl font-bold text-white">{selectedPitch.title}</h2>
            <p className="text-sm text-zinc-400">{selectedPitch.description}</p>

            <textarea
              placeholder="Mentor feedback"
              className="w-full bg-black border border-white/10 text-white placeholder-zinc-600 rounded-xl p-3 focus:border-blue-500 outline-none transition-all"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-2 items-center">
              {[1,2,3,4,5].map(r => (
                <Star key={r} size={24} className={`cursor-pointer transition-colors ${r <= rating ? "text-yellow-400" : "text-zinc-700"}`} onClick={() => setRating(r)} />
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => submitReview("approved")} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 font-bold transition-colors">Approve</button>
              <button onClick={() => submitReview("rejected")} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 font-bold transition-colors">Reject</button>
            </div>

            <button onClick={() => setSelectedPitch(null)} className="text-center text-sm text-zinc-500 hover:text-white transition-colors w-full">Cancel</button>
          </motion.div>
        </div>
      )}

    </Layout>
  );
};

/* ===== Reusable Components ===== */

const GlassCard = ({ title, value }) => (
  <div className="bg-zinc-950 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all">
    <h3 className="text-sm text-zinc-500 font-medium">{title}</h3>
    <p className="text-3xl font-black mt-2 text-white tracking-tight">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors =
    status === "approved"
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
      : status === "rejected"
      ? "bg-red-500/15 text-red-400 border border-red-500/20"
      : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${colors}`}>
      {status}
    </span>
  );
};

export default MentorDashboard;
