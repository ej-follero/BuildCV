import { useState, useCallback } from 'react';
import { ResumeData } from '../types';

const MAX_HISTORY = 50;

export function useHistory(initialData: ResumeData) {
  const [history, setHistory] = useState<ResumeData[]>([initialData]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const addToHistory = useCallback((data: ResumeData) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(data);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        setCurrentIndex(MAX_HISTORY - 1);
      } else {
        setCurrentIndex(newHistory.length - 1);
      }
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [canRedo, currentIndex, history]);

  const getCurrent = useCallback(() => {
    return history[currentIndex];
  }, [history, currentIndex]);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrent,
  };
}
