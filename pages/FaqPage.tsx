
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface FaqPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();
    const [activeCategory, setActiveCategory] = useState('general');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const categories = [
        { id: 'general', label: 'General', icon: 'help', gradient: 'from-rose-500 to-pink-500' },
        { id: 'features', label: 'Features', icon: 'star', gradient: 'from-violet-500 to-purple-500' },
        { id: 'pricing', label: 'Pricing', icon: 'payments', gradient: 'from-emerald-500 to-teal-500' },
        { id: 'technical', label: 'Technical', icon: 'code', gradient: 'from-sky-500 to-cyan-500' },
        { id: 'privacy', label: 'Privacy', icon: 'security', gradient: 'from-amber-500 to-orange-500' }
    ];

    const faqs: Record<string, { q: string; a: string }[]> = {
        general: [
            { q: 'What is Shadow Showcase?', a: 'Shadow Showcase is an all-in-one AI platform for creators, developers, and innovators. It combines image generation, video creation, text tools, code assistance, and more.' },
            { q: 'Who is Shadow SI?', a: 'Shadow SI is the technology company behind Shadow Showcase. We specialize in making cutting-edge AI accessible to everyone.' },
            { q: 'Is Shadow Showcase free?', a: 'Yes! You can start using Shadow Showcase completely free. Some advanced features may require your own API key for unlimited usage.' },
            { q: 'What AI models power Shadow Showcase?', a: 'We use Google Gemini AI for text and analysis, Veo for video generation, and Imagen for high-quality image creation.' }
        ],
        features: [
            { q: 'What can I create with Image Studio?', a: 'You can generate images from text prompts, edit existing photos with AI, analyze image content, and apply style transfers.' },
            { q: 'How does Video Studio work?', a: 'Video Studio uses Veo 3.1 to generate videos from text prompts or images. You can create up to 720p videos with various aspect ratios.' },
            { q: 'What languages does Code Assistant support?', a: 'Our Code Assistant supports all major programming languages including JavaScript, Python, TypeScript, Java, C++, and more.' },
            { q: 'Can Trip Planner book hotels?', a: 'Trip Planner creates detailed itineraries with recommendations but does not directly book hotels. It provides location suggestions you can use.' }
        ],
        pricing: [
            { q: 'Is there a premium plan?', a: 'Currently, Shadow Showcase is free to use. Premium features may be introduced in the future.' },
            { q: 'Do I need to pay for API usage?', a: 'For most features, we use our backend API. Video generation requires you to provide your own API key due to billing requirements.' },
            { q: 'Are there usage limits?', a: 'There are reasonable rate limits to ensure fair usage for all users. These limits are generous for normal use cases.' }
        ],
        technical: [
            { q: 'What browsers are supported?', a: 'Shadow Showcase works best on modern browsers like Chrome, Firefox, Safari, and Edge. Keep your browser updated.' },
            { q: 'Is there an API for developers?', a: 'Currently, Shadow Showcase is a web application. Developer API access may be available in the future.' },
            { q: 'Can I use generated content offline?', a: 'You can download generated images and videos to use offline. The creation process requires an internet connection.' }
        ],
        privacy: [
            { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption for all data. Your creations and personal information are protected with enterprise-grade security.' },
            { q: 'Do you store my creations?', a: 'Your creations are stored in your personal account. You can delete them at any time. We never share your content with third parties.' },
            { q: 'Can I delete my account?', a: 'Yes, you can delete your account at any time from the settings. This will permanently remove all your data from our systems.' },
            { q: 'Do you sell user data?', a: 'Absolutely not. We never sell or share your personal data with third parties. Your privacy is our priority.' }
        ]
    };

    const currentFaqs = faqs[activeCategory] || [];
    const currentCat = categories.find(c => c.id === activeCategory);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-[150px]" style={{ animation: 'float 10s ease-in-out infinite' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[120px]" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes expand { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
                .animate-expand { animation: expand 0.4s ease-out forwards; }
                .faq-card { transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
                .faq-card:hover { transform: translateX(8px); }
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
                    <span className="text-sm font-semibold text-sky-500 uppercase tracking-wider mb-4 block">Support</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">FAQ</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">Find answers to commonly asked questions.</p>
                </div>
            </section>

            {/* Content */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        {categories.map((cat, i) => (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                                className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-500 ${activeCategory === cat.id
                                        ? `bg-gradient-to-r ${cat.gradient} text-white shadow-xl scale-105`
                                        : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:scale-105 hover:shadow-lg'
                                    }`}
                            >
                                <Icon name={cat.icon} className={`text-lg transition-transform group-hover:rotate-12 ${activeCategory === cat.id ? '' : 'group-hover:scale-110'}`} />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-4">
                        {currentFaqs.map((faq, i) => (
                            <div key={i} className="faq-card animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden" style={{ animationDelay: `${i * 0.05 + 0.2}s` }}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left group"
                                >
                                    <span className="font-semibold text-slate-900 dark:text-white pr-4 group-hover:text-rose-500 transition-colors">{faq.q}</span>
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentCat?.gradient || 'from-rose-500 to-pink-500'} flex items-center justify-center flex-shrink-0 transition-all duration-500 ${openFaq === i ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`}>
                                        <Icon name="expand_more" className="text-white" />
                                    </div>
                                </button>
                                {openFaq === i && (
                                    <div className="animate-expand px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still have questions */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-3xl mx-auto text-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Still Have Questions?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Contact our support team for help.</p>
                    <button onClick={onBack} className="px-8 py-3 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 text-slate-700 dark:text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Contact Support
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
