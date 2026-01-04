
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { aiService } from '../services/ai';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import { HistoryPanel } from '../components/HistoryPanel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

type Tab = 'summarizer' | 'writer' | 'composer';

export const ContentToolsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('summarizer');
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        const type = activeTab === 'summarizer' ? 'summarizer' : 'email-writer';
        const unsub = db.collection('activities').where('userId', '==', user.uid).where('type', '==', type).orderBy('createdAt', 'desc').onSnapshot(s => setHistory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        return () => unsub();
    }, [user, activeTab]);

    const handleAction = async () => {
        if (!input.trim()) return;
        setIsLoading(true); setResult('');
        try {
            let prompt = input;
            if (activeTab === 'summarizer') prompt = `You are Shadow, an intelligent summarizer. Summarize this text concisely:\n${input}`;
            else if (activeTab === 'writer') prompt = `You are Shadow, a professional writing assistant. Write a professional email about:\n${input}`;

            // Call Backend API
            const response = await aiService.generateText(prompt);

            setResult(response.result); // generateText returns { result: string } on backend? No, wait. 
            // In gemini.ts: generateText returns string.
            // In routes/ai.ts: res.json({ result }). So frontend gets { result: string }.

            if (user && activeTab !== 'composer') await db.collection('activities').add({ userId: user.uid, type: activeTab === 'summarizer' ? 'summarizer' : 'email-writer', createdAt: firebase.firestore.FieldValue.serverTimestamp(), data: { prompt: input, resultText: response.result } });
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
                <h1 className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500"><Icon name="history_edu" /> Content Studio</h1>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    {['summarizer', 'writer'].map(t => (
                        <button key={t} onClick={() => { setActiveTab(t as Tab); setInput(''); setResult(''); }} className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${activeTab === t ? 'bg-white dark:bg-gray-700 shadow text-orange-600 dark:text-orange-400' : 'text-gray-500'}`}>{t}</button>
                    ))}
                </div>
                <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={activeTab === 'summarizer' ? "Paste text for Shadow to summarize..." : "Tell Shadow what email to write..."} className="flex-1 w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-orange-500/50" />
                <button onClick={handleAction} disabled={isLoading || !input.trim()} className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2">
                    {isLoading ? <Spinner /> : <Icon name="auto_awesome" />} Generate
                </button>
            </div>
            <div className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl overflow-hidden flex flex-col">
                <h3 className="font-bold text-gray-500 uppercase text-xs mb-4">Shadow Output</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {result ? <MarkdownRenderer content={result} /> : <div className="text-gray-400 text-center mt-20 opacity-50"><Icon name="description" className="text-6xl mb-4" /><p>Generated content appears here</p></div>}
                </div>
            </div>
            <div className="hidden xl:block w-64"><HistoryPanel title="History" isLoading={false} items={history} onItemClick={i => { setInput(i.data.prompt); setResult(i.data.resultText) }} renderItem={i => <p className="truncate font-medium">{i.data.prompt}</p>} /></div>
        </div>
    );
};
