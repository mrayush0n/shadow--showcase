import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

// ===== TESTIMONIALS CAROUSEL =====
interface Testimonial {
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
    tool: string;
}

export const TestimonialsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials: Testimonial[] = [
        { name: 'Sarah Chen', role: 'UI Designer', avatar: 'SC', content: 'Image Studio transformed my workflow. I create stunning mockups in minutes instead of hours!', rating: 5, tool: 'Image Studio' },
        { name: 'Alex Rivera', role: 'Content Creator', avatar: 'AR', content: 'The Video Studio is incredible. My social media engagement has tripled since I started using it.', rating: 5, tool: 'Video Studio' },
        { name: 'James Wilson', role: 'Software Engineer', avatar: 'JW', content: 'Code Assistant saved me countless hours of debugging. It\'s like having a senior dev on call 24/7.', rating: 5, tool: 'Code Assistant' },
        { name: 'Maria Garcia', role: 'Travel Blogger', avatar: 'MG', content: 'Trip Planner created the perfect itinerary for my Japan trip. Every detail was spot on!', rating: 5, tool: 'Trip Planner' },
        { name: 'David Kim', role: 'Marketing Manager', avatar: 'DK', content: 'Text Playground helps me create compelling copy in seconds. Game changer for our campaigns.', rating: 5, tool: 'Text Playground' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent via-rose-50/30 dark:via-rose-500/5 to-transparent">
            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
                .testimonial-active { animation: slideIn 0.5s ease-out; }
            `}</style>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold text-rose-500 uppercase tracking-wider">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-2">Loved by Creators</h2>
                </div>

                <div className="relative">
                    {/* Main Testimonial Card */}
                    <div className="testimonial-active bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 md:p-10 shadow-xl">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {testimonials[activeIndex].avatar}
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                        <Icon key={i} name="star" className="text-amber-400 text-lg" />
                                    ))}
                                </div>
                                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                    "{testimonials[activeIndex].content}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{testimonials[activeIndex].name}</p>
                                        <p className="text-sm text-slate-500">{testimonials[activeIndex].role}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-500 font-medium">
                                        {testimonials[activeIndex].tool}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-rose-500 w-8' : 'bg-slate-300 dark:bg-slate-700 hover:bg-rose-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ===== SCROLL PROGRESS INDICATOR =====
export const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (window.scrollY / totalHeight) * 100;
            setProgress(scrollProgress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-slate-200/50 dark:bg-slate-800/50">
            <div
                className="h-full bg-gradient-to-r from-rose-500 to-violet-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

// ===== COOKIE CONSENT BANNER =====
export const CookieConsent: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setTimeout(() => setVisible(true), 2000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slideUp">
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.5s ease-out; }
            `}</style>
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon name="cookie" className="text-amber-500 text-xl" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Cookie Consent</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <button onClick={handleDecline} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-xl transition-all">
                        Decline
                    </button>
                    <button onClick={handleAccept} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-violet-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===== NEWSLETTER SIGNUP =====
export const NewsletterSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
        }
    };

    return (
        <section className="relative z-10 px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-violet-500/10 to-rose-500/10 dark:from-violet-500/20 dark:to-rose-500/20 border border-violet-200 dark:border-violet-500/20 rounded-3xl p-8 md:p-10 text-center">
                    {subscribed ? (
                        <div className="animate-scaleIn">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="check" className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">You're In!</h3>
                            <p className="text-slate-600 dark:text-slate-400">Check your inbox for a welcome email.</p>
                        </div>
                    ) : (
                        <>
                            <Icon name="mail" className="text-4xl text-violet-500 mb-4" />
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Stay in the Loop</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">Get the latest AI tips, tutorials, and feature updates. No spam, ever.</p>
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    required
                                />
                                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-violet-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap">
                                    Subscribe Free
                                </button>
                            </form>
                            <p className="text-xs text-slate-500 mt-4">Join 10,000+ creators. Unsubscribe anytime.</p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

// ===== SOCIAL PROOF (PARTNER LOGOS) =====
export const SocialProof: React.FC = () => {
    const partners = [
        { name: 'TechCrunch', icon: 'newspaper' },
        { name: 'ProductHunt', icon: 'rocket_launch' },
        { name: 'Forbes', icon: 'business' },
        { name: 'Wired', icon: 'cable' },
        { name: 'The Verge', icon: 'devices' },
    ];

    return (
        <section className="relative z-10 px-6 py-12 border-y border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-5xl mx-auto">
                <p className="text-center text-sm text-slate-500 mb-6 uppercase tracking-wider">Featured In</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                    {partners.map((partner, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default group">
                            <Icon name={partner.icon} className="text-2xl group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-lg">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ===== FLOATING CHATBOT =====
interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
}

export const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', content: 'Hi! 👋 I\'m Shadow AI. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const quickReplies = ['What is Shadow Showcase?', 'How do I get started?', 'Is it free?', 'Contact support'];

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            let response = 'Thanks for your message! Our team will get back to you soon.';
            if (text.toLowerCase().includes('what is')) {
                response = 'Shadow Showcase is an all-in-one AI platform with tools for image generation, video creation, code assistance, and more!';
            } else if (text.toLowerCase().includes('started') || text.toLowerCase().includes('start')) {
                response = 'Getting started is easy! Click "Explore Free" to create your account and try all our AI tools for free.';
            } else if (text.toLowerCase().includes('free')) {
                response = 'Yes! Shadow Showcase is free to use. Some advanced features may require your own API key.';
            } else if (text.toLowerCase().includes('support') || text.toLowerCase().includes('contact')) {
                response = 'You can reach our support team at support@shadowsi.com. We typically respond within 24-48 hours.';
            }
            setMessages(prev => [...prev, { role: 'bot', content: response }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-2xl hover:shadow-rose-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center ${isOpen ? 'rotate-90' : ''}`}
            >
                <Icon name={isOpen ? 'close' : 'chat'} className="text-2xl" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-[90] w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                    <style>{`
                        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
                    `}</style>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-500 to-violet-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Icon name="smart_toy" className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold">Shadow AI</h4>
                                <p className="text-xs text-white/80">Online • Replies instantly</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-64 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white rounded-br-none'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Replies */}
                    <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800">
                        {quickReplies.map((reply, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(reply)}
                                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <button type="submit" className="w-10 h-10 bg-gradient-to-r from-rose-500 to-violet-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all">
                                <Icon name="send" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

// ===== VIDEO HERO BACKGROUND =====
export const VideoHeroBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative">
            {/* Video Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-slate-950/90 dark:via-slate-950/70 dark:to-slate-950 z-10" />
                {/* Animated gradient as video placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-violet-500/20 to-sky-500/20" style={{ animation: 'gradientShift 10s ease infinite' }} />
                <style>{`
                    @keyframes gradientShift {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                `}</style>
            </div>
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
};
