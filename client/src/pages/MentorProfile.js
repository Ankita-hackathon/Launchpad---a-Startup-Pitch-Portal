import React, { useEffect, useState } from "react";
import axios from "axios";

import { Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const MentorProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  // Decode userId from JWT payload (no library needed)
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

  if (!profile) {
    return <ProfileSkeleton />;
  }

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
      const res = await axios.post(`http://localhost:5000/api/mentor/upload`, formData, { headers: { ...authHeaders, "Content-Type": "multipart/form-data" } });
      setProfile({ ...profile, imagelink: res.data.photo });
    } catch { 
      alert("Upload failed"); 
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ========== PERSONAL INFO ========== */}
      <div className="bg-white rounded-2xl p-8 shadow">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
          <div className="relative">
            {uploading ? (
              <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-slate-100">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              <img
                src={profile.imagelink ? profile.imagelink : "https://via.placeholder.com/120"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
            )}
            <label className={`absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-opacity ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Camera size={16} />
              <input type="file" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="text-blue-600 font-semibold">Edit</button>
              ) : (
                <button onClick={handleUpdate} className="bg-blue-600 text-white px-5 py-2 rounded-xl">Save</button>
              )}
            </div>
            {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm">Profile updated successfully!</motion.p>}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Full Name" value={profile.name} editing={editing} onChange={(v) => setProfile({ ...profile, name: v })} />
              <InputField label="Email" value={profile.email} editing={editing} disabled />
              <InputField label="Role" value="Mentor" editing={editing} disabled />
              <InputField label="Expertise (comma separated)" value={Array.isArray(profile.experties) ? profile.experties.join(", ") : profile.experties || ""} editing={editing} onChange={(v) => setProfile({ ...profile, experties: v })} />
            </div>
          </div>
        </div>
      </div>

      {/* ========== PERFORMANCE STATS ========== */}
      <div className="bg-white rounded-2xl p-8 shadow">
        <h2 className="text-xl font-semibold mb-6">Mentor Performance</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <StatCard title="Total Reviews" value={analytics?.total ?? 0} />
          <StatCard title="Approved"      value={analytics?.approved ?? 0} />
          <StatCard title="Rejected"      value={analytics?.rejected ?? 0} />
          <StatCard title="Avg AI Score"  value={analytics?.avgScore ?? "N/A"} />
        </div>
      </div>

    </div>
  );
};

const InputField = ({ label, value, editing, onChange, disabled }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    {editing && !disabled ? (
      <input
        className="w-full mt-1 p-2 rounded-lg bg-slate-50 border outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="font-semibold">{value || "N/A"}</p>
    )}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-slate-50 p-6 rounded-xl text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Profile Card Skeleton */}
    <div className="bg-white rounded-2xl p-8 shadow flex flex-col md:flex-row items-center gap-8">
      <div className="w-32 h-32 rounded-full bg-slate-200"></div>
      <div className="flex-1 space-y-4 w-full">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-14 bg-slate-200 rounded-xl"></div>
          <div className="h-14 bg-slate-200 rounded-xl"></div>
          <div className="h-14 bg-slate-200 rounded-xl"></div>
          <div className="h-14 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
    {/* Stats Skeleton */}
    <div className="grid md:grid-cols-4 gap-6 mt-8">
      <div className="h-28 bg-slate-200 rounded-xl"></div>
      <div className="h-28 bg-slate-200 rounded-xl"></div>
      <div className="h-28 bg-slate-200 rounded-xl"></div>
      <div className="h-28 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

export default MentorProfile;
