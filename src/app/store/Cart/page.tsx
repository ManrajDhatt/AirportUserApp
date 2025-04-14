// // "use client";
// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { useStore } from "../../context/StoreContext";
// // import Image from "next/image";
// // import { db } from "../../lib/firebase";
// // import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
// // import { BsTrash } from "react-icons/bs";
// // import { getAuth } from "firebase/auth";
// // import PlaceOrderButton from "@/app/component/PlaceOrder";

// // interface Product {
// //   id: string;
// //   price: string;
// //   quantity: number;
// //   name: string;
// //   stock:number;
// //   productImageUrl: string;
// //   catalogueProductName: string;
// //   storeId: string;
// //   storeName: string;
// // }

// // const CartPage = () => {
// //   const router = useRouter();
// //   const { 
// //     cartItems, 
// //     updateCartQuantity, 
// //     removeFromCart, 
// //     clearCart 
// //   } = useStore();
  
// //   const [isMounted, setIsMounted] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const TAX_RATE = 0.10;

// //   useEffect(() => {
// //     setIsMounted(true);
// //   }, []);

// //   // const parsePrice = (price?: string | number) => 
// //   //   typeof price === "string" ? Number(price.replace("₹", "").trim()) : price || 0;
// //   const parsePrice = (price?: string | number) => 
// //     typeof price === "string" 
// //         ? Number(price.replace(/₹|,/g, "").trim()) // Remove ₹ and ,
// //         : price || 0;
// //   const subtotal = cartItems.reduce(
// //     (sum: number, product: Product) => sum + parsePrice(product.price) * product.quantity,
// //     0
// //   );
// //   const tax = subtotal * TAX_RATE;
// //   const total = subtotal + tax;

// //   // Fallback clear cart function
// //   const fallbackClearCart = () => {
// //     console.warn("Using fallback cart clearing method");
// //     // Clear each item individually as a last resort
// //     cartItems.forEach((item: Product) => {
// //       removeFromCart(item.id);
// //     });
// //     // Optional: Clear from localStorage if you're using it
// //     if (typeof window !== 'undefined') {
// //       localStorage.removeItem('cart');
// //     }
// //   };

  
// //   if (!isMounted) return null;

// //   return (
// //     <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-50">
// //       <div className="max-w-5xl mx-auto">
// //         <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
// //           Your Cart
// //         </h1>

// //         {cartItems.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center space-y-6 mt-16">
// //             <Image
// //               src="/images/emptyCart.jpg"
// //               alt="Empty Cart"
// //               width={300}
// //               height={400}
// //               priority
// //               className="max-w-xs opacity-70"
// //             />
// //             <p className="text-gray-500 text-lg">
// //               Your cart is empty
// //             </p>
// //             <button
// //               onClick={() => router.push("/")}
// //               className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
// //             >
// //               Continue Shopping
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             <div className="md:col-span-2 space-y-4">
// //               {cartItems.map((product: Product) => (
// //                 <div
// //                   key={product.id}
// //                   className="relative flex items-center bg-white border rounded-lg p-5 shadow-sm"
// //                 >
// //                   <button
// //                     onClick={() => removeFromCart(product.id)}
// //                     className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
// //                   >
// //                     <BsTrash />
// //                   </button>
// //                   <Image
// //                     src={product.productImageUrl}
// //                     alt={product.catalogueProductName || "Product image"}
// //                     width={100}
// //                     height={100}
// //                     className="w-24 h-24 object-cover rounded-md mr-5"
// //                   />
// //                   <div className="flex-grow">
// //                     <h3 className="text-gray-800 font-medium text-lg">
// //                       {product.name}
// //                     </h3>
// //                     <div className="flex items-center justify-between mt-3">
// //                       <div className="flex items-center space-x-2">
// //                         <button
// //                           onClick={() => {
// //                             const newQuantity = Math.max(1, product.quantity - 1);
// //                             updateCartQuantity(product.id, newQuantity);
// //                           }}
// //                           className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
// //                         >
// //                           -
// //                         </button>
// //                         <span className="w-8 text-center text-gray-700">
// //                           {product.quantity}
// //                         </span>
// //                         <button
// //                           onClick={() => {
// //                             updateCartQuantity(product.id, product.quantity + 1);
// //                           }}
// //                           className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
// //                         >
// //                           +
// //                         </button>
// //                       </div>
// //                       <p className="font-semibold text-gray-800">
// //                         ₹{(parsePrice(product.price) * product.quantity).toFixed(2)}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="bg-white border rounded-lg p-6 h-fit">
// //               <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
// //                 Order Summary
// //               </h2>
// //               <div className="space-y-3">
// //                 <div className="flex justify-between text-gray-600">
// //                   <span>Subtotal ({cartItems.length} items)</span>
// //                   <span>₹{subtotal.toFixed(2)}</span>
// //                 </div>
// //                 <div className="flex justify-between text-gray-600">
// //                   <span>Taxes ({TAX_RATE * 100}%)</span>
// //                   <span>₹{tax.toFixed(2)}</span>
// //                 </div>
// //                 <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
// //                   <span>Total</span>
// //                   <span>₹{total.toFixed(2)}</span>
// //                 </div>
// //               </div>
            
