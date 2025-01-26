import { useState, useEffect } from 'react';

export const useShiftDrag = () => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('keydown', e.shiftKey);
      if (e.shiftKey) setIsDragging(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('keyup', e.shiftKey);
      if (!e.shiftKey) setIsDragging(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onDragStart = (
    handler: (e: React.DragEvent<HTMLDivElement>) => void
  ) => {
    return (e: React.DragEvent<HTMLDivElement>) => {
      if (!isDragging) {
        e.preventDefault();
        return;
      }
      handler(e);
    };
  };

  return {
    isDragging,
    onDragStart,
  };
};
