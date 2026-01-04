
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';

interface CanvasPageProps {
    onNavigate: (page: string) => void;
}

interface CanvasItem {
    id: string;
    type: 'image' | 'text' | 'sticky' | 'shape';
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    color?: string;
}

export const CanvasPage: React.FC<CanvasPageProps> = ({ onNavigate }) => {
    const [items, setItems] = useState<CanvasItem[]>([
        { id: '1', type: 'sticky', x: 100, y: 100, width: 200, height: 150, content: 'Welcome to Canvas!', color: 'amber' },
        { id: '2', type: 'text', x: 400, y: 150, width: 250, height: 50, content: 'Drag items around' },
        { id: '3', type: 'image', x: 200, y: 300, width: 180, height: 180, content: 'AI Generated Image', color: 'rose' },
    ]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [itemDrag, setItemDrag] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const colors = ['amber', 'rose', 'sky', 'emerald', 'violet', 'pink'];

    const addSticky = () => {
        const newSticky: CanvasItem = {
            id: Date.now().toString(),
            type: 'sticky',
            x: 200 + Math.random() * 200,
            y: 200 + Math.random() * 200,
            width: 200,
            height: 150,
            content: 'New note...',
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        setItems(prev => [...prev, newSticky]);
    };

    const addText = () => {
        const newText: CanvasItem = {
            id: Date.now().toString(),
            type: 'text',
            x: 200 + Math.random() * 200,
            y: 200 + Math.random() * 200,
            width: 200,
            height: 40,
            content: 'Text block'
        };
        setItems(prev => [...prev, newText]);
    };

    const handleItemMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const item = items.find(i => i.id === id);
        if (!item) return;
        setSelectedId(id);
        setItemDrag({
            id,
            offsetX: e.clientX - item.x,
            offsetY: e.clientY - item.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (itemDrag) {
            setItems(prev => prev.map(item =>
                item.id === itemDrag.id
                    ? { ...item, x: e.clientX - itemDrag.offsetX, y: e.clientY - itemDrag.offsetY }
                    : item
            ));
        } else if (isDragging) {
            setPan({
                x: pan.x + (e.clientX - dragStart.x),
                y: pan.y + (e.clientY - dragStart.y)
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setItemDrag(null);
        setIsDragging(false);
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            setSelectedId(null);
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const deleteSelected = () => {
        if (selectedId) {
            setItems(prev => prev.filter(i => i.id !== selectedId));
            setSelectedId(null);
        }
    };

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            amber: 'bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700',
            rose: 'bg-rose-100 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700',
            sky: 'bg-sky-100 border-sky-300 dark:bg-sky-900/30 dark:border-sky-700',
            emerald: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700',
            violet: 'bg-violet-100 border-violet-300 dark:bg-violet-900/30 dark:border-violet-700',
            pink: 'bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700',
        };
        return colorMap[color] || colorMap.amber;
    };

    return (
        <div className="h-screen bg-slate-100 dark:bg-slate-900 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Icon name="dashboard" className="text-violet-500 text-2xl" />
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Creative Canvas</h1>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex gap-1">
                        <button onClick={addSticky} className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:scale-110 transition-transform" title="Add Sticky Note">
                            <Icon name="sticky_note_2" />
                        </button>
                        <button onClick={addText} className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:scale-110 transition-transform" title="Add Text">
                            <Icon name="text_fields" />
                        </button>
                        <button className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:scale-110 transition-transform" title="Add Image">
                            <Icon name="add_photo_alternate" />
                        </button>
                        <button className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform" title="Add Shape">
                            <Icon name="pentagon" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {selectedId && (
                        <button onClick={deleteSelected} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-110 transition-transform">
                            <Icon name="delete" />
                        </button>
                    )}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Icon name="remove" className="text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="w-12 text-center text-sm text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Icon name="add" className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                    <button className="px-4 py-2 bg-violet-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-violet-600 transition-colors">
                        <Icon name="download" /> Export
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                    backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                    backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                    backgroundPosition: `${pan.x}px ${pan.y}px`
                }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={`absolute cursor-move transition-shadow ${selectedId === item.id ? 'ring-2 ring-violet-500 shadow-xl' : 'shadow-md hover:shadow-lg'}`}
                            style={{ left: item.x, top: item.y, width: item.width, zIndex: selectedId === item.id ? 10 : 1 }}
                            onMouseDown={(e) => handleItemMouseDown(e, item.id)}
                        >
                            {item.type === 'sticky' && (
                                <div className={`${getColorClasses(item.color || 'amber')} border-2 rounded-lg p-3 h-full`}>
                                    <textarea
                                        className="w-full h-full bg-transparent resize-none text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                                        value={item.content}
                                        onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, content: e.target.value } : i))}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                            {item.type === 'text' && (
                                <input
                                    type="text"
                                    className="w-full bg-transparent text-slate-900 dark:text-white font-medium text-lg focus:outline-none border-b-2 border-transparent focus:border-violet-500"
                                    value={item.content}
                                    onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, content: e.target.value } : i))}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                            {item.type === 'image' && (
                                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${item.color === 'rose' ? 'from-rose-400 to-pink-500' : 'from-violet-400 to-purple-500'} flex items-center justify-center border-4 border-white dark:border-slate-800`}>
                                    <Icon name="image" className="text-white/50 text-4xl" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur text-white text-sm rounded-lg">
                Drag to move items • Scroll to pan • Use toolbar to add elements
            </div>
        </div>
    );
};
