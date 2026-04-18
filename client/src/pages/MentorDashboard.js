import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import MentorProfile from "../pages/MentorProfile";
import StartupLibrary from "../components/StartupLibrary";
import { Eye, Send, Star } from "lucide-react";
import { motion } from "framer-motion";

const MentorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pitches, setPitches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/mentor/all-pitches");
      setPitches(res.data || []);
    } catch (err) {
      console.error("Failed to load pitches", err);
    }
  };

  const submitReview = async (status) => {
    try {
      await axios.post("http://127.0.0.1:5000/api/mentor/update-status", {
        pitchId: selectedPitch.id,
        status,
        feedback,
        rating: Number(rating)
      });

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
      const res = await axios.post("http://127.0.0.1:5000/api/ai/chat", {
        message: msg
      });

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
      user={user}
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >

      {/* ================= DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-10">

          {/* Hero */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-10 rounded-3xl shadow-xl">
            <h1 className="text-4xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="opacity-90 mt-2">
              Review student startup ideas and guide the next unicorn.
            </p>
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
            <h1 className="text-3xl font-bold">Student Submissions</h1>
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search pitch..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-5 text-left">Title</th>
                  <th>Student</th>
                  <th>AI Score</th>
                  <th>Status</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-5 font-semibold">{p.title}</td>
                    <td>{p.student_name}</td>
                    <td className="font-bold text-blue-600">
                      {p.ai_score}%
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedPitch(p)}
                        className="text-blue-600 hover:text-blue-800"
                      >
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
          <h2 className="text-3xl font-bold">Analytics Overview</h2>

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
        <div className="max-w-2xl bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Mentor AI Assistant</h2>

          <div className="h-72 overflow-y-auto border rounded-xl p-4 mb-4 bg-slate-50">
            {chatMessages.map((m, i) => (
              <div key={i} className="mb-3">
                <p className={`text-sm ${m.role === "user" ? "text-blue-600" : "text-slate-700"}`}>
                  <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask AI something..."
            />
            <button
              onClick={sendMentorMessage}
              className="bg-blue-600 text-white px-5 rounded-xl"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {activeTab === "profile" && <MentorProfile user={user} />}

      {/* ================= LIBRARY ================= */}
      {activeTab === "library" && <StartupLibrary />}

      {/* ================= REVIEW MODAL ================= */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-4"
          >
            <h2 className="text-xl font-bold">{selectedPitch.title}</h2>
            <p className="text-sm text-slate-600">
              {selectedPitch.description}
            </p>

            <textarea
              placeholder="Mentor feedback"
              className="w-full border rounded-xl p-3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-2 items-center">
              {[1,2,3,4,5].map(r => (
                <Star
                  key={r}
                  size={22}
                  className={`cursor-pointer ${r <= rating ? "text-yellow-500" : "text-slate-300"}`}
                  onClick={() => setRating(r)}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => submitReview("approved")}
                className="flex-1 bg-green-600 text-white rounded-xl py-2"
              >
                Approve
              </button>
              <button
                onClick={() => submitReview("rejected")}
                className="flex-1 bg-red-600 text-white rounded-xl py-2"
              >
                Reject
              </button>
            </div>

            <button
              onClick={() => setSelectedPitch(null)}
              className="text-center text-sm text-slate-500 w-full"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

    </Layout>
  );
};

/* ===== Reusable Components ===== */

const GlassCard = ({ title, value }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl">
    <h3 className="text-sm text-slate-500">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors =
    status === "approved"
      ? "bg-green-100 text-green-600"
      : status === "rejected"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-600";

  return (
    <span className={`px-3 py-1 rounded-full text-xs capitalize ${colors}`}>
      {status}
    </span>
  );
};

export default MentorDashboard;
