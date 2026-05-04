import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Loader2, ShieldCheck, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const MentorProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const getUserIdFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id || payload.id;
    } catch { return null; }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = getUserIdFromToken();
      const profileRes = await axios.get(
        `http://localhost:5000/api/mentor/profile/${userId}`,
        { headers: authHeaders }
      );
      setProfile(profileRes.data);
      const analyticsRes = await axios.get(
        `http://localhost:5000/api/mentor/analytics`,
        { headers: authHeaders }
      );
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Mentor profile error:", err);
    }
  };

  if (!profile) return <ProfileSkeleton />;

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/mentor/profile`, profile, { headers: authHeaders });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { alert("Update failed"); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const res = await axios.post(`http://localhost:5000/api/mentor/upload`, formData, {
        headers: { ...authHeaders, "Content-Type": "multipart/form-data" }
      });
      setProfile({ ...profile, imagelink: res.data.photo });
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">

      {/* ── PROFILE CARD ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-zinc-950 border border-white/10 rounded-3xl p-8"
      >
        {/* Header row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Personal Information</h2>
          <div className="ml-auto">
            {!editing ? (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setEditing(true)}
                className="px-4 py-2 border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 rounded-xl text-sm font-semibold transition-all"
              >
                Edit Profile
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Save Changes
              </motion.button>
            )}
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium"
          >
            ✓ Profile updated successfully!
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {uploading ? (
              <div className="w-32 h-32 rounded-2xl border border-white/10 bg-zinc-900 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-400" size={32} />
              </div>
            ) : (
              <img
                src={profile.imagelink || "https://ui-avatars.com/api/?name=Mentor&background=3b82f6&color=fff&size=128"}
                alt="Profile"
                className="w-32 h-32 rounded-2xl object-cover border border-white/10"
              />
            )}
            <label className={`absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl cursor-pointer transition-all shadow-lg ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Camera size={15} />
              <input type="file" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>

          {/* Fields */}
          <div className="flex-1 w-full grid md:grid-cols-2 gap-5">
            <InputField label="Full Name" value={profile.name} placeholder="Enter your full name" editing={editing} onChange={(v) => setProfile({ ...profile, name: v })} />
            <InputField label="Email Address" value={profile.email} editing={editing} disabled />
            <InputField label="Role" value="Mentor" editing={editing} disabled />
            <InputField label="Expertise" value={Array.isArray(profile.experties) ? profile.experties.join(", ") : profile.experties} placeholder="e.g. AI, SaaS, Fintech" editing={editing} onChange={(v) => setProfile({ ...profile, experties: v })} />
          </div>
        </div>
      </motion.div>

      {/* ── PERFORMANCE STATS ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
        className="bg-zinc-950 border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <BarChart3 size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Mentor Performance</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Reviews" value={analytics?.total ?? 0} color="blue" />
          <StatCard title="Approved"      value={analytics?.approved ?? 0} color="emerald" />
          <StatCard title="Rejected"      value={analytics?.rejected ?? 0} color="red" />
          <StatCard title="Avg AI Score"  value={analytics?.avgScore ?? "N/A"} color="purple" />
        </div>
      </motion.div>

    </div>
  );
};

/* ─── Sub-components ──────────────────────────────── */

const InputField = ({ label, value, placeholder, editing, onChange, disabled }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
    {editing && !disabled ? (
      <input
        className="w-full p-3 rounded-xl bg-black border border-white/10 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="font-semibold text-white text-sm py-1">{value || <span className="text-zinc-600 italic">Not specified</span>}</p>
    )}
  </div>
);

const colorMap = {
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  red:     { bg: "bg-red-500/10",     border: "border-red-500/20",     text: "text-red-400" },
  purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/20",  text: "text-purple-400" },
};

const StatCard = ({ title, value, color = "blue" }) => {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} border ${c.border} p-6 rounded-2xl text-center`}>
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">{title}</p>
      <p className={`text-3xl font-black tracking-tight ${c.text}`}>{value}</p>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10">
      <div className="w-32 h-32 rounded-2xl bg-zinc-800 flex-shrink-0" />
      <div className="flex-1 w-full space-y-4">
        <div className="h-6 bg-zinc-800 rounded-xl w-1/3 mb-6" />
        <div className="grid md:grid-cols-2 gap-5">
          <div className="h-12 bg-zinc-800 rounded-xl" />
          <div className="h-12 bg-zinc-800 rounded-xl" />
          <div className="h-12 bg-zinc-800 rounded-xl" />
          <div className="h-12 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-zinc-800 rounded-2xl" />
      ))}
    </div>
  </div>
);

export default MentorProfile;
