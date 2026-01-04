
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface PodcastStudioPageProps {
    onNavigate: (page: string) => void;
}

export const PodcastStudioPage: React.FC<PodcastStudioPageProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<'text-to-podcast' | 'intro-outro'>('text-to-podcast');
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('professional');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg">
                        <Icon name="podcasts" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Podcast Studio</h1>
                        <p className="text-slate-500">Convert text to podcasts with AI voices</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {[{ id: 'text-to-podcast', label: 'Text to Podcast', icon: 'article' }, { id: 'intro-outro', label: 'Intro/Outro', icon: 'music_note' }].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${mode === m.id ? 'bg-purple-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon name={m.icon} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Paste your article, blog post, or script here..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none mb-4" />

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Voice Style</label>
                            <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="energetic">Energetic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Background Music</label>
                            <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <option>None</option>
                                <option>Ambient</option>
                                <option>Upbeat</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isGenerating ? <><Icon name="sync" className="animate-spin" /> Generating...</> : <><Icon name="podcasts" /> Generate Podcast</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
