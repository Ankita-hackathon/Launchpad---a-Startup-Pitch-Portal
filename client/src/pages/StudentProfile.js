import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const StudentProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const profileRes = await axios.get(
        `http://localhost:5000/api/student/profile`,
        { headers: authHeaders }
      );
      setProfile(profileRes.data.user);

      const submissionRes = await axios.get(
        `http://localhost:5000/api/student/my-pitches`,
        { headers: authHeaders }
      );
      setSubmissions(submissionRes.data?.pitches?.submittedPitches || []);

    } catch (error) {
      console.error("Profile loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/student/profile`,
        profile,
        { headers: authHeaders }
      );

      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Update failed");
    }
  };

  /* ================= PHOTO UPLOAD ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/student/upload`,
        formData,
        { headers: { ...authHeaders, "Content-Type": "multipart/form-data" } }
      );

      setProfile({ ...profile, imagelink: res.data.photo });
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !profile) return <ProfileSkeleton />;

  const feedbacks = submissions
    .filter(s => s.mentor_feedback || s.rating)
    .map(s => ({
      _id: s._id,
      rating: s.rating,
      comment: s.mentor_feedback,
      mentor: { name: "Mentor" }
    }));

  const avgRating =
    feedbacks.length > 0
      ? (
        feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
        feedbacks.length
      ).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-10">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-zinc-950 border border-white/10 p-8 rounded-3xl">

        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* Profile Image */}
          <div className="relative">
            {uploading ? (
              <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-slate-100">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              <img
                src={
                  profile.imagelink
                    ? profile.imagelink
                    : "https://via.placeholder.com/120"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
            )}

            <label className={`absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-opacity ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 font-semibold"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl"
                >
                  Save Changes
                </button>
              )}
            </div>

            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-sm"
              >
                Profile updated successfully!
              </motion.p>
            )}

            <InputField
              label="Name"
              value={profile.name}
              editing={editing}
              onChange={(val) => setProfile({ ...profile, name: val })}
            />

            <InputField
              label="Email"
              value={profile.email}
              editing={editing}
              disabled
            />

            <InputField
              label="College"
              value={profile.college || ""}
              editing={editing}
              onChange={(val) => setProfile({ ...profile, college: val })}
            />

            <InputField
              label="Department"
              value={profile.department || ""}
              editing={editing}
              onChange={(val) => setProfile({ ...profile, department: val })}
            />

          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Submissions" value={submissions.length} />
        <StatCard
          title="Approved Ideas"
          value={submissions.filter(s => s.status === "approved").length}
        />
        <StatCard title="Avg Rating" value={avgRating} />
      </div>

      {/* ================= FEEDBACK ================= */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white tracking-tight mb-6">Mentor Feedback</h2>

        {feedbacks.length === 0 ? (
          <p className="text-zinc-500">No feedback yet</p>
        ) : (
          <div className="space-y-6">
            {feedbacks.map(feed => (
              <div key={feed._id} className="border border-white/10 bg-black rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <p className="font-bold text-white">
                    {feed.mentor?.name || "Mentor"}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                    <Star size={16} className="fill-yellow-400" />
                    {feed.rating || 0}
                  </div>
                </div>
                <p className="text-zinc-400">{feed.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

/* ===== Reusable Components ===== */

const InputField = ({ label, value, editing, onChange, disabled }) => (
  <div>
    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    {editing && !disabled ? (
      <input
        className="w-full mt-2 p-3 rounded-xl bg-black border border-white/10 text-white focus:border-blue-500 outline-none transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="mt-1 font-semibold text-white">{value || <span className="text-zinc-600 font-normal">N/A</span>}</p>
    )}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-zinc-950 border border-white/10 p-6 rounded-3xl text-center hover:border-white/20 transition-colors">
    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{title}</p>
    <p className="text-3xl font-black mt-2 text-white tracking-tight">{value}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    {/* Profile Card Skeleton */}
    <div className="bg-zinc-950 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
      <div className="w-32 h-32 rounded-full bg-zinc-800"></div>
      <div className="flex-1 space-y-4 w-full">
        <div className="h-8 bg-zinc-800 rounded-xl w-1/3 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-14 bg-zinc-800 rounded-xl"></div>
          <div className="h-14 bg-zinc-800 rounded-xl"></div>
          <div className="h-14 bg-zinc-800 rounded-xl"></div>
          <div className="h-14 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
    {/* Stats Skeleton */}
    <div className="grid md:grid-cols-3 gap-6">
      <div className="h-32 bg-zinc-800 rounded-3xl"></div>
      <div className="h-32 bg-zinc-800 rounded-3xl"></div>
      <div className="h-32 bg-zinc-800 rounded-3xl"></div>
    </div>
    {/* Feedback Skeleton */}
    <div className="h-48 bg-zinc-800 rounded-3xl"></div>
  </div>
);

export default StudentProfile;
