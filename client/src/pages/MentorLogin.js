import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentorLogin = ({ onLogin }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 opacity-10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600 opacity-10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8"
            >
                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full">
                        <ShieldCheck size={14} />
                        Mentor Portal
                    </div>
                </div>

                {/* Title */}
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Rocket size={20} className="text-indigo-400" />
                    <h1 className="text-2xl font-bold text-white">Launchpad</h1>
                </div>
                <p className="text-center text-slate-400 text-sm mb-8">
                    Sign in to review and guide startup pitches
                </p>

                {/* Error */}
                {error && (
                    <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="mentor@example.com"
                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white p-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            'Sign In as Mentor'
                        )}
                    </motion.button>
                </form>

                {/* Footer link */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    Are you a student?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-indigo-400 font-medium cursor-pointer hover:underline"
                    >
                        Student Login
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default MentorLogin;