// //               <PlaceOrderButton/>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };


// // export default CartPage;














// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useStore } from "../../context/StoreContext";
// import Image from "next/image";
// import { db } from "../../lib/firebase";
// import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { BsTrash } from "react-icons/bs";
// import { getAuth } from "firebase/auth";
// import PlaceOrderButton from "@/app/component/PlaceOrder";

// interface Product {
//   id: string;
//   price: string;
//   quantity: number;
//   name: string;
//   stock: number;
//   productImageUrl: string;
//   catalogueProductName: string;
//   storeId: string;
//   storeName: string;
// }

// const CartPage = () => {
//   const router = useRouter();
//   const { 
//     cartItems, 
//     updateCartQuantity, 
//     removeFromCart, 
//     clearCart 
//   } = useStore();
  
//   const [isMounted, setIsMounted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [stockWarning, setStockWarning] = useState<{ id: string, message: string } | null>(null);
//   const TAX_RATE = 0.10;

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Hide stock warning after 3 seconds
//   useEffect(() => {
//     if (stockWarning) {
//       const timer = setTimeout(() => {
//         setStockWarning(null);
//       }, 3000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [stockWarning]);

//   const parsePrice = (price?: string | number) => 
//     typeof price === "string" 
//         ? Number(price.replace(/₹|,/g, "").trim()) // Remove ₹ and ,
//         : price || 0;
        
//   const subtotal = cartItems.reduce(
//     (sum: number, product: Product) => sum + parsePrice(product.price) * product.quantity,
//     0
//   );
//   const tax = subtotal * TAX_RATE;
//   const total = subtotal + tax;

//   // Fallback clear cart function
//   const fallbackClearCart = () => {
//     console.warn("Using fallback cart clearing method");
//     // Clear each item individually as a last resort
//     cartItems.forEach((item: Product) => {
//       removeFromCart(item.id);
//     });
//     // Optional: Clear from localStorage if you're using it
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('cart');
//     }
//   };

//   // Function to handle quantity increase with stock check
//   const handleIncreaseQuantity = (product: Product) => {
//     if (product.quantity >= product.stock) {
//       setStockWarning({ 
//         id: product.id, 
//         message: `Only ${product.stock} items available in stock!` 
//       });
//       return;
//     }
//     updateCartQuantity(product.id, product.quantity + 1);
//   };
  
//   if (!isMounted) return null;

//   return (
//     <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
//           Your Cart
//         </h1>

