
import React, { useState, useRef } from 'react';
import { Icon } from '../components/Icon';

interface DocumentChatPageProps {
    onNavigate: (page: string) => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: { page: number; text: string }[];
}

interface Document {
    id: string;
    name: string;
    pages: number;
    uploadedAt: Date;
}

export const DocumentChatPage: React.FC<DocumentChatPageProps> = ({ onNavigate }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeDoc, setActiveDoc] = useState<Document | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Simulate upload and processing
        setTimeout(() => {
            const newDoc: Document = {
                id: Date.now().toString(),
                name: file.name,
                pages: Math.floor(Math.random() * 50) + 5,
                uploadedAt: new Date()
            };
            setDocuments(prev => [...prev, newDoc]);
            setActiveDoc(newDoc);
            setIsUploading(false);
            setMessages([{
                role: 'assistant',
                content: `I've processed "${file.name}" (${newDoc.pages} pages). Ask me anything about this document!`
            }]);
        }, 2000);
    };

    const handleSend = async () => {
        if (!input.trim() || !activeDoc) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        // Simulate AI response with citations
        setTimeout(() => {
            const response: Message = {
                role: 'assistant',
                content: `Based on the document "${activeDoc.name}", here's what I found:\n\nThe document discusses several key points related to your question. The main findings indicate that the information you're looking for can be found in the sections outlined below.`,
                citations: [
                    { page: Math.floor(Math.random() * activeDoc.pages) + 1, text: 'Relevant excerpt from the document...' },
                    { page: Math.floor(Math.random() * activeDoc.pages) + 1, text: 'Another relevant section...' }
                ]
            };
            setMessages(prev => [...prev, response]);
            setIsProcessing(false);
        }, 2000);
    };

    const suggestedQuestions = [
        'Summarize the main points',
        'What are the key findings?',
        'List all important dates',
        'Explain the methodology'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <Icon name="description" className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Document Chat</h1>
                            <p className="text-slate-500">Chat with your PDFs and documents</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Documents */}
                    <div className="lg:col-span-1 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Documents</h3>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                <Icon name="add" />
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleUpload}
                        />

                        {isUploading && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-3">
                                <div className="flex items-center gap-2">
                                    <Icon name="sync" className="text-amber-500 animate-spin" />
                                    <span className="text-sm text-amber-600 dark:text-amber-400">Processing...</span>
                                </div>
                            </div>
                        )}

                        {documents.length === 0 && !isUploading ? (
                            <div className="text-center py-8 text-slate-400">
                                <Icon name="upload_file" className="text-4xl mb-2 opacity-50" />
                                <p className="text-sm">Upload a document to start</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {documents.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setActiveDoc(doc)}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${activeDoc?.id === doc.id ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon name="picture_as_pdf" className="text-amber-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{doc.pages} pages</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-3 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex flex-col h-[600px]">
                        {activeDoc ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Icon name="picture_as_pdf" className="text-amber-500" />
                                        <span className="font-medium text-slate-900 dark:text-white">{activeDoc.name}</span>
                                        <span className="text-xs text-slate-500">({activeDoc.pages} pages)</span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'} rounded-2xl px-4 py-3`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                {msg.citations && (
                                                    <div className="mt-3 pt-3 border-t border-white/20 dark:border-slate-700">
                                                        <p className="text-xs font-medium mb-2 opacity-70">Citations:</p>
                                                        {msg.citations.map((cite, j) => (
                                                            <div key={j} className="text-xs bg-white/10 dark:bg-slate-700 rounded px-2 py-1 mb-1">
                                                                📄 Page {cite.page}: "{cite.text}"
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isProcessing && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Suggested Questions */}
                                {messages.length === 1 && (
                                    <div className="px-4 py-2 flex flex-wrap gap-2">
                                        {suggestedQuestions.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setInput(q)}
                                                className="px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs rounded-lg hover:bg-amber-500/20 transition-colors"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask a question about your document..."
                                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isProcessing}
                                            className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                                        >
                                            <Icon name="send" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <Icon name="upload_file" className="text-6xl mb-4 opacity-30" />
                                    <p className="text-lg">Upload a document to start chatting</p>
                                    <p className="text-sm mt-1">Supports PDF, DOC, DOCX, TXT</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
