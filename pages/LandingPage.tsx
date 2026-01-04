
import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { TestimonialsSection, ScrollProgress, CookieConsent, NewsletterSignup, SocialProof, ChatbotWidget } from '../components/LandingComponents';

interface LandingPageProps {
    onLogin: () => void;
    onExplore: () => void;
    onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onExplore, onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        // Active Features
        { icon: 'palette', title: 'Image Studio', description: 'AI image generation, editing & analysis', color: 'rose', delay: '0s', serviceId: 'service-image' as const, comingSoon: false },
        { icon: 'movie_filter', title: 'Video Studio', description: 'Text-to-video creation', color: 'violet', delay: '0.1s', serviceId: 'service-video' as const, comingSoon: false },
        { icon: 'edit_note', title: 'Text Playground', description: 'Summarize, expand & translate', color: 'sky', delay: '0.2s', serviceId: 'service-text' as const, comingSoon: false },
        { icon: 'code', title: 'Code Assistant', description: 'Debug, explain & generate', color: 'emerald', delay: '0.3s', serviceId: 'service-code' as const, comingSoon: false },
        { icon: 'travel_explore', title: 'Trip Planner', description: 'AI travel planning', color: 'amber', delay: '0.4s', serviceId: 'service-trip' as const, comingSoon: false },
        { icon: 'graphic_eq', title: 'Voice Chat', description: 'Real-time voice AI', color: 'purple', delay: '0.5s', serviceId: 'service-voice' as const, comingSoon: false },
        // Previously Coming Soon Features - Now Active
        { icon: 'music_note', title: 'Music Studio', description: 'AI music generation & stem splitting', color: 'pink', delay: '0.6s', serviceId: 'musicStudio', comingSoon: false },
        { icon: 'view_in_ar', title: '3D Generator', description: 'Text-to-3D model creation', color: 'cyan', delay: '0.7s', serviceId: 'threeDStudio', comingSoon: false },
        { icon: 'description', title: 'Document Chat', description: 'Chat with PDFs & documents', color: 'orange', delay: '0.8s', serviceId: 'documentChat', comingSoon: false },
        { icon: 'smart_toy', title: 'AI Agents', description: 'Build custom AI personas', color: 'indigo', delay: '0.9s', serviceId: 'agentBuilder', comingSoon: false },
        { icon: 'collections', title: 'Community Gallery', description: 'Share & discover creations', color: 'red', delay: '1s', serviceId: 'gallery', comingSoon: false },
        { icon: 'storefront', title: 'Prompt Market', description: 'Curated prompt library', color: 'teal', delay: '1.1s', serviceId: 'promptMarket', comingSoon: false },
        { icon: 'dashboard', title: 'Creative Canvas', description: 'Infinite whiteboard for ideas', color: 'lime', delay: '1.2s', serviceId: 'canvas', comingSoon: false },
        // Wave 2 - Now Active
        { icon: 'podcasts', title: 'Podcast Studio', description: 'Convert text to podcasts', color: 'purple', delay: '1.3s', serviceId: 'podcastStudio', comingSoon: false },
        { icon: 'insights', title: 'Data Insights', description: 'AI-powered data analysis', color: 'blue', delay: '1.4s', serviceId: 'dataInsights', comingSoon: false },
        { icon: 'slideshow', title: 'Slides Builder', description: 'Generate presentations', color: 'orange', delay: '1.5s', serviceId: 'presentationBuilder', comingSoon: false },
        { icon: 'mail', title: 'Email Composer', description: 'Smart email drafting', color: 'green', delay: '1.6s', serviceId: 'emailComposer', comingSoon: false },
        { icon: 'face', title: 'Avatar Studio', description: 'AI profile pictures', color: 'pink', delay: '1.7s', serviceId: 'avatarStudio', comingSoon: false },
        { icon: 'description', title: 'Resume Builder', description: 'ATS-optimized resumes', color: 'indigo', delay: '1.8s', serviceId: 'resumeBuilder', comingSoon: false },
        { icon: 'search', title: 'SEO Optimizer', description: 'Content optimization', color: 'teal', delay: '1.9s', serviceId: 'seoOptimizer', comingSoon: false },
        { icon: 'summarize', title: 'Meeting Notes', description: 'Meeting summaries & actions', color: 'yellow', delay: '2s', serviceId: 'meetingNotes', comingSoon: false },
        { icon: 'school', title: 'AI Tutor', description: 'Personalized learning', color: 'emerald', delay: '2.1s', serviceId: 'aiTutor', comingSoon: false },
        { icon: 'photo_camera', title: 'Product Photo', description: 'AI product photography', color: 'red', delay: '2.2s', serviceId: 'productPhoto', comingSoon: false },
        // Wave 3 - Now Active
        { icon: 'share', title: 'Social Media', description: 'Posts, captions & hashtags', color: 'pink', delay: '2.3s', serviceId: 'socialMedia', comingSoon: false },
        { icon: 'translate', title: 'AI Translator', description: '100+ language translation', color: 'blue', delay: '2.4s', serviceId: 'aiTranslator', comingSoon: false },
        { icon: 'auto_stories', title: 'Story Writer', description: 'Creative story generation', color: 'amber', delay: '2.5s', serviceId: 'storyWriter', comingSoon: false },
        { icon: 'fitness_center', title: 'Fitness Coach', description: 'Workouts & meal plans', color: 'green', delay: '2.6s', serviceId: 'fitnessCoach', comingSoon: false },
        { icon: 'sentiment_very_satisfied', title: 'Meme Generator', description: 'Create viral memes', color: 'yellow', delay: '2.7s', serviceId: 'memeGenerator', comingSoon: false },
    ];

    const navLinks = [
        { id: 'services', label: 'Services' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'blog', label: 'Blog' },
        { id: 'about', label: 'About' },
    ];

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const getColorClasses = (color: string) => ({
        text: `text-${color}-500`,
        bg: `bg-${color}-500/10`,
        border: `border-${color}-500/20`,
        gradient: color === 'rose' ? 'from-rose-500 to-pink-500' :
            color === 'violet' ? 'from-violet-500 to-purple-500' :
                color === 'sky' ? 'from-sky-500 to-cyan-500' :
                    color === 'emerald' ? 'from-emerald-500 to-teal-500' :
                        color === 'amber' ? 'from-amber-500 to-orange-500' :
                            'from-purple-500 to-indigo-500'
    });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background with Parallax */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient orbs */}
                <div
                    className="absolute w-[800px] h-[800px] bg-gradient-to-br from-rose-500/20 to-pink-500/10 dark:from-rose-500/30 dark:to-pink-500/20 rounded-full blur-[120px] animate-pulse"
                    style={{
                        top: `${-200 + mousePosition.y * 100}px`,
                        left: `${-100 + mousePosition.x * 100}px`,
                        transition: 'top 0.5s ease-out, left 0.5s ease-out'
                    }}
                />
                <div
                    className="absolute w-[600px] h-[600px] bg-gradient-to-br from-violet-500/15 to-purple-500/10 dark:from-violet-500/25 dark:to-purple-500/15 rounded-full blur-[100px]"
                    style={{
                        bottom: `${-100 + (1 - mousePosition.y) * 80}px`,
                        right: `${-50 + (1 - mousePosition.x) * 80}px`,
                        transition: 'bottom 0.5s ease-out, right 0.5s ease-out',
                    }}
                />
                <div
                    className="absolute w-[500px] h-[500px] bg-gradient-to-br from-sky-500/10 to-cyan-500/5 dark:from-sky-500/20 dark:to-cyan-500/10 rounded-full blur-[80px]"
                    style={{
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',

                    }}
                />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-rose-500/30 dark:bg-rose-400/50 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,

                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(244, 63, 94, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(244, 63, 94, 0.6); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
                .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-glow { animation: glow 2s ease-in-out infinite; }
                .card-3d {
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }
                .card-3d:hover {
                    transform: rotateY(5deg) rotateX(5deg) translateZ(10px);
                }
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>

            {/* ===== NAVBAR ===== */}
            <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <img src="/logo.png" alt="Shadow Showcase" className="w-10 h-10 rounded-xl shadow-lg object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500 to-violet-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                        </div>
                        <div className="transition-transform duration-300 group-hover:translate-x-1">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Shadow Showcase</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Powered by Shadow SI</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link, i) => (
                            <button
                                key={link.id}
                                onClick={() => onNavigate(link.id as any)}
                                className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-sm font-medium group py-2"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-violet-500 group-hover:w-full transition-all duration-300" />
                            </button>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <div className="flex items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            {themeOptions.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-2 rounded-lg transition-all duration-300 ${theme === t.id ? 'bg-white dark:bg-slate-700 shadow-lg text-rose-500 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:scale-105'}`}
                                >
                                    <Icon name={t.icon} className="text-lg" />
                                </button>
                            ))}
                        </div>
                        <button onClick={onLogin} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
                            Log In
                        </button>
                        <button onClick={onExplore} className="relative px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-violet-500 rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 overflow-hidden group">
                            <span className="relative z-10">Explore Free</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110">
                        <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="text-2xl" />
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 p-6 space-y-3 animate-slideUp">
                        {navLinks.map(link => (
                            <button key={link.id} onClick={() => { onNavigate(link.id as any); setMobileMenuOpen(false); }} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors">
                                {link.label}
                            </button>
                        ))}
                        <hr className="border-slate-200 dark:border-slate-800" />
                        <div className="flex gap-3 pt-2">
                            <button onClick={onLogin} className="flex-1 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-center font-semibold hover:border-rose-500/50 transition-all">Log In</button>
                            <button onClick={onExplore} className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-violet-500 text-white rounded-xl text-center font-semibold">Explore</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative z-10 px-6 py-24 lg:py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Animated Badge */}
                    <div className="animate-slideUp inline-flex items-center gap-2 px-4 py-2 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur border border-rose-200 dark:border-rose-500/30 rounded-full text-sm text-rose-600 dark:text-rose-300 mb-8 hover:scale-105 transition-transform cursor-default">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span>Next Generation AI Platform</span>
                        <Icon name="arrow_forward" className="text-sm" />
                    </div>

                    {/* 3D Text Effect */}
                    <h1 className="animate-slideUp text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-8" style={{ animationDelay: '0.1s' }}>
                        <span className="block text-slate-900 dark:text-white drop-shadow-sm">Create Anything</span>
                        <span className="block bg-gradient-to-r from-rose-500 via-violet-500 to-sky-500 bg-clip-text text-transparent drop-shadow-lg" style={{ textShadow: '0 4px 30px rgba(244,63,94,0.3)' }}>
                            With AI Power
                        </span>
                    </h1>

                    <p className="animate-slideUp text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        The all-in-one AI platform for creators, developers, and dreamers. Generate images, videos, code, and more.
                    </p>

                    {/* CTA Buttons with 3D Effect */}
                    <div className="animate-slideUp flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" style={{ animationDelay: '0.3s' }}>
                        <button onClick={onExplore} className="group w-full sm:w-auto px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-violet-500 rounded-2xl shadow-xl shadow-rose-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/50 hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden">
                            <Icon name="rocket_launch" className="transition-transform group-hover:rotate-12" />
                            <span>Start Creating — It's Free</span>
                            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                        </button>
                        <button onClick={onLogin} className="group w-full sm:w-auto px-10 py-5 text-lg font-bold text-slate-700 dark:text-white bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur border-2 border-slate-200 dark:border-slate-700 rounded-2xl transition-all duration-500 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                            <Icon name="login" className="transition-transform group-hover:translate-x-1" />
                            Sign In
                        </button>
                    </div>

                    {/* Animated Stats with 3D Cards */}
                    <div className="animate-slideUp grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto" style={{ animationDelay: '0.4s' }}>
                        {[
                            { v: '6+', l: 'AI Tools', c: 'rose' },
                            { v: '1M+', l: 'Creations', c: 'violet' },
                            { v: '99.9%', l: 'Uptime', c: 'sky' },
                            { v: '24/7', l: 'Support', c: 'emerald' }
                        ].map((s, i) => (
                            <div
                                key={i}
                                className={`group text-center p-5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl cursor-default card-3d`}
                                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                            >
                                <p className={`text-3xl font-black text-${s.c}-500 transition-transform group-hover:scale-110`}>{s.v}</p>
                                <p className="text-sm text-slate-500 mt-1">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES with 3D Cards ===== */}
            <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/30 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">Our AI Tools</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">Everything you need to create, powered by cutting-edge AI.</p>
                        <button onClick={() => onNavigate('services')} className="group text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-2 mx-auto transition-all">
                            View All Services
                            <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-2" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => {
                            const colors = getColorClasses(f.color);
                            return (
                                <div
                                    key={i}
                                    onClick={() => !f.comingSoon && f.serviceId && onNavigate(f.serviceId)}
                                    className={`group relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-${f.color}-200/50 dark:border-${f.color}-500/20 rounded-3xl p-6 transition-all duration-500 card-3d ${f.comingSoon ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:shadow-2xl hover:shadow-' + f.color + '-500/20 hover:-translate-y-3 hover:border-' + f.color + '-300 dark:hover:border-' + f.color + '-500/50'}`}
                                    style={{ animationDelay: f.delay }}
                                >
                                    {/* Coming Soon Badge */}
                                    {f.comingSoon && (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                                            Coming Soon
                                        </div>
                                    )}

                                    {/* Floating Icon */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-5 shadow-lg transition-all duration-500 ${f.comingSoon ? 'grayscale-[30%]' : 'group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl'}`} style={{ animationDelay: f.delay }}>
                                        <Icon name={f.icon} className="text-3xl text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-slate-900 dark:text-white mb-2 ${f.comingSoon ? '' : 'group-hover:text-rose-500'} transition-colors`}>{f.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{f.description}</p>

                                    {/* Hover Arrow - only for active features */}
                                    {!f.comingSoon && (
                                        <div className="mt-4 flex items-center gap-2 text-rose-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-sm font-semibold">Explore</span>
                                            <Icon name="arrow_forward" className="text-sm" />
                                        </div>
                                    )}

                                    {/* Coming Soon hint */}
                                    {f.comingSoon && (
                                        <div className="mt-4 flex items-center gap-2 text-amber-500">
                                            <Icon name="schedule" className="text-sm" />
                                            <span className="text-sm font-medium">Launching Soon</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== QUICK LINKS with Hover Effects ===== */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { id: 'portfolio', icon: 'work', title: 'Portfolio', desc: 'See real projects', color: 'violet' },
                        { id: 'about', icon: 'info', title: 'About Us', desc: 'Our story & mission', color: 'rose' },
                        { id: 'faq', icon: 'help', title: 'FAQ', desc: 'Common questions', color: 'sky' }
                    ].map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
                            className={`group bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-${item.color}-200/50 dark:border-${item.color}-500/20 hover:border-${item.color}-400 dark:hover:border-${item.color}-500/50 rounded-2xl p-8 text-left transition-all duration-500 hover:shadow-2xl hover:shadow-${item.color}-500/20 hover:-translate-y-2 card-3d`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-${item.color}-500/20`}>
                                <Icon name={item.icon} className={`text-2xl text-${item.color}-500`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                            <Icon name="arrow_forward" className={`mt-4 text-${item.color}-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300`} />
                        </button>
                    ))}
                </div>
            </section>

            {/* ===== CTA with Glow Effect ===== */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-gradient-to-br from-rose-500 to-violet-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-500 group">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                        </div>

                        {/* Floating orbs */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-violet-400/30 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 group-hover:scale-105 transition-transform duration-500">Ready to Start?</h2>
                            <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg">Join thousands of creators. No credit card required.</p>
                            <button onClick={onExplore} className="px-12 py-5 text-lg font-bold bg-white text-slate-900 rounded-2xl shadow-2xl hover:bg-slate-100 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-3xl animate-glow">
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <TestimonialsSection />

            {/* ===== SOCIAL PROOF ===== */}
            <SocialProof />

            {/* ===== NEWSLETTER ===== */}
            <NewsletterSignup />

            {/* ===== FOOTER ===== */}
            <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 px-6 py-16 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-4 group cursor-pointer">
                                <img src="/logo.png" alt="Shadow Showcase" className="w-10 h-10 rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-3" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Shadow Showcase</h3>
                                    <p className="text-xs text-slate-500">Powered by Shadow SI</p>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">The next generation AI platform for creators.</p>
                        </div>
                        {[
                            { title: 'Product', links: [{ l: 'Services', id: 'services' }, { l: 'Pricing', id: 'pricing' }, { l: 'Demo', id: 'demo' }] },
                            { title: 'Company', links: [{ l: 'About', id: 'about' }, { l: 'Blog', id: 'blog' }, { l: 'Contact', id: 'contact' }] },
                            { title: 'Support', links: [{ l: 'FAQ', id: 'faq' }, { l: 'Help Center', id: 'contact' }] },
                            { title: 'Legal', links: [{ l: 'Privacy', id: 'privacy' }, { l: 'Terms', id: 'terms' }] }
                        ].map((section, i) => (
                            <div key={i}>
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
                                <ul className="space-y-3 text-sm text-slate-500">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <button onClick={() => link.id && onNavigate(link.id as any)} className="hover:text-rose-500 transition-colors">
                                                {link.l}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Shadow SI. All rights reserved.</p>
                        <div className="flex items-center gap-3">
                            {['language', 'code'].map((icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group">
                                    <Icon name={icon} className="text-slate-500 group-hover:text-rose-500 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Global Components */}
            <ScrollProgress />
            <CookieConsent />
            <ChatbotWidget />
        </div>
    );
};
