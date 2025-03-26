"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";
import Image from "next/image";
import { db } from "../../lib/firebase"; // Adjust Firebase import
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import { BsCart, BsCartDash, BsCartXFill } from "react-icons/bs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
interface Product {
  id: string;
  price: string; // Price is stored as a string, e.g., "$100"
  quantity: number;
  name:string,
  productImageUrl: string;
  catalogueProductName: string;
  storeId: string;
  storeName: string;
}

const CartPage = () => {
  const router = useRouter();
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const TAX_RATE = 0.10;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert "$100" to a number (100)
  // const parsePrice = (price: string) => Number(price.replace(/[^0-9.-]+/g, ""));
  const parsePrice = (price?: string | number) => 
    typeof price === "string" ? Number(price.replace("₹", "").trim()) : price || 0;
  
  // const parsePrice = (price?: string) =>Number( price ? price.replace("$", "").trim() : "0");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum: number, product: Product) => sum + parsePrice(product.price) * product.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;


 
const handlePlaceOrder = async () => {
  try {
    const auth = getAuth();
    
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("No authenticated user found.");
        alert("Please log in to place an order.");
        return;
      }

      console.log("Current User UID:", user.uid);

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Step 1: Organize products by storeID
          const storesMap: Record<string, Product[]> = {};
          cartItems.forEach((product: Product) => {
            if (!product.storeId) {
              console.error("Store ID is undefined for product:", product);
              return; // Skip this product
            }
            if (!storesMap[product.storeId]) {
              storesMap[product.storeId] = [];
            }
            storesMap[product.storeId].push(product);
          });

          // Step 2: Create an order per store
          const orderPromises = Object.entries(storesMap).map(async ([storeId, products]) => {
            const orderRef = await addDoc(collection(db, "Orders"), {
              createdAt: serverTimestamp(),
              userId: user.uid, // Check if this matches your actual logged-in user
              storeId,
              status: "pending",
              location: { latitude, longitude },
            });

            console.log(`Order placed with ID: ${orderRef.id} for user ${user.uid}`);

            const orderID = orderRef.id;

            // Step 3: Save products under the order
            for (const product of products) {
              if (!product.id) {
                console.error("Product ID is undefined for:", product);
                continue;
              }
              const productRef = doc(db, "Orders", orderID, "products", product.id);
              await setDoc(productRef, {
                name: product.catalogueProductName || product.name,
                price: product.price || "0",
                quantity: product.quantity || 1,
                id: product.id,
                productImageUrl: product.productImageUrl,
              });
            }
          });

          await Promise.all(orderPromises);
          await clearCart();

          alert("Orders placed successfully!");
          router.push("/order_history");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get your location. Please enable location services.");
        }
      );
    });
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Something went wrong while placing your order.");
  }
};
  // const handlePlaceOrder = async () => {
  //   try {
  //     const auth = getAuth(); // Get auth instance
  //     const user = auth.currentUser;
  
  //     if (!user) {
  //       return;
  //     }
  
  //     if (!navigator.geolocation) {
  //       alert("Geolocation is not supported by your browser.");
  //       return;
  //     }
  
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  
  //         // Step 1: Organize products by storeID
  //         const storesMap: Record<string, Product[]> = {};
  //         cartItems.forEach((product: Product) => {
  //           if (!product.storeId) {
  //             console.error("Store ID is undefined for product:", product);
  //             return; // Skip this product
  //           }
  //           if (!storesMap[product.storeId]) {
  //             storesMap[product.storeId] = [];
  //           }
  //           storesMap[product.storeId].push(product);
  //         });
  
  //         // Step 2: Create an order per store
  //         const orderPromises = Object.entries(storesMap).map(async ([storeId, products]) => {
  //           // Create a separate order for each store
  //           const orderRef = await addDoc(collection(db, "Orders"), {
  //             createdAt: serverTimestamp(),
  //             userId: user.uid,
  //             storeId, // Store ID in the order document
  //             status: "pending",
  //             location: { latitude, longitude },
  //           });
  
  //           const orderID = orderRef.id;
  
  //           // Step 3: Save products under the order
  //           for (const product of products) {
  //             if (!product.id) {
  //               console.error("Product ID is undefined for:", product);
  //               continue; // Skip this product
  //             }
  //             const productRef = doc(db, "Orders", orderID, "products", product.id);
  //             await setDoc(productRef, {
  //               name: product.catalogueProductName || product.name,
  //               price: product.price || "0",
  //               quantity: product.quantity || 1,
  //               id: product.id,
  //               productImageUrl: product.productImageUrl,
  //             });
  //           }
  //         });
  
  //         // Wait for all orders to be created
  //         await Promise.all(orderPromises);
  
  //         // Step 4: Clear cart after all orders are placed
  //         await clearCart();
  
  //         alert("Orders placed successfully!");
  //         router.push("/order_history");
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //         alert("Failed to get your location. Please enable location services.");
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     alert("Something went wrong while placing your order.");
  //   }
  // };
  
  // const handlePlaceOrder = async () => {
  //   try {
  //     const auth = getAuth(); // Get auth instance
  //     const user = auth.currentUser;
  
  //     if (!user) {
  //       return;
  //     }
  
  //     // Step 1: Check for Geolocation support
  //     if (!navigator.geolocation) {
  //       alert("Geolocation is not supported by your browser.");
  //       return;
  //     }
  
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  
  //         // Step 2: Create order document with location
  //         const orderRef = await addDoc(collection(db, "Orders"), {
  //           createdAt: serverTimestamp(),
  //           userId: user.uid,
  //           status:"pending",
  //           location: { latitude, longitude }, // Store user location
  //         });
  
  //         const orderID = orderRef.id;
  
  //         // Step 3: Organize products by storeID
  //         const storesMap: Record<string, Product[]> = {};
  //         cartItems.forEach((product: Product) => {
  //           if (!product.storeId) {
  //             console.error("Store ID is undefined for product:", product);
  //             return; // Skip this product
  //           }
  //           if (!storesMap[product.storeId]) {
  //             storesMap[product.storeId] = [];
  //           }
  //           storesMap[product.storeId].push(product);
  //         });
  
  //         // Step 4: Save products under respective stores in Firestore
  //         for (const [storeId, products] of Object.entries(storesMap)) {
  //           const storeRef = doc(db, "Orders", orderID, "stores", storeId);
  //           await setDoc(storeRef, {});
  
  //           for (const product of products) {
  //             if (!product.id) {
  //               console.error("Product ID is undefined for:", product);
  //               continue; // Skip this product
  //             }
  //             const productRef = doc(db, "Orders", orderID, "stores", storeId, "products", product.id);
  //             await setDoc(productRef, {
  //               name: product.catalogueProductName || product.name,
  //               price: product.price || "0",
  //               quantity: product.quantity || 1,
  //               id: product.id,
  //               productImageUrl: product.productImageUrl,
  //             });
  //           }
  //         }
  
  //         // Step 5: Clear cart after successful order
  //         await clearCart();
  
  //         alert("Order placed successfully!");
  //         router.push("/order_history");
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //         alert("Failed to get your location. Please enable location services.");
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     alert("Something went wrong while placing your order.");
  //   }
  // };
  
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl  py-2 text-white mt-14 bg-black text-center fixed w-full z-20 font-bold mb-8">Your Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 ">
          <Image
            src="/images/emptyCart.jpg"
            alt="Empty Cart"
            width={300}
            height={400}
            priority
            style={{ width: "auto", height: "auto" }}
            className="max-w-xs md:max-w-md mb-8"
          />
          <p className="text-gray-600 text-lg mb-4">
            Your cart is ready for amazing finds!
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            {isMounted && <span>← Continue Exploring</span>}
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 mt-32">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6 ">
            {cartItems.map((product: Product) => (
              <div
                key={product.id}
                className="flex  bg-white p-4 rounded-lg shadow-md "
              >
                <Image
                  src={product.productImageUrl}
                  alt={product.catalogueProductName || "Product image"}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex items-center lg:w-full">
                <div className="ml-6 flex-1  items-center">
                  <h3 className="text-xl font-semibold">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 ">
                    <div className="flex items-center space-x-4 ">
                      <button
                        onClick={() =>
                          updateCartQuantity(product.id, product.quantity - 1)
                        }
                        className="bg-gray-300 px-3 py-1 rounded-lg text-lg font-bold"
                        disabled={product.quantity === 1}
                      >
                        -
                      </button>
                      <span className="text-gray-600">{product.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(product.id, product.quantity + 1)
                        }
                        className="bg-gray-300 px-3 py-1 rounded-lg text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-bold">
                    ₹{(parsePrice(product.price) * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                </div>
                <div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="ml-10   text-m text-red-500  p-1 rounded-full border-red-600  hover: opacity-6"
                >
                  <BsCartXFill/>
                </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes ({TAX_RATE * 100}%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;



