
// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getCategoriesForStore, getProductsForCategory } from "../firebaseUtil";
// import Cards from "../Cards";

// export default function MainData() {
// 	const params = useParams();
// 	const storeId = params?.storeId;

// 	const [categories, setCategories] = useState([]);
// 	const [products, setProducts] = useState([]);
// 	const [filteredProducts, setFilteredProducts] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [selectedCategory, setSelectedCategory] = useState("all");

// 	useEffect(() => {
// 		if (storeId) {
// 			setLoading(true);
// 			getCategoriesForStore(storeId)
// 				.then((categoriesData) => setCategories(categoriesData))
// 				.catch(() =>	 setError("categories"))
// //  setError("Failed to load categories"))
// 				.finally(() => setLoading(false));
// 		}
// 	}, [storeId]);

// 	useEffect(() => {
// 		if (categories.length > 0) {
// 			setLoading(true);
// 			const fetchProducts = async () => {
// 				try {
// 					const allProducts = await Promise.all(
// 						categories.map((category) => getProductsForCategory(storeId, category.id))
// 					);
// 					const flatProducts = allProducts.flat();
// 					setProducts(flatProducts);
// 					setFilteredProducts(flatProducts); // Show all products initially
// 				} catch {
// 					setError("products");
// 					// setError("Failed to load products");
// 				} finally {
// 					setLoading(false);
// 				}
// 			};
// 			fetchProducts();
// 		}
// 	}, [categories, storeId]);

// 	//  FIXED FILTER FUNCTION
// 	const filterByCategory = (categoryId) => {
// 		if (categoryId === "all") {
// 			setFilteredProducts(products);
// 		} else {
// 			const filtered = products.filter(
// 				(product) => String(product.catalogueCategoryName) === String(categoryId)
// 			);
// 			setFilteredProducts(filtered);
// 		}
// 		setSelectedCategory(categoryId);
// 	};

// 	if (loading) return <div className="text-center py-10">Loading...</div>;
// 	if (error) return <div className="text-center text-red-500">{error}</div>;

// 	return (
// 		<div className="p-6">
// 			<h2 className="text-gray-600 text-xl font-semibold mb-4">Categories for this store:</h2>

// 			<div className="flex flex-wrap gap-4 mb-6">
// 				<select
// 					value={selectedCategory}
// 					onChange={(e) => filterByCategory(e.target.value)}
// 					className="w-48 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white text-gray-700 cursor-pointer"
// 				>
// 					<option value="all">All Categories</option>
// 					{categories.map((category) => (
// 						<option key={category.id} value={category.catalogueCategoryName}>
// 							{category.catalogueCategoryName || category.name || "Unknown Category"}
// 						</option>
// 					))}
// 				</select>
// 			</div>

// 			<h2 className="text-gray-600 text-lg font-medium mb-4">
// 				Showing {filteredProducts.length} Products
// 			</h2>

// 			{/* Responsive Grid */}
// 			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// 				{filteredProducts.map((product) => (
// 					<Cards key={product.id} product={product} storeId={storeId} />
// 				))}
// 			</div>
// 		</div>
// 	);
// }
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategoriesForStore, getProductsForCategory } from "../firebaseUtil";
import Cards from "../Cards";
import NoInternet from "../NoInternet"; // Import the NoInternet component

export default function MainData() {
	const params = useParams();
	const storeId = params?.storeId;

	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState("all");

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
					setFilteredProducts(flatProducts); // Show all products initially
				} catch {
					setError("products");
				} finally {
					setLoading(false);
				}
			};
			fetchProducts();
		}
	}, [categories, storeId]);

	//  FIXED FILTER FUNCTION
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

	// Show NoInternet component if there's an error
	if (loading) return <div className="text-center py-10">Loading...</div>;
	if (error) return <NoInternet />; // 🚀 Call NoInternet when error exists

	return (
		<div className="p-6">
			<h2 className="text-gray-600 text-xl font-semibold mb-4">Categories for this store:</h2>

			<div className="flex flex-wrap gap-4 mb-6">
				<select
					value={selectedCategory}
					onChange={(e) => filterByCategory(e.target.value)}
					className="w-48 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white text-gray-700 cursor-pointer"
				>
					<option value="all">All Categories</option>
					{categories.map((category) => (
						<option key={category.id} value={category.catalogueCategoryName}>
							{category.catalogueCategoryName || category.name || "Unknown Category"}
						</option>
					))}
				</select>
			</div>

			<h2 className="text-gray-600 text-lg font-medium mb-4">
				Showing {filteredProducts.length} Products
			</h2>

			{/* Responsive Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{filteredProducts.map((product) => (
					<Cards key={product.id} product={product} storeId={storeId} />
				))}
			</div>
		</div>
	);
}
