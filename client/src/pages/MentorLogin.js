import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const MentorLogin = ({ onLogin }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(
                'http://localhost:5000/api/mentor/auth/login',
                form
            );

            onLogin({ token: res.data.token, userType: 'mentor' });

        } catch (err) {
            console.error('Mentor Login Error:', err.response?.data);
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Theme toggle */}
      <button onClick={toggle} className="fixed top-5 right-5 z-50 p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-zinc-950 border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-xl"
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <ShieldCheck size={16} />
            MENTOR PORTAL
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center tracking-tight text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-zinc-400 mb-8 font-light">
          Sign in to review and guide startup pitches.
        </p>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-600 outline-none transition-all"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-600 outline-none transition-all"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Sign In as Mentor'
            )}
          </motion.button>
        </form>

        {/* Footer link */}
        <div className="mt-8 space-y-3">
          <p className="text-center text-sm text-zinc-500">
            Are you a student?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
            >
              Student Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
    );
};

export default MentorLogin;
