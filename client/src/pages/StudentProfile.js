import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Camera } from "lucide-react";
import { motion } from "framer-motion";

const StudentProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const profileRes = await axios.get(
        `http://localhost:5000/api/students/${userId}`
      );
      setProfile(profileRes.data);

      const submissionRes = await axios.get(
        `http://localhost:5000/api/submissions/student/${userId}`
      );
      setSubmissions(submissionRes.data || []);

      const feedbackRes = await axios.get(
        `http://localhost:5000/api/feedback/student/${userId}`
      );
      setFeedbacks(feedbackRes.data || []);

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
        `http://localhost:5000/api/students/${userId}`,
        profile
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

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/students/upload/${userId}`,
        formData
      );

      setProfile({ ...profile, photo: res.data.photo });
    } catch {
      alert("Upload failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (!profile) return <div className="text-center mt-10">Profile not found</div>;

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
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl">

        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                profile.photo
                  ? `http://localhost:5000/uploads/${profile.photo}`
                  : "https://via.placeholder.com/120"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />

            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Profile</h1>

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
      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Mentor Feedback</h2>

        {feedbacks.length === 0 ? (
          <p className="text-slate-500">No feedback yet</p>
        ) : (
          <div className="space-y-6">
            {feedbacks.map(feed => (
              <div key={feed._id} className="border rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <p className="font-semibold">
                    {feed.mentor?.name || "Mentor"}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} />
                    {feed.rating || 0}
                  </div>
                </div>
                <p className="text-slate-600">{feed.comment}</p>
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
    <label className="text-sm text-slate-500">{label}</label>
    {editing && !disabled ? (
      <input
        className="w-full mt-1 p-3 rounded-xl bg-slate-50 border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="mt-1 font-medium">{value || "N/A"}</p>
    )}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-3xl shadow-xl text-center">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default StudentProfile;
