import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Global Logistics - International Trade Logistics Solutions',
    template: '%s | Global Logistics',
  },
  description: 'Professional international trade logistics business providing sea transportation, air transportation, rail freight, customs brokerage, warehousing and multi-modal transport services worldwide.',
  keywords: ['logistics', 'international shipping', 'freight forwarding', 'ocean freight', 'air freight', 'customs brokerage', 'rail freight', 'warehousing'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
