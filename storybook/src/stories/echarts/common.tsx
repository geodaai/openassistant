import { ResizablePlotContainer } from '@openassistant/common';
import { ThemeProvider } from 'next-themes';

export function ResizableThemeWrapper({
  children,
  forcedTheme = 'light',
}: {
  children: JSX.Element;
  forcedTheme?: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={forcedTheme}
      defaultTheme="light"
      enableSystem={false}
    >
      <div className="common-wrapper w-[400px] h-[600px]">
        <ResizablePlotContainer>{children}</ResizablePlotContainer>
      </div>
    </ThemeProvider>
  );
}

export function SimpleThemeWrapper({
  children,
  forcedTheme = 'light',
  width = '400px',
  height = '600px',
}: {
  children: JSX.Element;
  forcedTheme?: string;
  width?: string;
  height?: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={forcedTheme}
      defaultTheme="light"
      enableSystem={false}
    >
      <div className={`common-wrapper w-[${width}] h-[${height}]`}>
        {children}
      </div>
    </ThemeProvider>
  );
}
