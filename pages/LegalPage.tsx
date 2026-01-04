
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface LegalPageProps {
    section: 'privacy' | 'terms';
    onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ section: initialSection, onBack }) => {
    const { theme, setTheme } = useTheme();
    const [activeSection, setActiveSection] = useState<'privacy' | 'terms'>(initialSection);

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-500/5 to-transparent dark:from-rose-500/10" />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="group flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-all text-sm">
                        <Icon name="arrow_back" className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Home</span>
                    </button>
                    <div className="flex items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
                        {themeOptions.map(t => (
                            <button key={t.id} onClick={() => setTheme(t.id)} className={`p-2 rounded-lg transition-all duration-300 ${theme === t.id ? 'bg-white dark:bg-slate-700 shadow-lg text-rose-500 scale-110' : 'text-slate-400'}`}>
                                <Icon name={t.icon} className="text-lg" />
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-2">
                            <button
                                onClick={() => setActiveSection('privacy')}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeSection === 'privacy' ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => setActiveSection('terms')}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeSection === 'terms' ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 prose prose-slate dark:prose-invert max-w-none">
                        {activeSection === 'privacy' ? (
                            <div className="animate-slideUp">
                                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                                <p className="text-slate-500 text-sm mb-8">Last updated: January 4, 2026</p>

                                <h3>1. Information We Collect</h3>
                                <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>

                                <h3>2. How We Use Your Information</h3>
                                <p>We use the information we collect to provide, maintain, and improve our services, such as to:</p>
                                <ul>
                                    <li>Provide, improve, and develop our Products and Services.</li>
                                    <li>Communicate with you about our Services.</li>
                                    <li>Protect our Services and our users.</li>
                                    <li>Analyze data to improve our services and features.</li>
                                </ul>

                                <h3>3. Sharing of Information</h3>
                                <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
                                <ul>
                                    <li>With third party service providers to enable them to provide the Services you request.</li>
                                    <li>With the public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public.</li>
                                    <li>With third parties with whom you choose to let us share information, for example other apps or websites that integrate with our API or Services, or those with an API or Service with which we integrate.</li>
                                </ul>
                            </div>
                        ) : (
                            <div className="animate-slideUp">
                                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                                <p className="text-slate-500 text-sm mb-8">Last updated: January 4, 2026</p>

                                <h3>1. Acceptance of Terms</h3>
                                <p>By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.</p>

                                <h3>2. Use of Services</h3>
                                <p>You may use our Services only as permitted by these Terms and any applicable laws. Don't misuse our Services. For example, don't interfere with our Services or try to access them using a method other than the interface and the instructions that we provide.</p>

                                <h3>3. User Accounts</h3>
                                <p>You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>

                                <h3>4. AI-Generated Content</h3>
                                <p>You retain ownership of the content you generate using our AI tools. However, you grant us a worldwide, non-exclusive, royalty-free license to host, store, copy, and use your content to provide and improve our services.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.5s ease-out; }
            `}</style>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 px-6 py-8 mt-12">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">© {new Date().getFullYear()} Shadow SI. All rights reserved.</p>
                    <button onClick={onBack} className="text-sm text-slate-500 hover:text-rose-500 transition-colors">Back to Home</button>
                </div>
            </footer>
        </div>
    );
};
