
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface LiveDemoPageProps {
    onBack: () => void;
    onLogin: () => void;
    onExplore: () => void;
}

type DemoTool = 'image' | 'text' | 'code';

export const LiveDemoPage: React.FC<LiveDemoPageProps> = ({ onBack, onLogin, onExplore }) => {
    const { theme, setTheme } = useTheme();
    const [activeTool, setActiveTool] = useState<DemoTool>('image');
    const [imagePrompt, setImagePrompt] = useState('');
    const [textInput, setTextInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [outputReady, setOutputReady] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const themeOptions = [
        { id: 'light', icon: 'light_mode' },
        { id: 'dark', icon: 'dark_mode' },
        { id: 'system', icon: 'contrast' },
    ] as const;

    const tools = [
        { id: 'image' as DemoTool, icon: 'palette', title: 'Image Studio', gradient: 'from-rose-500 to-pink-500' },
        { id: 'text' as DemoTool, icon: 'edit_note', title: 'Text Playground', gradient: 'from-sky-500 to-cyan-500' },
        { id: 'code' as DemoTool, icon: 'code', title: 'Code Assistant', gradient: 'from-emerald-500 to-teal-500' },
    ];

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setOutputReady(true);
        }, 2000);
    };

    const demoOutputs = {
        image: (
            <div className="relative aspect-square w-full max-w-sm mx-auto bg-gradient-to-br from-rose-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Qzkyc0IiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwSDZ2LTJoMjZ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
                <div className="text-center p-6">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-violet-500 rounded-2xl flex items-center justify-center animate-pulse">
                        <Icon name="image" className="text-white text-4xl" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">AI-generated image preview</p>
                    <p className="text-rose-500 text-xs mt-2">Sign up to generate real images!</p>
                </div>
            </div>
        ),
        text: (
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-sky-500">AI Summary:</span> Your text has been analyzed and summarized. The key points include improved readability, clear structure, and engaging content...
                </p>
                <p className="text-sky-500 text-xs mt-4">Sign up to see full AI-powered text transformations!</p>
            </div>
        ),
        code: (
            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <pre className="text-emerald-400">
                    {`// Code Assistant Output
function optimizedCode() {
  // Bug detected and fixed
  return result;
}`}
                </pre>
                <p className="text-emerald-500 text-xs mt-4">Sign up for full code analysis!</p>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[150px]" />
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
                .animate-spin { animation: spin 1s linear infinite; }
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
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto text-center animate-slideUp">
                    <span className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 block">Live Demo</span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">Try Before You Sign Up</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Experience our AI tools with a quick interactive preview.</p>
                </div>
            </section>

            {/* Tool Selector */}
            <section className="relative z-10 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center gap-3 mb-8">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => { setActiveTool(tool.id); setOutputReady(false); }}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTool === tool.id
                                        ? `bg-gradient-to-r ${tool.gradient} text-white shadow-xl scale-105`
                                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:scale-105'
                                    }`}
                            >
                                <Icon name={tool.icon} />
                                <span className="hidden sm:inline">{tool.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Demo Interface */}
                    <div className="animate-slideUp bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8">
                        {activeTool === 'image' && (
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Describe your image:</label>
                                <input
                                    type="text"
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                    placeholder="A futuristic city at sunset with flying cars..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                                />
                            </div>
                        )}

                        {activeTool === 'text' && (
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter text to summarize:</label>
                                <textarea
                                    rows={4}
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Paste your article or long text here..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                                />
                            </div>
                        )}

                        {activeTool === 'code' && (
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Paste code to analyze:</label>
                                <textarea
                                    rows={4}
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    placeholder="function buggyCode() { ... }"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none font-mono text-sm"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-rose-500 to-violet-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Icon name="sync" className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Icon name="auto_awesome" />
                                    Generate Preview
                                </>
                            )}
                        </button>

                        {outputReady && (
                            <div className="mt-8 animate-slideUp">
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Preview Output:</h3>
                                {demoOutputs[activeTool]}
                                <div className="mt-6 text-center">
                                    <button onClick={onExplore} className="px-8 py-3 bg-gradient-to-r from-violet-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                        Sign Up to Unlock Full Features
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">This is just a preview. Sign up to access:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Full Image Generation', 'Video Creation', 'Voice Chat', 'Trip Planning', 'Unlimited Usage'].map((feature, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-lg">
                                {feature}
                            </span>
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
