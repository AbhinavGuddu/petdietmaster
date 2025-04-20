import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Object Identifier',
  description: 'Identify objects in real-time using your camera',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen relative">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 