
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface DataInsightsPageProps {
    onNavigate: (page: string) => void;
}

export const DataInsightsPage: React.FC<DataInsightsPageProps> = ({ onNavigate }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [insights, setInsights] = useState<string[]>([]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setIsAnalyzing(true);
            setTimeout(() => {
                setInsights(['Revenue increased 23% YoY', 'Q3 had highest growth', 'Customer retention improved', 'Top category: Electronics']);
                setIsAnalyzing(false);
            }, 2500);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Icon name="insights" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Data Insights</h1>
                        <p className="text-slate-500">Upload data, get AI-powered charts and analysis</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upload Data</h2>
                        <label className="block w-full aspect-video border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors">
                            <input type="file" accept=".csv,.xlsx,.json" className="hidden" onChange={handleUpload} />
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Icon name="upload_file" className="text-5xl mb-3" />
                                <p className="font-medium">Drop CSV, Excel, or JSON</p>
                                <p className="text-sm">or click to browse</p>
                            </div>
                        </label>
                        {file && <p className="mt-3 text-sm text-blue-500 font-medium">📄 {file.name}</p>}
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">AI Insights</h2>
                        {isAnalyzing ? (
                            <div className="flex items-center gap-2 text-blue-500"><Icon name="sync" className="animate-spin" /> Analyzing data...</div>
                        ) : insights.length > 0 ? (
                            <ul className="space-y-3">
                                {insights.map((insight, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-xl">
                                        <Icon name="lightbulb" className="text-blue-500 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-400 text-center py-8">Upload data to see insights</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
