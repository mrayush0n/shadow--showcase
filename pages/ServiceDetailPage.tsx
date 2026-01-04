
import React from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

export type ServiceType = 'image' | 'video' | 'text' | 'code' | 'trip' | 'voice';

interface ServiceDetailPageProps {
    service: ServiceType;
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

const serviceData: Record<ServiceType, {
    title: string;
    tagline: string;
    description: string;
    icon: string;
    gradient: string;
    color: string;
    features: { icon: string; title: string; description: string }[];
    useCases: string[];
    stats: { value: string; label: string }[];
}> = {
    image: {
        title: 'Image Studio',
        tagline: 'Create stunning visuals with AI',
        description: 'Generate beautiful images from text prompts, edit photos with intelligent AI tools, and analyze visual content with cutting-edge technology.',
        icon: 'palette',
        gradient: 'from-rose-500 to-pink-500',
        color: 'rose',
        features: [
            { icon: 'auto_awesome', title: 'Text-to-Image', description: 'Generate stunning images from text descriptions' },
            { icon: 'brush', title: 'AI Editing', description: 'Edit photos with intelligent AI-powered tools' },
            { icon: 'search', title: 'Image Analysis', description: 'Understand and analyze image content' },
            { icon: 'style', title: 'Style Transfer', description: 'Apply artistic styles to your images' },
        ],
        useCases: ['Marketing Materials', 'Social Media Content', 'Product Mockups', 'Art & Illustration', 'Photo Enhancement', 'Brand Assets'],
        stats: [{ value: '500K+', label: 'Images Generated' }, { value: '50ms', label: 'Avg Response' }, { value: '4K', label: 'Max Resolution' }]
    },
    video: {
        title: 'Video Studio',
        tagline: 'Bring your ideas to life',
        description: 'Create professional videos from text prompts or images. Transform static content into dynamic, engaging video content.',
        icon: 'movie_filter',
        gradient: 'from-violet-500 to-purple-500',
        color: 'violet',
        features: [
            { icon: 'text_fields', title: 'Text-to-Video', description: 'Generate videos from text descriptions' },
            { icon: 'image', title: 'Image-to-Video', description: 'Animate still images into videos' },
            { icon: 'analytics', title: 'Video Analysis', description: 'Understand video content frame by frame' },
            { icon: 'aspect_ratio', title: 'Multiple Formats', description: 'Create in various aspect ratios' },
        ],
        useCases: ['Product Demos', 'Social Media Reels', 'Explainer Videos', 'Marketing Ads', 'Creative Shorts', 'Presentations'],
        stats: [{ value: '50K+', label: 'Videos Created' }, { value: '1080p', label: 'HD Quality' }, { value: '60fps', label: 'Smooth Motion' }]
    },
    text: {
        title: 'Text Playground',
        tagline: 'Words, reimagined by AI',
        description: 'Advanced text manipulation powered by AI. Summarize documents, expand ideas, translate languages, and generate content effortlessly.',
        icon: 'edit_note',
        gradient: 'from-sky-500 to-cyan-500',
        color: 'sky',
        features: [
            { icon: 'summarize', title: 'Summarization', description: 'Condense long documents into key points' },
            { icon: 'expand', title: 'Content Expansion', description: 'Expand brief ideas into full content' },
            { icon: 'translate', title: 'Translation', description: 'Translate text across 100+ languages' },
            { icon: 'edit', title: 'Rewriting', description: 'Rephrase content in different styles' },
        ],
        useCases: ['Blog Writing', 'Email Drafting', 'Research Summaries', 'Content Marketing', 'Documentation', 'Creative Writing'],
        stats: [{ value: '100+', label: 'Languages' }, { value: '10K', label: 'Words/Request' }, { value: '99%', label: 'Accuracy' }]
    },
    code: {
        title: 'Code Assistant',
        tagline: 'Your AI pair programmer',
        description: 'Debug issues, explain complex code, optimize performance, and generate solutions. The ultimate coding companion.',
        icon: 'code',
        gradient: 'from-emerald-500 to-teal-500',
        color: 'emerald',
        features: [
            { icon: 'bug_report', title: 'Debugging', description: 'Find and fix bugs automatically' },
            { icon: 'school', title: 'Code Explanation', description: 'Understand complex code easily' },
            { icon: 'speed', title: 'Optimization', description: 'Improve code performance' },
            { icon: 'add_box', title: 'Code Generation', description: 'Generate code from descriptions' },
        ],
        useCases: ['Bug Fixing', 'Code Review', 'Learning New Languages', 'Refactoring', 'Documentation', 'Testing'],
        stats: [{ value: '50+', label: 'Languages' }, { value: '1M+', label: 'Lines Analyzed' }, { value: '95%', label: 'Bug Detection' }]
    },
    trip: {
        title: 'Trip Planner',
        tagline: 'AI-powered travel planning',
        description: 'Get detailed day-by-day itineraries, smart packing lists, and budget breakdowns. Plan your perfect trip with AI assistance.',
        icon: 'travel_explore',
        gradient: 'from-amber-500 to-orange-500',
        color: 'amber',
        features: [
            { icon: 'calendar_month', title: 'Smart Itineraries', description: 'Day-by-day travel plans' },
            { icon: 'luggage', title: 'Packing Lists', description: 'Weather-based packing suggestions' },
            { icon: 'payments', title: 'Budget Planning', description: 'Detailed cost breakdowns' },
            { icon: 'place', title: 'Location Insights', description: 'Local tips and recommendations' },
        ],
        useCases: ['City Tours', 'Adventure Trips', 'Family Vacations', 'Business Travel', 'Honeymoons', 'Road Trips'],
        stats: [{ value: '100K+', label: 'Trips Planned' }, { value: '500+', label: 'Destinations' }, { value: '4.9★', label: 'User Rating' }]
    },
    voice: {
        title: 'Voice Chat',
        tagline: 'Talk to AI naturally',
        description: 'Have natural voice conversations with AI. Speak your thoughts and receive intelligent audio responses in real-time.',
        icon: 'graphic_eq',
        gradient: 'from-purple-500 to-indigo-500',
        color: 'purple',
        features: [
            { icon: 'mic', title: 'Voice Input', description: 'Speak naturally to AI' },
            { icon: 'volume_up', title: 'Audio Response', description: 'Hear AI responses spoken' },
            { icon: 'bolt', title: 'Real-time', description: 'Instant voice processing' },
            { icon: 'chat', title: 'Natural Conversation', description: 'Fluid, human-like dialogue' },
        ],
        useCases: ['Hands-free Assistance', 'Language Practice', 'Brainstorming', 'Accessibility', 'Quick Queries', 'Learning'],
        stats: [{ value: '<1s', label: 'Response Time' }, { value: '30+', label: 'Languages' }, { value: '24/7', label: 'Available' }]
    }
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();
    const data = serviceData[service];

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-1/3 w-[800px] h-[800px] bg-${data.color}-500/15 dark:bg-${data.color}-500/25 rounded-full blur-[200px]`} />
                <div className={`absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-${data.color}-400/10 dark:bg-${data.color}-400/15 rounded-full blur-[150px]`} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                @keyframes pulse3d { 0%, 100% { transform: scale(1) rotateY(0deg); } 50% { transform: scale(1.05) rotateY(10deg); } }
                .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.6s ease-out forwards; }
                .animate-pulse3d { animation: pulse3d 4s ease-in-out infinite; }
                .card-3d { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); transform-style: preserve-3d; }
                .card-3d:hover { transform: translateY(-12px) rotateX(5deg) rotateY(5deg) scale(1.02); }
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
                        <button onClick={onExplore} className={`px-4 py-2 text-sm bg-gradient-to-r ${data.gradient} text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all`}>Try Now</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Icon */}
                        <div className="animate-scaleIn">
                            <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br ${data.gradient} flex items-center justify-center shadow-2xl animate-pulse3d`}>
                                <Icon name={data.icon} className="text-6xl lg:text-7xl text-white" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center lg:text-left flex-1">
                            <div className="animate-slideUp">
                                <span className={`text-sm font-semibold text-${data.color}-500 uppercase tracking-wider mb-2 block`}>AI Tool</span>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                                    <span className={`bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>{data.title}</span>
                                </h1>
                                <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium mb-4">{data.tagline}</p>
                                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-8">{data.description}</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <button onClick={onExplore} className={`group px-8 py-4 bg-gradient-to-r ${data.gradient} text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2`}>
                                        <Icon name="rocket_launch" className="transition-transform group-hover:rotate-12" />
                                        Start Using Free
                                    </button>
                                    <button onClick={onLogin} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300">
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
                    {data.stats.map((stat, i) => (
                        <div key={i} className="animate-slideUp text-center p-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                            <p className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 px-6 py-16 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/30 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12 animate-slideUp">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.features.map((feature, i) => (
                            <div key={i} className="card-3d animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 cursor-default group" style={{ animationDelay: `${i * 0.1 + 0.4}s` }}>
                                <div className="flex items-start gap-5">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        <Icon name={feature.icon} className="text-2xl text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">{feature.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12 animate-slideUp">Use Cases</h2>
                    <div className="flex flex-wrap justify-center gap-3 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        {data.useCases.map((useCase, i) => (
                            <span key={i} className={`px-5 py-3 bg-${data.color}-500/10 border border-${data.color}-500/20 rounded-xl text-${data.color}-600 dark:text-${data.color}-400 font-medium hover:bg-${data.color}-500/20 hover:scale-105 transition-all duration-300 cursor-default`}>
                                {useCase}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className={`relative bg-gradient-to-br ${data.gradient} rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl group`}>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 group-hover:scale-105 transition-transform duration-500">Ready to Try {data.title}?</h2>
                            <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto">Get started for free. No credit card required.</p>
                            <button onClick={onExplore} className="px-12 py-5 text-lg font-bold bg-white text-slate-900 rounded-2xl shadow-2xl hover:bg-slate-100 hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                                Start Creating Now
                            </button>
                        </div>
                    </div>
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
