
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface AiTranslatorPageProps {
    onNavigate: (page: string) => void;
}

export const AiTranslatorPage: React.FC<AiTranslatorPageProps> = ({ onNavigate }) => {
    const [sourceText, setSourceText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('es');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const languages = [
        { code: 'auto', name: 'Auto Detect' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ar', name: 'Arabic' },
        { code: 'pt', name: 'Portuguese' },
    ];

    const handleTranslate = () => {
        if (!sourceText.trim()) return;
        setIsTranslating(true);
        setTimeout(() => {
            setTranslatedText(`[Translated to ${languages.find(l => l.code === targetLang)?.name}]\n\n${sourceText}`);
            setIsTranslating(false);
        }, 1500);
    };

    const swapLanguages = () => {
        if (sourceLang !== 'auto') {
            const temp = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(temp);
            setSourceText(translatedText);
            setTranslatedText(sourceText);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <Icon name="translate" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Translator</h1>
                        <p className="text-slate-500">Translate text with cultural context in 100+ languages</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                    {/* Source */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium">
                                {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                            </select>
                            <button className="p-2 text-slate-400 hover:text-blue-500"><Icon name="mic" /></button>
                        </div>
                        <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} rows={8} placeholder="Enter text to translate..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none text-lg" />
                        <p className="text-sm text-slate-400 mt-2">{sourceText.length} characters</p>
                    </div>

                    {/* Swap Button */}
                    <button onClick={swapLanguages} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors hidden lg:flex">
                        <Icon name="swap_horiz" />
                    </button>

                    {/* Target */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium">
                                {languages.filter(l => l.code !== 'auto').map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                            </select>
                            <button className="p-2 text-slate-400 hover:text-blue-500"><Icon name="volume_up" /></button>
                        </div>
                        <div className="min-h-[200px] px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {translatedText || <span className="text-slate-400">Translation will appear here...</span>}
                        </div>
                        {translatedText && (
                            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                                <Icon name="content_copy" /> Copy
                            </button>
                        )}
                    </div>
                </div>

                <button onClick={handleTranslate} disabled={isTranslating} className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg">
                    {isTranslating ? <><Icon name="sync" className="animate-spin" /> Translating...</> : <><Icon name="translate" /> Translate</>}
                </button>
            </div>
        </div>
    );
};
