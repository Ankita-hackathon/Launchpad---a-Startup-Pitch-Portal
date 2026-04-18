import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Rocket, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [form, setForm] = useState({ email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(
                'http://127.0.0.1:5000/api/auth/login',
                form
            );

            if (res.data.success) {
                onLogin(res.data.user);
            }
        } catch (err) {
            console.error("Login Error:", err.response?.data);
            setError(err.response?.data?.message || "Invalid Email, Password, or Role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-600 rounded-full text-white">
                        <Rocket size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    Launchpad
                </h2>
                <p className="text-center text-slate-500 mb-6">
                    Fueling your startup journey
                </p>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                                form.role === 'student'
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-slate-500'
                            }`}
                            onClick={() => setForm({ ...form, role: 'student' })}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                                form.role === 'mentor'
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-slate-500'
                            }`}
                            onClick={() => setForm({ ...form, role: 'mentor' })}
                        >
                            Mentor
                        </button>
                    </div>

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Sign Up */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Don’t have an account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                        Sign Up
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
