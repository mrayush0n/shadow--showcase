
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icon';
import { aiService } from '../services/ai';

export const VoiceChatPage: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

    const sessionRef = useRef<Promise<any> | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const outCtxRef = useRef<AudioContext | null>(null);
    const nextTimeRef = useRef(0);

    const stop = useCallback(() => {
        if ((window as any).currentMediaRecorder && (window as any).currentMediaRecorder.state !== 'inactive') {
            (window as any).currentMediaRecorder.stop();
        }
        // Cleaner cleanup? ideally use refs, but patching quickly for now.
        setIsRecording(false);
        // Note: aiState reset happens in onended or catch
    }, []);

    const start = async () => {
        if (isRecording) return;
        setIsRecording(true); setError(null); setAiState('listening'); setLiveTranscript('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/mp4';
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

            mediaRecorder.onstop = async () => {
                setAiState('thinking');
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = (reader.result as string).split(',')[1];
                    try {
                        // Call Backend Pipeline
                        const response = await aiService.voiceChat(base64Audio, mimeType, []); // History can be managed here if needed

                        setLiveTranscript(response.textResponse);
                        setAiState('speaking');

                        // Play Audio Response
                        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                        const ctx = new AudioContext({ sampleRate: 24000 });
                        const audioData = atob(response.audioData);
                        const arrayBuffer = new ArrayBuffer(audioData.length);
                        const view = new Uint8Array(arrayBuffer);
                        for (let i = 0; i < audioData.length; i++) view[i] = audioData.charCodeAt(i);

                        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                        const source = ctx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(ctx.destination);
                        source.start();
                        source.onended = () => {
                            setAiState('idle');
                            setIsRecording(false);
                        };

                    } catch (e: any) {
                        setError("Error: " + e.message);
                        setAiState('idle');
                        setIsRecording(false);
                    }
                };
            };

            (window as any).currentMediaRecorder = mediaRecorder;

            mediaRecorder.start();

        } catch (e) { setError("Microphone access denied."); setIsRecording(false); setAiState('idle'); }
    };

    useEffect(() => () => stop(), [stop]);

    const stateConfig = {
        idle: { label: 'Ready', sublabel: 'Tap to start', color: 'from-slate-600 to-slate-700' },
        listening: { label: 'Listening', sublabel: 'Speak now...', color: 'from-aurora-500 to-rose-500' },
        thinking: { label: 'Processing', sublabel: 'Analyzing...', color: 'from-cyan-500 to-aurora-500' },
        speaking: { label: 'Speaking', sublabel: 'AI responding', color: 'from-emerald-500 to-cyan-500' },
    };

    const currentState = stateConfig[aiState];

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center relative overflow-hidden rounded-2xl bg-slate-950">
            {/* Ambient Background */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isRecording ? 'opacity-100' : 'opacity-30'}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aurora-900/30 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-900/20 rounded-full blur-[120px]" style={{ animationDelay: '1s' }} />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />

            {/* Main Interaction Orb */}
            <div className="relative z-10 flex flex-col items-center gap-10">
                <button
                    onClick={isRecording ? stop : start}
                    className={`
            relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center 
            transition-all duration-500 
            ${isRecording ? 'scale-110' : 'scale-100 hover:scale-105'}
          `}
                >
                    {/* Outer glow */}
                    <div className={`
            absolute inset-0 rounded-full bg-gradient-to-br ${currentState.color} opacity-60 blur-xl
            ${aiState === 'speaking' ? 'animate-pulse' : ''}
          `} />

                    {/* Main orb */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentState.color} opacity-90`} />

                    {/* Inner dark circle */}
                    <div className="absolute inset-3 rounded-full bg-slate-950 z-10 flex items-center justify-center shadow-inner">
                        <Icon
                            name={isRecording ? 'stop' : 'mic'}
                            className={`text-4xl sm:text-5xl text-white transition-all ${isRecording ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                        />
                    </div>

                    {/* Spinning ring */}
                    <div className={`
            absolute inset-[-12px] rounded-full border-2 border-dashed 
            ${isRecording ? 'border-white/30 animate-spin-slow' : 'border-white/10'}
          `} />

                    {/* Pulsing rings */}
                    {isRecording && (
                        <>
                            <div className={`absolute inset-[-20px] rounded-full border border-white/20 animate-ping`} />
                            <div className={`absolute inset-[-40px] rounded-full border border-white/10 animate-ping`} style={{ animationDelay: '0.5s' }} />
                        </>
                    )}
                </button>

                {/* Status */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
                        {currentState.label}
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">{currentState.sublabel}</p>
                    <p className="text-slate-600 text-xs mt-4">Shadow Voice Interface</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500/30">
                        <Icon name="error" className="text-sm" />
                        {error}
                    </div>
                )}
            </div>

            {/* Floating Transcript */}
            {liveTranscript && (
                <div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl text-center text-slate-200 text-base sm:text-lg font-medium max-w-3xl mx-auto shadow-xl">
                    <Icon name="format_quote" className="text-aurora-500 text-sm mb-1" />
                    <p>"{liveTranscript}"</p>
                </div>
            )}
        </div>
    );
};
