import express from 'express';
import { generateText, generateImage, analyzeImage, editImage, processCode, generateTripItinerary, generateTripExtra, chat, generateVideo, generateSpeech, transcribeAudio, processMultimodal, voiceChatPipeline } from '../services/gemini';

const router = express.Router();

// Generate text
router.post('/text', async (req, res) => {
    try {
        const { prompt, systemInstruction, model } = req.body;
        const result = await generateText(prompt, systemInstruction, model);
        res.json({ result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Generate image
router.post('/image', async (req, res) => {
    try {
        const { prompt, mode } = req.body;
        const result = await generateImage(prompt, { mode });
        if (!result) throw new Error('Failed to generate image');
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Analyze image
router.post('/analyze', async (req, res) => {
    try {
        const { imageData, mimeType, prompt } = req.body;
        const result = await analyzeImage(imageData, mimeType, prompt);
        res.json({ result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Edit image
router.post('/edit', async (req, res) => {
    try {
        const { imageData, mimeType, editPrompt } = req.body;
        const result = await editImage(imageData, mimeType, editPrompt);
        if (!result) throw new Error('Failed to edit image');
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Code assistant
router.post('/code', async (req, res) => {
    try {
        const { code, mode, language } = req.body;
        const result = await processCode(code, mode, language);
        res.json({ result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Chat
router.post('/chat', async (req, res) => {
    try {
        const { message, history, isReasoningMode, enableSearch } = req.body;
        const result = await chat(message, history, isReasoningMode, enableSearch);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Trip Itinerary
router.post('/trip-plan', async (req, res) => {
    try {
        const { startingPoint, destination, duration, budget, interests, dining, transport, alternatives, proTips } = req.body;
        const form = { startingPoint, destination, duration, budget, interests };
        const options = { dining, transport, alternatives, proTips };
        const result = await generateTripItinerary(form, options);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Trip Extra (Packing/Budget)
router.post('/trip-extra', async (req, res) => {
    try {
        const { type, destination, duration, interests, budget } = req.body;
        const tripInfo = { destination, duration, interests, budget };
        const result = await generateTripExtra(type, tripInfo);
        res.json({ result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Video Generation
router.post('/video', async (req, res) => {
    try {
        const { prompt, image, mimeType, aspectRatio } = req.body;
        const buffer = await generateVideo(prompt, image, mimeType, aspectRatio);
        res.setHeader('Content-Type', 'video/mp4');
        res.send(buffer);
    } catch (error: any) {
        console.error("Video Gen Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Text to Speech
router.post('/tts', async (req, res) => {
    try {
        const { text, voiceName } = req.body;
        const buffer = await generateSpeech(text, voiceName);
        res.setHeader('Content-Type', 'audio/wav'); // Or audio/mpeg depending on output, assuming WAV/PCM wrapping from service or client needs
        res.send(buffer);
    } catch (error: any) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Transcribe Audio
router.post('/transcribe', async (req, res) => {
    try {
        const { audioData, mimeType } = req.body;
        const result = await transcribeAudio(audioData, mimeType);
        res.json({ result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Multimodal
router.post('/multimodal', async (req, res) => {
    try {
        const { parts, prompt } = req.body;
        const result = await processMultimodal(parts, prompt);
        res.json({ result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Voice Chat Pipeline (Audio -> Audio)
router.post('/voice-chat', async (req, res) => {
    try {
        const { audioData, mimeType, history } = req.body;
        const result = await voiceChatPipeline(audioData, mimeType, history || []);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
