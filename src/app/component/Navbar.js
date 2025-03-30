// "use client";
// import Link from "next/link";
// import { BsCartPlus, BsCartPlusFill } from "react-icons/bs";
// import React, { useState, useRef, useEffect } from "react";
// import { useStore } from "../context/StoreContext";
// import { useRouter } from "next/navigation";
// import { signOut } from "firebase/auth";
// import { auth } from "@/app/lib/firebase";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const { cartItems } = useStore();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     }
//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDropdownOpen]);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };
//   const router = useRouter();

//   const handleLogout = async () => {
//     await signOut(auth);
//     toast.success("Logout Successful!!");
//     router.push("/LoginPage");
//   };

//   return (
//     <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg shadow-lg rounded-full px-6 flex items-center justify-between w-[100%] max-w-md border border-gray-300 z-50">
//       {/* Left Section - Logo & Navigation */}
//       <div className="flex items-center space-x-6">
//         <Link href="/">
//           <img src="/images/airport_images/Untitled design.png" alt="Brand Logo" className="h-16 w-auto" />
//         </Link>
//         <Link href="/" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">
//           Home
//         </Link>
//         <Link href="/store" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">
//           Store
//         </Link>
//         <Link href="/order_history" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">
//           Orders
//         </Link>
//       </div>

//       {/* Right Section - Icons */}
//       <div className="flex items-center space-x-4">
//         {/* Shopping Cart Icon */}
//         <Link href="/store/Cart">
//           <div className="relative cursor-pointer">
//             {cartItems.length > 0 ? (
//               <BsCartPlusFill className="text-xl text-blue-500" />
//             ) : (
//               <BsCartPlus className="text-xl text-gray-700" />
//             )}
//             {cartItems.length > 0 && (
//               <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1">
//                 {cartItems.length}
//               </span>
//             )}
//           </div>
//         </Link>

//         {/* Profile Section */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             type="button"
//             className="flex items-center justify-center text-sm rounded-full focus:ring-4 focus:ring-blue-300"
//             onClick={toggleDropdown}
//           >
//             <span className="sr-only">Open user menu</span>
//             <img
//               className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-md"
//               src="/images/comment_user.jpg"
//               alt="User profile"
//             />
//           </button>

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div className="absolute top-12 right-0 z-50 bg-white shadow-lg rounded-lg w-40 py-2">
//               <ul className="text-gray-700">
//                 <li>
//                   <a href="#" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
//                 </li>
//                 <li>
//                   <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
//                 </li>
//                 <li>
//                   <a href="#" className="block px-4 py-2 hover:bg-gray-100">Earnings</a>
//                 </li>
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



"use client";
import Link from "next/link";
import { BsCartPlus, BsCartPlusFill } from "react-icons/bs";
import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { toast } from "react-toastify";

const Navbar = () => {
  const { cartItems } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState("/default_user.jpg");
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserImage(user.photoURL || "/default_user.jpg");
      } else {
        setIsLoggedIn(false);
        setUserImage("/default_user.jpg");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      await signOut(auth);
      toast.success("Logout Successful!");
      router.push("/");
    } else {
      router.push("/LoginPage");
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg shadow-lg rounded-full px-6 flex items-center justify-between w-[100%] max-w-md border border-gray-300 z-50">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <img src="/images/airport_images/Untitled design.png" alt="Brand Logo" className="h-16 w-auto" />
        </Link>
        <Link href="/" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">Home</Link>
        <Link href="/store" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">Store</Link>
        <Link href="/order_history" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">Orders</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/store/Cart">
          <div className="relative cursor-pointer">
            {cartItems.length > 0 ? (
              <BsCartPlusFill className="text-xl text-blue-500" />
            ) : (
              <BsCartPlus className="text-xl text-gray-700" />
            )}
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </div>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center justify-center text-sm rounded-full focus:ring-4 focus:ring-blue-300"
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md" src={userImage} alt="User profile"/>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-7 left-5 z-50 bg-white shadow-lg rounded-lg w-40 py-1">
              <ul className="text-gray-700">
                {isLoggedIn ? (
                  <>
                    <li><a href="#" className="block px-4 py-2 text-center hover:bg-gray-100">Dashboard</a></li>
                    <li><a href="#" className="block px-4 py-2 text-center hover:bg-gray-100">Settings</a></li>
                    <li><a href="#" className="block px-4 py-2 text-center hover:bg-gray-100">Earnings</a></li>
                    <li><button onClick={handleAuthAction} className="block w-full text-center px-4 py-2 hover:bg-gray-100">Logout</button></li>
                  </>
                ) : (
                  <li><button onClick={handleAuthAction} className="block w-full  px-4 py-2 text-center hover:bg-gray-100">Login</button></li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
