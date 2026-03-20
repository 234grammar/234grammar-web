import { Cormorant_Garamond, DM_Mono } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '600', '700'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  weight: ['400', '500'],
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${dmMono.variable}`}>
      {children}
    </div>
  );
}
