'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const sidebarElement = mutation.target;
          const isOpen = !sidebarElement.classList.contains('-translate-x-full');
          setSidebarOpen(isOpen);
        }
      });
    });

    const sidebarElement = document.querySelector('[data-sidebar]');
    if (sidebarElement) {
      observer.observe(sidebarElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen overflow-hidden">
          <Sidebar />
          <main
            className={`
              flex-1 relative transition-all duration-300 ease-in-out
              ${sidebarOpen ? 'lg:w-[calc(100%-16rem)]' : 'lg:w-full'}
            `}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
