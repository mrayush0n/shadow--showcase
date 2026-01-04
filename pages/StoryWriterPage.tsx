
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface StoryWriterPageProps {
    onNavigate: (page: string) => void;
}

export const StoryWriterPage: React.FC<StoryWriterPageProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<'story' | 'character' | 'prompt'>('story');
    const [genre, setGenre] = useState('fantasy');
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const genres = ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Adventure', 'Drama'];

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setStory(`Chapter 1: The Beginning

The wind howled through the ancient forest as ${prompt || 'our hero'} stepped into the unknown. Little did they know that this journey would change everything...

The path ahead was shrouded in mist, each step revealing secrets that had been hidden for centuries. With determination in their heart, they pressed forward.

"There's no turning back now," they whispered to themselves, gripping their resolve as tightly as the worn map in their hands.

[Story continues based on your genre: ${genre}]`);
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Icon name="auto_stories" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Story Writer</h1>
                        <p className="text-slate-500">Generate stories, characters & creative writing</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {[{ id: 'story', label: 'Write Story', icon: 'auto_stories' }, { id: 'character', label: 'Character', icon: 'person' }, { id: 'prompt', label: 'Prompts', icon: 'lightbulb' }].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium ${mode === m.id ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon name={m.icon} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Genre</label>
                                <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    {genres.map(g => <option key={g} value={g.toLowerCase()}>{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Story Idea</label>
                                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} placeholder="A young wizard discovers a hidden realm..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Length</label>
                                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <option>Short (500 words)</option>
                                    <option>Medium (1000 words)</option>
                                    <option>Long (2000+ words)</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isGenerating ? <><Icon name="sync" className="animate-spin" /> Writing...</> : <><Icon name="edit" /> Generate Story</>}
                        </button>
                    </div>

                    <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-900 dark:text-white">Your Story</h2>
                            {story && <button className="px-3 py-1 bg-amber-500 text-white text-sm rounded-lg flex items-center gap-1"><Icon name="content_copy" className="text-sm" /> Copy</button>}
                        </div>
                        {story ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-base leading-relaxed font-serif bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl">{story}</pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400">
                                <div className="text-center"><Icon name="auto_stories" className="text-6xl mb-3 opacity-30" /><p>Your story will appear here</p></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
