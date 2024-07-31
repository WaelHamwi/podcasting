//import { Inter } from 'next/font/google';
import './globals.css';
//const inter = Inter({ subsets: ['latin'] });
import { ConvexClerkProvider } from '@/providers/ConvexProviderClerk';
import AudioProvider from '@/providers/AudioProvider';
export const metadata = {
    title: 'Podcast',
    description: 'Generated podcast by Wael Hamwi using SAAS, Nextjs, typescript, tailwind, Ai and so on',
    icons: {
        icon: '/icons/podcasts.svg',
    },
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body className='bg-black-800'>
      <AudioProvider>
      <ConvexClerkProvider>{children}</ConvexClerkProvider>
      </AudioProvider>
      </body>
    </html>);
}
