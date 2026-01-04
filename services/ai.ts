const API_URL = 'http://localhost:3001/api/ai';

export const aiService = {
    // Generate Text
    generateText: async (prompt: string, systemInstruction?: string, model?: string) => {
        const response = await fetch(`${API_URL}/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemInstruction, model }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Generate Image
    generateImage: async (prompt: string, mode: 'quality' | 'realistic') => {
        const response = await fetch(`${API_URL}/image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, mode }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || errorJson.message || 'Failed to generate image');
            } catch (e) {
                throw new Error(errorText || 'Failed to generate image');
            }
        }
        return response.json();
    },

    // Analyze Image
    analyzeImage: async (imageData: string, mimeType: string, prompt: string) => {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData, mimeType, prompt }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Edit Image
    editImage: async (imageData: string, mimeType: string, editPrompt: string) => {
        const response = await fetch(`${API_URL}/edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData, mimeType, editPrompt }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Code Assistant
    processCode: async (code: string, mode: string, language: string) => {
        const response = await fetch(`${API_URL}/code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, mode, language }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Chat
    chat: async (message: string, history: { role: string; parts: { text: string }[] }[], isReasoningMode: boolean, enableSearch: boolean) => {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history, isReasoningMode, enableSearch }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Trip Planner
    generateTripItinerary: async (form: any, options: any) => {
        const response = await fetch(`${API_URL}/trip-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, ...options }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    generateTripExtra: async (type: 'packing' | 'budget', tripInfo: any) => {
        const response = await fetch(`${API_URL}/trip-extra`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, ...tripInfo }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Video
    generateVideo: async (prompt: string, image?: string, mimeType?: string, aspectRatio?: string) => {
        const response = await fetch(`${API_URL}/video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, image, mimeType, aspectRatio }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.blob(); // Returns a video blob
    },

    // TTS
    generateSpeech: async (text: string, voiceName: string = 'Kore') => {
        const response = await fetch(`${API_URL}/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voiceName }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.blob(); // Returns an audio blob
    },

    // Transcribe
    transcribeAudio: async (audioData: string, mimeType: string) => {
        const response = await fetch(`${API_URL}/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioData, mimeType }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Multimodal (Video/Multi-image Analysis)
    processMultimodal: async (parts: { mimeType: string; data: string }[], prompt: string) => {
        const response = await fetch(`${API_URL}/multimodal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parts, prompt }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    // Voice Chat Pipeline
    voiceChat: async (audioData: string, mimeType: string, history: any[]) => {
        const response = await fetch(`${API_URL}/voice-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioData, mimeType, history }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }
};
