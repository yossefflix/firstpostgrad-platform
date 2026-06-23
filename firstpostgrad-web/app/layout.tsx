import "./globals.css";
import { ThemeProvider } from './context/ThemeContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "FirstPostgrad - NHS SHO Jobs for IMG Doctors",
  description: "FirstPostgrad finds every NHS SHO job in the UK for you. Built by IMG doctors, for IMG doctors.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230F6E56'/><text x='50' y='72' font-family='Georgia,serif' font-size='68' font-weight='700' fill='white' text-anchor='middle'>F</text></svg>" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}