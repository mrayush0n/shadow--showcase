
import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    hover?: boolean;
    gradient?: boolean;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    variant = 'default',
    hover = false,
    gradient = false,
    onClick,
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variantStyles = {
        default: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-glass dark:shadow-glass-dark',
        elevated: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl',
        outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
    };

    const hoverStyles = hover
        ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-glow-primary active:scale-[0.98]'
        : '';

    const gradientStyles = gradient
        ? 'relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-aurora-500 before:via-rose-500 before:to-cyan-400 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:-z-10'
        : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${gradientStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
