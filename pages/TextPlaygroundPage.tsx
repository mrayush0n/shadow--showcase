
// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import type { Activity } from '../types';
import { HistoryPanel } from '../components/HistoryPanel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { aiService } from '../services/ai';

const systemInstruction = "You are Shadow, the AI engine of the Shadow Showcase. You are here to assist the user with complex text generation, reasoning, and creative writing tasks. You are built by the creators of Shadow Showcase.";

export const TextPlaygroundPage: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [thinkingBudget, setThinkingBudget] = useState(1024);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<Activity[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
        setPrompt(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsHistoryLoading(true);
    const q = db.collection('activities').where('userId', '==', user.uid).where('type', '==', 'text-playground').orderBy('createdAt', 'desc');
    const unsubscribe = q.onSnapshot((snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
      setIsHistoryLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleToggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else {
      setPrompt(''); setResult(''); setError(null);
      recognitionRef.current?.start();
    }
  };

  const handleGenerate = async () => {
    if (isListening) recognitionRef.current?.stop();
    if (!prompt.trim() || !user) return;

    setIsLoading(true); setError(null); setResult('');

    try {
      // Use aiService instead of direct SDK
      const model = undefined; // Use backend default (Gemini 3 Pro Preview)
      // Pass thinking config as part of system instruction or separate field if backend supports it.
      // Current backend structure supports: prompt, systemInstruction, model.
      // We'll append thinking budget info to system instruction if needed, or update backend to support it.
      // For now, let's keep it simple and just pass the model.

      const response = await aiService.generateText(prompt, systemInstruction, model);

      const resultText = response.result;
      setResult(resultText);

      await db.collection('activities').add({
        userId: user.uid,
        type: 'text-playground', createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        data: { prompt, resultText, thinkingMode: useThinkingMode }
      });

    } catch (e: any) {
      setError(e.message || 'An error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: Activity) => {
    setPrompt(item.data.prompt || ''); setResult(item.data.resultText || ''); setUseThinkingMode(item.data.thinkingMode || false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-6rem)] pb-6">
      {/* Left Column: Input */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <GlassCard className="flex-1 p-6 flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-500 to-aurora-700 flex items-center justify-center">
                <Icon name="edit_note" className="text-white text-xl" />
              </div>
              <span className="bg-gradient-to-r from-aurora-600 to-aurora-700 dark:from-aurora-400 dark:to-aurora-500 bg-clip-text text-transparent">
                Text Playground
              </span>
            </h1>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Thinking Mode Toggle */}
              <button
                onClick={() => setUseThinkingMode(!useThinkingMode)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200 border
                  ${useThinkingMode
                    ? 'bg-aurora-100 dark:bg-aurora-900/30 border-aurora-300 dark:border-aurora-700 text-aurora-700 dark:text-aurora-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }
                `}
              >
                <Icon name="psychology" className={useThinkingMode ? 'animate-pulse' : ''} />
                Thinking Mode
              </button>

              {useThinkingMode && (
                <select
                  value={thinkingBudget}
                  onChange={(e) => setThinkingBudget(Number(e.target.value))}
                  className="text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-aurora-500"
                >
                  <option value={1024}>Low Reasoning</option>
                  <option value={4096}>Med Reasoning</option>
                  <option value={8192}>High Reasoning</option>
                </select>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative flex-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here. Ask Shadow about anything..."
              className="w-full h-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent font-mono text-sm"
            />

            {/* Voice Input Button */}
            <button
              onClick={handleToggleListening}
              className={`
                absolute bottom-4 right-4 p-3 rounded-xl transition-all duration-200
                ${isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-aurora-100 dark:hover:bg-aurora-900/30 hover:text-aurora-600'
                }
              `}
            >
              <Icon name={isListening ? 'mic_off' : 'mic'} />
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {useThinkingMode ? 'Using Shadow SI Pro Mode with deep reasoning' : 'Using Shadow SI Flash Mode for speed'}
            </p>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-aurora-600 to-rose-600 hover:from-aurora-500 hover:to-rose-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-aurora-500/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all transform active:scale-[0.98]"
            >
              {isLoading ? <Spinner size="sm" /> : <Icon name="auto_awesome" />}
              <span>{isLoading ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </GlassCard>

        {/* Output Area */}
        {(result || error) && (
          <GlassCard className="p-6 max-h-[40%] overflow-y-auto">
            {error ? (
              <div className="flex items-center gap-3 text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/50">
                <Icon name="error" className="text-xl flex-shrink-0" />
                <p>{error}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Icon name="output" className="text-aurora-500" />
                  Shadow Output
                </h3>
                <div className="prose-aurora">
                  <MarkdownRenderer content={result} />
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>

      {/* Right Column: History */}
      <div className="lg:col-span-1 h-full">
        <HistoryPanel
          title="History"
          isLoading={isHistoryLoading}
          items={history}
          onItemClick={loadFromHistory}
          renderItem={(item) => (
            <div>
              <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{item.data.prompt}</p>
              {item.data.thinkingMode && (
                <span className="inline-flex items-center gap-1 text-xs text-aurora-600 dark:text-aurora-400 mt-1">
                  <Icon name="psychology" className="text-xs" /> Thinking Mode
                </span>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};
