// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { ThemeProvider } from 'next-themes';
import { HeroUIProvider } from '@heroui/react';

/**
 * Type of ChatContainerProps.
 *
 * @param children - The children of the chat container.
 * @param theme - The theme of the chat container. Here we force the theme to be the same as the theme of the chat container. Default is light.
 */
type ChatContainerProps = {
  children: JSX.Element;
  theme: string;
};

export function ChatContainer({ children, theme }: ChatContainerProps) {
  return (
    <ThemeProvider attribute="class" forcedTheme={theme}>
      <HeroUIProvider className="h-full">{children}</HeroUIProvider>
    </ThemeProvider>
  );
}
