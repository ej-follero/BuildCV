import { useEffect } from 'react';

interface KeyboardShortcuts {
  onExport?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts({
  onExport,
  onNext,
  onPrevious,
  onUndo,
  onRedo,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + Enter = Export
      if (modifier && e.key === 'Enter' && onExport) {
        e.preventDefault();
        onExport();
        return;
      }

      // Cmd/Ctrl + Z = Undo (without Shift)
      if (modifier && (e.key === 'z' || e.key === 'Z') && !e.shiftKey && onUndo) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Cmd/Ctrl + Shift + Z = Redo
      if (modifier && e.shiftKey && (e.key === 'z' || e.key === 'Z') && onRedo) {
        e.preventDefault();
        onRedo();
        return;
      }

      // Arrow keys for navigation (when not in input)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        e.preventDefault();
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExport, onNext, onPrevious, onUndo, onRedo]);
}
