import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/ai';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import type { Trip } from '../types';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const TripPlannerPage: React.FC = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ startingPoint: '', destination: '', duration: '', budget: '', interests: '' });
    const [options, setOptions] = useState({ dining: true, transport: true, alternatives: true, proTips: true });

    const [itinerary, setItinerary] = useState('');
    const [packingList, setPackingList] = useState('');
    const [budgetBreakdown, setBudgetBreakdown] = useState('');
    const [groundingChunks, setGroundingChunks] = useState<any[]>([]);

    const [history, setHistory] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [isExtraLoading, setIsExtraLoading] = useState<'packing' | 'budget' | null>(null);
    const [error, setError] = useState('');

    const itineraryRef = useRef<HTMLDivElement>(null);
    const packingRef = useRef<HTMLDivElement>(null);
    const budgetRef = useRef<HTMLDivElement>(null);

    // Load History
    useEffect(() => {
        if (user) {
            setIsHistoryLoading(true);
            const q = db.collection('trips').where('userId', '==', user.uid).orderBy('createdAt', 'desc');
            const unsub = q.onSnapshot(snap => {
                setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip)));
                setIsHistoryLoading(false);
            });
            return () => unsub();
        }
    }, [user]);

    // Auto-scroll to new sections when generated
    useEffect(() => {
        if (packingList && packingRef.current) {
            packingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [packingList]);

    useEffect(() => {
        if (budgetBreakdown && budgetRef.current) {
            budgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [budgetBreakdown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setOptions({ ...options, [e.target.name]: e.target.checked });

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { setError('You must be logged in.'); return; }

        setIsLoading(true);
        setError('');
        setSelectedTrip(null);
        setItinerary('');
        setPackingList('');
        setBudgetBreakdown('');
        setGroundingChunks([]);

        let prompt = `You are an expert travel planner. Create a highly detailed, day-by-day travel itinerary for a trip to ${form.destination}, starting from ${form.startingPoint}.
        
        **Trip Details:**
        - Duration: ${form.duration} days
        - Budget: ${form.budget}
        - Interests: ${form.interests}

        **Requirements:**
        - Use specific place names so they can be found on Google Maps.
        - Format the output in clean Markdown.
        - Group activities by morning, afternoon, and evening.
        `;

        if (options.dining) prompt += `\n- Include specific restaurant recommendations for lunch and dinner.`;
        if (options.transport) prompt += `\n- Include transportation advice between locations.`;
        if (options.proTips) prompt += `\n- Include 'Pro Tips' for avoiding crowds or saving money.`;

        try {
            // 2. Call Backend API
            const response = await aiService.generateTripItinerary(form, options);

            const result = response.itinerary;
            const sanitizedChunks = response.groundingChunks || [];

            setItinerary(result);
            setGroundingChunks(sanitizedChunks);

            const newTripData = {
                ...form,
                itinerary: result,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            // Set selectedTrip FIRST so buttons work even if Firebase fails
            const tempTrip = {
                ...newTripData,
                id: 'temp-' + Date.now(),
                createdAt: { toDate: () => new Date() }
            } as unknown as Trip;
            setSelectedTrip(tempTrip);

            // Then try to save to Firebase
            try {
                const ref = await db.collection('trips').add(newTripData);
                // Update with real ID
                setSelectedTrip({
                    ...newTripData,
                    id: ref.id,
                    createdAt: { toDate: () => new Date() }
                } as unknown as Trip);
            } catch (dbError) {
                console.error('Firebase save failed, but trip is still usable:', dbError);
            }

        } catch (e: any) {
            setError(e.message || 'Generation failed. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const generateExtra = async (type: 'packing' | 'budget') => {
        if (!selectedTrip) {
            setError("Please select or generate a trip first.");
            return;
        }
        setIsExtraLoading(type);

        // Use Shadow SI for packing lists and budgets
        const modelName = undefined; // Use backend default

        const prompt = type === 'packing'
            ? `I am going to ${selectedTrip.destination} for ${selectedTrip.duration} days. My interests are ${selectedTrip.interests}. Create a structured packing list. 
               Categories: Essentials, Clothing (Weather appropriate), Electronics, Toiletries, and specific gear for my interests. Format as a Markdown checklist.`
            : `Create a realistic budget breakdown for a trip to ${selectedTrip.destination} (${selectedTrip.duration} days) with a total budget of ${selectedTrip.budget}. 
               Provide specific estimates for: Accommodation, Food & Dining, Transportation, Activities, and a 'Buffer' fund. Format as a markdown table.`;

        try {
            // 2. Call Backend API
            const response = await aiService.generateTripExtra(type, {
                destination: selectedTrip.destination,
                duration: selectedTrip.duration,
                interests: selectedTrip.interests,
                budget: selectedTrip.budget
            });

            if (type === 'packing') {
                setPackingList(response.result);
                await db.collection('trips').doc(selectedTrip.id).update({ packingList: response.result });
            } else {
                setBudgetBreakdown(response.result);
                await db.collection('trips').doc(selectedTrip.id).update({ budgetBreakdown: response.result });
            }
        } catch (e: any) {
            console.error(e);
            setError(`Failed to generate ${type}.`);
        } finally {
            setIsExtraLoading(null);
        }
    };

    const loadTrip = (t: Trip) => {
        setSelectedTrip(t);
        setItinerary(t.itinerary);
        setPackingList(t.packingList || '');
        setBudgetBreakdown(t.budgetBreakdown || '');
        setGroundingChunks([]);
        // Populate form so user can regenerate easily
        setForm({
            startingPoint: t.startingPoint,
            destination: t.destination,
            duration: t.duration,
            budget: t.budget,
            interests: t.interests
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-6rem)] pb-6">
            {/* Left Column: Form & History (Hidden when printing) */}
            <div className="flex flex-col gap-6 lg:col-span-1 h-full overflow-hidden print:hidden">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 overflow-y-auto custom-scrollbar">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-600"><Icon name="map" /> Plan Trip</h2>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Route</label>
                            <input name="startingPoint" value={form.startingPoint} onChange={handleInputChange} placeholder="From (e.g. New York)" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all focus:bg-white dark:focus:bg-black" />
                            <input name="destination" value={form.destination} onChange={handleInputChange} placeholder="To (e.g. Tokyo)" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all focus:bg-white dark:focus:bg-black" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Logistics</label>
                            <div className="flex gap-4">
                                <input type="number" name="duration" value={form.duration} onChange={handleInputChange} placeholder="Days" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500" />
                                <input name="budget" value={form.budget} onChange={handleInputChange} placeholder="Budget (e.g. $2000)" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Preferences</label>
                            <textarea name="interests" value={form.interests} onChange={handleInputChange} placeholder="What do you like? (e.g. History, Food, Hiking)" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none h-24 resize-none text-sm focus:ring-2 focus:ring-emerald-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                            {Object.entries(options).map(([k, v]) => (
                                <label key={k} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors select-none">
                                    <input type="checkbox" name={k} checked={v} onChange={handleOptionChange} className="rounded text-emerald-600 focus:ring-emerald-500" />
                                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>

                        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 text-xs rounded-lg">{error}</div>}

                        <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex justify-center items-center gap-2 transition-all transform active:scale-95">
                            {isLoading ? <Spinner className="text-white" /> : <Icon name="flight_takeoff" />} {isLoading ? 'Planning Trip...' : 'Generate Itinerary'}
                        </button>
                    </form>
                </div>

                <div className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 overflow-hidden flex flex-col">
                    <h3 className="font-bold mb-4 text-gray-500 uppercase text-xs flex items-center gap-2"><Icon name="history" /> Recent Trips</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {history.length === 0 && !isHistoryLoading && <div className="text-center text-gray-400 text-xs mt-10">No trips planned yet.</div>}
                        {history.map(t => (
                            <button key={t.id} onClick={() => loadTrip(t)} className={`w-full text-left p-3 rounded-xl border transition-all group ${selectedTrip?.id === t.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 transition-colors">{t.destination}</div>
                                    <div className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">{t.duration}d</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate">{t.startingPoint} • {t.budget}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Results */}
            <div
                className="lg:col-span-2 bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full print:border-0 print:shadow-none print:bg-white print:text-black print:block print:overflow-visible print:h-auto print:w-full print:static"
                ref={itineraryRef}
                id="trip-results"
            >
                {(itinerary || selectedTrip) ? (
                    <div className="flex flex-col h-full print:block print:h-auto">
                        {/* Toolbar - Hidden when printing */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10 print:hidden">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    {selectedTrip?.destination || form.destination} <span className="text-emerald-500 text-lg font-normal">Itinerary</span>
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">{selectedTrip?.duration || form.duration} Days • From {selectedTrip?.startingPoint || form.startingPoint}</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => generateExtra('packing')} disabled={!!isExtraLoading} className={`flex-1 sm:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center gap-2 ${isExtraLoading === 'packing' ? 'opacity-70' : ''}`}>
                                    {isExtraLoading === 'packing' ? <Spinner className="w-4 h-4 text-blue-600" /> : <Icon name="backpack" />} Packing List
                                </button>
                                <button onClick={() => generateExtra('budget')} disabled={!!isExtraLoading} className={`flex-1 sm:flex-none px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all flex items-center justify-center gap-2 ${isExtraLoading === 'budget' ? 'opacity-70' : ''}`}>
                                    {isExtraLoading === 'budget' ? <Spinner className="w-4 h-4 text-green-600" /> : <Icon name="attach_money" />} Budget
                                </button>
                                <button onClick={handlePrint} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors flex items-center gap-2 px-3" title="Print / Save PDF">
                                    <Icon name="print" /> <span className="text-xs font-bold hidden sm:inline">PDF</span>
                                </button>
                            </div>
                        </div>

                        {/* Header for Print Only */}
                        <div className="hidden print:block p-8 pb-0">
                            <h1 className="text-3xl font-bold text-black mb-2">{selectedTrip?.destination} Trip Plan</h1>
                            <p className="text-gray-600">{selectedTrip?.duration} Days • Budget: {selectedTrip?.budget}</p>
                            <hr className="my-4 border-gray-300" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth print:overflow-visible print:h-auto">
                            {/* Grounding Chips (Google Maps) - Hidden in Print to avoid clutter */}
                            {groundingChunks.length > 0 && (
                                <div className="mb-8 print:hidden">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-xs uppercase text-gray-500 tracking-wider"><Icon name="pin_drop" className="text-red-500" /> Locations Found</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {groundingChunks.map((c, i) => c.maps && (
                                            <a key={i} href={c.maps.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800 hover:shadow-md transition-all text-sm group">
                                                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform"><Icon name="place" className="text-xs" /></div>
                                                <div className="truncate max-w-[150px] font-medium text-gray-700 dark:text-gray-200">{c.maps.title}</div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-8 print:space-y-6">
                                <div className="prose dark:prose-invert max-w-none print:prose-black">
                                    <MarkdownRenderer content={itinerary} />
                                </div>

                                {packingList && (
                                    <div ref={packingRef} className="pt-8 border-t border-dashed border-gray-300 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 print:break-before-page">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600 print:text-black"><Icon name="backpack" /> Packing List</h3>
                                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 print:border print:bg-white print:p-0 print:border-none">
                                            <MarkdownRenderer content={packingList} />
                                        </div>
                                    </div>
                                )}

                                {budgetBreakdown && (
                                    <div ref={budgetRef} className="pt-8 border-t border-dashed border-gray-300 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 print:break-before-page">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600 print:text-black"><Icon name="payments" /> Budget Breakdown</h3>
                                        <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-800/30 print:border print:bg-white print:p-0 print:border-none">
                                            <MarkdownRenderer content={budgetBreakdown} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8 text-center print:hidden">
                        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Icon name="travel_explore" className="text-6xl opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">Ready to explore?</h3>
                        <p className="text-sm max-w-xs">Enter your destination details on the left to generate a grounded, AI-curated itinerary.</p>
                    </div>
                )}
            </div>
            <style>{`
                @media print { 
                    body * { visibility: hidden; display: none; } 
                    #trip-results, #trip-results * { visibility: visible; display: block; }
                    #trip-results { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        margin: 0; 
                        padding: 20px; 
                        background: white !important; 
                        color: black !important;
                        height: auto !important;
                        overflow: visible !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    /* Force prose to be black on print */
                    .prose { color: black !important; }
                    .prose h1, .prose h2, .prose h3, .prose h4, .prose strong { color: black !important; }
                }
            `}</style>
        </div>
    );
};