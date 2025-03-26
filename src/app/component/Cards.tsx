"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BsCartPlus, BsCartDash } from "react-icons/bs";
import { useStore } from "../context/StoreContext";

interface Product {
	id: string;
	price: string;
	productImageUrl?: string;
	catalogueProductName: string;
	catalogueCategoryId: string;
	productDescription?: string;
	stock: string;
}

interface CardProps {
	product: Product;
	storeId: string;
}

interface CartItem {
	id: string;
	name: string;
	price: number;
	storeId: string;
	quantity: number;
	productImageUrl: string;
	productDescription: string;
	CategoryName: string;
	CategoryId: string;
}

const Cards: React.FC<CardProps> = ({ product, storeId }) => {
	const { addToCart, cartItems, removeFromCart, setCartItems, setSelectedProduct } = useStore();
	const router = useRouter();

	const isInCart = cartItems.some((item: CartItem) => item.id === product.id);

	const handleCartToggle = async () => {
		if (isInCart) {
			setCartItems((prev) => prev.filter((item) => item.id !== product.id));
			await removeFromCart(product.id);
		} else {
			const newItem: CartItem = {
				...product,
				id: product.id,
				quantity: 1,
			};
			setCartItems((prev) => [...prev, newItem]);
			await addToCart(newItem, storeId);
		}
	};

	const handleProductClick = (event: React.MouseEvent) => {
		event.preventDefault();
		setSelectedProduct(product);
		router.push(
			`/store/${storeId}/product/${product.id}?categoryId=${product.catalogueCategoryId}`
		);
	};

	return (
		<div className="w-72 bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
			<a onClick={handleProductClick} className="block relative cursor-pointer">
				<img
					className="w-full h-56 object-cover rounded-t-xl"
					src={product.productImageUrl || "/default-image.jpg"}
					alt={product.catalogueProductName}
				/>
			</a>

			<div className="p-4 flex flex-col gap-2">
				<h5 className="text-lg font-semibold text-gray-900">{product.catalogueProductName}</h5>
				<p className="text-gray-500 text-sm line-clamp-2">
					{product.productDescription || "A great product for you!"}
				</p>

				<div className="flex justify-between items-center mt-3">
					<span className="text-xl font-bold text-black">₹{product.price}</span>

					<button
						onClick={handleCartToggle}
						className={`px-4 py-2 ${
							isInCart ? "bg-red-600 hover:bg-red-800" : "bg-[#525df3] hover:bg-[#4049c9]"
						} text-white rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-105`}
					>
						{isInCart ? (
							<>
								<BsCartDash className="text-xl" />
								<span className="hidden lg:inline">Remove</span>
							</>
						) : (
							<>
								<BsCartPlus className="text-xl" />
								<span className="hidden lg:inline">Add</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Cards;
