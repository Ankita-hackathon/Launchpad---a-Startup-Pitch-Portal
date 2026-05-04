import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, GraduationCap, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [userType, setUserType] = useState('student');
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = userType === 'student'
            ? 'http://localhost:5000/api/student/auth/signup'
            : 'http://localhost:5000/api/mentor/auth/signup';
        try {
            await axios.post(url, form);
            alert("Registration Successful! Please login.");
            navigate(userType === 'student' ? '/login' : '/mentor-login');
        } catch (err) {
            alert("Registration failed. Email might already exist.");
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Theme toggle */}
      <button onClick={toggle} className="fixed top-5 right-5 z-50 p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-zinc-950 border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 backdrop-blur-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <UserPlus size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center tracking-tight text-white mb-2">
          Join Launchpad
        </h2>
        <p className="text-center text-zinc-400 mb-8 font-light">
          Create an account to start your journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text" placeholder="Full Name"
            className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-zinc-600 outline-none transition-all"
            onChange={(e) => setForm({...form, name: e.target.value})} required
          />
          <input
            type="email" placeholder="Email Address"
            className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-zinc-600 outline-none transition-all"
            onChange={(e) => setForm({...form, email: e.target.value})} required
          />
          <input
            type="password" placeholder="Password"
            className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-zinc-600 outline-none transition-all"
            onChange={(e) => setForm({...form, password: e.target.value})} required
          />

          <div className="flex gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setUserType('student')}
              className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${userType === 'student' ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-black text-zinc-500 hover:text-white'}`}
            >
              <GraduationCap size={24} /> <span className="text-sm font-bold">Student</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setUserType('mentor')}
              className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${userType === 'mentor' ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-black text-zinc-500 hover:text-white'}`}
            >
              <ShieldCheck size={24} /> <span className="text-sm font-bold">Mentor</span>
            </motion.button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all mt-6"
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-white font-semibold cursor-pointer hover:text-purple-400 transition-colors"
          >
            Log In
          </span>
        </p>
        </motion.div>
      </div>
    );
};

export default Register;