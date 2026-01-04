
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';

interface ThreeDStudioPageProps {
    onNavigate: (page: string) => void;
}

export const ThreeDStudioPage: React.FC<ThreeDStudioPageProps> = ({ onNavigate }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [modelGenerated, setModelGenerated] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const viewerRef = useRef<HTMLDivElement>(null);

    const presets = [
        { icon: 'chair', label: 'Furniture', prompt: 'A modern minimalist wooden chair' },
        { icon: 'pets', label: 'Characters', prompt: 'A cute cartoon robot mascot' },
        { icon: 'landscape', label: 'Environment', prompt: 'A small island with a palm tree' },
        { icon: 'build', label: 'Props', prompt: 'A treasure chest with gold coins' },
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setModelGenerated(true);
        }, 4000);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastPos.x;
        const deltaY = e.clientY - lastPos.y;
        setRotation(prev => ({
            x: prev.x + deltaY * 0.5,
            y: prev.y + deltaX * 0.5
        }));
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-50 dark:from-slate-950 dark:via-cyan-950/20 dark:to-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                            <Icon name="view_in_ar" className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">3D Asset Generator</h1>
                            <p className="text-slate-500">Create 3D models from text descriptions</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Describe Your 3D Model</h2>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            placeholder="A futuristic spaceship with glowing engines and metallic wings..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-4"
                        />

                        {/* Quick Presets */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Quick Presets</p>
                            <div className="grid grid-cols-2 gap-2">
                                {presets.map((preset, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPrompt(preset.prompt)}
                                        className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all text-left"
                                    >
                                        <Icon name={preset.icon} />
                                        <span className="text-sm font-medium">{preset.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Style</label>
                                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                                    <option>Realistic</option>
                                    <option>Cartoon</option>
                                    <option>Low Poly</option>
                                    <option>Voxel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Format</label>
                                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                                    <option>GLB</option>
                                    <option>GLTF</option>
                                    <option>OBJ</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Icon name="sync" className="animate-spin" />
                                    Generating 3D Model...
                                </>
                            ) : (
                                <>
                                    <Icon name="view_in_ar" />
                                    Generate 3D Model
                                </>
                            )}
                        </button>
                    </div>

                    {/* 3D Viewer */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3D Preview</h2>
                            {modelGenerated && (
                                <div className="flex gap-2">
                                    <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-cyan-500">
                                        <Icon name="refresh" />
                                    </button>
                                    <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-cyan-500">
                                        <Icon name="fullscreen" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div
                            ref={viewerRef}
                            className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing relative"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {/* Grid Floor */}
                            <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                                transform: 'perspective(500px) rotateX(60deg)',
                                transformOrigin: 'center bottom'
                            }} />

                            {modelGenerated ? (
                                <div
                                    className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-2xl transition-transform"
                                    style={{
                                        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                                    }}
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon name="view_in_ar" className="text-white text-5xl" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Icon name="view_in_ar" className="text-6xl mb-3 opacity-30" />
                                    <p>Your 3D model will appear here</p>
                                    <p className="text-xs mt-1">Drag to rotate</p>
                                </div>
                            )}
                        </div>

                        {modelGenerated && (
                            <div className="flex gap-3 mt-4">
                                <button className="flex-1 py-3 bg-cyan-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors">
                                    <Icon name="download" /> Download GLB
                                </button>
                                <button className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-medium flex items-center justify-center gap-2">
                                    <Icon name="share" /> Share
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
