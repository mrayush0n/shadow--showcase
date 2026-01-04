
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface AiTutorPageProps {
    onNavigate: (page: string) => void;
}

export const AiTutorPage: React.FC<AiTutorPageProps> = ({ onNavigate }) => {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Programming'];

    const handleLearn = () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            setContent(mode === 'learn'
                ? `# Understanding ${topic}\n\n## Overview\n${topic} is a fundamental concept that plays a crucial role in ${subject || 'the field'}.\n\n## Key Points\n1. Foundation concepts\n2. Practical applications\n3. Common examples\n\n## Try It\nPractice with real-world examples to solidify your understanding.`
                : `Quiz Time! Answer these questions about ${topic}:\n\n1. What is the primary purpose of ${topic}?\n2. How does ${topic} relate to practical applications?\n3. Name three key concepts.`
            );
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                        <Icon name="school" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Tutor</h1>
                        <p className="text-slate-500">Interactive learning with personalized explanations</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {[{ id: 'learn', label: 'Learn', icon: 'menu_book' }, { id: 'quiz', label: 'Quiz Me', icon: 'quiz' }].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium ${mode === m.id ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon name={m.icon} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">What do you want to learn?</h2>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic (e.g., Quadratic equations)" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4" />
                        <button onClick={handleLearn} disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isLoading ? <><Icon name="sync" className="animate-spin" /> Loading...</> : <><Icon name={mode === 'learn' ? 'menu_book' : 'quiz'} /> {mode === 'learn' ? 'Start Learning' : 'Start Quiz'}</>}
                        </button>
                    </div>

                    <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">{mode === 'learn' ? 'Lesson' : 'Quiz'}</h2>
                        {content ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">{content}</pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400">
                                <div className="text-center"><Icon name="school" className="text-6xl mb-3 opacity-30" /><p>Enter a topic to start learning</p></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
