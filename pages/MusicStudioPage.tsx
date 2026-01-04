
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface MusicStudioPageProps {
    onNavigate: (page: string) => void;
}

type MusicMode = 'generate' | 'stems';

export const MusicStudioPage: React.FC<MusicStudioPageProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<MusicMode>('generate');
    const [prompt, setPrompt] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
    const [stems, setStems] = useState<{ vocals: string; instruments: string } | null>(null);

    const genres = ['Ambient', 'Electronic', 'Classical', 'Jazz', 'Rock', 'Lo-Fi', 'Cinematic', 'Pop'];
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm', 'Epic', 'Mysterious', 'Romantic'];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedAudio('/demo-audio.mp3'); // Placeholder
        }, 3000);
    };

    const handleStemSplit = async () => {
        if (!audioFile) return;
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
            setStems({
                vocals: '/demo-vocals.mp3',
                instruments: '/demo-instruments.mp3'
            });
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <Icon name="music_note" className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Music Studio</h1>
                            <p className="text-slate-500">Create and manipulate audio with AI</p>
                        </div>
                    </div>
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setMode('generate')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${mode === 'generate' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Icon name="auto_awesome" />
                        Text-to-Music
                    </button>
                    <button
                        onClick={() => setMode('stems')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${mode === 'stems' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Icon name="call_split" />
                        Stem Splitter
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8">
                    {mode === 'generate' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Describe your music
                                </label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={3}
                                    placeholder="A calm lo-fi beat with soft piano and rain sounds..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Genre</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mood</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                                        {moods.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                                <div className="flex gap-2">
                                    {['15s', '30s', '60s', '2min'].map(d => (
                                        <button key={d} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-purple-500/20 hover:text-purple-500 transition-all">
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Icon name="sync" className="animate-spin" />
                                        Generating Music...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="music_note" />
                                        Generate Music
                                    </>
                                )}
                            </button>

                            {generatedAudio && (
                                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-3 font-medium">Generated Audio</p>
                                    <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                        <div className="flex items-center gap-1">
                                            {[...Array(30)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 bg-purple-500 rounded-full animate-pulse"
                                                    style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.05}s` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button className="flex-1 py-2 bg-purple-500 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                                            <Icon name="play_arrow" /> Play
                                        </button>
                                        <button className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-medium flex items-center justify-center gap-2">
                                            <Icon name="download" /> Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Upload Audio File
                                </label>
                                <div
                                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                                    onClick={() => document.getElementById('audio-upload')?.click()}
                                >
                                    <input
                                        type="file"
                                        id="audio-upload"
                                        accept="audio/*"
                                        className="hidden"
                                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    />
                                    <Icon name="upload_file" className="text-4xl text-slate-400 mb-3" />
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {audioFile ? audioFile.name : 'Click to upload or drag & drop'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">MP3, WAV, FLAC (max 50MB)</p>
                                </div>
                            </div>

                            <button
                                onClick={handleStemSplit}
                                disabled={isGenerating || !audioFile}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Icon name="sync" className="animate-spin" />
                                        Separating Stems...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="call_split" />
                                        Split into Stems
                                    </>
                                )}
                            </button>

                            {stems && (
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon name="mic" className="text-pink-500" />
                                            <span className="font-medium text-slate-900 dark:text-white">Vocals</span>
                                        </div>
                                        <button className="w-full py-2 bg-pink-500 text-white rounded-lg flex items-center justify-center gap-2">
                                            <Icon name="download" /> Download
                                        </button>
                                    </div>
                                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon name="piano" className="text-purple-500" />
                                            <span className="font-medium text-slate-900 dark:text-white">Instruments</span>
                                        </div>
                                        <button className="w-full py-2 bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2">
                                            <Icon name="download" /> Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
