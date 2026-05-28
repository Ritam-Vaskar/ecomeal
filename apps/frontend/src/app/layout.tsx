import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata = {
  title: 'Ecomeal | Kitchen Intelligence',
  description: 'AI-powered inventory and kitchen intelligence platform.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
