"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategoriesForStore, getProductsForCategory } from "../firebaseUtil";
import Cards from "../Cards";
import NoInternet from "../NoInternet";

export default function MainData() {
  const params = useParams();
  const storeId = params?.storeId;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (storeId) {
      setLoading(true);
      getCategoriesForStore(storeId)
        .then((categoriesData) => setCategories(categoriesData))
        .catch(() => setError("categories"))
        .finally(() => setLoading(false));
    }
  }, [storeId]);

  useEffect(() => {
    if (categories.length > 0) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const allProducts = await Promise.all(
            categories.map((category) => getProductsForCategory(storeId, category.id))
          );
          const flatProducts = allProducts.flat();
          setProducts(flatProducts);
          setFilteredProducts(flatProducts);
        } catch {
          setError("products");
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [categories, storeId]);

  const filterByCategory = (categoryId) => {
    if (categoryId === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => String(product.catalogueCategoryName) === String(categoryId)
      );
      setFilteredProducts(filtered);
    }
    setSelectedCategory(categoryId);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
        <p className="text-gray-500">Loading products...</p>
      </div>
    </div>
  );

  if (error) return <NoInternet />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sticky category filter */}
      <div className={`sticky top-0 z-10 bg-white/90 backdrop-blur-md transition-all duration-300 ${isScrolled ? "py-3 shadow-sm" : "py-6"} mb-8`}>
        <div className="flex flex-col px-4 py-4 sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Our Collection</h1>
            <p className="text-gray-500 text-sm mt-1">
              {selectedCategory === "all" 
                ? "All products" 
                : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "items"} in ${selectedCategory}`
              }
            </p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => filterByCategory(e.target.value)}
              className="w-full px-4 py-2.5 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 appearance-none bg-white text-gray-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.catalogueCategoryName}>
                  {category.catalogueCategoryName || category.name || "Unknown Category"}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Cards key={product.id} product={product} storeId={storeId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory === "all" 
              ? "There are currently no products available." 
              : `No products found in the ${selectedCategory} category.`}
          </p>
          {selectedCategory !== "all" && (
            <button
              onClick={() => filterByCategory("all")}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
            >
              View all products
            </button>
          )}
        </div>
      )}
    </div>
  );
}