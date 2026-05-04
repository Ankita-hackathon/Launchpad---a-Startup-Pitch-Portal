import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
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
  Menu,
  Sun,
  Moon
} from "lucide-react";
import AIChatbot from "./AIChatbot";

const Layout = ({ children, userType, onLogout, activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

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

  const { theme, toggle } = useTheme();

  const accentGradient = userType === "mentor"
    ? "from-blue-500 to-cyan-500"
    : "from-purple-500 to-blue-500";

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">

      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"} bg-zinc-950 border-r border-white/8 flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/8">
          {!collapsed && (
            <Link to="/">
              <h1 className={`text-xl font-extrabold tracking-tighter bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                Launchpad.
              </h1>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive
                    ? `bg-gradient-to-r ${accentGradient} text-white shadow-lg`
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="border-t border-white/8 p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${accentGradient} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                {userType === "mentor" ? "M" : "S"}
              </div>
              <div>
                <p className="font-semibold text-sm capitalize text-white">{userType}</p>
                <p className="text-xs text-zinc-500 capitalize">{userType} Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all text-sm"
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-white/8 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-base font-bold capitalize text-white tracking-tight">
            {activeTab.replace(/_/g, " ")}
          </h2>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggle}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${accentGradient} bg-opacity-10 border border-white/10 text-xs font-bold text-white`}>
              <span className="capitalize">{userType}</span>
              <span className="text-white/60">Dashboard</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-zinc-950/30">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
