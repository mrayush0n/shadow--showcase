
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { aiService } from '../services/ai';
import { fileToBase64 } from '../utils/fileUtils';

type Mode = 'text-to-video' | 'image-to-video';
type AspectRatio = '16:9' | '9:16';

const loadingMessages = [
    "Warming up the digital director's chair...",
    "Choreographing pixels into motion...",
    "Teaching virtual actors their lines...",
    "Rendering the opening scene...",
    "Brewing a fresh pot of digital film...",
    "Polishing the lens for a perfect shot...",
    "This can take a few minutes, please wait...",
];

export const VideoGenPage: React.FC = () => {
    // Manual Key Management
    const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini-api-key-video'));
    const [tempApiKey, setTempApiKey] = useState('');

    const [mode, setMode] = useState<Mode>('text-to-video');
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const loadingIntervalRef = useRef<number | null>(null);

    const handleSaveKey = () => {
        if (tempApiKey.trim()) {
            localStorage.setItem('gemini-api-key-video', tempApiKey.trim());
            setApiKey(tempApiKey.trim());
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const startLoadingMessages = () => {
        setLoadingMessage(loadingMessages[0]);
        loadingIntervalRef.current = window.setInterval(() => {
            setLoadingMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                return loadingMessages[(currentIndex + 1) % loadingMessages.length];
            });
        }, 5000);
    };

    const stopLoadingMessages = () => {
        if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || (mode === 'image-to-video' && !image)) return;

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        startLoadingMessages();

        try {
            // Call Backend API
            const videoBlob = await aiService.generateVideo(
                prompt,
                mode === 'image-to-video' && image ? await fileToBase64(image) : undefined,
                mode === 'image-to-video' && image ? image.type : undefined,
                aspectRatio
            );

            setVideoUrl(URL.createObjectURL(videoBlob));

        } catch (e: any) {
            setError(e.message || 'Failed to generate video. Please check your API key and try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
            stopLoadingMessages();
        }
    };

    if (!apiKey) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl max-w-md">
                    <Icon name="key" className="text-7xl text-purple-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">API Key Required</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Veo video generation requires a specific API key. Please enter it below.
                    </p>
                    <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="Paste Gemini API Key"
                        className="w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button onClick={handleSaveKey} disabled={!tempApiKey.trim()} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50">
                        Save & Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon name={mode === 'image-to-video' ? 'movie' : 'video_spark'} /> Video Generation
            </h1>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
                    <button onClick={() => setMode('text-to-video')} className={`px-4 py-2 ${mode === 'text-to-video' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>Text-to-Video</button>
                    <button onClick={() => setMode('image-to-video')} className={`px-4 py-2 ${mode === 'image-to-video' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>Image-to-Video</button>
                </div>

                {mode === 'image-to-video' && (
                    <div
                        className="w-full h-48 mb-4 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-purple-500"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        {imagePreview ? (
                            <img src={imagePreview} alt="upload preview" className="max-h-full max-w-full object-contain rounded-md" />
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <Icon name="upload_file" className="text-4xl" />
                                <p>Click to upload a starting image</p>
                            </div>
                        )}
                    </div>
                )}

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A cinematic shot of a raccoon coding on a laptop in a cozy library..."
                    className="w-full h-24 bg-gray-200 dark:bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-medium">Aspect Ratio:</span>
                    <button onClick={() => setAspectRatio('16:9')} className={`px-3 py-1 rounded ${aspectRatio === '16:9' ? 'bg-purple-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}>16:9</button>
                    <button onClick={() => setAspectRatio('9:16')} className={`px-3 py-1 rounded ${aspectRatio === '9:16' ? 'bg-purple-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}>9:16</button>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim() || (mode === 'image-to-video' && !image)}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                >
                    {isLoading ? <Spinner /> : <Icon name="play_arrow" />}
                    <span>{isLoading ? 'Generating...' : 'Generate Video'}</span>
                </button>
            </div>

            {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</p>}

            <div className="w-full flex justify-center items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
                {isLoading && (
                    <div className="text-center">
                        <Spinner className="h-10 w-10 mx-auto mb-4" />
                        <p className="text-lg font-medium">{loadingMessage}</p>
                    </div>
                )}
                {videoUrl && <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-[512px] rounded-md shadow-lg" />}
                {!isLoading && !videoUrl && <p className="text-gray-500 dark:text-gray-400">Your generated video will appear here.</p>}
            </div>
        </div>
    );
};
