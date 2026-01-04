import { GoogleGenAI, Modality } from '@google/genai';

// Configuration
// Using Gemini 1.5 Pro as the high-capability default.
const GEMINI_MODEL = 'gemini-1.5-pro';

// Initialize Gemini AI client
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    return new GoogleGenAI({ apiKey });
};

/**
 * Generate text content using Gemini
 */
export const generateText = async (
    prompt: string,
    systemInstruction?: string,
    model: string = GEMINI_MODEL
): Promise<string> => {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
    });

    return response.text || '';
};

/**
 * Generate image using Gemini
 */
export const generateImage = async (
    prompt: string,
    options: { mode?: string } = {}
): Promise<{ imageData: string; mimeType: string } | null> => {
    const ai = getGeminiClient();

    // Keeping 2.0 Flash Exp for Image Gen as it serves this purpose well in the experimental tier
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
        if (part.inlineData) {
            return {
                imageData: part.inlineData.data || '',
                mimeType: part.inlineData.mimeType || 'image/png',
            };
        }
    }

    return null;
};

/**
 * Analyze image using Gemini
 */
export const analyzeImage = async (
    imageData: string,
    mimeType: string,
    prompt: string = 'Describe this image in detail.'
): Promise<string> => {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: {
            parts: [
                { inlineData: { mimeType, data: imageData } },
                { text: prompt },
            ],
        },
    });

    return response.text || '';
};

/**
 * Edit image using Gemini
 */
