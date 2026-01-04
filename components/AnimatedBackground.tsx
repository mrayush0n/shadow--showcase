
import React from 'react';

interface AnimatedBackgroundProps {
    variant?: 'default' | 'minimal' | 'intense';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
    const orbs = {
        default: [
            { color: 'from-aurora-500/30 to-aurora-600/20', size: 'w-[600px] h-[600px]', position: 'top-[-20%] right-[-10%]', delay: '0s' },
            { color: 'from-rose-500/25 to-rose-600/15', size: 'w-[500px] h-[500px]', position: 'bottom-[-15%] left-[-10%]', delay: '3s' },
            { color: 'from-cyan-400/20 to-cyan-500/10', size: 'w-[400px] h-[400px]', position: 'top-[40%] left-[30%]', delay: '6s' },
        ],
        minimal: [
            { color: 'from-aurora-500/20 to-aurora-600/10', size: 'w-[400px] h-[400px]', position: 'top-[-10%] right-[-5%]', delay: '0s' },
            { color: 'from-rose-500/15 to-rose-600/5', size: 'w-[300px] h-[300px]', position: 'bottom-[-10%] left-[-5%]', delay: '2s' },
        ],
        intense: [
            { color: 'from-aurora-500/40 to-aurora-600/30', size: 'w-[700px] h-[700px]', position: 'top-[-25%] right-[-15%]', delay: '0s' },
            { color: 'from-rose-500/35 to-rose-600/25', size: 'w-[600px] h-[600px]', position: 'bottom-[-20%] left-[-15%]', delay: '2s' },
            { color: 'from-cyan-400/30 to-cyan-500/20', size: 'w-[500px] h-[500px]', position: 'top-[30%] left-[40%]', delay: '4s' },
            { color: 'from-aurora-400/25 to-rose-400/15', size: 'w-[350px] h-[350px]', position: 'top-[60%] right-[20%]', delay: '6s' },
        ],
    };

    const selectedOrbs = orbs[variant];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-aurora-50/30 to-rose-50/20 dark:from-slate-950 dark:via-aurora-950/50 dark:to-slate-900 transition-colors duration-500" />

            {/* Animated orbs */}
            {selectedOrbs.map((orb, index) => (
                <div
                    key={index}
                    className={`absolute ${orb.size} ${orb.position} rounded-full bg-gradient-radial ${orb.color} blur-[100px] animate-aurora`}
                    style={{ animationDelay: orb.delay }}
                />
            ))}

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
            />
        </div>
    );
};
