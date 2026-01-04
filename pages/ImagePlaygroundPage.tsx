
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { aiService } from '../services/ai';
import { Spinner } from '../components/Spinner';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import firebase from 'firebase/compat/app';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Activity } from '../types';
import { fileToBase64, dataUrlToBlob } from '../utils/fileUtils';
import { HistoryPanel } from '../components/HistoryPanel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

type Tab = 'generate' | 'analyze' | 'edit';

const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'generate', label: 'Generate', icon: 'auto_awesome' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'analyze', label: 'Analyze', icon: 'search' },
];

export const ImagePlaygroundPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('generate');
    const [error, setError] = useState<string | null>(null);

    // Shared State
    const [prompt, setPrompt] = useState('');
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<Activity[]>([]);


    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch history based on tab
    useEffect(() => {
        if (!user) return;
        const typeMap = { generate: 'image-generation', analyze: 'image-analysis', edit: 'image-editor' };
        const q = db.collection('activities').where('userId', '==', user.uid).where('type', '==', typeMap[activeTab]).orderBy('createdAt', 'desc');
        const unsub = q.onSnapshot(snap => setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity))));
        return () => unsub();
    }, [user, activeTab]);

    const handleGenerate = async () => {
        if (!prompt.trim() || !user) return;
        setIsLoading(true); setError(null);
        try {
            // Call Backend API
            const response = await aiService.generateImage(prompt, 'realistic'); // Using 'realistic' as default equivalent to 'gemini-2.0-flash-exp'

            if (response.imageData) {
                const imgUrl = `data:${response.mimeType};base64,${response.imageData}`;
                setMainImage(imgUrl);
                await db.collection('activities').add({ userId: user.uid, type: 'image-generation', createdAt: firebase.firestore.FieldValue.serverTimestamp(), data: { prompt, outputImageUrl: imgUrl } });
            } else {
                throw new Error("Image generation failed.");
            }
        } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    };

    const handleAnalyze = async () => {
        if (!uploadFile || !prompt.trim() || !user) return;
        setIsLoading(true);
        try {
            const b64 = await fileToBase64(uploadFile);

            // Call Backend API
            const response = await aiService.analyzeImage(b64, uploadFile.type, prompt);

            alert(response.result); // Assuming backend analyzeImage returns { result: string } wrapper in routes/ai.ts? 
            // Checking routes/ai.ts: res.json({ result: await analyzeImage(...) }) -> correct.

            await db.collection('activities').add({ userId: user.uid, type: 'image-analysis', createdAt: firebase.firestore.FieldValue.serverTimestamp(), data: { prompt, resultText: response.result, inputImageUrl: mainImage } });
        } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    };

    const handleEdit = async () => {
        if (!uploadFile || !prompt.trim()) return;
        setIsLoading(true);
        try {
            const b64 = await fileToBase64(uploadFile);

            // Call Backend API
            const response = await aiService.editImage(b64, uploadFile.type, prompt);

            if (response.imageData) {
                const imgUrl = `data:${response.mimeType};base64,${response.imageData}`;
                setMainImage(imgUrl);
            }
        } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) { setUploadFile(f); setMainImage(URL.createObjectURL(f)); }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
            {/* Left Control Panel */}
            <GlassCard className="w-full lg:w-96 p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                        <Icon name="palette" className="text-white text-xl" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Image Studio
                    </h1>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`
                flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2
                ${activeTab === t.id
                                    ? 'bg-white dark:bg-slate-700 shadow text-rose-600 dark:text-rose-400'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }
              `}
                        >
                            <Icon name={t.icon} className="text-sm" />
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Upload Zone (for edit/analyze) */}
                {activeTab !== 'generate' && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition-all group"
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        <Icon name="cloud_upload" className="text-3xl text-slate-400 group-hover:text-rose-500 transition-colors" />
                        <span className="text-xs text-slate-500 mt-2 font-medium group-hover:text-rose-500 transition-colors">
                            UPLOAD SOURCE IMAGE
                        </span>
                    </div>
                )}

                {/* Prompt Input */}
                <div className="space-y-2 flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={activeTab === 'generate' ? "Describe the image you want to create..." : "Describe the edit or ask a question..."}
                        className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none transition-all"
                    />
                </div>



                {/* Action Button */}
                <button
                    onClick={activeTab === 'generate' ? handleGenerate : activeTab === 'edit' ? handleEdit : handleAnalyze}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    {isLoading ? <Spinner size="sm" /> : <Icon name="auto_awesome" />}
                    {isLoading ? 'Processing...' : tabs.find(t => t.id === activeTab)?.label.toUpperCase()}
                </button>

                {/* Error Display */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-xs">
                        <Icon name="error" className="flex-shrink-0" />
                        {error}
                    </div>
                )}
            </GlassCard>

            {/* Right Canvas Area */}
            <div className="flex-1 bg-slate-200/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center overflow-hidden relative shadow-inner">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgb(148, 163, 184) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                {mainImage ? (
                    <div className="relative group shadow-2xl rounded-xl overflow-hidden max-h-[90%] max-w-[90%]">
                        <img src={mainImage} alt="Generated" className="max-w-full max-h-full object-contain" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <a
                                href={mainImage}
                                download="generated-image.jpg"
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
                            >
                                <Icon name="download" />
                                Download
                            </a>
                            <button
                                onClick={() => setMainImage(null)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-full font-semibold hover:scale-105 transition-transform"
                            >
                                <Icon name="close" />
                                Clear
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-40">
                        <Icon name="image" className="text-7xl mb-4" />
                        <p className="text-lg font-semibold">Canvas Empty</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {activeTab === 'generate' ? 'Generate an image to see it here' : 'Upload an image to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Mini History Sidebar (Hidden on mobile) */}
            <div className="hidden xl:flex flex-col w-28 h-full gap-3 overflow-y-auto pr-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center mb-1">History</p>
                {history.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center">No history</p>
                ) : (
                    history.slice(0, 10).map((h, i) => (
                        <div
                            key={h.id || i}
                            onClick={() => { setPrompt(h.data.prompt || ''); setMainImage(h.data.outputImageUrl || h.data.inputImageUrl); }}
                            className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-rose-500 hover:ring-2 ring-rose-500/30 transition-all shadow-sm"
                        >
                            <img src={h.data.outputImageUrl || h.data.inputImageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
