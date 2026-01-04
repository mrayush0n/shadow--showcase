
import React, { useState, useRef } from 'react';
import { Icon } from '../components/Icon';
import { aiService } from '../services/ai';
import { Spinner } from '../components/Spinner';

const FRAMES_TO_CAPTURE = 10;

export const VideoAnalyzerPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setResult('');
        }
    };

    const captureFrames = async (): Promise<{ mimeType: string; data: string }[]> => {
        return new Promise((resolve) => {
            if (!videoRef.current || !canvasRef.current || !videoFile) {
                resolve([]);
                return;
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const frames: { mimeType: string; data: string }[] = [];
            let capturedCount = 0;

            video.onloadeddata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const duration = video.duration;
                const interval = duration / FRAMES_TO_CAPTURE;

                const captureFrameAt = (time: number) => {
                    video.currentTime = time;
                };

                video.onseeked = () => {
                    if (capturedCount < FRAMES_TO_CAPTURE && ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/jpeg');
                        const base64Data = dataUrl.split(',')[1];
                        frames.push({ mimeType: 'image/jpeg', data: base64Data });
                        capturedCount++;
                        setStatus(`Processing frames... ${capturedCount}/${FRAMES_TO_CAPTURE}`);

                        if (capturedCount < FRAMES_TO_CAPTURE) {
                            captureFrameAt(capturedCount * interval);
                        } else {
                            resolve(frames);
                        }
                    }
                };

                captureFrameAt(0);
            };
        });
    };

    const handleAnalyze = async () => {
        if (!videoFile || !prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult('');
        setStatus('Preparing to capture frames...');

        try {
            const frames = await captureFrames();
            if (frames.length === 0) {
                throw new Error("Could not capture any frames from the video.");
            }

            setStatus('Sending frames to Shadow SI for analysis...');

            // Prepare parts for backend
            const parts = frames.map(f => ({ mimeType: f.mimeType, data: f.data }));

            // Call Backend API
            const response = await aiService.processMultimodal(parts, prompt);

            setResult(response.result);
        } catch (e) {
            setError('Failed to analyze video. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="video_library" /> Video Analysis
            </h1>

            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div
                    className="w-full h-64 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-purple-500"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                    {videoPreview ? (
                        <video ref={videoRef} src={videoPreview} className="max-h-full max-w-full object-contain rounded-md" playsInline muted />
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <Icon name="upload_file" className="text-4xl" />
                            <p>Click to upload a video</p>
                        </div>
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Summarize this video"
                    className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading || !videoFile}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !prompt.trim() || !videoFile}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                    {isLoading ? <Spinner /> : <Icon name="analytics" />}
                    <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
                </button>
            </div>

            {isLoading && <p className="text-center text-purple-600 dark:text-purple-400">{status}</p>}
            {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</p>}

            {result && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-medium mb-2">Analysis Result</h2>
                    <div className="prose dark:prose-invert max-w-none bg-gray-200 dark:bg-gray-700 p-3 rounded-md whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};