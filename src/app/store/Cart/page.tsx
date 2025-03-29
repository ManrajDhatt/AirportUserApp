"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";
import Image from "next/image";
import { db } from "../../lib/firebase";
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { BsTrash } from "react-icons/bs";
import { getAuth } from "firebase/auth";
import PlaceOrderButton from "@/app/component/PlaceOrder";

interface Product {
  id: string;
  price: string;
  quantity: number;
  name: string;
  productImageUrl: string;
  catalogueProductName: string;
  storeId: string;
  storeName: string;
}

const CartPage = () => {
  const router = useRouter();
  const { 
    cartItems, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart 
  } = useStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const TAX_RATE = 0.10;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const parsePrice = (price?: string | number) => 
  //   typeof price === "string" ? Number(price.replace("₹", "").trim()) : price || 0;
  const parsePrice = (price?: string | number) => 
    typeof price === "string" 
        ? Number(price.replace(/₹|,/g, "").trim()) // Remove ₹ and ,
        : price || 0;
  const subtotal = cartItems.reduce(
    (sum: number, product: Product) => sum + parsePrice(product.price) * product.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Fallback clear cart function
  const fallbackClearCart = () => {
    console.warn("Using fallback cart clearing method");
    // Clear each item individually as a last resort
    cartItems.forEach((item: Product) => {
      removeFromCart(item.id);
    });
    // Optional: Clear from localStorage if you're using it
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  // const handlePlaceOrder = async () => {
  //   if (isLoading) return;
  //   setIsLoading(true);

  //   try {
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (!user) {
  //       alert("Please log in to place an order.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (cartItems.length === 0) {
  //       alert("Your cart is empty.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (!navigator.geolocation) {
  //       alert("Geolocation is not supported by your browser.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     const getLocation = () => {
  //       return new Promise<GeolocationPosition>((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(resolve, reject);
  //       });
  //     };

  //     const position = await getLocation();
  //     const { latitude, longitude } = position.coords;

  //     const storesMap: Record<string, Product[]> = {};
  //     cartItems.forEach((product: Product) => {
  //       if (!product.storeId) {
  //         console.error("Store ID is undefined for product:", product);
  //         return;
  //       }
  //       if (!storesMap[product.storeId]) {
  //         storesMap[product.storeId] = [];
  //       }
  //       storesMap[product.storeId].push(product);
  //     });

  //     const orderPromises = Object.entries(storesMap).map(async ([storeId, products]) => {
  //       const orderRef = await addDoc(collection(db, "Orders"), {
  //         createdAt: serverTimestamp(),
  //         userId: user.uid,
  //         storeId,
  //         status: "pending",
  //         location: { latitude, longitude },
  //       });

  //       const orderID = orderRef.id;

  //       for (const product of products) {
  //         if (!product.id) {
  //           console.error("Product ID is undefined for:", product);
  //           continue;
  //         }
  //         const productRef = doc(db, "Orders", orderID, "products", product.id);
  //         await setDoc(productRef, {
  //           name: product.catalogueProductName || product.name,
  //           price: product.price || "0",
  //           quantity: product.quantity || 1,
  //           id: product.id,
  //           productImageUrl: product.productImageUrl,
  //         });
  //       }
  //     });

  //     await Promise.all(orderPromises);

  //     // Attempt to clear cart with multiple fallbacks
  //     try {
  //       if (clearCart && typeof clearCart === 'function') {
  //         await clearCart();
  //       } else {
  //         console.warn('clearCart not available, using fallback');
  //         await fallbackClearCart();
  //       }
  //     } catch (clearError) {
  //       console.error('Error clearing cart:', clearError);
  //       await fallbackClearCart();
  //     }

  //     alert("Orders placed successfully!");
  //     router.push("/order_history");

  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     alert("Something went wrong while placing your order. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 mt-16">
            <Image
              src="/images/emptyCart.jpg"
              alt="Empty Cart"
              width={300}
              height={400}
              priority
              className="max-w-xs opacity-70"
            />
            <p className="text-gray-500 text-lg">
              Your cart is empty
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((product: Product) => (
                <div
                  key={product.id}
                  className="relative flex items-center bg-white border rounded-lg p-5 shadow-sm"
                >
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <BsTrash />
                  </button>
                  <Image
                    src={product.productImageUrl}
                    alt={product.catalogueProductName || "Product image"}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-md mr-5"
                  />
                  <div className="flex-grow">
                    <h3 className="text-gray-800 font-medium text-lg">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const newQuantity = Math.max(1, product.quantity - 1);
                            updateCartQuantity(product.id, newQuantity);
                          }}
                          className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-gray-700">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => {
                            updateCartQuantity(product.id, product.quantity + 1);
                          }}
                          className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{(parsePrice(product.price) * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border rounded-lg p-6 h-fit">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes ({TAX_RATE * 100}%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              {/* <button
                onClick={PlaceOrderButton}
                disabled={isLoading}
                className={`w-full mt-6 py-3 rounded-md transition-colors ${
                  isLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button> */}
              <PlaceOrderButton/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;