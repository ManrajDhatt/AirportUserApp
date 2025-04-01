"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../app/component/Navbar";
import Footer from "../app/component/Footer";
import { StoreProvider } from "./context/StoreContext";
import { auth } from "@/app/lib/firebase";
import { ToastContainer } from "react-toastify";
import StickyCartBanner from "../app/component/StickyCartBanner";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft } from "lucide-react"; // Back icon

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  // Pages where the back button should NOT appear
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/LoginPage";

  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <ToastContainer autoClose={3000} position="top-right" />

        <StoreProvider>
          {!isLoginPage && <Navbar />} {/* ✅ Navbar is visible on Home and other pages */}

          {isAuthenticated === null ? (
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          ) : (
            <main className="w-full px-4 py-6 flex-grow relative">
              {/* ✅ Back Button (Interactive & Positioned Better) */}
              {!isHomePage && !isLoginPage && (
                <button
                  onClick={() => router.back()}
                  className="fixed top-5 left-5 bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-700"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              )}

              {children}
            </main>
          )}

          {!isLoginPage && <StickyCartBanner />}
          {!isLoginPage && <Footer />}
        </StoreProvider>
      </body>
    </html>
  );
}
