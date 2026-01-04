import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import firebase from 'firebase/compat/app';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Activity } from '../types';
import { dataUrlToBlob } from '../utils/fileUtils';
import { HistoryPanel } from '../components/HistoryPanel';
import { aiService } from '../services/ai';

type GenerationMode = 'quality' | 'realistic';

export const ImageGenPage: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<GenerationMode>('quality');

  const [history, setHistory] = useState<Activity[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setIsHistoryLoading(true);
    const q = db.collection('activities')
      .where('userId', '==', user.uid)
      .where('type', '==', 'image-generation')
      .orderBy('createdAt', 'desc');

    const unsubscribe = q.onSnapshot((snapshot) => {
      const userHistory: Activity[] = [];
      snapshot.forEach(doc => userHistory.push({ id: doc.id, ...doc.data() } as Activity));
      setHistory(userHistory);
      setIsHistoryLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    setIsLoading(true);
    setError(null);
    setImage(null);

    try {
      const result = await aiService.generateImage(prompt, mode);
      const imageUrl = `data:${result.mimeType};base64,${result.imageData}`;

      setImage(imageUrl);

      // Save to history
      const imageBlob = dataUrlToBlob(imageUrl);
      const activityId = `${user.uid}-${Date.now()}`;
      const storageRef = ref(storage, `user_activity/${user.uid}/image-gen/${activityId}`);
      await uploadBytes(storageRef, imageBlob);
      const downloadUrl = await getDownloadURL(storageRef);

      await db.collection('activities').add({
        userId: user.uid,
        type: 'image-generation',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        data: {
          prompt,
          generationMode: mode,
          outputImageUrl: downloadUrl,
        }
      });

    } catch (e: any) {
      setError(e.message || 'Failed to generate image. Please try again.');
      console.error('Generation execution failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetIdeas = async () => {
    if (!prompt.trim()) return;
    setIsIdeaLoading(true);
    setError(null);
    try {
      const ideaPrompt = `Based on the user's prompt "${prompt}", suggest one creative style addition to make the image more interesting. Return just the phrase to add. For example, if the prompt is "a cat", you could return "in the style of vaporwave" or "as a detailed watercolor painting". Be concise.`;
      const result = await aiService.generateText(ideaPrompt, undefined, 'gemini-2.0-flash-exp');
      const idea = result.result.trim().replace(/"/g, ''); // Clean up quotes
      setPrompt(prev => `${prev}, ${idea}`);
    } catch (e) {
      setError('Could not get ideas. Please try again.');
      console.error(e);
    } finally {
      setIsIdeaLoading(false);
    }
  };

  const loadFromHistory = (item: Activity) => {
    setPrompt(item.data.prompt || '');
    setMode(item.data.generationMode || 'quality');
    setImage(item.data.outputImageUrl || null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <Icon name="image" /> Image Generation
          </h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-lg font-medium mb-2">Your Prompt</label>
              <div className="flex gap-2">
                <input id="prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A futuristic cityscape at sunset..." className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" disabled={isLoading} />
                <button onClick={handleGetIdeas} disabled={isIdeaLoading || !prompt.trim()} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 text-sm" title="Get prompt ideas">
                  {isIdeaLoading ? <Spinner className="w-4 h-4" /> : <Icon name="lightbulb" className="text-base" />}
                  <span>Ideas</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Mode:</span>
                  <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <button onClick={() => setMode('quality')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${mode === 'quality' ? 'bg-white dark:bg-gray-800 shadow text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}>High Quality</button>
                    <button onClick={() => setMode('realistic')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${mode === 'realistic' ? 'bg-white dark:bg-gray-800 shadow text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}>Realistic</button>
                  </div>
                </div>
              </div>
              <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                {isLoading ? <Spinner /> : <Icon name="auto_awesome" />}<span>{isLoading ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</p>}

        <div className="w-full flex justify-center items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md min-h-[400px]">
          {isLoading && <Spinner className="h-10 w-10" />}
          {image && (
            <div className="relative group">
              <img src={image} alt={prompt} className="max-w-full max-h-[512px] rounded-md shadow-lg" />
              <a
                href={image}
                download="generated-image.jpg"
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100"
                aria-label="Download image"
              >
                <Icon name="download" />
              </a>
            </div>
          )}
          {!isLoading && !image && <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here.</p>}
        </div>
      </div>
      <div className="lg:col-span-1">
        <HistoryPanel
          title="Image History"
          isLoading={isHistoryLoading}
          items={history}
          onItemClick={loadFromHistory}
          renderItem={(item) => (
            <div className="flex items-center gap-3">
              <img src={item.data.outputImageUrl} alt={item.data.prompt} className="w-12 h-12 rounded-md object-cover bg-gray-200 dark:bg-gray-700" />
              <p className="font-semibold truncate flex-1">{item.data.prompt}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};