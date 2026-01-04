
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface SocialMediaManagerPageProps {
    onNavigate: (page: string) => void;
}

export const SocialMediaManagerPage: React.FC<SocialMediaManagerPageProps> = ({ onNavigate }) => {
    const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'linkedin'>('instagram');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [posts, setPosts] = useState<{ text: string; hashtags: string[] }[]>([]);

    const platforms = [
        { id: 'instagram', label: 'Instagram', icon: 'photo_camera', color: 'from-pink-500 to-purple-500' },
        { id: 'twitter', label: 'Twitter/X', icon: 'tag', color: 'from-sky-500 to-blue-500' },
        { id: 'linkedin', label: 'LinkedIn', icon: 'work', color: 'from-blue-600 to-blue-800' },
    ];

    const handleGenerate = () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setPosts([
                { text: `🚀 Exciting news about ${topic}! Here's what you need to know...`, hashtags: ['#trending', '#viral', '#mustread'] },
                { text: `Did you know? ${topic} is changing the game! 💡`, hashtags: ['#tips', '#insights', '#growth'] },
                { text: `The future of ${topic} is here. Are you ready? 🔥`, hashtags: ['#innovation', '#future', '#tech'] },
            ]);
            setIsGenerating(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-slate-50 dark:from-slate-950 dark:via-pink-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Icon name="share" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Social Media Manager</h1>
                        <p className="text-slate-500">Generate posts, captions & hashtags for any platform</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {platforms.map(p => (
                        <button key={p.id} onClick={() => setPlatform(p.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${platform === p.id ? `bg-gradient-to-r ${p.color} text-white shadow-lg` : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon name={p.icon} /> {p.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Content Topic</h2>
                        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={4} placeholder="What do you want to post about? E.g., 'New product launch', 'Behind the scenes', 'Tips for success'..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none mb-4" />
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <select className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <option>Professional</option>
                                <option>Casual</option>
                                <option>Humorous</option>
                                <option>Inspirational</option>
                            </select>
                            <select className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <option>3 Posts</option>
                                <option>5 Posts</option>
                                <option>7 Posts</option>
                            </select>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isGenerating ? <><Icon name="sync" className="animate-spin" /> Generating...</> : <><Icon name="auto_awesome" /> Generate Posts</>}
                        </button>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Generated Posts</h2>
                        {posts.length > 0 ? (
                            <div className="space-y-4">
                                {posts.map((post, i) => (
                                    <div key={i} className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-200 dark:border-pink-800">
                                        <p className="text-slate-700 dark:text-slate-300 mb-2">{post.text}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {post.hashtags.map(tag => <span key={tag} className="text-xs text-pink-500 font-medium">{tag}</span>)}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button className="px-3 py-1 bg-pink-500 text-white text-xs rounded-lg">Copy</button>
                                            <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs rounded-lg">Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-slate-400"><Icon name="share" className="text-5xl opacity-30" /></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
