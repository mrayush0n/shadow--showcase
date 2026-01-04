
import React from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface AboutPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const values = [
        { icon: 'auto_awesome', title: 'Innovation', description: 'Pushing AI boundaries.', gradient: 'from-rose-500 to-pink-500', delay: 0 },
        { icon: 'people', title: 'Accessibility', description: 'AI for everyone.', gradient: 'from-violet-500 to-purple-500', delay: 0.1 },
        { icon: 'security', title: 'Privacy First', description: 'Your data is safe.', gradient: 'from-emerald-500 to-teal-500', delay: 0.2 },
        { icon: 'speed', title: 'Performance', description: 'Fast & reliable.', gradient: 'from-sky-500 to-cyan-500', delay: 0.3 },
    ];

    const team = [
        { name: 'Shadow SI', role: 'Founder', avatar: 'SS', gradient: 'from-rose-500 to-violet-500' },
        { name: 'AI Core', role: 'Engineering', avatar: 'AI', gradient: 'from-violet-500 to-purple-500' },
        { name: 'Design Lab', role: 'UX/UI', avatar: 'DL', gradient: 'from-sky-500 to-cyan-500' },
    ];

    const milestones = [
        { year: '2024', event: 'Shadow Showcase launched', icon: 'rocket_launch' },
        { year: '2025', event: 'Video Studio released', icon: 'movie' },
        { year: '2025', event: 'Voice Chat & Code Assistant', icon: 'code' },
        { year: 'Future', event: 'Global AI expansion', icon: 'public' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[120px]" />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-25px) rotate(3deg); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
                .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
                .card-3d { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .card-3d:hover { transform: translateY(-8px) scale(1.02); }
            `}</style>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="group flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-all text-sm">
                        <Icon name="arrow_back" className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Home</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur rounded-xl">
                            {themeOptions.map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)} className={`p-2 rounded-lg transition-all duration-300 ${theme === t.id ? 'bg-white dark:bg-slate-700 shadow-lg text-rose-500 scale-110' : 'text-slate-400 hover:scale-105'}`}>
                                    <Icon name={t.icon} className="text-lg" />
                                </button>
                            ))}
                        </div>
                        <button onClick={onLogin} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors">Log In</button>
                        <button onClick={onExplore} className="px-4 py-2 text-sm bg-gradient-to-r from-rose-500 to-violet-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center animate-slideUp">
                    <span className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 block">About Us</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">The Story of Shadow SI</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        We're on a mission to democratize AI creativity for everyone.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    <div className="card-3d animate-slideUp bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-500/10 dark:to-rose-500/5 border border-rose-200/50 dark:border-rose-500/20 rounded-3xl p-8 cursor-default" style={{ animationDelay: '0.1s' }}>
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Icon name="flag" className="text-white text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
                        <p className="text-slate-600 dark:text-slate-400">Empower creators worldwide with AI tools that amplify human creativity.</p>
                    </div>
                    <div className="card-3d animate-slideUp bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-500/10 dark:to-violet-500/5 border border-violet-200/50 dark:border-violet-500/20 rounded-3xl p-8 cursor-default" style={{ animationDelay: '0.2s' }}>
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Icon name="visibility" className="text-white text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
                        <p className="text-slate-600 dark:text-slate-400">A world where AI is a collaborative partner in every creative process.</p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="relative z-10 px-6 py-16 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/30 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12 animate-slideUp">Our Values</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="card-3d animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 text-center cursor-default group" style={{ animationDelay: `${v.delay + 0.3}s` }}>
                                <div className={`w-12 h-12 bg-gradient-to-br ${v.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <Icon name={v.icon} className="text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-rose-500 transition-colors">{v.title}</h3>
                                <p className="text-slate-500 text-sm">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12 animate-slideUp">Meet the Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {team.map((m, i) => (
                            <div key={i} className="card-3d animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 text-center cursor-default group" style={{ animationDelay: `${i * 0.1 + 0.4}s` }}>
                                <div className={`w-20 h-20 bg-gradient-to-br ${m.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                    {m.avatar}
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">{m.name}</h3>
                                <p className="text-sm text-rose-500">{m.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12 animate-slideUp">Our Journey</h2>
                    <div className="space-y-4">
                        {milestones.map((m, i) => (
                            <div key={i} className="animate-slideIn flex items-center gap-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group cursor-default" style={{ animationDelay: `${i * 0.1 + 0.5}s` }}>
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <Icon name={m.icon} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-emerald-500 font-bold text-sm">{m.year}</span>
                                    <p className="text-slate-700 dark:text-slate-300">{m.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-3xl mx-auto text-center animate-slideUp" style={{ animationDelay: '0.7s' }}>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Join Our Journey</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Experience AI-powered creativity.</p>
                    <button onClick={onExplore} className="px-10 py-4 bg-gradient-to-r from-rose-500 to-violet-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                        Get Started Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 px-6 py-8 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">© {new Date().getFullYear()} Shadow SI. All rights reserved.</p>
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-rose-500 transition-colors">Back to Home</button>
                </div>
            </footer>
        </div>
    );
};
