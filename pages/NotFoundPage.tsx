
import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

interface NotFoundPageProps {
    onBack: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBack }) => {
    const { theme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative flex items-center justify-center">
            {/* Stars Background */}
            <div className="absolute inset-0 z-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.7 + 0.3,
                            animationDuration: `${Math.random() * 3 + 1}s`
                        }}
                    />
                ))}
            </div>

            {/* Glowing Orb */}
            <div
                className="absolute w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[100px] z-0 transition-transform duration-100 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * -50}px, ${mousePosition.y * -50}px)`
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                <div className="relative inline-block mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-b from-slate-200 to-slate-800 bg-clip-text text-transparent opacity-50 select-none">
                        404
                    </h1>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl"
                        style={{
                            transform: `translate(calc(-50% + ${mousePosition.x * 20}px), calc(-50% + ${mousePosition.y * 20}px)) rotate(10deg)`
                        }}
                    >
                        <Icon name="rocket_launch" className="text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]" />
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4">Lost in Space?</h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto mb-10">
                    The page you're looking for seems to have drifted into a black hole. Let's get you back to safety.
                </p>

                <button
                    onClick={onBack}
                    className="group relative px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg overflow-hidden transition-transform hover:scale-105"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Icon name="arrow_back" />
                        Return to Base
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-violet-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(-50%, -50%) rotate(10deg) translateY(0); }
                    50% { transform: translate(-50%, -50%) rotate(10deg) translateY(-20px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
};
