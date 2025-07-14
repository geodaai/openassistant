// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useEffect, useRef, useState } from 'react';

interface ResizeObserverEntry {
  contentRect: {
    width: number;
    height: number;
  };
}

export function useResizeObserver<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { elementRef, dimensions };
} 