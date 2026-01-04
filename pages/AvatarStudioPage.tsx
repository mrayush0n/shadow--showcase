
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface AvatarStudioPageProps {
    onNavigate: (page: string) => void;
}

export const AvatarStudioPage: React.FC<AvatarStudioPageProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<'generate' | 'style'>('generate');
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState('realistic');
    const [isGenerating, setIsGenerating] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);

    const styles = [
        { id: 'realistic', label: 'Realistic', icon: 'person' },
        { id: 'cartoon', label: 'Cartoon', icon: 'face' },
        { id: 'anime', label: 'Anime', icon: 'star' },
        { id: '3d', label: '3D Render', icon: 'view_in_ar' },
    ];

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setAvatar('generated');
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-slate-50 dark:from-slate-950 dark:via-pink-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                        <Icon name="face" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Avatar Studio</h1>
                        <p className="text-slate-500">Generate AI avatars and profile pictures</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Describe Your Avatar</h2>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A professional headshot of a young woman with dark hair..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none mb-4" />

                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Style</p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {styles.map(s => (
                                <button key={s.id} onClick={() => setStyle(s.id)} className={`flex items-center gap-2 p-3 rounded-xl ${style === s.id ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                    <Icon name={s.icon} /> {s.label}
                                </button>
                            ))}
                        </div>

                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isGenerating ? <><Icon name="sync" className="animate-spin" /> Generating...</> : <><Icon name="auto_awesome" /> Generate Avatar</>}
                        </button>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Preview</h2>
                        <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center">
                            {avatar ? (
                                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                    <Icon name="face" className="text-white text-7xl" />
                                </div>
                            ) : (
                                <div className="text-center text-slate-400"><Icon name="face" className="text-6xl mb-2 opacity-30" /><p>Your avatar will appear here</p></div>
                            )}
                        </div>
                        {avatar && (
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 py-2 bg-pink-500 text-white rounded-xl font-medium">Download</button>
                                <button className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-medium">Variations</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
