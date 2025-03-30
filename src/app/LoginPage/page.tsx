"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { Eye, EyeOff } from "lucide-react"; // Eye icons for password toggle

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Hide navbar when this page loads
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.style.display = "none";
    
    return () => {
      if (navbar) navbar.style.display = "flex"; // Show it back when navigating away
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!!");

      const user = userCredential.user;
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous",
        })
      );

      router.replace("/");
    } catch (error: any) {
      setError("Invalid email or password.");
      toast.error("Login Failed!!");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "Users", userCredential.user.uid), {
        name,
        email,
        uid: userCredential.user.uid,
        createdAt: new Date(),
      });

      toast.success("Registration successful! Please log in.");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error("Registration Failed!");
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-5 pt-4">
      <div className=" max-w-lg bg-white shadow-lg rounded-lg flex flex-col w-full  p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Login to Flyair" : "Register on Flyair"}
          </h1>
          <p className="text-sm text-gray-500">
            {isLogin
              ? "Enter your details to log in"
              : "Create an account to start shopping"}
          </p>
        </div>

        <div className="mt-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="flex flex-col gap-4"
          >
            {!isLogin && (
              <input
                type="text"
                value={name}
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            )}
            <input
              type="email"
              value={email}
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <button
              type="submit"
              className="mt-4 bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-all"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p
            className="mt-4 text-center text-sm text-gray-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register here"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}

