import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { AppProviders } from "../contexts/Providers";

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
    template: "%s - MidNight",
  },
  description:
    "Plataforma de fichas de RPG para o sistema de The Mental World.",
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
        <AppProviders>
          <ThemeProvider attribute="class" defaultTheme="dark" themes={["dark", "black"]} enableSystem={false}>
            <div className="relative min-h-screen">
              {children}
              <ToastContainer limit={5} />
            </div>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
