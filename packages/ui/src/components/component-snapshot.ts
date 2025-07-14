// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import React, { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';

/**
 * Renders a React component and captures its snapshot as a base64 string
 * @param Component The React component to render
 * @param props The props to pass to the component
 * @returns A promise that resolves to a base64 string of the component's snapshot
 */
export async function captureComponentSnapshot<P extends object>(
  Component: ComponentType<P>,
  props: P
): Promise<string> {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '100px';
  container.style.height = '100px';
  document.body.appendChild(container);

  try {
    // Render the component
    const root = createRoot(container);
    root.render(React.createElement(Component, props));

    // Wait for the component to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture the snapshot using html2canvas
    const canvas = await html2canvas(container, {
      scale: window.devicePixelRatio,
      backgroundColor: null,
      useCORS: true,
    });

    // Convert to base64
    return canvas.toDataURL('image/png');
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
} 