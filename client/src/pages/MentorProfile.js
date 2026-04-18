import React, { useEffect, useState } from "react";
import axios from "axios";

const MentorProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const profileRes = await axios.get(
        `http://localhost:5000/api/mentors/${user._id}`
      );
      setProfile(profileRes.data);

      const reviewRes = await axios.get(
        `http://localhost:5000/api/feedback/mentor/${user._id}`
      );
      setReviews(reviewRes.data);
    } catch (err) {
      console.error("Mentor profile error:", err);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-8">

      {/* ========== PERSONAL INFO ========== */}
      <div className="bg-white rounded-2xl p-8 shadow">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Full Name" value={profile.name} />
          <Info label="Email" value={profile.email} />
          <Info label="Role" value="Mentor" />
          <Info label="Expertise" value={profile.expertise || "Not added"} />
          <Info label="Experience" value={profile.experience || "Not added"} />
          <Info label="Organization" value={profile.organization || "Not added"} />
        </div>
      </div>

      {/* ========== PERFORMANCE STATS ========== */}
      <div className="bg-white rounded-2xl p-8 shadow">
        <h2 className="text-xl font-semibold mb-6">Mentor Performance</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <StatCard title="Total Reviews" value={reviews.length} />
          <StatCard
            title="Approved"
            value={reviews.filter(r => r.status === "approved").length}
          />
          <StatCard
            title="Rejected"
            value={reviews.filter(r => r.status === "rejected").length}
          />
          <StatCard title="Avg Rating" value={avgRating} />
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
