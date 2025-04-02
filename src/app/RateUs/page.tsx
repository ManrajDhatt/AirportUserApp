"use client";

import React, { useState } from "react";
import { auth, db } from "@/app/lib/firebase"; // Ensure Firebase is correctly imported
import { collection, addDoc, doc, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";

const RateUs = () => {
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    const handleStarClick = async (index: number) => {
      if (!email) {
        toast.error("Please enter your email before rating.");
        return;
      }
  
      setRating(index);
  
      try {
        // Store rating and email in Firestore
        await addDoc(collection(db, "ratings"), {
          email,
          rating: index,
          createdAt: Timestamp.now(),
        });
  
        toast.success("Rating submitted successfully!");
  
        // Wait for the toast to complete before resetting the form
        setTimeout(() => {
          setEmail("");  // Reset email input
          setRating(0);  // Reset rating
          setIsSubmitted(false);
        }, 2000); // 2 seconds delay (adjust as needed)
  
        setIsSubmitted(true);
      } catch (error) {
        console.error("Error submitting rating:", error);
        toast.error("Failed to submit rating. Try again later.");
      }
    };
  
    const getRatingMessage = () => {
      switch (rating) {
        case 1:
          return "Very Bad";
        case 2:
          return "Bad";
        case 3:
          return "Good";
        case 4:
          return "Excellent";
        case 5:
          return "Outstanding Service";
        default:
          return "";
      }
    };
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center mb-6">Rate This Page</h1>
  
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
  
          {/* Rating Stars */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <svg
                key={index}
                onClick={() => !isSubmitted && handleStarClick(index)}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-10 w-10 cursor-pointer ${rating >= index ? "text-yellow-500" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15l-3.29 1.732a1 1 0 01-1.42-1.06L7.618 11 5.29 8.268a1 1 0 011.42-1.06L10 9l3.29-1.732a1 1 0 011.42 1.06L12.382 11l2.29 3.732a1 1 0 01-1.42 1.06L10 15z"
                />
              </svg>
            ))}
          </div>
  
          {/* Rating Message */}
          {rating > 0 && (
            <div className="text-center text-lg font-medium text-gray-700 mb-4">
              {getRatingMessage()}
            </div>
          )}
  
          {/* Thank You Message */}
          <div className="text-center text-lg text-gray-600">
            Thank you for your valuable time!
          </div>
        </div>
      </div>
    );
  };
  
  export default RateUs;