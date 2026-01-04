
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface GalleryPageProps {
    onNavigate: (page: string) => void;
}

interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    prompt: string;
    author: { name: string; avatar: string };
    likes: number;
    comments: number;
    createdAt: Date;
    liked: boolean;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
    const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
    const [items, setItems] = useState<GalleryItem[]>([
        { id: '1', type: 'image', url: '', prompt: 'A futuristic cityscape at sunset with flying cars', author: { name: 'Sarah Chen', avatar: 'SC' }, likes: 234, comments: 45, createdAt: new Date(), liked: false },
        { id: '2', type: 'image', url: '', prompt: 'A magical forest with glowing mushrooms and fairies', author: { name: 'Alex Rivera', avatar: 'AR' }, likes: 189, comments: 32, createdAt: new Date(), liked: true },
        { id: '3', type: 'video', url: '', prompt: 'A robot learning to dance in a neon-lit room', author: { name: 'James Wilson', avatar: 'JW' }, likes: 456, comments: 78, createdAt: new Date(), liked: false },
        { id: '4', type: 'image', url: '', prompt: 'An underwater kingdom with bioluminescent creatures', author: { name: 'Maria Garcia', avatar: 'MG' }, likes: 312, comments: 56, createdAt: new Date(), liked: false },
        { id: '5', type: 'image', url: '', prompt: 'A steampunk airship flying through clouds', author: { name: 'David Kim', avatar: 'DK' }, likes: 278, comments: 41, createdAt: new Date(), liked: true },
        { id: '6', type: 'video', url: '', prompt: 'A phoenix rising from flames in slow motion', author: { name: 'Emma Johnson', avatar: 'EJ' }, likes: 523, comments: 89, createdAt: new Date(), liked: false },
    ]);

    const handleLike = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 } : item
        ));
    };

    const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter.slice(0, -1) as 'image' | 'video');

    const gradients = [
        'from-rose-500 to-pink-500',
        'from-violet-500 to-purple-500',
        'from-sky-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-indigo-500 to-blue-500',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-50 dark:from-slate-950 dark:via-rose-950/20 dark:to-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <Icon name="collections" className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Community Gallery</h1>
                            <p className="text-slate-500">Explore amazing AI creations from the community</p>
                        </div>
                    </div>
                    <button className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                        <Icon name="add_photo_alternate" />
                        Share Creation
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8">
                    {(['all', 'images', 'videos'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl font-medium transition-all capitalize ${filter === f ? 'bg-rose-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, i) => (
                        <div
                            key={item.id}
                            className="group bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                        >
                            {/* Media Preview */}
                            <div className={`aspect-square bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center relative`}>
                                <Icon name={item.type === 'video' ? 'movie' : 'image'} className="text-white/50 text-6xl" />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                                            <Icon name="play_arrow" className="text-white text-3xl ml-1" />
                                        </div>
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button className="p-3 bg-white/20 backdrop-blur rounded-xl text-white hover:bg-white/30 transition-colors">
                                        <Icon name="fullscreen" />
                                    </button>
                                    <button className="p-3 bg-white/20 backdrop-blur rounded-xl text-white hover:bg-white/30 transition-colors">
                                        <Icon name="content_copy" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3">{item.prompt}</p>

                                {/* Author */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {item.author.avatar}
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.author.name}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleLike(item.id)}
                                            className={`flex items-center gap-1 text-sm ${item.liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'} transition-colors`}
                                        >
                                            <Icon name={item.liked ? 'favorite' : 'favorite_border'} />
                                            {item.likes}
                                        </button>
                                        <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-sky-500 transition-colors">
                                            <Icon name="chat_bubble_outline" />
                                            {item.comments}
                                        </button>
                                    </div>
                                </div>

                                {/* Remix Button */}
                                <button className="mt-3 w-full py-2 bg-rose-500/10 text-rose-500 rounded-lg text-sm font-medium hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2">
                                    <Icon name="sync" />
                                    Remix This Prompt
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
