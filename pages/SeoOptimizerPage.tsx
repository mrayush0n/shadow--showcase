
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface SeoOptimizerPageProps {
    onNavigate: (page: string) => void;
}

export const SeoOptimizerPage: React.FC<SeoOptimizerPageProps> = ({ onNavigate }) => {
    const [content, setContent] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<{ type: 'success' | 'warning' | 'error'; text: string }[]>([]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setScore(72);
            setSuggestions([
                { type: 'success', text: 'Good keyword density (2.3%)' },
                { type: 'warning', text: 'Add more internal links' },
                { type: 'error', text: 'Meta description missing' },
                { type: 'warning', text: 'Consider adding more headers' },
                { type: 'success', text: 'Content length is optimal' },
            ]);
            setIsAnalyzing(false);
        }, 2500);
    };

    const getScoreColor = (s: number) => s >= 80 ? 'green' : s >= 60 ? 'amber' : 'red';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Icon name="search" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">SEO Optimizer</h1>
                        <p className="text-slate-500">Analyze and improve content for search engines</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Target keyword..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4" />
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Paste your content here..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none mb-4" />
                        <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isAnalyzing ? <><Icon name="sync" className="animate-spin" /> Analyzing...</> : <><Icon name="analytics" /> Analyze Content</>}
                        </button>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">SEO Score</h2>
                        {score !== null ? (
                            <>
                                <div className={`w-24 h-24 mx-auto rounded-full border-8 border-${getScoreColor(score)}-500 flex items-center justify-center mb-4`}>
                                    <span className={`text-3xl font-black text-${getScoreColor(score)}-500`}>{score}</span>
                                </div>
                                <ul className="space-y-2">
                                    {suggestions.map((s, i) => (
                                        <li key={i} className={`flex items-start gap-2 p-2 rounded-lg bg-${s.type === 'success' ? 'green' : s.type === 'warning' ? 'amber' : 'red'}-500/10`}>
                                            <Icon name={s.type === 'success' ? 'check_circle' : s.type === 'warning' ? 'warning' : 'error'} className={`text-${s.type === 'success' ? 'green' : s.type === 'warning' ? 'amber' : 'red'}-500 mt-0.5`} />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{s.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="text-center py-12 text-slate-400"><Icon name="analytics" className="text-5xl mb-2 opacity-30" /><p>Enter content to analyze</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
