
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: string) => void;
}

interface Command {
    id: string;
    icon: string;
    label: string;
    description: string;
    shortcut?: string;
    action: () => void;
    category: 'navigation' | 'tools' | 'actions';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: Command[] = [
        // Navigation
        { id: 'home', icon: 'home', label: 'Go to Home', description: 'Dashboard', shortcut: 'H', action: () => onNavigate('home'), category: 'navigation' },
        { id: 'image', icon: 'palette', label: 'Image Studio', description: 'Generate and edit images', shortcut: 'I', action: () => onNavigate('imagePlayground'), category: 'navigation' },
        { id: 'video', icon: 'movie', label: 'Video Studio', description: 'Create videos with AI', shortcut: 'V', action: () => onNavigate('videoPlayground'), category: 'navigation' },
        { id: 'text', icon: 'edit_note', label: 'Text Playground', description: 'Text generation tools', shortcut: 'T', action: () => onNavigate('textPlayground'), category: 'navigation' },
        { id: 'code', icon: 'code', label: 'Code Assistant', description: 'Debug and generate code', shortcut: 'C', action: () => onNavigate('codeDebugger'), category: 'navigation' },
        { id: 'trip', icon: 'travel_explore', label: 'Trip Planner', description: 'Plan your travels', action: () => onNavigate('tripPlanner'), category: 'navigation' },
        { id: 'music', icon: 'music_note', label: 'Music Studio', description: 'AI music generation', action: () => onNavigate('musicStudio'), category: 'navigation' },
        { id: '3d', icon: 'view_in_ar', label: '3D Generator', description: 'Create 3D models', action: () => onNavigate('threeDStudio'), category: 'navigation' },
        { id: 'docs', icon: 'description', label: 'Document Chat', description: 'Chat with PDFs', action: () => onNavigate('documentChat'), category: 'navigation' },
        { id: 'agents', icon: 'smart_toy', label: 'AI Agents', description: 'Custom AI personas', action: () => onNavigate('agentBuilder'), category: 'navigation' },
        { id: 'gallery', icon: 'collections', label: 'Gallery', description: 'Community creations', action: () => onNavigate('gallery'), category: 'navigation' },
        { id: 'prompts', icon: 'storefront', label: 'Prompt Market', description: 'Discover prompts', action: () => onNavigate('promptMarket'), category: 'navigation' },
        { id: 'canvas', icon: 'dashboard', label: 'Canvas', description: 'Whiteboard mode', action: () => onNavigate('canvas'), category: 'navigation' },
        { id: 'profile', icon: 'person', label: 'Profile', description: 'Your account', shortcut: 'P', action: () => onNavigate('profile'), category: 'navigation' },
        // Actions
        { id: 'theme', icon: 'dark_mode', label: 'Toggle Theme', description: 'Switch dark/light mode', shortcut: 'D', action: () => { document.documentElement.classList.toggle('dark'); onClose(); }, category: 'actions' },
        { id: 'newChat', icon: 'add', label: 'New Chat', description: 'Start a new conversation', shortcut: 'N', action: () => onClose(), category: 'actions' },
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Palette */}
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scaleIn">
                <style>{`
                    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                    .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
                `}</style>

                {/* Input */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                    <Icon name="search" className="text-slate-400 text-xl" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent text-slate-900 dark:text-white text-lg placeholder-slate-400 focus:outline-none"
                    />
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                            <Icon name="search_off" className="text-4xl mb-2 opacity-50" />
                            <p>No results found</p>
                        </div>
                    ) : (
                        <>
                            {['navigation', 'actions'].map(category => {
                                const categoryCommands = filteredCommands.filter(c => c.category === category);
                                if (categoryCommands.length === 0) return null;
                                return (
                                    <div key={category}>
                                        <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">{category}</p>
                                        {categoryCommands.map((cmd, i) => {
                                            const globalIndex = filteredCommands.indexOf(cmd);
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => { cmd.action(); onClose(); }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${globalIndex === selectedIndex ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                >
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${globalIndex === selectedIndex ? 'bg-violet-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                        <Icon name={cmd.icon} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="font-medium">{cmd.label}</p>
                                                        <p className="text-xs text-slate-500">{cmd.description}</p>
                                                    </div>
                                                    {cmd.shortcut && (
                                                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs rounded">{cmd.shortcut}</kbd>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">↑↓</kbd> Navigate</span>
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">↵</kbd> Select</span>
                    </div>
                    <span>Powered by Shadow AI</span>
                </div>
            </div>
        </div>
    );
};
