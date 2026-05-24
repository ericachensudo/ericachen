import './globals.css';

export const metadata = {
  title: 'Erica Chen',
  description: 'Three spaces, one person.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
