import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serenada — Katalog Undangan & Sistem Order',
  description:
    'Platform katalog undangan pernikahan dengan kustomisasi nama instan, sistem pembayaran otomatis QRIS dan Virtual Account, serta dashboard manajemen pesanan admin.',
  openGraph: {
    title: 'Serenada — Katalog Undangan & Sistem Order',
    description:
      'Platform katalog undangan pernikahan dengan kustomisasi nama instan, sistem pembayaran otomatis QRIS dan Virtual Account, serta dashboard manajemen pesanan admin.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serenada — Katalog Undangan & Sistem Order',
    description:
      'Platform katalog undangan pernikahan dengan kustomisasi nama instan, sistem pembayaran otomatis QRIS dan Virtual Account, serta dashboard manajemen pesanan admin.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F0F7FD] text-[#0F172A] antialiased selection:bg-[#BFDBFE] selection:text-[#1E3A8A]"
      >
        {children}
      </body>
    </html>
  );
}
