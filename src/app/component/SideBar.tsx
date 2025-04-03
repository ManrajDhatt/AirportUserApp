"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown, FiShoppingBag } from "react-icons/fi";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

// Define Store & Category Types
type Store = {
  storeId: string;
  name: string;
  category: string;
};

type Category = {
  name: string;
  image: string;
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Record<string, Store[]>>({});
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryImages: Record<string, string> = {
        Phones: "/images/airport_images/iphone16_PNG17.png",
        Jewellery: "/images/airport_images/91-917122_imitation-jewellery-transparent-images-png-royalty-emitesan-jewellery.png",
        Clothes: "/images/airport_images/IMG_8215.webp",
        Shoes: "/images/airport_images/shoes.png",
        Watches: "/images/airport_images/watches.png",
        Food: "/images/airport_images/ffoodd.jpg",
      };

      const storeSnapshot = await getDocs(collection(db, "stores"));
      const uniqueCategories = [...new Set(storeSnapshot.docs.map((doc) => doc.data().category))].map((category) => ({
        name: category,
        image: categoryImages[category] || "/images/default.png",
      }));

      setCategories(uniqueCategories);
    };

    fetchCategories();
  }, []);

  const fetchStoresForCategory = async (category: string) => {
    if (stores[category]) return;

    const storeQuery = query(collection(db, "stores"), where("category", "==", category));
    const storeSnapshot = await getDocs(storeQuery);

    const storeList: Store[] = storeSnapshot.docs.map((doc) => ({
      storeId: doc.id,
      ...(doc.data() as Store),
    }));

    setStores((prev) => ({ ...prev, [category]: storeList }));
  };

  const toggleSubmenu = async (category: string) => {
    if (!submenuOpen[category]) {
      await fetchStoresForCategory(category);
    }
    setSubmenuOpen((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-5 left-5 z-50 text-2xl text-white bg-gray-900 p-2 rounded-full shadow-lg"
      >
        {open ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white text-black w-80 h-full shadow-lg p-6 flex flex-col z-40 overflow-y-auto"
          >
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.name}>
                  {/* Category Item */}
                  <div
                    className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-200 rounded-lg transition"
                    onClick={() => toggleSubmenu(category.name)}
                  >
                    <img src={category.image} alt={category.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium">{category.name}</span>
                    <FiChevronDown
                      className={`ml-auto transition-transform ${submenuOpen[category.name] ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Stores Dropdown */}
                  <AnimatePresence>
                    {submenuOpen[category.name] && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-6 mt-2 space-y-2"
                      >
                        {stores[category.name]?.length > 0 ? (
                          stores[category.name].map((store) => (
                            <li key={store.storeId} className="py-2 px-4 hover:bg-gray-300 rounded-md">
                              <Link href={`/store/${store.storeId}`} className="flex items-center gap-2">
                                <FiShoppingBag /> {store.name}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="py-2 px-4 text-gray-500">No stores available.</li>
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
