// // "use client";

// // import { useState, useEffect } from "react";
// // import { usePathname } from "next/navigation";
// // import Navbar from "../app/component/Navbar";
// // import Footer from "../app/component/Footer";
// // import { StoreProvider, useStore } from "./context/StoreContext"; // Import cart context
// // import { auth } from "@/app/lib/firebase";
// // import { ToastContainer } from "react-toastify";
// // import StickyCartBanner from "../app/component/StickyCartBanner"; // Import StickyCartBanner
// // import "./globals.css";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
// //   const pathname = usePathname();

// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       setIsAuthenticated(true);
// //       return;
// //     }

// //     const unsubscribe = auth.onAuthStateChanged((user) => {
// //       setIsAuthenticated(!!user);
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   return (
// //     <html lang="en">
// //       <head>
// //         <title>My App</title>
// //       </head>
// //       <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
// //         <ToastContainer autoClose={3000} position="top-right" />

// //         <StoreProvider>
// //           {pathname !== "/login" && <Navbar />}

// //           {isAuthenticated === null ? (
// //             <div className="flex items-center justify-center h-screen bg-gray-50">
// //               <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
// //             </div>
// //           ) : (
// //             <main className="w-full px-4 py-6 flex-grow">{children}</main>
// //           )}

// //           {/* ✅ Add StickyCartBanner inside StoreProvider */}
// //           <StickyCartBanner />

// //           <Footer />
// //         </StoreProvider>
// //       </body>
// //     </html>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import Navbar from "../app/component/Navbar";
// import Footer from "../app/component/Footer";
// import { StoreProvider } from "./context/StoreContext";
// import { auth } from "@/app/lib/firebase";
// import { ToastContainer } from "react-toastify";
// import StickyCartBanner from "../app/component/StickyCartBanner";
// import "./globals.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import LoginPage from "../app/LoginPage/page";


// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const pathname = usePathname();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setIsAuthenticated(true);
//       return;
//     }

//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsAuthenticated(!!user);
//     });

//     return () => unsubscribe();
//   }, []);
//   const isLoginPage = pathname.startsWith("/login"); // ✅ Fix for pathname detection

//   return (
//     <html lang="en">
//        <head>
//         <title>My App</title>
//        </head>
//        <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
//        <ToastContainer autoClose={3000} position="top-right" />

//     <StoreProvider>
//       {!isLoginPage && <Navbar />}
  
//       {isAuthenticated === null ? (
//         <div className="flex items-center justify-center h-screen bg-gray-50">
//           <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
//         </div>
//       ) : (
//         <main className="w-full px-4 py-6 flex-grow">{children}</main>
//       )}
  
//       {!isLoginPage && <StickyCartBanner />}
//       {!isLoginPage && <Footer />}
//     </StoreProvider>
//     </body>
//     </html>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../app/component/Navbar";
import Footer from "../app/component/Footer";
import { StoreProvider } from "./context/StoreContext";
import { auth } from "@/app/lib/firebase";
import { ToastContainer } from "react-toastify";
import StickyCartBanner from "../app/component/StickyCartBanner";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

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

  // Match the exact login page URL
  const isLoginPage = pathname === "/LoginPage";

  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <ToastContainer autoClose={3000} position="top-right" />

        <StoreProvider>
          {!isLoginPage && <Navbar />}

          {isAuthenticated === null ? (
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          ) : (
            <main className="w-full px-4 py-6 flex-grow">{children}</main>
          )}

          {!isLoginPage && <StickyCartBanner />}
          {!isLoginPage && <Footer />}
        </StoreProvider>
      </body>
    </html>
  );
}