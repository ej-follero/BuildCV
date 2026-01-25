import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ResumeData } from '../types';

const MAX_HISTORY = 50;

export function useHistory(initialData: ResumeData) {
  const [history, setHistory] = useState<ResumeData[]>([initialData]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const historyRef = useRef(history);
  const indexRef = useRef(currentIndex);

  // Keep refs in sync
  useEffect(() => {
    historyRef.current = history;
    indexRef.current = currentIndex;
  }, [history, currentIndex]);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);

  const addToHistory = useCallback((data: ResumeData) => {
    const prevIndex = indexRef.current;
    const prevHistory = historyRef.current;
    
    const newHistory = prevHistory.slice(0, prevIndex + 1);
    newHistory.push(data);
    
    let newIndex: number;
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
      newIndex = MAX_HISTORY - 1;
    } else {
      newIndex = newHistory.length - 1;
    }
    
    setHistory(newHistory);
    setCurrentIndex(newIndex);
  }, []);

  const undo = useCallback(() => {
    let result: ResumeData | null = null;
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        result = historyRef.current[newIndex];
        return newIndex;
      }
      return prevIndex;
    });
    return result;
  }, []);

  const redo = useCallback(() => {
    let result: ResumeData | null = null;
    setCurrentIndex((prevIndex) => {
      if (prevIndex < historyRef.current.length - 1) {
        const newIndex = prevIndex + 1;
        result = historyRef.current[newIndex];
        return newIndex;
      }
      return prevIndex;
    });
    return result;
  }, []);

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
