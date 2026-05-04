import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentProfile from "../pages/StudentProfile";
import Layout from "../components/Layout";
import NewsSlider from "../components/NewsSlider";
import StartupLibrary from "../components/StartupLibrary";
import { Lightbulb, Rocket, Send, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const StudentDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState({
    title: "",
    description: "",
    industry: "Tech"
  });
  const [result, setResult] = useState(null);
  const [myPitches, setMyPitches] = useState([]);

  const authHeaders = { Authorization: `Bearer ${token}` };

  /* ================= FETCH PITCHES ================= */
  useEffect(() => {
    if (activeTab === "submissions" || activeTab === "feedback") {
      fetchMyPitches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchMyPitches = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/student/my-pitches`,
        { headers: authHeaders }
      );
      setMyPitches(res.data?.pitches?.submittedPitches || []);
    } catch (err) {
      console.error("Failed to load pitches", err);
    }
  };

  /* ================= SUBMIT PITCH ================= */
  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/student/pitch",
        pitch,
        { headers: authHeaders }
      );

      setResult(res.data);
    } catch {
      alert("Pitch submission failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CALCULATIONS ================= */
  const total = myPitches.length;
  const approved = myPitches.filter(p => p.status === "approved").length;
  const avgRating =
    myPitches.length > 0
      ? (
          myPitches.reduce((acc, p) => acc + (p.mentor_rating || 0), 0) /
          myPitches.length
        ).toFixed(1)
      : 0;

  return (
    <Layout
      userType="student"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >

      {/* ================= DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-10">

          {/* Hero */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 text-white p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <h1 className="text-4xl font-black tracking-tight relative z-10">Welcome back 🚀</h1>
            <p className="text-zinc-300 mt-2 relative z-10">Build, refine and launch your startup idea.</p>
          </div>

          <NewsSlider />

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard title="Total Pitches" value={total} />
            <GlassCard title="Approved" value={approved} />
            <GlassCard title="Avg Mentor Rating" value={avgRating} />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              icon={<Lightbulb size={28} />}
              title="Submit Pitch"
              onClick={() => setActiveTab("student_pitch_ai")}
            />
            <ActionCard
              icon={<Rocket size={28} />}
              title="My Submissions"
              onClick={() => setActiveTab("submissions")}
            />
            <ActionCard
              icon={<TrendingUp size={28} />}
              title="Mentor Feedback"
              onClick={() => setActiveTab("feedback")}
            />
          </div>
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {activeTab === "profile" && (
        <StudentProfile token={token} />
      )}

      {/* ================= AI PITCH ================= */}
      {activeTab === "student_pitch_ai" && (
        <div className="max-w-2xl mx-auto bg-zinc-950 border border-white/10 p-10 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">AI Pitch Auditor</h2>

          {!result && (
            <form onSubmit={handlePitchSubmit} className="space-y-6">
              <input
                placeholder="Startup Title"
                className="w-full p-4 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                required
                value={pitch.title}
                onChange={(e) => setPitch({ ...pitch, title: e.target.value })}
              />

              <textarea
                placeholder="Describe your startup idea..."
                className="w-full p-4 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all h-40"
                required
                value={pitch.description}
                onChange={(e) => setPitch({ ...pitch, description: e.target.value })}
              />

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-white text-black p-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
              >
                {loading ? "Analyzing..." : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} /> Get AI Feedback
                  </span>
                )}
              </motion.button>
            </form>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold">
                AI Score: <span className="text-blue-600">{result.score}/100</span>
              </h3>
              <p className="text-zinc-300">{result.feedback}</p>

              <button
                onClick={() => {
                  setResult(null);
                  setPitch({ title: "", description: "", industry: "Tech" });
                }}
                className="text-purple-400 font-bold hover:text-white transition-colors"
              >
                Analyze Another Idea
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* ================= SUBMISSIONS ================= */}
      {(activeTab === "submissions" || activeTab === "feedback") && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight">My Pitch History</h2>

          {myPitches.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-lg">No pitches submitted yet.</p>
              <p className="text-sm mt-1">Submit your first idea using the AI Pitch tab.</p>
            </div>
          )}

          {myPitches.map((p, i) => (
            <div
              key={i}
              className="bg-zinc-950 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">{p.title}</h3>

                <StatusBadge status={p.status} />
              </div>

              {/* Rating */}
              {p.mentor_rating && (
                <div className="flex mt-3 gap-1">
                  {[...Array(p.mentor_rating)].map((_, idx) => (
                    <Star key={idx} size={18} className="text-yellow-500" />
                  ))}
                </div>
              )}

              {/* Feedback */}
              {p.mentor_feedback ? (
                <div className="mt-3 bg-black/50 border border-white/8 p-4 rounded-xl text-sm text-zinc-300">
                  💬 <b className="text-white">Mentor:</b> {p.mentor_feedback}
                </div>
              ) : (
                <p className="mt-3 text-zinc-600 text-sm">⏳ Awaiting mentor review</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= LIBRARY ================= */}
      {activeTab === "library" && <StartupLibrary />}

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

const ActionCard = ({ icon, title, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/40 p-8 rounded-3xl transition-all flex flex-col items-center text-center group"
  >
    <div className="text-purple-400 group-hover:text-white transition-colors">{icon}</div>
    <h3 className="mt-4 font-bold text-base text-white">{title}</h3>
  </motion.div>
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

export default StudentDashboard;
