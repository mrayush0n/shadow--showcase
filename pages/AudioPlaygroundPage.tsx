
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { aiService } from '../services/ai';

export const AudioPlaygroundPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'transcription' | 'tts'>('transcription');

    // Transcription
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // TTS
    const [ttsText, setTtsText] = useState('');
    const [isTtsLoading, setIsTtsLoading] = useState(false);
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const startRecording = async () => {
        if (isRecording) return;
        setTranscriptionError(null); setTranscription('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // or audio/webm
                // Convert blob to base64
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = (reader.result as string).split(',')[1];
                    try {
                        setTranscription("Transcribing...");
                        const response = await aiService.transcribeAudio(base64Audio, 'audio/wav'); // mimetype might need adjustment based on browser
                        setTranscription(response.result);
                    } catch (e: any) {
                        setTranscriptionError("Transcription failed: " + e.message);
                        setTranscription("Error.");
                    }
                };
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (e) {
            setTranscriptionError("Microphone access failed.");
            setIsRecording(false);
        }
    };

    useEffect(() => { return () => { if (isRecording) stopRecording(); } }, [isRecording, stopRecording]);

    const handleTts = async () => {
        if (!ttsText.trim()) return;
        setIsTtsLoading(true); setTtsError(null); setAudioUrl(null);
        try {
            const audioBlob = await aiService.generateSpeech(ttsText);
            setAudioUrl(URL.createObjectURL(audioBlob));
        } catch (e) { setTtsError("TTS Failed."); } finally { setIsTtsLoading(false); }
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
                <h1 className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500"><Icon name="graphic_eq" /> Audio Lab</h1>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button onClick={() => setActiveTab('transcription')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'transcription' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>Transcribe</button>
                    <button onClick={() => setActiveTab('tts')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'tts' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>TTS</button>
                </div>

                {activeTab === 'transcription' ? (
                    <div className="flex-1 flex flex-col justify-center items-center gap-6">
                        <button onClick={isRecording ? stopRecording : startRecording} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isRecording ? 'bg-red-500 animate-pulse ring-4 ring-red-500/30' : 'bg-indigo-600 hover:bg-indigo-500 ring-4 ring-indigo-600/30'}`}>
                            <Icon name={isRecording ? 'stop' : 'mic'} className="text-5xl text-white" />
                        </button>
                        <p className="text-center text-gray-500 text-sm font-medium">{isRecording ? "LISTENING..." : "TAP TO RECORD"}</p>
                        {transcriptionError && <p className="text-red-500 text-xs">{transcriptionError}</p>}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-4">
                        <textarea value={ttsText} onChange={e => setTtsText(e.target.value)} placeholder="Enter text to speak..." className="flex-1 w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={handleTts} disabled={isTtsLoading || !ttsText.trim()} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 disabled:opacity-50 flex justify-center items-center gap-2">
                            {isTtsLoading ? <Spinner /> : <Icon name="volume_up" />} Speak
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-white/40 dark:bg-black/40 backdrop-blur rounded-3xl border border-white/10 p-8 shadow-inner overflow-hidden relative flex flex-col">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 relative z-10">Output Stream</h3>
                {activeTab === 'transcription' ? (
                    <div className="flex-1 font-mono text-lg text-gray-800 dark:text-gray-200 overflow-y-auto relative z-10">
                        {transcription || <span className="opacity-30">Waiting for audio input...</span>}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-6">
                        {isTtsLoading ? (
                            <div className="text-indigo-500"><Icon name="graphic_eq" className="text-6xl" /></div>
                        ) : audioUrl ? (
                            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
                                <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Icon name="music_note" className="text-5xl text-white" />
                                </div>
                                <audio controls src={audioUrl} className="w-72" />
                                <a href={audioUrl} download="shadow-tts-audio.wav" className="flex items-center gap-2 px-6 py-2 bg-white text-indigo-600 rounded-full font-bold hover:bg-gray-100 transition-colors shadow">
                                    <Icon name="download" /> Download WAV
                                </a>
                            </div>
                        ) : (
                            <Icon name="campaign" className="text-9xl text-gray-300 dark:text-gray-700" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
