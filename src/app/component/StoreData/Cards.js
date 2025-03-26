"use client";
import React from "react";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa"; // Filled heart icon
import { BsCartPlus, BsCartDash } from "react-icons/bs";
import { useStore } from "../context/StoreContext";

const Cards = ({ product, storeId }) => {
	const { likedItems, addToCart, toggleLike, cartItems, removeFromCart, setCartItems } = useStore();
	const { setSelectedProduct } = useStore();
	const isInCart = cartItems.some((item) => item.id === product.id);

	const handleCartToggle = async () => {
		if (isInCart) {
			setCartItems((prev) => prev.filter((item) => item.id !== product.id));
			await removeFromCart(product.id);
		} else {
			const newItem = { ...product, id: product.id, quantity: 1 };
			setCartItems((prev) => [...prev, newItem]);
			await addToCart(product, storeId);
		}
	};

	const isLiked = likedItems.some((item) => item.id === product.id);

	const router = useRouter();

	const handleProductClick = (event) => {
		event.preventDefault();
		setSelectedProduct(product);
		router.push(`/store/${storeId}/product/${product.id}?categoryId=${product.catalogueCategoryId}`);
	};

	return (
		<div className="w-80 h-[400px] bg-white rounded-3xl shadow-xl p-5 border border-gray-300 transform transition duration-300 hover:scale-105 flex flex-col">
			
			{/* Image */}
			<a
				href={`/store/product/${product.id}?categoryId=${product.catalogueCategoryId}`}
				onClick={handleProductClick}
				className="block rounded-2xl overflow-hidden"
			>
				<img
					className="w-full h-40 object-cover rounded-lg" // No hover effect on image
					src={product.productImageUrl || "/default-image.jpg"}
					alt={product.catalogueProductName}
				/>
			</a>

			{/* Content */}
			<div className="text-center mt-4 flex-grow flex flex-col justify-between">
				<h5 className="text-lg font-bold text-gray-900">
					{product.catalogueProductName}
				</h5>
				<p className="text-gray-700 text-sm mt-2 font-medium px-2 line-clamp-2">
					{product.productDescription || "Awesome product, check it out!"}
				</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 w-full">
					<button
						onClick={handleCartToggle}
						className={`px-4 py-2 ${isInCart ? "bg-red-600" : "bg-blue-600"} text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 transform hover:scale-110 transition-all`}
					>
						{isInCart ? (
							<>
								<BsCartDash className="text-2xl" />
								<span className="hidden lg:inline">Remove from Cart</span>
							</>
						) : (
							<>
								<BsCartPlus className="text-2xl" />
								<span className="hidden lg:inline">Add to Cart</span>
							</>
						)}
					</button>
					<button
						onClick={() => toggleLike(product, storeId)}
						className={`p-2 rounded-full shadow-md transition-all duration-300 ${
							isLiked ? "text-red-500 scale-105" : "text-gray-400 hover:text-red-500"
						}`}
					>
						{isLiked ? <FaHeart className="text-2xl" /> : <FiHeart className="text-2xl" />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Cards;
