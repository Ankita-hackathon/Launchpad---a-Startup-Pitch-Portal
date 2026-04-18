import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            alert("Registration Successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert("Registration failed. Email might already exist.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg"
            >
                <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <UserPlus className="text-blue-600" /> Join Launchpad
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Full Name"
                        className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setForm({...form, name: e.target.value})} required
                    />
                    <input
                        type="email" placeholder="Email Address"
                        className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setForm({...form, email: e.target.value})} required
                    />
                    <input
                        type="password" placeholder="Password"
                        className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setForm({...form, password: e.target.value})} required
                    />

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => setForm({...form, role: 'student'})}
                            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition ${form.role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'text-slate-500'}`}
                        >
                            <GraduationCap /> <span className="text-sm font-bold">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({...form, role: 'mentor'})}
                            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition ${form.role === 'mentor' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'text-slate-500'}`}
                        >
                            <ShieldCheck /> <span className="text-sm font-bold">Mentor</span>
                        </button>
                    </div>

                    <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition mt-6">
                        Create Account
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;