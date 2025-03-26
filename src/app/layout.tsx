"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../app/component/Navbar";
import Footer from "../app/component/Footer";
import { StoreProvider } from "./context/StoreContext";
import { auth } from "@/app/lib/firebase";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Always show Navbar (even while loading)
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <ToastContainer autoClose={3000} position="top-right" />
        
        <StoreProvider>
          {/* ✅ Navbar should always be visible (except login page) */}
          {pathname !== "/login" && <Navbar />}

          {isAuthenticated === null ? (
            // 🔄 Loading Effect
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          ) : (
            <main className="w-full px-4 py-6 flex-grow">{children}</main>
          )}

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
