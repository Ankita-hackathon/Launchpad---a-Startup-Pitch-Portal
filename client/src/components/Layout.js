import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  BookOpen,
  LogOut,
  TrendingUp,
  User,
  ClipboardList,
  MessageSquare,
  BarChart3,
  LayoutDashboard,
  Menu
} from "lucide-react";
import AIChatbot from "./AIChatbot";

const Layout = ({ children, userType, onLogout, activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  /* 🔹 Common menu */
  const commonMenu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User }
  ];

  const studentMenu = [
    { id: "submissions", label: "My Submissions", icon: ClipboardList },
    { id: "feedback", label: "Mentor Feedback", icon: MessageSquare },
    { id: "student_pitch_ai", label: "AI Pitch", icon: Rocket },
    { id: "library", label: "Resources", icon: BookOpen }
  ];

  const mentorMenu = [
    { id: "mentor_insights", label: "Student Insights", icon: TrendingUp },
    { id: "mentor_analytics", label: "Analytics", icon: BarChart3 },
    { id: "mentor_ai", label: "AI Assistant", icon: Rocket },
    { id: "library", label: "Resources", icon: BookOpen }
  ];

  const menuItems =
    userType === "mentor"
      ? [...commonMenu, ...mentorMenu]
      : [...commonMenu, ...studentMenu];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-72"
        } bg-[#0B1120] text-white flex flex-col transition-all duration-300 shadow-2xl`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          {!collapsed && (
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Launchpad
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg"
                      : "hover:bg-slate-800"
                  }`}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="border-t border-slate-800 p-4">
          {!collapsed && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                  {userType === "mentor" ? "M" : "S"}
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize">{userType}</p>
                  <p className="text-xs text-slate-400 capitalize">{userType} Portal</p>
                </div>
              </div>
            </>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 shadow-sm">
          <h2 className="text-xl font-bold capitalize text-slate-800">
            {activeTab.replace("_", " ")}
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700 capitalize">{userType} Dashboard</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-10">

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>

        </main>

      </div>

      {/* Floating AI */}
      <AIChatbot />

    </div>
  );
};

export default Layout;
