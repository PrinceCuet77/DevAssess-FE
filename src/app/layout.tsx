import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Providers from '@/providers';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Developer Accessment Platform',
  description:
    'It is a platform where a evaluators publish paid technical assessments, developers buy them, take them, and review them, and admins oversee the whole marketplace.',
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('devassess-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(
        'h-full',
        'dark',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className='min-h-full flex flex-col' suppressHydrationWarning>
        <Providers>
          <Toaster richColors closeButton />
          {children}
        </Providers>
      </body>
    </html>
  );
}
