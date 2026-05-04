import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import NeuralNetwork from '../components/NeuralNetwork';
import FloatingCrystal from '../components/FloatingCrystal';
import RingPortal from '../components/RingPortal';
import {
  ChevronDown, Rocket, Users, BrainCircuit, LineChart, Sparkles,
  ArrowRight, CheckCircle2, Target, Zap, Star, TrendingUp, Globe, Shield,
  Sun, Moon
} from 'lucide-react';

/* ─── Animation Variants ──────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

/* ─── Reusable Section Header ─────────────────────── */
const SectionTag = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-bold tracking-widest uppercase text-zinc-200 mb-6">
    {children}
  </span>
);

/* ─── Stats Counter ───────────────────────────────── */
const stats = [
  { value: '2,400+', label: 'Student Founders', icon: Users },
  { value: '340+', label: 'Expert Mentors', icon: Shield },
  { value: '89%', label: 'Pitch Success Rate', icon: TrendingUp },
  { value: '$12M+', label: 'Funding Raised', icon: Globe },
];

/* ─── How It Works Steps ──────────────────────────── */
const steps = [
  { num: '01', title: 'Build Your Pitch', desc: 'Create a compelling startup pitch with our structured templates and AI-guided storytelling framework.', color: 'purple', crystalColor: '#a855f7' },
  { num: '02', title: 'AI Audits Your Idea', desc: 'Our Gemini-powered engine dissects your pitch for clarity, market fit, and investor appeal in seconds.', color: 'blue', crystalColor: '#3b82f6' },
  { num: '03', title: 'Match With Mentors', desc: 'Get paired with vetted industry leaders aligned to your sector who provide real, actionable feedback.', color: 'cyan', crystalColor: '#06b6d4' },
  { num: '04', title: 'Launch & Raise', desc: 'Use your refined pitch to confidently approach investors and accelerators with a battle-tested narrative.', color: 'emerald', crystalColor: '#10b981' },
];

/* ─── Testimonials ────────────────────────────────── */
const testimonials = [
  { name: 'Aanya Sharma', role: 'Founder, NestTech', quote: 'Launchpad connected me with a mentor who had raised Series B at my exact target market. We closed our seed round in 3 months.', rating: 5 },
  { name: 'Raj Mehta', role: 'Co-founder, AgroSense', quote: "The AI pitch audit caught gaps I'd been blind to for weeks. It re-framed our entire value proposition and the feedback was surgical.", rating: 5 },
  { name: 'Priya Nair', role: 'Student, IIT Bombay', quote: "I went from a concept on a napkin to a pitch deck that an angel investor actually called 'one of the best I've seen this year'.", rating: 5 },
];

