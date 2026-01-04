
import React, { useState, useEffect } from 'react';
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

const LANGUAGES = ['JavaScript', 'Python', 'HTML/CSS', 'SQL', 'TypeScript', 'Java', 'Go', 'C++', 'Ruby', 'PHP', 'Rust', 'Swift', 'C#', 'Kotlin'];

type Mode = 'debug' | 'review' | 'explain' | 'optimize' | 'generate';

const MODES: { id: Mode; label: string; icon: string; description: string; color: string }[] = [
    { id: 'debug', label: 'Debug', icon: 'bug_report', description: 'Fix errors in your code', color: 'from-red-500 to-orange-500' },
    { id: 'review', label: 'Review', icon: 'rate_review', description: 'Get a code review', color: 'from-blue-500 to-cyan-500' },
    { id: 'explain', label: 'Explain', icon: 'school', description: 'Understand how code works', color: 'from-purple-500 to-pink-500' },
    { id: 'optimize', label: 'Optimize', icon: 'speed', description: 'Improve performance', color: 'from-green-500 to-emerald-500' },
    { id: 'generate', label: 'Generate', icon: 'auto_awesome', description: 'Create new code', color: 'from-amber-500 to-orange-500' },
];

export const CodeDebuggerPage: React.FC = () => {
    const { user } = useAuth();
    const [mode, setMode] = useState<Mode>('debug');
    const [language, setLanguage] = useState('JavaScript');
    const [userCode, setUserCode] = useState('');
    const [promptText, setPromptText] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<Activity[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!user) return;
        const unsub = db.collection('activities').where('userId', '==', user.uid).where('type', '==', 'code-assistant').orderBy('createdAt', 'desc').onSnapshot(snap => {
            setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));
        });
        return () => unsub();
    }, [user]);

    const getPromptForMode = () => {
        const baseContext = `You are Shadow Code Assistant, an expert software engineer. Language: ${language}.`;

        switch (mode) {
            case 'debug':
                return `${baseContext}
Task: Debug the following code and fix the error.
Code: \`\`\`${language.toLowerCase()}\n${userCode}\n\`\`\`
Error: "${promptText}"
Output: Provide the fixed code block first, followed by a brief explanation of what was wrong and how you fixed it.`;
            case 'review':
                return `${baseContext}
Task: Perform a thorough code review.
Code: \`\`\`${language.toLowerCase()}\n${userCode}\n\`\`\`
${promptText ? `Focus on: ${promptText}` : ''}
Output: Provide feedback on code quality, potential bugs, best practices, and suggestions for improvement. Use markdown formatting.`;
            case 'explain':
                return `${baseContext}
Task: Explain how this code works in detail.
Code: \`\`\`${language.toLowerCase()}\n${userCode}\n\`\`\`
${promptText ? `Specifically explain: ${promptText}` : ''}
Output: Break down the code step by step. Explain each part clearly for someone learning to code.`;
            case 'optimize':
                return `${baseContext}
Task: Optimize this code for better performance and readability.
Code: \`\`\`${language.toLowerCase()}\n${userCode}\n\`\`\`
${promptText ? `Optimization focus: ${promptText}` : ''}
Output: Provide the optimized code block first, then explain what improvements you made and why.`;
            case 'generate':
                return `${baseContext}
Task: Generate code based on this description.
Description: ${promptText}
Output: Provide clean, well-commented code. Then briefly explain how it works.`;
            default:
                return '';
        }
    };

    const getPlaceholderText = () => {
        switch (mode) {
            case 'debug': return 'Paste the error message here...';
            case 'review': return 'Any specific areas to focus on? (optional)';
            case 'explain': return 'What specifically do you want explained? (optional)';
            case 'optimize': return 'Any specific optimization goals? (optional)';
            case 'generate': return 'Describe what code you want to generate...';
            default: return '';
        }
    };

    const handleAnalyze = async () => {
        if (mode === 'generate' && !promptText.trim()) return;
        if (mode !== 'generate' && !userCode.trim()) return;
        if (mode === 'debug' && !promptText.trim()) return;

        setIsLoading(true);
        setResult('');
        setError('');

        try {
            const result = await aiService.processCode(userCode, mode, language);
            setResult(result.result);

            if (user) {
                db.collection('activities').add({
                    userId: user.uid,
                    type: 'code-assistant',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    data: {
                        mode,
                        language,
                        code: userCode,
                        prompt: promptText,
                        resultText: result.result
                    }
                });
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentMode = MODES.find(m => m.id === mode)!;
    const isButtonDisabled = isLoading ||
        (mode === 'generate' ? !promptText.trim() : !userCode.trim()) ||
        (mode === 'debug' && !promptText.trim());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-6rem)] pb-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Code Input Card - Dark theme for code */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 flex-1 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentMode.color} flex items-center justify-center`}>
                                <Icon name={currentMode.icon} className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Code Assistant</h1>
                                <p className="text-xs text-slate-400">{currentMode.description}</p>
                            </div>
                        </div>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex flex-wrap gap-2">
                        {MODES.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${mode === m.id
                                    ? `bg-gradient-to-r ${m.color} text-white shadow-lg`
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <Icon name={m.icon} className="text-sm" />
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Code Editors */}
                    <div className={`grid gap-4 flex-1 min-h-0 ${mode === 'generate' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {mode !== 'generate' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                    <Icon name="code" className="text-sm" /> Your Code
                                </label>
                                <textarea
                                    value={userCode}
                                    onChange={e => setUserCode(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 resize-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                                    placeholder="// Paste your code here..."
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${mode === 'debug' ? 'text-red-400' : 'text-slate-400'}`}>
                                <Icon name={mode === 'debug' ? 'error' : mode === 'generate' ? 'description' : 'chat'} className="text-sm" />
                                {mode === 'debug' ? 'Error Message' : mode === 'generate' ? 'Description' : 'Additional Context'}
                                {(mode === 'debug' || mode === 'generate') && <span className="text-amber-400">*</span>}
                            </label>
                            <textarea
                                value={promptText}
                                onChange={e => setPromptText(e.target.value)}
                                className={`flex-1 bg-slate-950 border rounded-xl p-4 font-mono text-sm resize-none focus:ring-1 outline-none ${mode === 'debug'
                                    ? 'border-red-900/50 text-red-300 focus:border-red-500 focus:ring-red-500'
                                    : 'border-slate-700 text-slate-300 focus:border-amber-500 focus:ring-amber-500'
                                    }`}
                                placeholder={getPlaceholderText()}
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">
                            <Icon name="error" className="text-lg flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={isButtonDisabled}
                        className={`w-full py-3.5 bg-gradient-to-r ${currentMode.color} hover:opacity-90 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all`}
                    >
                        {isLoading ? <Spinner size="sm" /> : <Icon name={currentMode.icon} />}
                        {isLoading ? 'Processing...' : `${currentMode.label} Code`}
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-h-[40vh] overflow-y-auto relative">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                <Icon name="check_circle" className="text-emerald-500" />
                                Result
                            </h3>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                            >
                                <Icon name={copied ? 'check' : 'content_copy'} className="text-sm" />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="prose-aurora prose-invert">
                            <MarkdownRenderer content={result} />
                        </div>
                    </div>
                )}
            </div>

            {/* History */}
            <div className="lg:col-span-1 h-full">
                <HistoryPanel
                    title="History"
                    isLoading={false}
                    items={history}
                    onItemClick={(i) => {
                        setUserCode(i.data.code || '');
                        setPromptText(i.data.prompt || i.data.errorDescription || '');
                        setResult(i.data.resultText || '');
                        setLanguage(i.data.language || 'JavaScript');
                        setMode(i.data.mode || 'debug');
                    }}
                    renderItem={i => (
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${i.data.mode === 'debug' ? 'bg-red-500/10 text-red-400' :
                                i.data.mode === 'review' ? 'bg-blue-500/10 text-blue-400' :
                                    i.data.mode === 'explain' ? 'bg-purple-500/10 text-purple-400' :
                                        i.data.mode === 'optimize' ? 'bg-green-500/10 text-green-400' :
                                            'bg-amber-500/10 text-amber-400'
                                }`}>
                                {i.data.mode || 'debug'}
                            </span>
                            <span className="px-2 py-1 rounded-md bg-slate-700 text-slate-400 text-xs">{i.data.language}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
