
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface EmailComposerPageProps {
    onNavigate: (page: string) => void;
}

export const EmailComposerPage: React.FC<EmailComposerPageProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<'compose' | 'reply'>('compose');
    const [context, setContext] = useState('');
    const [tone, setTone] = useState('professional');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedEmail(`Subject: Follow-up on Our Discussion\n\nDear [Recipient],\n\nI hope this email finds you well. I wanted to follow up on our recent conversation regarding ${context || 'the project'}.\n\nPlease let me know if you have any questions or need additional information.\n\nBest regards,\n[Your Name]`);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50 dark:from-slate-950 dark:via-green-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Icon name="mail" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Email Composer</h1>
                        <p className="text-slate-500">AI-powered email drafting and replies</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {[{ id: 'compose', label: 'Compose', icon: 'edit' }, { id: 'reply', label: 'Reply', icon: 'reply' }].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium ${mode === m.id ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon name={m.icon} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Input</h2>
                        <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} placeholder={mode === 'compose' ? 'What should the email be about?' : 'Paste the email you want to reply to...'} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none mb-4" />
                        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                        </select>
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isGenerating ? <><Icon name="sync" className="animate-spin" /> Writing...</> : <><Icon name="auto_awesome" /> Generate Email</>}
                        </button>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-900 dark:text-white">Generated Email</h2>
                            {generatedEmail && <button className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Icon name="content_copy" /></button>}
                        </div>
                        {generatedEmail ? (
                            <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">{generatedEmail}</pre>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-slate-400"><Icon name="mail" className="text-5xl opacity-30" /></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