export const editImage = async (
    imageData: string,
    mimeType: string,
    editPrompt: string
): Promise<{ imageData: string; mimeType: string } | null> => {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Specific capability
        contents: {
            parts: [
                { inlineData: { mimeType, data: imageData } },
                { text: editPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
        if (part.inlineData) {
            return {
                imageData: part.inlineData.data || '',
                mimeType: part.inlineData.mimeType || 'image/png',
            };
        }
    }

    return null;
};

/**
 * Code assistant - analyze, debug, explain, or generate code
 */
export const processCode = async (
    code: string,
    mode: 'debug' | 'explain' | 'optimize' | 'generate',
    language: string
): Promise<string> => {
    const ai = getGeminiClient();

    const prompts: Record<string, string> = {
        debug: `You are an expert debugger. Find bugs, errors, and issues in this ${language} code. Explain each problem and provide the corrected code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        explain: `Explain this ${language} code in detail. Cover what it does, how it works, and any notable patterns or techniques used:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        optimize: `Optimize this ${language} code for performance and readability. Explain your improvements:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        generate: `Generate ${language} code based on this description. Include comments and follow best practices:\n\n${code}`,
    };

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompts[mode],
        config: {
            systemInstruction: 'You are an expert software engineer and coding assistant. Provide clear, well-documented code and explanations.',
        },
    });

    return response.text || '';
};

/**
 * Generate trip itinerary with Google Maps grounding
 */
export const generateTripItinerary = async (
    form: {
        startingPoint: string;
        destination: string;
        duration: string;
        budget: string;
        interests: string;
    },
    options: {
        dining?: boolean;
        transport?: boolean;
        alternatives?: boolean;
        proTips?: boolean;
    }
): Promise<{ itinerary: string; groundingChunks: any[] }> => {
    const ai = getGeminiClient();

    let prompt = `You are an expert travel planner. Create a highly detailed, day-by-day travel itinerary for a trip to ${form.destination}, starting from ${form.startingPoint}.
  
  **Trip Details:**
  - Duration: ${form.duration} days
  - Budget: ${form.budget}
  - Interests: ${form.interests}

  **Requirements:**
  - Use specific place names so they can be found on Google Maps.
  - Format the output in clean Markdown.
  - Group activities by morning, afternoon, and evening.
  `;

    if (options.dining) prompt += `\n- Include specific restaurant recommendations for lunch and dinner.`;
    if (options.transport) prompt += `\n- Include transportation advice between locations.`;
    if (options.proTips) prompt += `\n- Include 'Pro Tips' for avoiding crowds or saving money.`;

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { tools: [{ googleMaps: {} }] as any },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
        itinerary: response.text || '',
        groundingChunks: JSON.parse(JSON.stringify(chunks)),
    };
};

/**
 * Generate packing list or budget breakdown
 */
export const generateTripExtra = async (
    type: 'packing' | 'budget',
    tripInfo: {
        destination: string;
        duration: string;
        interests: string;
        budget?: string;
    }
): Promise<string> => {
    const ai = getGeminiClient();

    const prompt = type === 'packing'
        ? `I am going to ${tripInfo.destination} for ${tripInfo.duration} days. My interests are ${tripInfo.interests}. Create a structured packing list. 
       Categories: Essentials, Clothing (Weather appropriate), Electronics, Toiletries, and specific gear for my interests. Format as a Markdown checklist.`
        : `Create a realistic budget breakdown for a trip to ${tripInfo.destination} (${tripInfo.duration} days) with a total budget of ${tripInfo.budget}. 
       Provide specific estimates for: Accommodation, Food & Dining, Transportation, Activities, and a 'Buffer' fund. Format as a markdown table.`;

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
    });

    return response.text || '';
};

/**
 * Chat with Gemini
 */
export const chat = async (
    message: string,
    history: { role: string; parts: { text: string }[] }[],
    isReasoningMode: boolean,
    enableSearch: boolean
): Promise<{ text: string; groundingLinks?: any[] }> => {
    const ai = getGeminiClient();
    const modelName = isReasoningMode ? 'gemini-1.5-pro' : GEMINI_MODEL;

    // Note: isReasoningMode currently defaults to 1.5-pro as well in this logic. 
    // If we wanted a "reasoning" model specifically (like o1 equivalent), we'd use a specific one.
    // For now, sticking to the standard Pro model is safest.

    const tools = enableSearch ? [{ googleSearch: {} }] : [];

    const response = await ai.models.generateContent({
        model: modelName,
        contents: [...history.map(m => ({ role: m.role, parts: m.parts })), { role: 'user', parts: [{ text: message }] }],
        config: {
            tools: tools as any,
        }
    });

    const text = response.text || '';
    const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
        text,
        groundingLinks: JSON.parse(JSON.stringify(groundingLinks))
    };
};

/**
 * Generate Video using Veo (Polled)
 */
export const generateVideo = async (
    prompt: string,
    image?: string,
    mimeType?: string,
    aspectRatio: string = '16:9'
): Promise<Buffer> => {
    const ai = getGeminiClient();
    const imagePayload = image && mimeType ? { image: { imageBytes: image, mimeType: mimeType } } : {};

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-preview',
        prompt: prompt,
        ...imagePayload,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
    });

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("No video URI returned.");

    // Fetch the video file (requires API key)
    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(`${downloadLink}&key=${apiKey}`);
    const arrayBuffer = await res.arrayBuffer();

    return Buffer.from(arrayBuffer);
};

/**
 * Generate Speech (TTS)
 */
export const generateSpeech = async (
    text: string,
    voiceName: string = 'Kore'
): Promise<Buffer> => {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp", // Specific TTS capabilities in 2.0 Flash Exp
        contents: { parts: [{ text: text }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        }
    });

    const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64) throw new Error("No audio data returned.");

    return Buffer.from(b64, 'base64');
};

/**
 * Transcribe Audio
 */
export const transcribeAudio = async (
    audioData: string,
    mimeType: string
): Promise<string> => {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: {
            parts: [
                { inlineData: { mimeType, data: audioData } },
                { text: "Transcribe this audio exactly as spoken." },
            ]
        },
    });

    return response.text || '';
};

/**
 * Process Multimodal (Images/Video Frames + Text)
 */
export const processMultimodal = async (
    parts: { mimeType: string; data: string }[],
    prompt: string
): Promise<string> => {
    const ai = getGeminiClient();

    const contentParts = [
        ...parts.map(p => ({ inlineData: { mimeType: p.mimeType, data: p.data } })),
        { text: prompt }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-1.5-pro", // Pro model is better for deep multimodal reasoning
        contents: { parts: contentParts },
    });

    return response.text || '';
};

/**
 * Pipeline: Audio -> STT -> Chat -> TTS -> Audio
 */
export const voiceChatPipeline = async (
    audioData: string,
    mimeType: string,
    history: { role: string; parts: { text: string }[] }[]
): Promise<{ audioData: string; textResponse: string }> => {
    // 1. Transcribe
    const userText = await transcribeAudio(audioData, mimeType);

    // 2. Chat
    const chatResponse = await chat(userText, history, false, false);
    const aiText = chatResponse.text;

    // 3. TTS
    // Note: generateSpeech returns a Buffer. We need base64 for JSON response.
    const audioBuffer = await generateSpeech(aiText, 'Kore');

    return {
        audioData: audioBuffer.toString('base64'),
        textResponse: aiText
    };
};
