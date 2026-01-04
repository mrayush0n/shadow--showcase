
import React from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface PricingPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out Shadow Showcase',
            features: ['5 Image Generations/day', '2 Video Generations/day', 'Basic Text Tools', 'Community Support', '720p Video Output'],
            cta: 'Get Started',
            popular: false,
            gradient: 'from-slate-500 to-slate-600'
        },
        {
            name: 'Pro',
            price: '$19',
            period: '/month',
            description: 'For creators who need more power',
            features: ['Unlimited Image Generation', '50 Video Generations/day', 'All AI Tools Unlocked', 'Priority Support', '1080p Video Output', 'No Watermarks', 'API Access'],
            cta: 'Start Pro Trial',
            popular: true,
            gradient: 'from-rose-500 to-violet-500'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'For teams and businesses',
            features: ['Unlimited Everything', 'Custom API Integration', 'Dedicated Support', '4K Video Output', 'Team Management', 'SLA Guarantee', 'Custom Branding', 'On-premise Option'],
            cta: 'Contact Sales',
            popular: false,
            gradient: 'from-violet-500 to-indigo-500'
        }
    ];

    const faqs = [
        { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
        { q: 'Is there a free trial?', a: 'Pro plan comes with a 7-day free trial. No credit card required.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise.' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[120px]" />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
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
                    <span className="text-sm font-semibold text-violet-500 uppercase tracking-wider mb-4 block">Pricing</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-violet-500 to-rose-500 bg-clip-text text-transparent">Simple, Transparent Pricing</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Choose the plan that fits your needs. Upgrade or downgrade anytime.</p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, i) => (
                        <div key={i} className={`animate-slideUp relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-rose-500/50 shadow-xl shadow-rose-500/10' : 'border-slate-200/50 dark:border-slate-800/50'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-rose-500 to-violet-500 text-white text-xs font-bold rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-4xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>
                                <p className="text-slate-500 text-sm mt-2">{plan.description}</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                        <Icon name="check_circle" className="text-emerald-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={onExplore} className={`w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${plan.popular ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-lg hover:shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{faq.a}</p>
                            </div>
                        ))}
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
