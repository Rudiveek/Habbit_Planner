import AuraLogo from '../components/AuraLogo';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Flame,
  Target,
  Timer,
  BarChart3,
  Apple,
  Dumbbell,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Sun,
  Moon,
  ChevronRight,
  Brain,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    try {
      await login('demo@habits.local', 'secret123');
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#09090b] text-zinc-100'
    }`}>
      {/* 1. SaaS Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-zinc-800/60 px-6 lg:px-12 h-20 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <AuraLogo size="md" />
          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AURA
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              Habit OS
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#focus" className="hover:text-indigo-400 transition-colors">Focus Engine</a>
          <a href="#methodology" className="hover:text-indigo-400 transition-colors">Methodology</a>
          <a href="#reviews" className="hover:text-indigo-400 transition-colors">Reviews</a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <span>Go to App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-block px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold tracking-wide uppercase mb-6 animate-fade-in">
          <Zap className="w-3.5 h-3.5" /> Built for High Performers & Creators
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Form Better Habits.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Build Unbroken Streaks.
          </span>{' '}
          Elevate Your Life.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The all-in-one personal growth operating system inspired by Habitify & Atomic Habits. Intelligent tracking, Pomodoro focus audio, smart nutrition, and visual heatmaps.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleQuickDemo}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try 1-Click Interactive Demo</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free to use
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Private Isolated Database
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 User Rating
          </span>
        </div>

        {/* 3. Hero Visual Dashboard Mockup Card */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-zinc-500">aura.app/dashboard</span>
            </div>
            <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Live System Preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Morning Deep Reading</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold"><Flame className="w-3.5 h-3.5 fill-amber-400" /> 14d</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[90%]" />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed Today
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Deep Focus Pomodoro</span>
                <span className="text-indigo-400 font-mono font-bold">25:00 ⏱️</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[60%]" />
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold">
                Ambient Rain Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Daily Hydration</span>
                <span className="text-cyan-400 font-mono font-bold">2,500 ml</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[83%]" />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Target: 3,000 ml
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four Core Pillars Section */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-zinc-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Architecture & Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2">
            Everything you need to master your daily routines.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-4">
            Designed from the ground up for habit formation, deliberate practice, and lifestyle optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Intelligent Habit Streaks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated rest-day tolerance engine. Flexible schedules (Daily, Weekdays, Custom) that never unfairly break your streak on rest days.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Focus & Pomodoro Hub</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesized ambient soundscapes (Pink Noise Rain, 10Hz Alpha Waves). Link focus blocks directly to habits and earn XP automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Nutrition & Hydration</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track calorie budgets, protein, carbs, and fats. Meal timeline logs, body weight progress tracking, and intelligent macro advice.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Deep Visual Analytics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              GitHub-style yearly contribution heatmaps, weekly velocity meters, and LeetCode-inspired streak tier badges to gamify discipline.
            </p>
          </div>
        </div>
      </section>

      {/* 5. User Reviews / Testimonials */}
      <section id="reviews" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-zinc-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Loved by Achievers</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
            Why people switch to Aura.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "The Pomodoro timer linked with habits is a game-changer. I hit my 45-minute code blocks and my habit checks off with zero friction."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                AK
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Alex K.</div>
                <div className="text-[10px] text-zinc-500">Senior Software Engineer</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Finally, a habit app that doesn't punish me for taking Sunday off as a rest day! The streak engine is so smart and fair."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
                ML
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Maya Lin</div>
                <div className="text-[10px] text-zinc-500">Marathon Runner & Designer</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "The design is gorgeous. In dark mode or pure white mode, it feels like a $50/mo executive tool, but it's completely free."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                DR
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">David Ross</div>
                <div className="text-[10px] text-zinc-500">Product Manager</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Conversion Call To Action */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto text-center">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900 border border-indigo-500/30 p-10 sm:p-16 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Ready to Build Your Unstoppable Routine?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mt-4 leading-relaxed">
            Join thousands of achievers. Set your targets, lock in your streaks, and watch your daily momentum compound.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              Start Free Today — Zero Setup
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-zinc-800/80 py-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-zinc-400">AURA Growth System</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-zinc-300">Features</a>
          <Link to="/login" className="hover:text-zinc-300">Sign In</Link>
          <Link to="/register" className="hover:text-zinc-300">Register</Link>
        </div>
      </footer>
    </div>
  );
}
