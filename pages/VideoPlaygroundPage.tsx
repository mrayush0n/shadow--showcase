
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { fileToBase64 } from '../utils/fileUtils';
import { aiService } from '../services/ai';

type Tab = 'generation' | 'analysis';
type AspectRatio = '16:9' | '9:16';

const loadingMessages = [
    "Configuring Veo 3.1 parameters...", "Simulating physics engine...", "Rendering volumetric light...",
    "Composing digital score...", "Finalizing frame interpolation...", "Polishing pixels..."
];

export const VideoPlaygroundPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('generation');
    const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini-api-key-video'));
    const [tempApiKey, setTempApiKey] = useState('');

    // Generation State
    const [genMode, setGenMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
    const [genPrompt, setGenPrompt] = useState('');
    const [genImage, setGenImage] = useState<File | null>(null);
    const [genImagePreview, setGenImagePreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGenLoading, setIsGenLoading] = useState(false);
    const [genError, setGenError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const genFileInputRef = useRef<HTMLInputElement>(null);

    // Analysis State
    const [analysisVideo, setAnalysisVideo] = useState<File | null>(null);
    const [analysisPreview, setAnalysisPreview] = useState<string | null>(null);
    const [analysisPrompt, setAnalysisPrompt] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [analysisStatus, setAnalysisStatus] = useState('');
    const analysisInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleSaveKey = () => {
        if (tempApiKey.trim()) {
            localStorage.setItem('gemini-api-key-video', tempApiKey.trim());
            setApiKey(tempApiKey.trim());
        }
    };

    const handleGenerate = async () => {
        if (!genPrompt.trim() || (genMode === 'image-to-video' && !genImage)) return;
        setIsGenLoading(true); setGenError(null); setVideoUrl(null);

        const msgInterval = setInterval(() => {
            setLoadingMessage(prev => loadingMessages[(loadingMessages.indexOf(prev) + 1) % loadingMessages.length]);
        }, 4000);

        try {
            const imageBase64 = genMode === 'image-to-video' && genImage ? await fileToBase64(genImage) : undefined;

            // Call Backend API
            const videoBlob = await aiService.generateVideo(genPrompt, imageBase64, genImage?.type, aspectRatio);

            setVideoUrl(URL.createObjectURL(videoBlob));

        } catch (e: any) {
            setGenError(e.message || "Generation failed.");
        } finally {
            setIsGenLoading(false); clearInterval(msgInterval);
        }
    };

    // Helper to capture frames for analysis
    const captureFrames = async (): Promise<string[]> => {
        return new Promise((resolve) => {
            if (!videoRef.current || !canvasRef.current || !analysisVideo) { resolve([]); return; }
            const video = videoRef.current; const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
            const frames: string[] = [];
            let count = 0; const maxFrames = 10;

            video.onloadeddata = () => {
                canvas.width = video.videoWidth; canvas.height = video.videoHeight;
                const interval = video.duration / maxFrames;
                const seek = (time: number) => { video.currentTime = time; };

                video.onseeked = () => {
                    if (count < maxFrames && ctx) {
                        ctx.drawImage(video, 0, 0);
                        frames.push(canvas.toDataURL('image/jpeg').split(',')[1]);
                        count++; setAnalysisStatus(`Extracting frame ${count}/${maxFrames}...`);
                        if (count < maxFrames) seek(count * interval);
                        else resolve(frames);
                    }
                };
                seek(0);
            };
        });
    };

    const handleAnalyze = async () => {
        if (!analysisVideo || !analysisPrompt.trim()) return;
        setIsAnalysisLoading(true); setAnalysisResult('');
        try {
            const frames = await captureFrames();
            setAnalysisStatus('Analyzing visual data...');

            // Prepare parts for backend
            const parts = frames.map(f => ({ mimeType: 'image/jpeg', data: f }));

            // Call Backend API
            const response = await aiService.processMultimodal(parts, analysisPrompt);

            setAnalysisResult(response.result);
        } catch (e) {
            console.error(e);
            setAnalysisResult("Analysis failed. Please try again.");
        } finally {
            setIsAnalysisLoading(false); setAnalysisStatus('');
        }
    };

    if (!apiKey) return (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
            <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-400"><Icon name="key" className="text-4xl" /></div>
                <h2 className="text-2xl font-bold text-white">Veo Access Required</h2>
                <p className="text-gray-400 text-sm">Video generation requires a separate API key due to billing.</p>
                <input type="password" value={tempApiKey} onChange={e => setTempApiKey(e.target.value)} placeholder="Paste Gemini API Key" className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
                <button onClick={handleSaveKey} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors">Unlock Studio</button>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Cinematic Header */}
            <div className="relative overflow-hidden rounded-3xl bg-black border border-gray-800 h-48 flex items-center px-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
                        <Icon name="movie_filter" className="text-blue-400" /> VEO STUDIO
                    </h1>
                </div>
                {/* Tab Switcher */}
                <div className="absolute bottom-4 right-4 flex bg-gray-900/80 backdrop-blur rounded-full p-1 border border-gray-700">
                    <button onClick={() => setActiveTab('generation')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'generation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white'}`}>GENERATE</button>
                    <button onClick={() => setActiveTab('analysis')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'analysis' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-400 hover:text-white'}`}>ANALYZE</button>
                </div>
            </div>

            {activeTab === 'generation' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 p-6 rounded-3xl space-y-5">
                            <div className="flex rounded-xl bg-black/50 p-1 border border-gray-700">
                                <button onClick={() => setGenMode('text-to-video')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${genMode === 'text-to-video' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>Text to Video</button>
                                <button onClick={() => setGenMode('image-to-video')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${genMode === 'image-to-video' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>Image to Video</button>
                            </div>

                            {genMode === 'image-to-video' && (
                                <div onClick={() => genFileInputRef.current?.click()} className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl h-32 flex items-center justify-center cursor-pointer transition-colors bg-black/30">
                                    <input type="file" ref={genFileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setGenImage(f); setGenImagePreview(URL.createObjectURL(f)); } }} className="hidden" accept="image/*" />
                                    {genImagePreview ? <img src={genImagePreview} className="h-full w-full object-contain p-2" /> : <span className="text-gray-500 text-xs">UPLOAD REFERENCE FRAME</span>}
                                </div>
                            )}

                            <textarea value={genPrompt} onChange={e => setGenPrompt(e.target.value)} placeholder="Describe the scene in detail... (e.g., A cyberpunk street at night with neon rain)" className="w-full h-32 bg-black/50 border border-gray-700 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />

                            <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Aspect Ratio</span>
                                <div className="flex gap-2">
                                    {['16:9', '9:16'].map(r => (
                                        <button key={r} onClick={() => setAspectRatio(r as AspectRatio)} className={`flex-1 py-2 border rounded-lg text-xs font-bold ${aspectRatio === r ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>{r}</button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleGenerate} disabled={isGenLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isGenLoading ? <Spinner className="text-white" /> : <Icon name="videocam" />}
                                {isGenLoading ? 'RENDERING...' : 'GENERATE VIDEO'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-black rounded-3xl border border-gray-800 aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl">
                            {isGenLoading ? (
                                <div className="text-center space-y-4 z-10">
                                    <div className="relative w-20 h-20 mx-auto">
                                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                                        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-blue-400 font-mono text-sm tracking-widest animate-pulse">{loadingMessage}</p>
                                </div>
                            ) : videoUrl ? (
                                <div className="w-full h-full relative group">
                                    <video src={videoUrl} controls autoPlay loop className="w-full h-full" />
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={videoUrl} download="generated-veo-video.mp4" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg transition-colors">
                                            <Icon name="download" /> Download
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center opacity-30">
                                    <Icon name="movie" className="text-8xl text-gray-500 mb-4" />
                                    <p className="text-gray-500 font-mono">VIEWPORT READY</p>
                                </div>
                            )}
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                        </div>
                        {genError && <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-sm flex items-center gap-2"><Icon name="warning" /> {genError}</div>}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 p-6 rounded-3xl space-y-5">
                            <div onClick={() => analysisInputRef.current?.click()} className="border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl h-40 flex items-center justify-center cursor-pointer bg-black/30">
                                <input type="file" ref={analysisInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setAnalysisVideo(f); setAnalysisPreview(URL.createObjectURL(f)); } }} className="hidden" accept="video/*" />
                                {analysisPreview ? <video src={analysisPreview} className="h-full w-full object-contain p-2" /> : <div className="text-center"><Icon name="upload" className="text-2xl text-gray-500" /><p className="text-gray-500 text-xs mt-2">UPLOAD VIDEO</p></div>}
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                            <video ref={videoRef} src={analysisPreview || ''} className="hidden" muted />

                            <input value={analysisPrompt} onChange={e => setAnalysisPrompt(e.target.value)} placeholder="Ask about the video..." className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none" />

                            <button onClick={handleAnalyze} disabled={isAnalysisLoading} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl disabled:opacity-50">
                                {isAnalysisLoading ? 'ANALYZING...' : 'ANALYZE'}
                            </button>
                            {analysisStatus && <p className="text-xs text-purple-400 text-center animate-pulse">{analysisStatus}</p>}
                        </div>
                    </div>
                    <div className="lg:col-span-8 bg-gray-900/50 border border-gray-800 rounded-3xl p-8 min-h-[300px]">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Intelligence Output</h3>
                        <div className="prose prose-invert max-w-none text-gray-300">
                            {analysisResult ? analysisResult : <span className="text-gray-700 italic">Analysis results will decrypt here...</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
