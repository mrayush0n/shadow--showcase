
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface ContactPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactMethods = [
        { icon: 'mail', title: 'Email', detail: 'support@shadowsi.com', gradient: 'from-rose-500 to-pink-500', delay: 0 },
        { icon: 'schedule', title: 'Response', detail: '24-48 hours', gradient: 'from-violet-500 to-purple-500', delay: 0.1 },
        { icon: 'help_center', title: 'Help', detail: 'docs.shadowsi.com', gradient: 'from-sky-500 to-cyan-500', delay: 0.2 },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-[150px]" style={{ animation: 'float 10s ease-in-out infinite' }} />
                <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[120px]" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-25px) rotate(3deg); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
                .card-3d { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .card-3d:hover { transform: translateY(-8px) scale(1.02); }
                .input-focus { transition: all 0.3s ease; }
                .input-focus:focus { transform: scale(1.01); }
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
                    <span className="text-sm font-semibold text-sky-500 uppercase tracking-wider mb-4 block">Contact</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-sky-500 to-rose-500 bg-clip-text text-transparent">Get in Touch</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">Have a question? We'd love to hear from you.</p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="relative z-10 px-6 pb-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contactMethods.map((m, i) => (
                        <div key={i} className="card-3d animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 text-center cursor-default group" style={{ animationDelay: `${m.delay}s` }}>
                            <div className={`w-12 h-12 bg-gradient-to-br ${m.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} style={{ animation: 'float 5s ease-in-out infinite', animationDelay: `${m.delay}s` }}>
                                <Icon name={m.icon} className="text-xl text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-rose-500 transition-colors">{m.title}</h3>
                            <p className="text-rose-500 text-sm font-medium">{m.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8 animate-slideUp">Send a Message</h2>
                    {submitted ? (
                        <div className="animate-scaleIn bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-3xl p-10 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
                                <Icon name="check" className="text-white text-4xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">We'll get back to you within 24-48 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 space-y-5" style={{ animationDelay: '0.2s' }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formData.name ? 'top-1 text-xs text-rose-500' : 'top-3.5 text-sm text-slate-400'}`}>Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} className="input-focus w-full px-4 pt-6 pb-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                                </div>
                                <div className="relative">
                                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'email' || formData.email ? 'top-1 text-xs text-rose-500' : 'top-3.5 text-sm text-slate-400'}`}>Email</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className="input-focus w-full px-4 pt-6 pb-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div className="relative">
                                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'subject' || formData.subject ? 'top-1 text-xs text-rose-500' : 'top-3.5 text-sm text-slate-400'}`}>Subject</label>
                                <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)} className="input-focus w-full px-4 pt-6 pb-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                            </div>
                            <div className="relative">
                                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message ? 'top-1 text-xs text-rose-500' : 'top-3.5 text-sm text-slate-400'}`}>Message</label>
                                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} className="input-focus w-full px-4 pt-6 pb-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none" />
                            </div>
                            <button type="submit" className="group w-full py-4 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                                <Icon name="send" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                Send Message
                            </button>
                        </form>
                    )}
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
