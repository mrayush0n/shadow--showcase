
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface PromptMarketPageProps {
    onNavigate: (page: string) => void;
}

interface Prompt {
    id: string;
    title: string;
    prompt: string;
    category: 'image' | 'video' | 'text' | 'code';
    author: string;
    uses: number;
    saved: boolean;
    tags: string[];
}

export const PromptMarketPage: React.FC<PromptMarketPageProps> = ({ onNavigate }) => {
    const [category, setCategory] = useState<'all' | 'image' | 'video' | 'text' | 'code'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [prompts, setPrompts] = useState<Prompt[]>([
        { id: '1', title: 'Cinematic Portrait', prompt: 'A cinematic portrait photo of [subject], dramatic lighting, shallow depth of field, film grain, 35mm lens', category: 'image', author: 'PromptMaster', uses: 2341, saved: false, tags: ['portrait', 'cinematic', 'photography'] },
        { id: '2', title: 'Tech Explainer Video', prompt: 'Create a 30-second explainer video showing [concept] with smooth animations, modern graphics, and upbeat background music', category: 'video', author: 'VideoWiz', uses: 1256, saved: true, tags: ['explainer', 'tech', 'animation'] },
        { id: '3', title: 'Blog Post Outline', prompt: 'Write a comprehensive blog post outline about [topic] with engaging introduction, 5 main sections with subpoints, and a call-to-action conclusion', category: 'text', author: 'ContentKing', uses: 3421, saved: false, tags: ['blog', 'content', 'marketing'] },
        { id: '4', title: 'React Component', prompt: 'Create a reusable React TypeScript component for [functionality] with props interface, error handling, loading states, and responsive styling', category: 'code', author: 'CodeNinja', uses: 1876, saved: true, tags: ['react', 'typescript', 'component'] },
        { id: '5', title: 'Fantasy Landscape', prompt: 'A breathtaking fantasy landscape with [elements], ethereal lighting, volumetric fog, highly detailed, 8k resolution, artstation trending', category: 'image', author: 'ArtGenius', uses: 4521, saved: false, tags: ['fantasy', 'landscape', 'art'] },
        { id: '6', title: 'Email Newsletter', prompt: 'Write a compelling email newsletter about [topic] with attention-grabbing subject line, personalized greeting, value-packed content, and clear CTA', category: 'text', author: 'EmailPro', uses: 2134, saved: false, tags: ['email', 'newsletter', 'marketing'] },
    ]);

    const categories = [
        { id: 'all', label: 'All Prompts', icon: 'apps' },
        { id: 'image', label: 'Image', icon: 'image', color: 'rose' },
        { id: 'video', label: 'Video', icon: 'movie', color: 'violet' },
        { id: 'text', label: 'Text', icon: 'edit_note', color: 'sky' },
        { id: 'code', label: 'Code', icon: 'code', color: 'emerald' },
    ];

    const handleSave = (id: string) => {
        setPrompts(prev => prev.map(p =>
            p.id === id ? { ...p, saved: !p.saved } : p
        ));
    };

    const handleUse = (prompt: Prompt) => {
        navigator.clipboard.writeText(prompt.prompt);
        // Increment uses
        setPrompts(prev => prev.map(p =>
            p.id === prompt.id ? { ...p, uses: p.uses + 1 } : p
        ));
    };

    const filteredPrompts = prompts
        .filter(p => category === 'all' || p.category === category)
        .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.includes(searchQuery.toLowerCase())));

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'image': return 'rose';
            case 'video': return 'violet';
            case 'text': return 'sky';
            case 'code': return 'emerald';
            default: return 'slate';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50 dark:from-slate-950 dark:via-violet-950/20 dark:to-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Icon name="storefront" className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Prompt Marketplace</h1>
                            <p className="text-slate-500">Discover and share powerful prompts</p>
                        </div>
                    </div>
                    <button className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                        <Icon name="add" />
                        Share Prompt
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search prompts by title or tag..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white shadow-lg"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id as any)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${category === cat.id ? 'bg-violet-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                            <Icon name={cat.icon} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Prompts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPrompts.map(prompt => {
                        const color = getCategoryColor(prompt.category);
                        return (
                            <div
                                key={prompt.id}
                                className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                                            <Icon name={categories.find(c => c.id === prompt.category)?.icon || 'apps'} className={`text-${color}-500`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{prompt.title}</h3>
                                            <p className="text-xs text-slate-500">by {prompt.author}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSave(prompt.id)}
                                        className={`p-2 rounded-lg transition-colors ${prompt.saved ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-500/10'}`}
                                    >
                                        <Icon name={prompt.saved ? 'bookmark' : 'bookmark_border'} />
                                    </button>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                    {prompt.prompt}
                                </p>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {prompt.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded-lg">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Icon name="trending_up" className="text-sm" />
                                        {prompt.uses.toLocaleString()} uses
                                    </span>
                                    <button
                                        onClick={() => handleUse(prompt)}
                                        className={`px-4 py-2 bg-${color}-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1`}
                                    >
                                        <Icon name="content_copy" className="text-sm" />
                                        Use Prompt
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
