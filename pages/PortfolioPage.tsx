
import React from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface PortfolioPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const projects = [
        { category: 'Image Generation', title: 'AI Art Gallery', description: 'Stunning AI-generated artwork.', icon: 'image', gradient: 'from-rose-500 to-pink-500', examples: ['Fantasy Landscapes', 'Portrait Art', 'Abstract', 'Mockups'], delay: 0 },
        { category: 'Video Creation', title: 'Motion Stories', description: 'Short-form videos from text.', icon: 'movie', gradient: 'from-violet-500 to-purple-500', examples: ['Product Demos', 'Social', 'Explainers', 'Shorts'], delay: 0.1 },
        { category: 'Code Projects', title: 'Developer Works', description: 'Real-world code solutions.', icon: 'terminal', gradient: 'from-emerald-500 to-teal-500', examples: ['Web Apps', 'APIs', 'Bug Fixes', 'Optimization'], delay: 0.2 },
        { category: 'Content Writing', title: 'Written Works', description: 'Articles and creative writing.', icon: 'article', gradient: 'from-sky-500 to-cyan-500', examples: ['Blogs', 'Marketing', 'Stories', 'Docs'], delay: 0.3 },
        { category: 'Travel Planning', title: 'Trip Itineraries', description: 'Complete travel plans.', icon: 'flight', gradient: 'from-amber-500 to-orange-500', examples: ['City Tours', 'Adventure', 'Family', 'Business'], delay: 0.4 },
    ];

    const stats = [
        { value: '500K+', label: 'Images', gradient: 'from-rose-500 to-pink-500' },
        { value: '50K+', label: 'Videos', gradient: 'from-violet-500 to-purple-500' },
        { value: '1M+', label: 'Code Lines', gradient: 'from-emerald-500 to-teal-500' },
        { value: '100K+', label: 'Trips', gradient: 'from-amber-500 to-orange-500' }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[150px]" style={{ animation: 'float 10s ease-in-out infinite' }} />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[120px]" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-25px) rotate(3deg); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
                .card-3d { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .card-3d:hover { transform: translateY(-12px) rotateX(5deg) scale(1.02); }
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
                    <span className="text-sm font-semibold text-violet-500 uppercase tracking-wider mb-4 block">Portfolio</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-violet-500 to-rose-500 bg-clip-text text-transparent">Our Work</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        See what creators have built with Shadow Showcase.
                    </p>
                </div>
            </section>

            {/* Animated Stats */}
            <section className="relative z-10 px-6 pb-16">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="animate-scaleIn text-center p-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group" style={{ animationDelay: `${i * 0.1}s` }}>
                            <p className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Grid */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div key={index} className="card-3d animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 cursor-pointer group" style={{ animationDelay: `${project.delay}s` }}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} style={{ animation: 'float 5s ease-in-out infinite', animationDelay: `${project.delay}s` }}>
                                <Icon name={project.icon} className="text-2xl text-white" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{project.category}</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3 group-hover:text-rose-500 transition-colors">{project.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.examples.map((ex, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-xs text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-default">{ex}</span>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-rose-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <span className="text-sm font-semibold">View More</span>
                                <Icon name="arrow_forward" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-3xl mx-auto text-center animate-slideUp" style={{ animationDelay: '0.5s' }}>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Create Your Own</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Join thousands of creators.</p>
                    <button onClick={onExplore} className="px-10 py-4 bg-gradient-to-r from-rose-500 to-violet-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                        Start Creating
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
