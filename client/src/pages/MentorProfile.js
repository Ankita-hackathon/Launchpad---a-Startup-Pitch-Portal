import React, { useEffect, useState } from "react";
import axios from "axios";

const MentorProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);

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
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="space-y-8">

      {/* ========== PERSONAL INFO ========== */}
      <div className="bg-white rounded-2xl p-8 shadow">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Full Name" value={profile.name} />
          <Info label="Email" value={profile.email} />
          <Info label="Role" value="Mentor" />
          <Info label="Expertise" value={profile.experties?.join(", ") || "Not added"} />
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

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-slate-50 p-6 rounded-xl text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default MentorProfile;
