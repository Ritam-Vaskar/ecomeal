import './globals.css';

export const metadata = {
  title: 'Ecomeal | Kitchen Intelligence',
  description: 'AI-powered inventory and kitchen intelligence platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
