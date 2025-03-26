"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="p-2 m-2 bg-gray-800 text-white rounded fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white shadow-lg z-50"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold">Dashboard</h2>

          <ul className="mt-4 space-y-2">
            <li className="p-2 hover:bg-gray-700 rounded">
              <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded">
              <Link href="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded">
              <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded">
              <Link href="/customers" onClick={() => setIsOpen(false)}>Customers</Link>
            </li>
          </ul>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