//         {cartItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center space-y-6 mt-16">
//             <Image
//               src="/images/emptyCart.jpg"
//               alt="Empty Cart"
//               width={300}
//               height={400}
//               priority
//               className="max-w-xs opacity-70"
//             />
//             <p className="text-gray-500 text-lg">
//               Your cart is empty
//             </p>
//             <button
//               onClick={() => router.push("/")}
//               className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-4">
//               {cartItems.map((product: Product) => (
//                 <div
//                   key={product.id}
//                   className="relative flex items-center bg-white border rounded-lg p-5 shadow-sm"
//                 >
//                   <button
//                     onClick={() => removeFromCart(product.id)}
//                     className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
//                   >
//                     <BsTrash />
//                   </button>
//                   <Image
//                     src={product.productImageUrl}
//                     alt={product.catalogueProductName || "Product image"}
//                     width={100}
//                     height={100}
//                     className="w-24 h-24 object-cover rounded-md mr-5"
//                   />
//                   <div className="flex-grow">
//                     <h3 className="text-gray-800 font-medium text-lg">
//                       {product.name}
//                     </h3>
//                     <div className="flex items-center justify-between mt-3">
//                       <div className="flex flex-col">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => {
//                               const newQuantity = Math.max(1, product.quantity - 1);
//                               updateCartQuantity(product.id, newQuantity);
//                             }}
//                             className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
//                           >
//                             -
//                           </button>
//                           <span className="w-8 text-center text-gray-700">
//                             {product.quantity}
//                           </span>
//                           <button
//                             onClick={() => handleIncreaseQuantity(product)}
//                             className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
//                           >
//                             +
//                           </button>
//                         </div>
//                         {stockWarning && stockWarning.id === product.id && (
//                           <div className="mt-2 animate-fade-in-out">
//                             <p className="text-sm text-orange-500 font-medium">
//                               {stockWarning.message}
//                             </p>
//                           </div>
//                         )}
//                         <div className="mt-1">
//                           <p className="text-xs text-gray-500">
//                             Stock: {product.stock} items
//                           </p>
//                         </div>
//                       </div>
//                       <p className="font-semibold text-gray-800">
//                         ₹{(parsePrice(product.price) * product.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="bg-white border rounded-lg p-6 h-fit">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
//                 Order Summary
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({cartItems.length} items)</span>
//                   <span>₹{subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Taxes ({TAX_RATE * 100}%)</span>
//                   <span>₹{tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
//                   <span>Total</span>
//                   <span>₹{total.toFixed(2)}</span>
//                 </div>
//               </div>
            
//               <PlaceOrderButton/>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;





"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";
import Image from "next/image";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { BsTrash } from "react-icons/bs";
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
  const [isLoading, setIsLoading] = useState(true);
  const [stockWarning, setStockWarning] = useState<{ id: string, message: string } | null>(null);
  const [productStock, setProductStock] = useState<Record<string, number>>({});
  const TAX_RATE = 0.10;

  // Initial mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Fetch product stock from Firebase
// Update your fetchProductStock useEffect hook like this:
useEffect(() => {
  const fetchProductStock = async () => {
    if (cartItems.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const stockData: Record<string, number> = {};
      
      // Create an array of promises for all stock fetches
      const stockPromises = cartItems.map(async (item) => {
        try {
          // Correct path based on your Firestore structure
          // stores/{storeId}/categories/{categoryId}/products/{productId}
          const productRef = doc(
            db,
            "stores",
            item.storeId,
            "categories",
            item.CategoryId,
            "products",
            item.id
          );
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const stock = productSnap.data().stock;
            stockData[item.id] = stock !== undefined ? stock : 0; // Default to 0 if stock is undefined
          } else {
            stockData[item.id] = 0; // Product not found, assume out of stock
          }
        } catch (err) {
          console.error(`Failed to fetch stock for ${item.id}:`, err);
          stockData[item.id] = 0; // On error, assume out of stock
        }
      });

      // Wait for all stock fetches to complete
      await Promise.all(stockPromises);
      
      setProductStock(stockData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      // On major error, set all to 0 to prevent over-selling
      const defaultStock: Record<string, number> = {};
      cartItems.forEach(item => {
        defaultStock[item.id] = 0;
      });
      setProductStock(defaultStock);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMounted) {
    fetchProductStock();
  }
}, [cartItems, isMounted]);
  // Auto-dismiss stock warning after 3 seconds
  useEffect(() => {
    if (stockWarning) {
      const timer = setTimeout(() => {
        setStockWarning(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [stockWarning]);

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

  // Function to handle quantity increase with stock check
  const handleIncreaseQuantity = (product: Product) => {
    const availableStock = productStock[product.id] || 0;
    
    if (product.quantity >= availableStock) {
      setStockWarning({ 
        id: product.id, 
        message: `Only ${availableStock} items available in stock!` 
      });
      return;
    }
    
    updateCartQuantity(product.id, product.quantity + 1);
  };
  
  if (!isMounted) return null;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

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
                      <div className="flex flex-col">
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
                            onClick={() => handleIncreaseQuantity(product)}
                            className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        {stockWarning && stockWarning.id === product.id && (
                          <div className="mt-2">
                            <p className="text-sm text-orange-500 bg-orange-50 px-2 py-1 rounded-md font-medium animate-pulse">
                              {stockWarning.message}
                            </p>
                          </div>
                        )}
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">
                            {/* In stock: {productStock[product.id] || 0} items */}
                          </p>
                        </div>
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
            
              <PlaceOrderButton/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;













































































































































