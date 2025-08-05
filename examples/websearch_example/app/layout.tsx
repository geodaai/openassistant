import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebSearch Example',
  description: 'Example of using the webSearch tool from OpenAssistant Places',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 