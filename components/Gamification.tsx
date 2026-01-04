
import React from 'react';
import { Icon } from './Icon';

interface GamificationWidgetProps {
    level: number;
    xp: number;
    xpToNext: number;
    streak: number;
    badges: { id: string; icon: string; name: string; earned: boolean }[];
}

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({ level, xp, xpToNext, streak, badges }) => {
    const progress = (xp / xpToNext) * 100;

    return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4">
            {/* Level & XP */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                        {level}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">Level {level}</p>
                        <p className="text-xs text-slate-500">{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-lg">
                    <Icon name="local_fire_department" />
                    <span className="font-bold">{streak}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Badges */}
            <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                    {badges.map(badge => (
                        <div
                            key={badge.id}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${badge.earned ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-200 dark:bg-slate-700 grayscale opacity-50'}`}
                            title={badge.name}
                        >
                            {badge.icon}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Daily Streak Popup
export const StreakPopup: React.FC<{ streak: number; onClose: () => void }> = ({ streak, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-2xl animate-scaleIn max-w-sm">
                <style>{`
                    @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                    @keyframes fire { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                    .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
                    .animate-fire { animation: fire 0.5s ease-in-out infinite; }
                `}</style>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center animate-fire">
                    <Icon name="local_fire_department" className="text-white text-4xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    {streak} Day Streak! 🔥
                </h2>
                <p className="text-slate-500 mb-6">Keep it up! You're on fire.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                        Let's Go!
                    </button>
                </div>
            </div>
        </div>
    );
};

// Level Up Celebration
export const LevelUpPopup: React.FC<{ newLevel: number; onClose: () => void }> = ({ newLevel, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-center shadow-2xl animate-scaleIn max-w-sm">
                <style>{`
                    @keyframes scaleIn { from { opacity: 0; transform: scale(0.8) rotate(-5deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
                    .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
                `}</style>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-black text-white mb-2">
                    Level Up!
                </h2>
                <p className="text-white/80 text-lg mb-6">You've reached Level {newLevel}</p>
                <button onClick={onClose} className="w-full py-3 bg-white text-orange-500 rounded-xl font-bold hover:bg-orange-50 transition-all">
                    Awesome!
                </button>
            </div>
        </div>
    );
};

// Badge Earned Notification
export const BadgeEarnedToast: React.FC<{ badge: { icon: string; name: string }; onClose: () => void }> = ({ badge, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-slideUp">
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.3s ease-out; }
            `}</style>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
                {badge.icon}
            </div>
            <div>
                <p className="text-xs text-amber-500 font-semibold">Badge Earned!</p>
                <p className="font-bold text-slate-900 dark:text-white">{badge.name}</p>
            </div>
        </div>
    );
};
