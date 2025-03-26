"use client"
import React, { useEffect, useState } from "react"
import { ArrowRight, Star, Minus, Plus } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { getProductById } from "@/app/component/firebaseUtil"
import { useStore } from "..//..//..//..//context/StoreContext"
import { toast } from "react-toastify"
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "@/app/lib/firebase"
import { BsCartDash, BsCartPlus } from "react-icons/bs"

interface Product {
	// storeId: string;
	name: string;
	id: string;
	price:string; // Price is stored as a string, e.g., "$100"
	catalogueProductName: string;
	catalogueCategoryName:string;
	catalogueCategoryId:string,
	productImageUrl: string;
	productDescription: string;
	stock:string;
	
}
interface CartItem {
	id: string;
	name: string;
	price: number;
	storeId: string;
	quantity: number;
	productImageUrl: string;

	productDescription:string;
	CategoryName:string;
	CategoryId:string;
  }

export default function Page(){
	const params = useParams(); // Unwrap the params
	const { storeId, productId } = params as { storeId: string; productId: string };
	const { selectedProduct } = useStore();
	const searchParams = useSearchParams()
	const categoryId = searchParams.get("categoryId")
	const { addToCart, cartItems,removeFromCart ,setCartItems,updateCartQuantity} = useStore()
	const isInCart = cartItems.some((item:CartItem) => item.id === productId);
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState(true)
	const [quantity, setQuantity] = useState(1);

	const router = useRouter()


useEffect(() => {
  // Check if selectedProduct matches the current productId
  if (selectedProduct?.id === productId) {
    setProduct(selectedProduct);
    setLoading(false);
    return; // Skip Firebase fetch
  }
  // Fetch product if not in context
//   const fetchProduct = async () => {
//     try {
//       const productData = await getProductById(storeId, categoryId, productId);
//       setProduct(productData);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProduct();
}, [storeId, categoryId, productId, router, selectedProduct]);

	const handleIncreaseQuantity = () => {
		setQuantity(prev => prev + 1);
	};
	
	const handleDecreaseQuantity = () => {
		setQuantity(prev => (prev > 1 ? prev - 1 : 1));  // Ensure quantity is at least 1
	};
	
	if (!categoryId) {
		return <p className="p-10">Category ID is missing or invalid</p>
	}

	if (loading) return <p className="p-10">Loading...</p>
	if (!product) return <p className="p-10">Product not found</p>
	

	const handleBuyNow = async () => {
		const user = JSON.parse(localStorage.getItem("user") || "{}")
	
		if (!user?.uid) {
			toast.error("Please log in to place an order.")
			return
		}
	
		if (!product) {
			toast.error("No product details available.")
			return
		}
		
  // Check if Geolocation is available
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

		try {
			 // Reference to the "Orders" collection
			 const ordersCollectionRef = collection(db, "Orders")
			 // Add order details and let Firebase generate the order ID
			 const orderRef = await addDoc(ordersCollectionRef, {
				 userId: user.uid,
				 createdAt: serverTimestamp(),
				 location:{latitude,longitude},
				 storeId:storeId,
				 status: "pending", // Example status
			 });
			
        // Use the generated order ID for further actions
        const orderId = orderRef.id
        // Reference to store sub-collection in the order
        const storeRef = doc(db, "Orders", orderId)
			
			// Add product under the store
			const productRef = doc(storeRef, "products", productId)
			await setDoc(productRef, {
				id: productId,
				name: product.catalogueProductName,
				price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
				productImageUrl: product.productImageUrl,
				quantity: quantity,
				// storeId: storeId,
				
			})
	
			toast.success("Order placed successfully!")
			router.push("/") // Redirect to Orders page
		} catch (error) {
			console.error("Error placing order:", error)
			toast.error("Failed to place order. Please try again.")
		}
	},
	(error) => {
		console.error("Error getting location:", error);
		toast.error("Failed to get location. Please enable location services.");
	  }
	);
  };



  
	const handleCartToggle = async () => {
		if (!product|| !product.id || !product.catalogueProductName || !product.price || !product.productImageUrl) {
			console.error("Missing required product fields:", product);
			return;
		}
	
		const parsedPrice = typeof product.price === "string" 
			? parseFloat(product.price.replace("$", "")) 
			: product.price || 0; // Ensure price is a number
	
		if (isNaN(parsedPrice)) {
			console.error("Invalid price format:", product.price);
			return;
		}
	
		const newItem = { 
			id: product.id,
			catalogueProductName: product.catalogueProductName,
			price:product.price,
			storeId:storeId, 
			quantity: quantity||1, 
			productImageUrl: product.productImageUrl,
			productDescription:product.productDescription,
			catalogueCategoryId:product.catalogueCategoryId,
			catalogueCategoryName:product.catalogueCategoryName


		};
	
		if (isInCart) {
			setCartItems((prev: CartItem[]) => prev.filter((item: CartItem) => item.id !== product.id));
			await removeFromCart(product.id);
		} else {
			setCartItems((prev: CartItem[]) => [...prev, newItem]);
			await addToCart(newItem, storeId,newItem.quantity);
		}
	};
	

	return (
		<div className="custom-bg-home text-white">
			{/* Breadcrumb Navigation */}
			<div className="py-10 px-56 flex items-center gap-2 text-gray-300">
				<p>Home</p>
				<ArrowRight size={16} />
				<p>Store</p>
				<ArrowRight size={16} />
				<p>{product.catalogueCategoryName}</p>
				<ArrowRight size={16} />
				<p>{product.catalogueProductName}</p>
			</div>

			{/* Product Section */}
			<div className="px-40 py-10 flex items-start">
				<div className="flex flex-col w-[40%]">
					{/* Main Product Image */}
					<img
						src={product.productImageUrl}
						alt={product.catalogueProductName}
						width={450}
						height={400}
						className="rounded-3xl"
					/>
				</div>

				<div className="flex-grow p-6 bg-gray-800 rounded-lg">
					<h2 className="text-3xl font-bold">
						{product.catalogueProductName}
					</h2>
					<p className="text-gray-400 mt-1">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</p>

					<div className="flex items-center gap-1 mt-3">
						<p className="text-yellow-400 font-semibold">(4.5)</p>
						<Star size={20} className="text-yellow-400" />
						<Star size={20} className="text-yellow-400" />
						<Star size={20} className="text-yellow-400" />
						<Star size={20} className="text-yellow-400" />
						<Star size={20} className="text-gray-500" />
					</div>

					<p className="text-gray-300 mt-4">
						{product.productDescription || "No description available"}
					</p>

					<p className="mt-4 text-red-400">
						Only <span className="font-bold">({product.stock})</span> items left in
						stock!
					</p>

					<div className="flex items-center justify-between mt-6">
						<p className="text-3xl font-bold text-green-400">{product.price}</p>

						<div className="flex items-center gap-4 border border-gray-500 px-4 py-2 rounded-lg">
							<Minus
								size={20}
								className={`cursor-pointer ${quantity === 1 ? 'text-gray-300' : 'hover:text-white'}`}
								onClick={handleDecreaseQuantity}
							/>
							<p className="text-lg">{quantity}</p>
							<Plus
								size={20}
								className="cursor-pointer text-gray-300 hover:text-white"
								onClick={handleIncreaseQuantity}
							/>
						</div>
					</div>

					<div className="mt-6 flex gap-4">
						<button
							className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold"
							onClick={handleBuyNow}
						>
							Buy Now
						</button>
						<button
							className={`${cartItems.some((item:CartItem) => item.id === product.id)  ? "bg-red-600" : "bg-blue-600"} text-white px-6 py-2 rounded-lg text-lg font-semibold flex items-center gap-2 transform hover:opacity-8 transition-all`}
							onClick={handleCartToggle}
						>{ isInCart? (
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
					</div>
				</div>
			</div>
		</div>
	)
}
