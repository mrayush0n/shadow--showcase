
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface BlogPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();
    const [activeCategory, setActiveCategory] = useState('all');

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const categories = ['all', 'tutorials', 'news', 'case-studies', 'tips'];

    const posts = [
        { id: 1, title: 'Getting Started with AI Image Generation', category: 'tutorials', date: 'Jan 3, 2026', readTime: '5 min', excerpt: 'Learn how to create stunning AI images from text prompts with Image Studio.', icon: 'palette', gradient: 'from-rose-500 to-pink-500', featured: true },
        { id: 2, title: 'Shadow Showcase v2.0 Released', category: 'news', date: 'Jan 1, 2026', readTime: '3 min', excerpt: 'Introducing Video Studio, Voice Chat, and more exciting features!', icon: 'campaign', gradient: 'from-violet-500 to-purple-500', featured: true },
        { id: 3, title: 'How TechCorp Saved 100+ Hours with Code Assistant', category: 'case-studies', date: 'Dec 28, 2025', readTime: '8 min', excerpt: 'A deep dive into how Code Assistant transformed their development workflow.', icon: 'business', gradient: 'from-emerald-500 to-teal-500', featured: false },
        { id: 4, title: '10 Tips for Better AI Prompts', category: 'tips', date: 'Dec 25, 2025', readTime: '6 min', excerpt: 'Master the art of prompt engineering for better AI outputs.', icon: 'lightbulb', gradient: 'from-amber-500 to-orange-500', featured: false },
        { id: 5, title: 'Creating Travel Itineraries with Trip Planner', category: 'tutorials', date: 'Dec 20, 2025', readTime: '7 min', excerpt: 'Plan your perfect vacation with AI-powered travel recommendations.', icon: 'travel_explore', gradient: 'from-sky-500 to-cyan-500', featured: false },
        { id: 6, title: 'The Future of AI in Content Creation', category: 'news', date: 'Dec 15, 2025', readTime: '4 min', excerpt: 'Our vision for the next generation of AI-powered creativity tools.', icon: 'auto_awesome', gradient: 'from-purple-500 to-indigo-500', featured: false },
    ];

    const filteredPosts = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);
    const featuredPosts = posts.filter(p => p.featured);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
                .card-hover { transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
                .card-hover:hover { transform: translateY(-8px); }
            `}</style>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="group flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-all text-sm">
                        <Icon name="arrow_back" className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Home</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
                            {themeOptions.map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)} className={`p-2 rounded-lg transition-all duration-300 ${theme === t.id ? 'bg-white dark:bg-slate-700 shadow-lg text-rose-500 scale-110' : 'text-slate-400'}`}>
                                    <Icon name={t.icon} className="text-lg" />
                                </button>
                            ))}
                        </div>
                        <button onClick={onLogin} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">Log In</button>
                        <button onClick={onExplore} className="px-4 py-2 text-sm bg-gradient-to-r from-rose-500 to-violet-500 text-white rounded-lg font-semibold">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center animate-slideUp">
                    <span className="text-sm font-semibold text-sky-500 uppercase tracking-wider mb-4 block">Blog</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">News & Tutorials</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Latest updates, guides, and case studies from Shadow Showcase.</p>
                </div>
            </section>

            {/* Featured Posts */}
            <section className="relative z-10 px-6 pb-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Featured</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredPosts.map((post, i) => (
                            <div key={post.id} className="card-hover animate-slideUp group cursor-pointer bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 hover:shadow-2xl" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${post.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        <Icon name={post.icon} className="text-2xl text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-full capitalize">{post.category}</span>
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime} read</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">{post.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="relative z-10 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                {cat === 'all' ? 'All Posts' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Posts */}
            <section className="relative z-10 px-6 py-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post, i) => (
                        <div key={post.id} className="card-hover animate-slideUp group cursor-pointer bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 hover:shadow-xl" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon name={post.icon} className="text-xl text-white" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">{post.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                        </div>
                    ))}
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
