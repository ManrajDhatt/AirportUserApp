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
  const [isFeedbackDropdownOpen, setIsFeedbackDropdownOpen] = useState(false); // state for feedback dropdown
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState("/default_user.jpg");
  const dropdownRef = useRef(null);
  const feedbackDropdownRef = useRef(null); // ref for feedback dropdown
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
      if (feedbackDropdownRef.current && !feedbackDropdownRef.current.contains(event.target)) {
        setIsFeedbackDropdownOpen(false); // close feedback dropdown if click outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        {/* Feedback Dropdown */}
        <Link href="/Contact" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">Contact</Link>


        <Link href="/order_history" className="hover:text-[#7C85F6] transition text-black text-lg font-medium">Orders</Link>
      </div>

      <div className="flex items-center space-x-4">

        <Link href="/store/Cart">
          <div className="relative cursor-pointer">
            {cartItems.length > 0 ? (
              <BsCartPlusFill className="text-xl text-gray-500" />
            ) : (
              <BsCartPlus className="text-xl text-gray-700" />
            )}
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full px-1">
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
            <img className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-md" src={userImage} alt="User profile"/>

          </button>

          {isDropdownOpen && (
  <div className="absolute top-10 left-0 z-50 bg-white shadow-xl rounded-lg w-48 py-2 transition-all duration-200 ease-in-out border border-gray-100">
    <ul className="text-gray-700 divide-y divide-gray-100">
      {isLoggedIn ? (
        <>
         
          
          <li>
            <button
              onClick={handleAuthAction}
              className="w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-gray-100 transition-all"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <li>
          <button
            onClick={handleAuthAction}
            className="w-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all text-left"
          >
            Login
          </button>
        </li>
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