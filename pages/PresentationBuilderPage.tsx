
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface PresentationBuilderPageProps {
    onNavigate: (page: string) => void;
}

export const PresentationBuilderPage: React.FC<PresentationBuilderPageProps> = ({ onNavigate }) => {
    const [topic, setTopic] = useState('');
    const [slides, setSlides] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSlides, setGeneratedSlides] = useState<{ title: string; content: string }[]>([]);

    const handleGenerate = () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedSlides([
                { title: 'Introduction', content: 'Overview of ' + topic },
                { title: 'Key Points', content: 'Main concepts and ideas' },
                { title: 'Analysis', content: 'Deep dive into the topic' },
                { title: 'Conclusion', content: 'Summary and takeaways' },
            ]);
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 dark:from-slate-950 dark:via-orange-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                        <Icon name="slideshow" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Presentation Builder</h1>
                        <p className="text-slate-500">Generate slide decks from any topic</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Configure</h2>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic or paste content..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4" />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Slides: {slides}</label>
                            <input type="range" min="3" max="15" value={slides} onChange={(e) => setSlides(Number(e.target.value))} className="w-full" />
                        </div>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                            <option>Professional</option>
                            <option>Creative</option>
                            <option>Minimalist</option>
                        </select>
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isGenerating ? <><Icon name="sync" className="animate-spin" /> Generating...</> : <><Icon name="auto_awesome" /> Generate Slides</>}
                        </button>
                    </div>

                    <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Preview</h2>
                        {generatedSlides.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {generatedSlides.map((slide, i) => (
                                    <div key={i} className="aspect-video bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                                        <p className="text-xs text-orange-500 mb-1">Slide {i + 1}</p>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{slide.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{slide.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400">
                                <div className="text-center"><Icon name="slideshow" className="text-5xl mb-2 opacity-30" /><p>Your slides will appear here</p></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
