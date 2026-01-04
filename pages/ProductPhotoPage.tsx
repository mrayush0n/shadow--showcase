
import React, { useState, useRef } from 'react';
import { Icon } from '../components/Icon';

interface ProductPhotoPageProps {
    onNavigate: (page: string) => void;
}

export const ProductPhotoPage: React.FC<ProductPhotoPageProps> = ({ onNavigate }) => {
    const [image, setImage] = useState<string | null>(null);
    const [background, setBackground] = useState('studio');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const backgrounds = [
        { id: 'studio', label: 'Studio White', icon: 'light_mode' },
        { id: 'lifestyle', label: 'Lifestyle', icon: 'house' },
        { id: 'nature', label: 'Nature', icon: 'park' },
        { id: 'abstract', label: 'Abstract', icon: 'blur_on' },
    ];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setResult('generated');
            setIsProcessing(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-slate-50 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
                        <Icon name="photo_camera" className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Product Photography</h1>
                        <p className="text-slate-500">AI product shots and background replacement</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Upload Product Image</h2>
                        <label className="block aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-red-500 transition-colors overflow-hidden">
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                            {image ? (
                                <img src={image} alt="Product" className="w-full h-full object-contain" />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <Icon name="add_photo_alternate" className="text-5xl mb-3" />
                                    <p className="font-medium">Upload product image</p>
                                </div>
                            )}
                        </label>

                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 mb-2">Background Style</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {backgrounds.map(bg => (
                                <button key={bg.id} onClick={() => setBackground(bg.id)} className={`flex items-center gap-2 p-3 rounded-xl ${background === bg.id ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                    <Icon name={bg.icon} /> {bg.label}
                                </button>
                            ))}
                        </div>

                        <button onClick={handleGenerate} disabled={!image || isProcessing} className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                            {isProcessing ? <><Icon name="sync" className="animate-spin" /> Processing...</> : <><Icon name="auto_awesome" /> Generate Photos</>}
                        </button>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Generated Result</h2>
                        <div className="aspect-square bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-2xl flex items-center justify-center">
                            {result ? (
                                <div className="text-center">
                                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-red-500/30 to-rose-500/30 rounded-2xl flex items-center justify-center mb-4">
                                        <Icon name="check" className="text-red-500 text-5xl" />
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">Product photo ready!</p>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Icon name="photo_camera" className="text-6xl mb-3 opacity-30" />
                                    <p>Your product photo will appear here</p>
                                </div>
                            )}
                        </div>
                        {result && (
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"><Icon name="download" /> Download</button>
                                <button className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-medium">More Variations</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
