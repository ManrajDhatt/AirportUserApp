"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FeaturedProduct from "./FeaturedProduct";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define Store type
type Store = {
  storeId: string;
  category: string;
  addressOne: string;
  addressTwo: string;
  status: string;
  email: string;
  storeNumber: string;
};

export default function StoreList({ stores }: { stores: Store[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredStores, setFilteredStores] = useState(stores);
  const [categories, setCategories] = useState<{ name: string; image: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);


  
  useEffect(() => {
  const categoryImages: Record<string, string> = {
    "Phones": "/images/airport_images/iphone16_PNG17.png",
    "Jewellery": "/images/airport_images/91-917122_imitation-jewellery-transparent-images-png-royalty-emitesan-jewellery.png",
    "Clothes": "/images/airport_images/IMG_8215.webp",
    "Shoes": "/images/airport_images/shoes.png",
    "Watches": "/images/airport_images/watches.png",
    "Food": "/images/airport_images/ffoodd.jpg",
  };

  const uniqueCategories = [...new Set(stores.map((store) => store.category))].map((category) => ({
    name: category,
    image: categoryImages[category] || "/images/default.png", // Provide a fallback image
  }));

  console.log("Final Categories with Images:", uniqueCategories);

  setCategories(uniqueCategories);
}, [stores]);


  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilteredStores(category === "All" ? stores : stores.filter((store) => store.category === category));
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full px-10 mt-11 mb-10">
      {/* "What's on your mind?" Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">What's on your mind?</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll("left")} className="bg-white shadow-md p-2 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll("right")} className="bg-white shadow-md p-2 rounded-full">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        <div className="relative w-full">
          <div ref={scrollRef} className="flex space-x-16 overflow-x-auto scrollbar-hide w-full py-4 justify-center">
            {categories.map((category) => (
              <button key={category.name} onClick={() => handleCategoryChange(category.name)} className="flex flex-col items-center cursor-pointer">
                <img src={category.image} alt={category.name} className="w-28 h-28 rounded-full shadow-md" />
                <span className="text-sm text-gray-700 mt-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Store Grid */}
      <div className="gap-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        {filteredStores.map((store) => (
          <Link key={store.storeId} href={`/store/${store.storeId}`}>
            <FeaturedProduct store={store} />
          </Link>
        ))}
      </div>
    </div>
  );
}
