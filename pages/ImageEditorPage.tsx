
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { fileToBase64, dataUrlToBlob } from '../utils/fileUtils';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import firebase from 'firebase/compat/app';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Activity } from '../types';
import { HistoryPanel } from '../components/HistoryPanel';
import { aiService } from '../services/ai';

export const ImageEditorPage: React.FC = () => {
  const { user } = useAuth();
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
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
      .where('type', '==', 'image-editor')
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
      setOriginalImage(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setEditedImage(null);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim() || !user) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Image = await fileToBase64(originalImage);

      const result = await aiService.editImage(base64Image, originalImage.type, prompt);
      const editedImageUrl = `data:${result.mimeType};base64,${result.imageData}`;

      setEditedImage(editedImageUrl);

      // Save to history
      const activityId = `${user.uid}-${Date.now()}`;
      const originalStorageRef = ref(storage, `user_activity/${user.uid}/image-editor/${activityId}-original`);
      const editedStorageRef = ref(storage, `user_activity/${user.uid}/image-editor/${activityId}-edited`);

      const editedImageBlob = dataUrlToBlob(editedImageUrl);

      await uploadBytes(originalStorageRef, originalImage);
      await uploadBytes(editedStorageRef, editedImageBlob);

      const originalDownloadUrl = await getDownloadURL(originalStorageRef);
      const editedDownloadUrl = await getDownloadURL(editedStorageRef);

      await db.collection('activities').add({
        userId: user.uid,
        type: 'image-editor',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        data: {
          prompt,
          inputImageUrl: originalDownloadUrl,
          outputImageUrl: editedDownloadUrl
        }
      });

    } catch (e: any) {
      setError(e.message || 'Failed to edit image. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: Activity) => {
    setOriginalImage(null);
    setOriginalImagePreview(item.data.inputImageUrl || null);
    setEditedImage(item.data.outputImageUrl || null);
    setPrompt(item.data.prompt || '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <Icon name="auto_fix_high" /> Image Editor
          </h1>
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 items-start">
            {/* Input Column */}
            <div className="space-y-4">
              <div
                className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex justify-center items-center cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {originalImagePreview ? (
                  <img src={originalImagePreview} alt="upload preview" className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Icon name="upload_file" className="text-4xl" />
                    <p>Click to upload an image</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Add a retro filter"
                  className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoading || !originalImage}
                />
                <button
                  onClick={handleEdit}
                  disabled={isLoading || !prompt.trim() || !originalImage}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  {isLoading ? <Spinner /> : <Icon name="auto_awesome" />}
                  <span>{isLoading ? 'Editing...' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="w-full flex justify-center items-center p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg min-h-[320px]">
              {isLoading && <Spinner className="h-10 w-10" />}
              {editedImage && (
                <div className="relative group">
                  <img src={editedImage} alt={prompt} className="max-w-full max-h-[512px] rounded-md shadow-lg" />
                  <a
                    href={editedImage}
                    download="edited-image.png"
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Download edited image"
                  >
                    <Icon name="download" />
                  </a>
                </div>
              )}
              {!isLoading && !editedImage && <p className="text-gray-500 dark:text-gray-400">Your edited image will appear here.</p>}
            </div>
          </div>
        </div>
        {error && <p className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</p>}
      </div>
      <div className="lg:col-span-1">
        <HistoryPanel
          title="Edit History"
          isLoading={isHistoryLoading}
          items={history}
          onItemClick={loadFromHistory}
          renderItem={(item) => (
            <div className="flex items-center gap-3">
              <img src={item.data.inputImageUrl} alt="Original" className="w-8 h-8 rounded-md object-cover bg-gray-200 dark:bg-gray-700" />
              <Icon name="arrow_forward" />
              <img src={item.data.outputImageUrl} alt="Edited" className="w-8 h-8 rounded-md object-cover bg-gray-200 dark:bg-gray-700" />
              <p className="font-semibold truncate flex-1 ml-2">{item.data.prompt}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};
