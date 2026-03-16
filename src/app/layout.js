
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}











export function Footer() {
  return (
    <div className="bg-black text-white w-full flex justify-center items-center mt-auto py-4">
      <p className="text-center">
        Wikigame © 2025 - Contactos: fcorrom2907@g.educaand.es - 999999999 - C/ Blanca de los rios 1
      </p>
    </div>
  );
}