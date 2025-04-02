"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "@/app/lib/firebase";
import { collection, addDoc, doc, setDoc, Timestamp, writeBatch } from "firebase/firestore";

const FeedbackPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name && email && feedback) {
      try {
        // Store feedback in Firestore
        await addDoc(collection(db, "feedbacks"), {
          name,
          email,
          feedback,
          rating,
          createdAt: Timestamp.now(), // Store timestamp
        });

        toast.success("Feedback submitted successfully!");

        // Clear form after submission
        setName("");
        setEmail("");
        setFeedback("");
        setRating(1);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error("Failed to submit feedback. Try again later.");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">We Value Your Feedback</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
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

          {/* Feedback Field */}
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Your Feedback</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please enter your feedback here"
              required
            />
          </div>

          {/* Rating Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`w-8 h-8 rounded-full ${rating >= star ? "bg-yellow-400" : "bg-gray-300"}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
