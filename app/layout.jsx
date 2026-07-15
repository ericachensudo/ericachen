import './globals.css';

export const metadata = {
  title: 'Erica Chen',
  description: 'Three spaces, one person.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-100">
        {children}
      </body>
    </html>
  );
}
