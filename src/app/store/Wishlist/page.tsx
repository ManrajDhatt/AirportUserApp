

"use client";
import { useEffect, useState } from "react";
import React from "react";
import Cards from "../../component/Cards";
import { useStore } from "../../context/StoreContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  storeId: string; // Add storeId here
  stock:string,
  price:string,
  productImageUrl?: string;
  catalogueProductName: string;
  catalogueCategoryId: string; // Add this
   categoryId: string; 
   // productDescription?: string;
}
const WishlistPage: React.FC = () => {
  const { likedItems } = useStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist ❤️</h2>
      {likedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <Image
            src="/images/empty-wishlist.png"
            alt="Empty Wishlist"
            width={500}
            height={400}
            className="max-w-xs md:max-w-md mb-8"
          />
          <p className="text-gray-600 text-lg mb-4">Your wishlist is waiting to be filled!</p>
          <button
            onClick={handleBack}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
            disabled={!isMounted}
          >
            {isMounted && <span>← Find Your Favorites</span>}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {likedItems.map((product:Product) => (
            <Cards key={product.id} product={product} storeId={product.storeId || ""} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
