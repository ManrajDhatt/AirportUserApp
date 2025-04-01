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
        <div className="relative" ref={feedbackDropdownRef}>
          <button
            className="hover:text-[#7C85F6] transition text-black text-lg font-medium"
            onMouseEnter={() => setIsFeedbackDropdownOpen(true)} // on hover, open feedback dropdown
            onMouseLeave={() => setIsFeedbackDropdownOpen(false)} // on mouse leave, close feedback dropdown
          >
            Feedback
          </button>
          {isFeedbackDropdownOpen && (
            <div
              className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48"
              onMouseEnter={() => setIsFeedbackDropdownOpen(true)}
              onMouseLeave={() => setIsFeedbackDropdownOpen(false)}
            >
              {/* Feedback Dropdown Links */}
              <Link href="/Feedback" className="block px-4 py-2 hover:bg-gray-100">Feedback Form</Link>
              <Link href="/RateUs" className="block px-4 py-2 hover:bg-gray-100">Rate Us</Link>
              <Link href="/Contact" className="block px-4 py-2 hover:bg-gray-100">Contact Us</Link>
            </div>
          )}
        </div>

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
                  <li><button onClick={handleAuthAction} className="block w-full px-4 py-2 text-center hover:bg-gray-100">Login</button></li>
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
