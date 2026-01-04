
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { aiService } from '../services/ai';

export const TtsPage: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    const cleanupAudio = useCallback(() => {
        sourceNodeRef.current?.stop();
        sourceNodeRef.current?.disconnect();
        sourceNodeRef.current = null;
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanupAudio();
        };
    }, [cleanupAudio]);

    const handleGenerateSpeech = async () => {
        if (!text.trim()) return;

        setIsLoading(true);
        setError(null);
        cleanupAudio();

        try {
            // Call Backend API
            const audioBlob = await aiService.generateSpeech(text);

            // Explicitly define AudioContext
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const outputAudioContext = new AudioContext({ sampleRate: 24000 });
            audioContextRef.current = outputAudioContext;

            // Decode the blob
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await outputAudioContext.decodeAudioData(arrayBuffer);

            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
            sourceNodeRef.current = source;

        } catch (e) {
            setError("Failed to generate speech. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="audio_spark" /> Text-to-Speech
            </h1>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <label htmlFor="tts-text" className="block text-lg font-medium mb-2">Text to Synthesize</label>
                <textarea
                    id="tts-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Hello, world! I am an AI voice powered by Shadow SI."
                    className="w-full h-40 bg-gray-200 dark:bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleGenerateSpeech}
                    disabled={isLoading || !text.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                    {isLoading ? <Spinner /> : <Icon name="campaign" />}
                    <span>{isLoading ? 'Generating...' : 'Generate Speech'}</span>
                </button>
            </div>

            {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</p>}
        </div>
    );
};