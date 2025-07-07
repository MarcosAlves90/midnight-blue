import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brevis = localFont({
  src: "./fonts/brevis.otf",
  variable: "--font-brevis",
});

const futuraProBook = localFont({
  src: "./fonts/futura-pro-book.ttf",
  variable: "--font-futura-pro-book",
});

export const metadata: Metadata = {
  title: {
    default: "MidNight",
    template: "MidNight - %s",
  },
  description: "Plataforma de fichas de RPG para o sistema de The Mental World.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brevis.variable} ${futuraProBook.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ToastContainer 
            limit={5}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
