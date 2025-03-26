"use client";
import React, { useState, useRef, useEffect } from "react";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function LikeAndCart() {
  const { likedItems, cartItems } = useStore();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center shadow-md relative">
      <h1 className="text-xl font-bold">My Store</h1>
      <div className="flex items-center space-x-6">
        
        {/* Heart Icon - Show Liked Items */}
        <div className="relative">
          <Heart
            onClick={() => setOpenDropdown(openDropdown === "liked" ? null : "liked")}
            className={`w-6 h-6 cursor-pointer ${
              likedItems.length > 0 ? "text-red-500 fill-current" : "text-gray-800"
            }`}
          />
          {likedItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {likedItems.length}
            </span>
          )}
        </div>

        {/* Shopping Cart Icon - Show Cart Items */}
        <div className="relative">
          <ShoppingCart
            onClick={() => setOpenDropdown(openDropdown === "cart" ? null : "cart")}
            className="w-6 h-6 cursor-pointer text-gray-800"
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {openDropdown && (
        <div ref={dropdownRef} className="absolute top-14 right-4 w-64 bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">
              {openDropdown === "liked" ? "Liked Products" : "Cart Items"}
            </h3>
            <X className="w-5 h-5 cursor-pointer" onClick={() => setOpenDropdown(null)} />
          </div>
          <div className="mt-2 max-h-60 overflow-y-auto">
            {(openDropdown === "liked" ? likedItems : cartItems).length > 0 ? (
              (openDropdown === "liked" ? likedItems : cartItems).map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b py-2">
                  <img src={item.productImageUrl || "/default.jpg"} alt={item.name} className="w-12 h-12 rounded" />
                  <p className="text-sm">{item.catalogueProductName}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">No items found</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
