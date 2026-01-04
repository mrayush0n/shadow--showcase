
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface ResumeBuilderPageProps {
    onNavigate: (page: string) => void;
}

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', title: '', experience: '', skills: '' });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setStep(3);
            setIsGenerating(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
                        <Icon name="description" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Resume Builder</h1>
                        <p className="text-slate-500">Generate ATS-optimized resumes</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                </div>

                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                    {step === 1 && (
                        <>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" />
                                <input type="text" placeholder="Job Title (e.g., Software Engineer)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" />
                            </div>
                            <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-indigo-500 text-white font-bold rounded-xl">Next</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Experience & Skills</h2>
                            <div className="space-y-4">
                                <textarea placeholder="Briefly describe your experience..." value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none" />
                                <input type="text" placeholder="Key skills (comma separated)" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl">Back</button>
                                <button onClick={handleGenerate} disabled={isGenerating} className="flex-1 py-3 bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                    {isGenerating ? <><Icon name="sync" className="animate-spin" /> Generating...</> : 'Generate Resume'}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"><Icon name="check" className="text-green-500 text-4xl" /></div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resume Generated!</h2>
                            <p className="text-slate-500 mb-6">Your ATS-optimized resume is ready</p>
                            <div className="flex gap-3 justify-center">
                                <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium flex items-center gap-2"><Icon name="download" /> Download PDF</button>
                                <button onClick={() => setStep(1)} className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-medium">Create Another</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
