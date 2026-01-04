
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icon';
import { aiService } from '../services/ai';

export const AudioTranscriberPage: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const startRecording = async () => {
        if (isRecording) return;
        setIsRecording(true);
        setError(null);
        setTranscription('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // or webm
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = (reader.result as string).split(',')[1];
                    try {
                        setTranscription("Processed audio captured. Transcribing with Gemini Flash...");
                        const response = await aiService.transcribeAudio(base64Audio, 'audio/wav');
                        setTranscription(response.result);
                    } catch (e: any) {
                        setError("Transcription failed: " + e.message);
                        setTranscription("Error.");
                    }
                };
            };

            mediaRecorder.start();
        } catch (err: any) {
            console.error('Failed to start recording:', err);
            setError('Could not access microphone.');
            setIsRecording(false);
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (isRecording) stopRecording();
        };
    }, [stopRecording, isRecording]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="speech_to_text" /> Audio Transcription
            </h1>

            <div className="flex justify-center items-center gap-6">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex justify-center items-center transition-colors duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                    <Icon name={isRecording ? 'mic_off' : 'mic'} className="text-4xl text-white" />
                </button>
            </div>

            <p className="text-center text-gray-500 dark:text-gray-400">{isRecording ? "Recording... Click to stop and transcribe." : "Press the button to record."}</p>

            {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg text-center">{error}</p>}

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[200px]">
                <h2 className="text-lg font-medium mb-2">Transcription Result</h2>
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md h-full min-h-[150px]">
                    {transcription || <span className="text-gray-400 dark:text-gray-500">...</span>}
                </div>
            </div>
        </div>
    );
};
