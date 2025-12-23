import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ultimatecontextapi.vercel.app"),
  title: {
    default: "Ultimate Context API",
    template: "%s | Ultimate Context API",
  },
  description: "The API that gives you real-time location, weather, currency, and security context for your users in < 50ms.",
  openGraph: {
    title: "Ultimate Context API",
    description: "Real-time context in milliseconds. Location, Weather, Currency, Security - all in one API.",
    url: "https://ultimatecontextapi.vercel.app",
    siteName: "Ultimate Context API",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Context API",
    description: "Real-time context in milliseconds. Location, Weather, Currency, Security - all in one API.",
    creator: "@chiragadve",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
