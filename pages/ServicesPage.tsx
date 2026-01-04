
import React from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface ServicesPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const services = [
        {
            icon: 'palette', title: 'Image Studio',
            description: 'Generate stunning AI images from text prompts, edit photos with intelligent tools, and analyze visual content.',
            features: ['Text-to-Image', 'AI Editing', 'Analysis', 'Style Transfer'],
            gradient: 'from-rose-500 to-pink-500', color: 'rose', delay: 0
        },
        {
            icon: 'movie_filter', title: 'Video Studio',
            description: 'Create professional videos from text or images with intelligent frame-by-frame understanding.',
            features: ['Text-to-Video', 'Image-to-Video', 'Analysis', 'HD Output'],
            gradient: 'from-violet-500 to-purple-500', color: 'violet', delay: 0.1
        },
        {
            icon: 'edit_note', title: 'Text Playground',
            description: 'Advanced text manipulation. Summarize documents, expand ideas, translate languages effortlessly.',
            features: ['Summarize', 'Expand', 'Translate', 'Rewrite'],
            gradient: 'from-sky-500 to-cyan-500', color: 'sky', delay: 0.2
        },
        {
            icon: 'code', title: 'Code Assistant',
            description: 'Your AI pair programming companion. Debug issues, explain code, optimize performance.',
            features: ['Debug', 'Explain', 'Optimize', 'Generate'],
            gradient: 'from-emerald-500 to-teal-500', color: 'emerald', delay: 0.3
        },
        {
            icon: 'travel_explore', title: 'Trip Planner',
            description: 'AI travel planning with smart location suggestions and detailed itineraries.',
            features: ['Itineraries', 'Packing', 'Budget', 'Locations'],
            gradient: 'from-amber-500 to-orange-500', color: 'amber', delay: 0.4
        },
        {
            icon: 'graphic_eq', title: 'Voice Chat',
            description: 'Natural voice conversations with AI. Speak and receive intelligent audio responses.',
            features: ['Voice Input', 'Audio Output', 'Real-time', 'Natural'],
            gradient: 'from-purple-500 to-indigo-500', color: 'purple', delay: 0.5
        },
        // Coming Soon - Wave 1
        {
            icon: 'music_note', title: 'Music Studio',
            description: 'AI music generation & stem splitting. Create original tracks and separate vocals/instruments.',
            features: ['Text-to-Music', 'Stem Splitter', 'Remixing', 'Royalty Free'],
            gradient: 'from-pink-500 to-red-500', color: 'pink', delay: 0.6, comingSoon: true
        },
        {
            icon: 'view_in_ar', title: '3D Generator',
            description: 'Convert text and 2D images into high-quality 3D assets for games and AR/VR.',
            features: ['Text-to-3D', 'Image-to-3D', 'Glb Export', 'Texture Generation'],
            gradient: 'from-cyan-500 to-blue-500', color: 'cyan', delay: 0.7, comingSoon: true
        },
        {
            icon: 'description', title: 'Document Chat',
            description: 'Chat with your PDFs and docs. Extract insights, summaries, and answers instantly.',
            features: ['PDF Analysis', 'Q&A', 'Summarization', 'Citations'],
            gradient: 'from-orange-500 to-amber-500', color: 'orange', delay: 0.8, comingSoon: true
        },
        {
            icon: 'smart_toy', title: 'AI Agents',
            description: 'Build and deploy custom AI personas for specific tasks and workflows.',
            features: ['Character Creation', 'Custom Knowledge', 'Workflow Automation', 'Deployment'],
            gradient: 'from-indigo-500 to-purple-500', color: 'indigo', delay: 0.9, comingSoon: true
        },
        {
            icon: 'collections', title: 'Community Gallery',
            description: 'Share your creations and discover inspiring work from the community.',
            features: ['Sharing', 'Discovery', 'Remixing', 'Social'],
            gradient: 'from-red-500 to-rose-500', color: 'red', delay: 1.0, comingSoon: true
        },
        {
            icon: 'storefront', title: 'Prompt Market',
            description: 'Buy and sell high-quality prompts. Monetize your prompt engineering skills.',
            features: ['Marketplace', 'Buying', 'Selling', 'Verification'],
            gradient: 'from-teal-500 to-emerald-500', color: 'teal', delay: 1.1, comingSoon: true
        },
        {
            icon: 'dashboard', title: 'Creative Canvas',
            description: 'Infinite whiteboard for brainstorming, sketching, and organizing ideas.',
            features: ['Infinite Board', 'Drawing', 'Notes', 'Collaboration'],
            gradient: 'from-lime-500 to-green-500', color: 'lime', delay: 1.2, comingSoon: true
        },
        // Coming Soon - Wave 2
        {
            icon: 'podcasts', title: 'Podcast Studio',
            description: 'Turn text into full podcast episodes with multiple AI hosts.',
            features: ['Text-to-Podcast', 'Multi-Host', 'Intro/Outro', 'Editing'],
            gradient: 'from-purple-500 to-violet-600', color: 'purple', delay: 1.3, comingSoon: true
        },
        {
            icon: 'insights', title: 'Data Insights',
            description: 'Upload spreadsheets and get instant charts, analysis, and insights.',
            features: ['Data Analysis', 'Visualization', 'Trend Detection', 'Export'],
            gradient: 'from-blue-500 to-cyan-600', color: 'blue', delay: 1.4, comingSoon: true
        },
        {
            icon: 'slideshow', title: 'Presentation Builder',
            description: 'Generate complete slide decks from a topic or document.',
            features: ['Slide Generation', 'Layouts', 'Themes', 'PowerPoint Export'],
            gradient: 'from-orange-500 to-red-600', color: 'orange', delay: 1.5, comingSoon: true
        },
        {
            icon: 'mail', title: 'Email Composer',
            description: 'Draft professional emails and intelligent replies in seconds.',
            features: ['Drafting', 'Smart Reply', 'Tone Adjustment', 'Polishing'],
            gradient: 'from-green-500 to-emerald-600', color: 'green', delay: 1.6, comingSoon: true
        },
        {
            icon: 'face', title: 'Avatar Studio',
            description: 'Create realistic AI avatars and profile pictures in various styles.',
            features: ['Profile Pics', 'Virtual Try-on', 'Style Transfer', 'Realistic'],
            gradient: 'from-pink-500 to-rose-600', color: 'pink', delay: 1.7, comingSoon: true
        },
        {
            icon: 'description', title: 'Resume Builder',
            description: 'Build ATS-optimized resumes and cover letters tailored to job descriptions.',
            features: ['Resume Writing', 'Cover Letters', 'ATS Check', 'Formatting'],
            gradient: 'from-indigo-500 to-blue-600', color: 'indigo', delay: 1.8, comingSoon: true
        },
        {
            icon: 'search', title: 'SEO Optimizer',
            description: 'Analyze content and get recommendations to improve search rankings.',
            features: ['Audit', 'Keywords', 'Optimization', 'Competitor Analysis'],
            gradient: 'from-teal-500 to-cyan-600', color: 'teal', delay: 1.9, comingSoon: true
        },
        {
            icon: 'summarize', title: 'Meeting Notes',
            description: 'Transcribe and summarize meetings with actionable items.',
            features: ['Transcription', 'Summaries', 'Action Items', 'Speaker ID'],
            gradient: 'from-yellow-500 to-amber-600', color: 'yellow', delay: 2.0, comingSoon: true
        },
        {
            icon: 'school', title: 'AI Tutor',
            description: 'Personalized learning experiences with interactive quizzes and explanations.',
            features: ['Personalized Plans', 'Quizzes', 'Explanations', 'Progress'],
            gradient: 'from-emerald-500 to-green-600', color: 'emerald', delay: 2.1, comingSoon: true
        },
        {
            icon: 'photo_camera', title: 'Product Photography',
            description: 'Generate professional product shots and remove backgrounds instantly.',
            features: ['Background Removal', 'Scene Generation', 'Lighting', 'High Res'],
            gradient: 'from-red-500 to-rose-600', color: 'red', delay: 2.2, comingSoon: true
        },
        // Coming Soon - Wave 3
        {
            icon: 'share', title: 'Social Media Manager',
            description: 'Auto-generate posts, captions, and hashtags for all platforms.',
            features: ['Content Calendar', 'Post Generation', 'Hashtags', 'Analytics'],
            gradient: 'from-pink-500 to-purple-600', color: 'pink', delay: 2.3, comingSoon: true
        },
        {
            icon: 'translate', title: 'AI Translator',
            description: 'Break language barriers with accurate, context-aware translations.',
            features: ['100+ Languages', 'Real-time', 'Contextual', 'Voice'],
            gradient: 'from-blue-500 to-indigo-600', color: 'blue', delay: 2.4, comingSoon: true
        },
        {
            icon: 'auto_stories', title: 'Story Writer',
            description: 'Unleash creativity with AI-assisted story and character generation.',
            features: ['Plot Generation', 'Character Dev', 'World Building', 'Writing Aid'],
            gradient: 'from-amber-500 to-orange-600', color: 'amber', delay: 2.5, comingSoon: true
        },
        {
            icon: 'fitness_center', title: 'Fitness Coach',
            description: 'Get personalized workout routines and meal plans based on your goals.',
            features: ['Workout Plans', 'Diet Plans', 'Tracking', 'Form Correction'],
            gradient: 'from-green-500 to-emerald-600', color: 'green', delay: 2.6, comingSoon: true
        },
        {
            icon: 'sentiment_very_satisfied', title: 'Meme Generator',
            description: 'Create viral memes instantly with AI-suggested captions and templates.',
            features: ['Templates', 'Caption Gen', 'Trends', 'Editing'],
            gradient: 'from-yellow-500 to-orange-600', color: 'yellow', delay: 2.7, comingSoon: true
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[120px]" style={{ animation: 'float 8s ease-in-out infinite' }} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
                .card-3d { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .card-3d:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
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
                    <span className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 block">Services</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">Our AI Tools</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        A complete suite of AI-powered tools for creativity and productivity.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`card-3d bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-${service.color}-200/50 dark:border-${service.color}-500/20 rounded-3xl p-8 animate-slideUp`}
                            style={{ animationDelay: `${service.delay}s` }}
                        >
                            <div className="flex items-start gap-6">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-xl flex-shrink-0`} style={{ animation: 'float 4s ease-in-out infinite', animationDelay: `${service.delay}s` }}>
                                    <Icon name={service.icon} className="text-3xl text-white" />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{service.description}</p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2">
                                        {service.features.map((feature, i) => (
                                            <span key={i} className={`px-3 py-1 bg-${service.color}-500/10 border border-${service.color}-500/20 rounded-lg text-xs text-${service.color}-600 dark:text-${service.color}-400 font-medium`}>
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-3xl mx-auto text-center animate-slideUp" style={{ animationDelay: '0.6s' }}>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to Try?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Start creating with AI today — it's free.</p>
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
