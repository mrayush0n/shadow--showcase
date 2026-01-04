
import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface FitnessCoachPageProps {
    onNavigate: (page: string) => void;
}

export const FitnessCoachPage: React.FC<FitnessCoachPageProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<'workout' | 'meal' | 'progress'>('workout');
    const [goal, setGoal] = useState('strength');
    const [level, setLevel] = useState('intermediate');
    const [isGenerating, setIsGenerating] = useState(false);
    const [plan, setPlan] = useState<{ day: string; exercises: string[] }[]>([]);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setPlan([
                { day: 'Monday', exercises: ['Bench Press 4x8', 'Incline DB Press 3x10', 'Cable Flyes 3x12', 'Tricep Pushdowns 3x15'] },
                { day: 'Wednesday', exercises: ['Squats 4x8', 'Leg Press 3x10', 'Lunges 3x12 each', 'Calf Raises 4x15'] },
                { day: 'Friday', exercises: ['Deadlifts 4x6', 'Barbell Rows 3x10', 'Lat Pulldowns 3x12', 'Bicep Curls 3x15'] },
            ]);
            setIsGenerating(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50 dark:from-slate-950 dark:via-green-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Icon name="fitness_center" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Fitness Coach</h1>
                        <p className="text-slate-500">Personalized workouts, meal plans & progress tracking</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {[{ id: 'workout', label: 'Workouts', icon: 'fitness_center' }, { id: 'meal', label: 'Meal Plan', icon: 'restaurant' }, { id: 'progress', label: 'Progress', icon: 'trending_up' }].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium ${mode === m.id ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon name={m.icon} /> {m.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Your Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fitness Goal</label>
                                <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <option value="strength">Build Strength</option>
                                    <option value="weight-loss">Weight Loss</option>
                                    <option value="muscle">Build Muscle</option>
                                    <option value="endurance">Improve Endurance</option>
                                    <option value="flexibility">Flexibility</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Experience Level</label>
                                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Days per Week</label>
                                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <option>3 days</option>
                                    <option>4 days</option>
                                    <option>5 days</option>
                                    <option>6 days</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isGenerating ? <><Icon name="sync" className="animate-spin" /> Creating Plan...</> : <><Icon name="auto_awesome" /> Generate Plan</>}
                        </button>
                    </div>

                    <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Your Workout Plan</h2>
                        {plan.length > 0 ? (
                            <div className="space-y-4">
                                {plan.map((day, i) => (
                                    <div key={i} className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200 dark:border-green-800">
                                        <h3 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2"><Icon name="calendar_today" /> {day.day}</h3>
                                        <ul className="space-y-1">
                                            {day.exercises.map((ex, j) => (
                                                <li key={j} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <Icon name="check_circle" className="text-green-500 text-sm" /> {ex}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400">
                                <div className="text-center"><Icon name="fitness_center" className="text-6xl mb-3 opacity-30" /><p>Your plan will appear here</p></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
