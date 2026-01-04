
import React, { useState, useRef } from 'react';
import { Icon } from '../components/Icon';

interface MeetingNotesPageProps {
    onNavigate: (page: string) => void;
}

export const MeetingNotesPage: React.FC<MeetingNotesPageProps> = ({ onNavigate }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [notes, setNotes] = useState<{ summary: string; actionItems: string[]; decisions: string[] } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setIsProcessing(true);
            setTimeout(() => {
                setNotes({
                    summary: 'The team discussed Q1 goals, budget allocation, and upcoming product launches. Key stakeholders agreed on timeline adjustments.',
                    actionItems: ['John to prepare budget report by Friday', 'Sarah to schedule follow-up with marketing', 'Team to review proposal draft'],
                    decisions: ['Approved $50K budget for Q1 campaign', 'Launch date moved to March 15', 'Weekly sync changed to Tuesdays']
                });
                setIsProcessing(false);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/30 to-slate-50 dark:from-slate-950 dark:via-yellow-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                        <Icon name="summarize" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Meeting Notes</h1>
                        <p className="text-slate-500">Get summaries, action items, and decisions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Upload Recording</h2>
                        <label className="block aspect-video border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-yellow-500 transition-colors">
                            <input ref={fileRef} type="file" accept="audio/*,video/*" className="hidden" onChange={handleUpload} />
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Icon name="upload" className="text-5xl mb-3" />
                                <p className="font-medium">Drop audio or video</p>
                            </div>
                        </label>
                        {file && <p className="mt-3 text-sm text-yellow-500 font-medium">📁 {file.name}</p>}
                        {isProcessing && <div className="mt-4 flex items-center gap-2 text-yellow-500"><Icon name="sync" className="animate-spin" /> Processing...</div>}
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {notes ? (
                            <>
                                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Icon name="description" className="text-yellow-500" /> Summary</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{notes.summary}</p>
                                </div>
                                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Icon name="check_circle" className="text-green-500" /> Action Items</h3>
                                    <ul className="space-y-2">{notes.actionItems.map((a, i) => <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Icon name="arrow_forward" className="text-green-500" /> {a}</li>)}</ul>
                                </div>
                                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Icon name="gavel" className="text-blue-500" /> Decisions</h3>
                                    <ul className="space-y-2">{notes.decisions.map((d, i) => <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Icon name="done" className="text-blue-500" /> {d}</li>)}</ul>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-12 text-center text-slate-400">
                                <Icon name="summarize" className="text-6xl mb-3 opacity-30" />
                                <p>Upload a meeting recording to get notes</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
