
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { fileToBase64 } from '../utils/fileUtils';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import firebase from 'firebase/compat/app';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Activity } from '../types';
import { HistoryPanel } from '../components/HistoryPanel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { aiService } from '../services/ai';

export const ImageAnalyzerPage: React.FC = () => {
  const { user } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<Activity[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setIsHistoryLoading(true);
    const q = db.collection('activities')
      .where('userId', '==', user.uid)
      .where('type', '==', 'image-analysis')
      .orderBy('createdAt', 'desc');

    const unsubscribe = q.onSnapshot((snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
      setIsHistoryLoading(false);
    });
    return () => unsubscribe();
  }, [user]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult('');
    }
  };

  const handleAnalyze = async (customPrompt?: string) => {
    const analysisPrompt = customPrompt || prompt;
    if (!image || !analysisPrompt.trim() || !user) return;

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      // 1. Upload input image to storage first
      const activityId = `${user.uid}-${Date.now()}`;
      const storageRef = ref(storage, `user_activity/${user.uid}/image-analysis/${activityId}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Call Backend API
      const base64Image = await fileToBase64(image);
      const response = await aiService.analyzeImage(base64Image, image.type, analysisPrompt);
      const resultText = response.result;

      setResult(resultText);

      // 3. Save result to history
      await db.collection('activities').add({
        userId: user.uid,
        type: 'image-analysis',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        data: {
          prompt: analysisPrompt,
          resultText,
          inputImageUrl: imageUrl
        }
      });

    } catch (e: any) {
      setError(e.message || 'Failed to analyze image. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: Activity) => {
    setImage(null);
    setImagePreview(item.data.inputImageUrl || null);
    setPrompt(item.data.prompt || '');
    setResult(item.data.resultText || '');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <Icon name="document_scanner" /> Image Analysis
          </h1>
          <div
            className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex justify-center items-center cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {imagePreview ? (
              <img src={imagePreview} alt="upload preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Icon name="upload_file" className="text-4xl" />
                <p>Click to upload an image</p>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Quick Actions:</span>
              <button onClick={() => handleAnalyze("Generate a detailed accessibility description (alt text) for this image.")} disabled={isLoading || !image} className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"><Icon name="accessibility_new" className="text-base" /> Alt Text</button>
              <button onClick={() => handleAnalyze("Identify and list all distinct objects in this image.")} disabled={isLoading || !image} className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"><Icon name="label" className="text-base" /> Identify Objects</button>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Or ask a custom question about the image..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading || !imagePreview}
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading || !prompt.trim() || !image}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                {isLoading ? <Spinner /> : <Icon name="analytics" />}
                <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</p>}

        {result && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-lg font-medium mb-2">Analysis Result</h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
              <MarkdownRenderer content={result} />
            </div>
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <HistoryPanel
          title="Analysis History"
          isLoading={isHistoryLoading}
          items={history}
          onItemClick={loadFromHistory}
          renderItem={(item) => (
            <div className="flex items-center gap-3">
              <img src={item.data.inputImageUrl} alt={item.data.prompt} className="w-12 h-12 rounded-md object-cover bg-gray-200 dark:bg-gray-700" />
              <p className="font-semibold truncate flex-1">{item.data.prompt}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};
