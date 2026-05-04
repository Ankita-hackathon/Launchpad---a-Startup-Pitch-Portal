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
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-10 rounded-3xl shadow-xl">
            <h1 className="text-4xl font-bold">
              Welcome back 🚀
            </h1>
            <p className="opacity-90 mt-2">
              Build, refine and launch your startup idea.
            </p>
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
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold">AI Pitch Auditor</h2>

          {!result && (
            <form onSubmit={handlePitchSubmit} className="space-y-6">
              <input
                placeholder="Startup Title"
                className="w-full p-4 rounded-xl bg-slate-50 border"
                required
                value={pitch.title}
                onChange={(e) =>
                  setPitch({ ...pitch, title: e.target.value })
                }
              />

              <textarea
                placeholder="Describe your startup idea..."
                className="w-full p-4 rounded-xl bg-slate-50 border h-40"
                required
                value={pitch.description}
                onChange={(e) =>
                  setPitch({ ...pitch, description: e.target.value })
                }
              />

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold"
              >
                {loading ? "Analyzing..." : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} /> Get AI Feedback
                  </span>
                )}
              </button>
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
              <p className="text-slate-600">{result.feedback}</p>

              <button
                onClick={() => {
                  setResult(null);
                  setPitch({ title: "", description: "", industry: "Tech" });
                }}
                className="text-blue-600 font-bold"
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
          <h2 className="text-3xl font-bold">My Pitch History</h2>

          {myPitches.length === 0 && (
            <p className="text-slate-500">No pitches submitted yet.</p>
          )}

          {myPitches.map((p, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{p.title}</h3>

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
                <div className="mt-3 bg-slate-50 p-4 rounded-xl text-sm">
                  💬 <b>Mentor:</b> {p.mentor_feedback}
                </div>
              ) : (
                <p className="mt-3 text-slate-400 text-sm">
                  ⏳ Awaiting mentor review
                </p>
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
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl">
    <h3 className="text-sm text-slate-500">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const ActionCard = ({ icon, title, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition flex flex-col items-center text-center"
  >
    {icon}
    <h3 className="mt-4 font-bold text-lg">{title}</h3>
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

export default StudentDashboard;