/* ─── Main Component ──────────────────────────────── */
const LandingPage = () => {
  const { scrollY } = useScroll();
  const { theme, toggle } = useTheme();

  // Hero parallax
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.94]);
  // Neural fades out completely as soon as user scrolls past hero
  const neuralOpacity = useTransform(scrollY, [0, 600], [0.65, 0]);

  // Background parallax orbs
  const bgY1 = useTransform(scrollY, [0, 2000], [0, 600]);
  const bgY2 = useTransform(scrollY, [0, 2000], [0, -600]);
  const bgY3 = useTransform(scrollY, [500, 2500], [0, 400]);

  // Scroll-driven section skews & reveals
  const statsSkew = useTransform(scrollY, [300, 700], [6, 0]);

  // Section refs for in-view animations
  const statsRef = useRef(null);
  const stepsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: false, margin: '-100px' });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* ── FIXED GRADIENT ORBS (full page depth) ─────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: bgY1 }} className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px]" />
        <motion.div style={{ y: bgY2 }} className="absolute top-2/3 -right-48 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <motion.div style={{ y: bgY3 }} className="absolute top-[140%] left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      {/* ── NAVIGATION ────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-transparent bg-transparent"
      >
        <div className="text-xl md:text-2xl font-extrabold tracking-tighter text-white">
          <Link to="/" className="hover:opacity-80 transition-opacity">Launchpad<span className="text-purple-500">.</span></Link>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={toggle}
            className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] transition-shadow"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center z-10">

        {/* Neural Network scoped to hero ONLY — fades on scroll */}
        <motion.div style={{ opacity: neuralOpacity }} className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
            <NeuralNetwork />
          </Canvas>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mt-20 pointer-events-none"
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-8">
              <Sparkles size={13} className="text-purple-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-purple-300">The Future of Incubation</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
              <span className={`text-transparent bg-clip-text bg-gradient-to-b ${theme === 'dark' ? 'from-white via-white to-zinc-600' : 'from-slate-900 via-slate-800 to-slate-500'}`}>Where Ideas</span>
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-br ${theme === 'dark' ? 'from-purple-400 via-white to-blue-400' : 'from-purple-600 via-slate-900 to-blue-600'}`}>Find Fuel.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              An elite digital incubator connecting visionary students with industry-leading mentors. Powered by AI, driven by ambition.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-zinc-400 pointer-events-none"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────── */}
      <section ref={statsRef} className="relative z-20 py-20 px-6 border-y border-white/5 backdrop-blur-sm overflow-hidden">
        <motion.div
          style={{ skewY: statsSkew }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 280, damping: 22 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <s.icon size={24} className="text-zinc-300 mb-1" />
              <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">{s.value}</div>
              <div className="text-sm text-zinc-300 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" ref={stepsRef} className="relative z-20 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-24"
          >
            <motion.div variants={fadeUp}><SectionTag><Target size={12} />How It Works</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              From idea to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> investor</span>.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-300 text-xl max-w-2xl mx-auto font-light">Four steps. Designed to compress years of trial-and-error into weeks.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: '-80px' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: i * 0.1 }}
                className="group relative bg-zinc-950/80 border border-white/8 rounded-3xl p-10 overflow-hidden flex gap-8 items-start backdrop-blur-md hover:border-white/15 transition-all duration-500"
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-${step.color}-500/8 to-transparent`} />

                {/* Mini 3D Canvas */}
                <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10">
                  <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[5, 5, 5]} intensity={1} color={step.crystalColor} />
                    <FloatingCrystal color={step.crystalColor} speed={1 + i * 0.3} />
                  </Canvas>
                </div>

                <div className="relative z-10">
                  <div className="text-xs font-black tracking-widest text-zinc-400 mb-3">{step.num}</div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3">{step.title}</h3>
                  <p className="text-zinc-300 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ────────────────────────────── */}
      <section className="relative z-20 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp}><SectionTag><Zap size={12} />Platform Features</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Everything you need
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">to scale.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[260px]">
            {/* AI Pitch */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }} whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="md:col-span-2 bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
              <BrainCircuit size={44} className="text-purple-400 mb-6 absolute top-10 left-10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-bold mb-4">AI-Powered</div>
                <h3 className="text-3xl font-bold mb-3 tracking-tight">AI Pitch Auditing</h3>
                <p className="text-zinc-300 text-base leading-relaxed">Get instant algorithmic feedback on your startup pitch before it ever reaches a human mentor. Refine your narrative in real-time.</p>
              </div>
            </motion.div>

            {/* Elite Network */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }} whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Users size={44} className="text-blue-400 mb-6 absolute top-10 left-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Elite Network</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">Connect with vetted industry leaders who have built and scaled real companies.</p>
              </div>
            </motion.div>

            {/* Analytics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }} whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <LineChart size={44} className="text-cyan-400 mb-6 absolute top-10 left-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Deep Analytics</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">Track pitch views, mentor engagement, and your success rate over time.</p>
              </div>
            </motion.div>

            {/* Launch Ready */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }} whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="md:col-span-2 bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
              <Rocket size={44} className="text-emerald-400 mb-6 absolute top-10 left-10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-bold mb-4">End-to-End</div>
                <h3 className="text-3xl font-bold mb-3 tracking-tight">Launch Ready</h3>
                <p className="text-zinc-300 text-base leading-relaxed">Transition from idea to execution. Use actionable feedback to build your MVP and prepare for actual funding rounds.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="relative z-20 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp}><SectionTag><Star size={12} />Testimonials</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter">
              Founders who
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">made it.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-60px' }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 300, damping: 28 }}
                whileHover={{ y: -6 }}
                className="bg-zinc-950 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-200 leading-relaxed text-base relative z-10">"{t.quote}"</p>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-zinc-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RING PORTAL CTA ───────────────────────────── */}
      <section className="relative z-20 py-40 px-6 overflow-hidden">
        {/* Ring Portal 3D */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <RingPortal />
          </Canvas>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}><SectionTag><Rocket size={12} />Join Today</SectionTag></motion.div>

            <motion.h2 variants={fadeUp} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
              Your idea
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-blue-400">deserves a stage.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-zinc-300 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Join 2,400+ founders who used Launchpad to refine their pitch, find their mentor, and secure funding.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-shadow flex items-center gap-3"
                >
                  Start Pitching <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/mentor-login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/5 border border-white/15 text-white font-bold text-lg rounded-2xl hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-3"
                >
                  Join as Mentor <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-14 text-sm text-zinc-300">
              {['No credit card required', '2 minute setup', 'AI-powered feedback', 'Vetted mentors'].map(badge => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-extrabold tracking-tighter">
            <Link to="/" className="hover:opacity-80 transition-opacity">Launchpad<span className="text-purple-500">.</span></Link>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-300">
            <Link to="/login" className="hover:text-white transition-colors">Student Login</Link>
            <Link to="/mentor-login" className="hover:text-white transition-colors">Mentor Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
          <div className="text-xs text-zinc-500">© 2025 Launchpad. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
