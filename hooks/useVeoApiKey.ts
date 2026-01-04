
import { useState, useEffect, useCallback } from 'react';

// Extend Window interface for aistudio API
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export const useVeoApiKey = () => {
  const [hasKey, setHasKey] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkKey = useCallback(async () => {
    setIsChecking(true);
    if (window.aistudio) {
      const result = await window.aistudio.hasSelectedApiKey();
      setHasKey(result);
    } else {
      setHasKey(false); // aistudio might not be available
    }
    setIsChecking(false);
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const selectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Optimistically assume key is selected.
      setHasKey(true);
    }
  };

  const handleApiError = useCallback((error: any) => {
    if (error?.message?.includes("Requested entity was not found.")) {
      setHasKey(false);
      console.error("API Key error, please select a key again.", error);
    }
  }, []);

  return { hasKey, isChecking, selectKey, handleApiError };
};