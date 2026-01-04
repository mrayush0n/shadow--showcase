
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { aiService } from '../services/ai';

const BASE_INSTRUCTION = "You are Shadow, the advanced AI assistant of the Shadow Showcase platform. You are helpful, witty, and technically precise. Always identify yourself as Shadow when asked.";

export const ChatbotPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);

    // Settings
    const [isReasoningMode, setIsReasoningMode] = useState(false);
    const [enableSearch, setEnableSearch] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Load Sessions List
    useEffect(() => {
        if (!user) return;
        const unsub = db.collection('users').doc(user.uid).collection('chats')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snap => {
                const s = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setSessions(s);
                if (!activeSessionId && s.length > 0) setActiveSessionId(s[0].id);
                else if (s.length === 0 && !activeSessionId) createNewChat();
            });
        return () => unsub();
    }, [user]);

    // Load Messages for Active Session
    useEffect(() => {
        if (!user || !activeSessionId) return;
        const unsub = db.collection('users').doc(user.uid).collection('chats').doc(activeSessionId).collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snap => {
                setMessages(snap.docs.map(d => d.data() as ChatMessage));
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            });
        return () => unsub();
    }, [activeSessionId, user]);

    const createNewChat = async () => {
        if (!user) return;
        try {
            const ref = await db.collection('users').doc(user.uid).collection('chats').add({
                title: 'New Conversation',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            setActiveSessionId(ref.id);
            setMessages([]);
            setErrorMsg(null);
        } catch (e) {
            console.error("Error creating chat:", e);
        }
    };

    const send = async () => {
        if (!input.trim() || !activeSessionId || !user) return;

        const txt = input;
        setInput('');
        setIsLoading(true);
        setErrorMsg(null);

        try {
            // 1. Save User Message
            await db.collection('users').doc(user.uid).collection('chats').doc(activeSessionId).collection('messages').add({
                role: 'user',
                parts: [{ text: txt }],
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update title if it's the first message
            if (messages.length === 0) {
                await db.collection('users').doc(user.uid).collection('chats').doc(activeSessionId).update({
                    title: txt.substring(0, 30) + (txt.length > 30 ? '...' : '')
                });
            }

            // 2. Call Backend API
            const response = await aiService.chat(txt, messages.map(m => ({
                role: m.role,
                parts: m.parts.map(p => ({ text: p.text || '' }))
            })), isReasoningMode, enableSearch);

            const responseText = response.text;
            const grounding = response.groundingLinks || [];

            // 4. Save Model Message
            await db.collection('users').doc(user.uid).collection('chats').doc(activeSessionId).collection('messages').add({
                role: 'model',
                parts: [{ text: responseText }],
                groundingLinks: grounding,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

        } catch (e: any) {
            console.error("Chat error:", e);
            setErrorMsg(e.message || "An error occurred while connecting to Shadow.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6">
            {/* Sidebar List */}
            <div className="w-72 hidden md:flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <button onClick={createNewChat} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                        <Icon name="add_comment" /> New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {sessions.map(s => (
                        <button key={s.id} onClick={() => setActiveSessionId(s.id)} className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all truncate flex items-center gap-3 ${activeSessionId === s.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                            <Icon name="chat_bubble_outline" className="text-xs opacity-70" />
                            <span className="truncate">{s.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white/40 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-700 flex flex-col shadow-2xl overflow-hidden relative">

                {/* Control Bar */}
                <div className="px-6 py-3 border-b border-white/10 dark:border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10 gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Icon name="smart_toy" /> Shadow AI
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search Toggle */}
                        <button
                            onClick={() => setEnableSearch(!enableSearch)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${enableSearch ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500'}`}
                        >
                            <Icon name="search" className="text-sm" /> Google Search {enableSearch ? 'ON' : 'OFF'}
                        </button>

                        {/* Model Toggle */}
                        <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setIsReasoningMode(false)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!isReasoningMode ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500'}`}
                            >
                                <span className="flex items-center gap-1"><Icon name="bolt" className="text-xs" /> Fast</span>
                            </button>
                            <button
                                onClick={() => setIsReasoningMode(true)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${isReasoningMode ? 'bg-white dark:bg-gray-700 shadow text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}
                            >
                                <span className="flex items-center gap-1"><Icon name="psychology" className="text-xs" /> Reasoning</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {messages.length === 0 && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 opacity-50">
                            <Icon name="forum" className="text-6xl mb-4" />
                            <p>Start a new conversation with Shadow</p>
                            <div className="flex gap-2 mt-4 text-xs">
                                <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">Gemini 3.0 Pro</span>
                                <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">Gemini 2.5 Flash</span>
                                <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">Google Search Grounding</span>
                            </div>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-5 shadow-md ${m.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-tl-none'}`}>
                                <div className={`text-xs font-bold mb-2 opacity-70 flex items-center gap-2 ${m.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {m.role === 'user' ? 'YOU' : <><Icon name="smart_toy" className="text-xs" /> SHADOW</>}
                                </div>
                                <div className="text-sm leading-relaxed">
                                    <MarkdownRenderer content={m.parts[0].text || "..."} />
                                </div>

                                {/* Grounding Sources (Search Results) */}
                                {m.groundingLinks && m.groundingLinks.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10">
                                        <div className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><Icon name="public" className="text-xs" /> Sources Found</div>
                                        <div className="flex flex-wrap gap-2">
                                            {m.groundingLinks.map((l: any, idx: number) => l.web?.uri ? (
                                                <a key={idx} href={l.web.uri} target="_blank" rel="noreferrer" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2 py-1 rounded-lg flex items-center gap-1 truncate max-w-[200px] transition-colors border border-blue-100 dark:border-blue-800">
                                                    <Icon name="link" className="text-[10px]" /> {l.web.title || "Web Source"}
                                                </a>
                                            ) : null)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-2 min-w-[200px]">
                                <div className="flex items-center gap-3">
                                    <Spinner className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-500 animate-pulse font-medium">
                                        {enableSearch ? 'Searching Google & Summarizing...' : (isReasoningMode ? 'Shadow is Reasoning (Gemini 3)...' : 'Shadow is writing...')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/80 dark:bg-gray-900/80 border-t border-white/20 dark:border-gray-700 backdrop-blur-xl">
                    {errorMsg && (
                        <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-500">
                            <Icon name="error" /> {errorMsg}
                        </div>
                    )}
                    <div className="flex items-end gap-2 bg-gray-100 dark:bg-black/50 p-2 rounded-3xl border border-transparent focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-inner">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                            placeholder={`Message Shadow (${isReasoningMode ? 'Gemini 3' : 'Gemini 2.5'}) ${enableSearch ? '+ Search' : ''}...`}
                            rows={1}
                            className="flex-1 bg-transparent px-4 py-3 focus:outline-none max-h-32 resize-none text-gray-900 dark:text-white placeholder-gray-500"
                            style={{ minHeight: '48px' }}
                        />
                        <button onClick={send} disabled={!input.trim() || isLoading} className="p-3 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-90">
                            <Icon name="arrow_upward" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
