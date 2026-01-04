
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface MemeGeneratorPageProps {
    onNavigate: (page: string) => void;
}

const memeTemplates = [
    { id: 'drake', name: 'Drake Hotline', preview: '🎤' },
    { id: 'distracted', name: 'Distracted BF', preview: '👀' },
    { id: 'twobuttons', name: 'Two Buttons', preview: '🔘' },
    { id: 'changemy', name: 'Change My Mind', preview: '☕' },
    { id: 'expanding', name: 'Expanding Brain', preview: '🧠' },
    { id: 'success', name: 'Success Kid', preview: '✊' },
];

export const MemeGeneratorPage: React.FC<MemeGeneratorPageProps> = ({ onNavigate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('drake');
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [memeReady, setMemeReady] = useState(false);

    const handleGenerate = () => {
        if (!topText.trim() && !bottomText.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setMemeReady(true);
            setIsGenerating(false);
        }, 2000);
    };

    const handleAISuggest = () => {
        setTopText('When you finally fix a bug');
        setBottomText('And create 10 more bugs');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/30 to-slate-50 dark:from-slate-950 dark:via-yellow-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Icon name="sentiment_very_satisfied" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Meme Generator</h1>
                        <p className="text-slate-500">Create viral memes with AI suggestions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Template Selection */}
                        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Choose Template</h2>
                            <div className="grid grid-cols-3 gap-2">
                                {memeTemplates.map(t => (
                                    <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl text-center transition-all ${selectedTemplate === t.id ? 'bg-yellow-500 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                        <span className="text-2xl block mb-1">{t.preview}</span>
                                        <span className="text-xs font-medium">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-900 dark:text-white">Meme Text</h2>
                                <button onClick={handleAISuggest} className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm rounded-lg flex items-center gap-1">
                                    <Icon name="auto_awesome" className="text-sm" /> AI Suggest
                                </button>
                            </div>
                            <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Top text..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-3" />
                            <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Bottom text..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" />
                            <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                {isGenerating ? <><Icon name="sync" className="animate-spin" /> Creating...</> : <><Icon name="sentiment_very_satisfied" /> Generate Meme</>}
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Preview</h2>
                        <div className="aspect-square bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                            {memeReady ? (
                                <>
                                    <div className="absolute top-4 left-0 right-0 text-center">
                                        <p className="text-xl font-black text-white drop-shadow-lg uppercase" style={{ textShadow: '2px 2px 0 #000' }}>{topText}</p>
                                    </div>
                                    <span className="text-8xl">{memeTemplates.find(t => t.id === selectedTemplate)?.preview}</span>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <p className="text-xl font-black text-white drop-shadow-lg uppercase" style={{ textShadow: '2px 2px 0 #000' }}>{bottomText}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Icon name="sentiment_very_satisfied" className="text-6xl mb-3 opacity-30" />
                                    <p>Your meme will appear here</p>
                                </div>
                            )}
                        </div>
                        {memeReady && (
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 py-2 bg-yellow-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"><Icon name="download" /> Download</button>
                                <button className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-medium flex items-center justify-center gap-2"><Icon name="share" /> Share</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
