
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "@/app/lib/firebase";
// import { collection, addDoc, doc, setDoc, Timestamp } from "firebase/firestore";
// import { Eye, EyeOff } from "lucide-react";
// import { useStore } from "@/app/context/StoreContext";

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   productImageUrl: string;
// }

// export default function PlaceOrderButton() {
//   // const { cartItems, clearCart } = useStore();
//   const [user, setUser] = useState(auth.currentUser);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const { cartItems, clearCart } = useStore() as { cartItems: CartItem[]; clearCart: () => void };

  
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((authUser) => {
//       setUser(authUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handlePlaceOrder = async () => {
//     if (!user) {
//       sessionStorage.setItem("redirectAfterLogin", "/order_history");
//       setShowLoginModal(true);
//       return;
//     }

//     if (cartItems.length === 0) {
//       toast.error("Your cart is empty!");
//       return;
//     }

//     try {
//       const orderRef = await addDoc(collection(db, "Orders"), {
//         userId: user.uid,
//         createdAt: Timestamp.now(),
//         status: "pending",
//         storeId: "someStoreId",
//         location: { latitude: 0, longitude: 0 },
//       });

//       for (const item of cartItems) {
//         await setDoc(doc(db, "Orders", orderRef.id, "products", item.id), {
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           productImageUrl: item.productImageUrl,
//         });
//       }

//       clearCart();
//       toast.success("Order placed successfully!",{ autoClose: 500 });

//       setTimeout(() => {
//         router.push("/order_history");
//       }, 1000);
//     } catch (error) {
//       console.error("Order placement failed:", error);
//       toast.error("Failed to place order. Try again.");
//     }
//   };

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       toast.success("You're logged in! Now you can place your order.",{ autoClose: 500 });
//       setShowLoginModal(false);
//     } catch {
//       setError("Invalid email or password.");
//       toast.error("Login Failed!");
//     }
//   };

//   return (
//     <div>
//       <button
//         className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
//         onClick={handlePlaceOrder}
//       >
//         Place Order
//       </button>

//       {/* Login Modal */}
//       {showLoginModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">Login to Place Order</h2>
//             <form onSubmit={handleLogin}>
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3 relative">
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-9 text-gray-600"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>

//               {error && <p className="text-red-500 text-sm">{error}</p>}

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
//               >
//                 Login
//               </button>
//             </form>

//             <button
//               className="mt-3 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-all"
//               onClick={() => setShowLoginModal(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { collection, addDoc, doc, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { useStore } from "@/app/context/StoreContext";


interface CartItem {
  storeId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  productImageUrl: string;
}

export default function PlaceOrderButton() {
  const [user, setUser] = useState(auth.currentUser);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false); // ✅ Track login status
  const router = useRouter();
  const { cartItems, clearCart } = useStore() as { cartItems: CartItem[]; clearCart: () => void };
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);


  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      if (!name || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
        await setDoc(doc(db, "Users", userCredential.user.uid), {
          name,
          email,
          uid: userCredential.user.uid,
          createdAt: new Date(),
        });
  
        toast.success("Registration successful! Please log in.");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
      } catch (error: any) {
        toast.error("Registration Failed!");
        setError(error.message);
      }
    };
  const handlePlaceOrder = async () => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/order_history");
      setShowLoginModal(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            // setIsLoading(false);
            return;
          }
    
          const getLocation = () => {
            return new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
          };
    
          const position = await getLocation();
          const { latitude, longitude } = position.coords;
    

    // try {
    //   const orderRef = await addDoc(collection(db, "Orders"), {
    //     userId: user.uid,
    //     createdAt: Timestamp.now(),
    //     status: "pending",
        
    //     location: { latitude, longitude},
    //   });

    //   for (const item of cartItems) {
    //     await setDoc(doc(db, "Orders", orderRef.id, "products", item.id), {
    //       id: item.id,
    //       name: item.name,
    //       price: item.price,
    //       quantity: item.quantity,
    //       productImageUrl: item.productImageUrl,
    //       storeId:item.storeId
    //     });
    //   }




    // try {
    //   const storeGroups = cartItems.reduce((acc: Record<string, typeof cartItems>, item) => {
    //     if (!acc[item.storeId]) {
    //       acc[item.storeId] = [];
    //     }
    //     acc[item.storeId].push(item);
    //     return acc;
    //   }, {});
    
    //   for (const storeId in storeGroups) {
    //     const orderRef = await addDoc(collection(db, "Orders"), {
    //       userId: user.uid,
    //       createdAt: Timestamp.now(),
    //       status: "pending",
    //       location: { latitude, longitude },
    //       storeId: storeId
    //     });
    
    //     for (const item of storeGroups[storeId]) {
    //       await setDoc(doc(db, "Orders", orderRef.id, "products", item.id), {
    //         id: item.id,
    //         name: item.name,
    //         price: item.price,
    //         quantity: item.quantity,
    //         productImageUrl: item.productImageUrl,
    //         storeId: item.storeId
    //       });
    //     }
    //   }
    try {
  const batch = writeBatch(db);

  // Create the parent order document
  const orderRef = doc(collection(db, "Orders"));
  batch.set(orderRef, {
    userId: user.uid,
    createdAt: Timestamp.now(),
    
    status: "pending", // Overall order status
    location: { latitude, longitude },
    storeStatuses: {}, // Will track status by store
  });

  // Group cart items by store
  const itemsByStore: Record<string, typeof cartItems> = {};
  for (const item of cartItems) {
    if (!itemsByStore[item.storeId]) {
      itemsByStore[item.storeId] = [];
    }
    itemsByStore[item.storeId].push(item);
  }

  // Create a sub-order for each store
  for (const storeId in itemsByStore) {
    const storeOrderRef = doc(collection(db, "Orders", orderRef.id, "StoreOrders"));
    batch.set(storeOrderRef, {
      storeId: storeId,
      status: "pending",
      createdAt: Timestamp.now(),
    });

    // Update the parent order's storeStatuses
    batch.update(orderRef, {
      [`storeStatuses.${storeId}`]: "pending",
    });

    // Add products for this store to the sub-order
    for (const item of itemsByStore[storeId]) {
      const productRef = doc(db, "Orders", orderRef.id, "StoreOrders", storeOrderRef.id, "products", item.id);
      batch.set(productRef, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productImageUrl: item.productImageUrl,
        storeId: item.storeId,
      });
    }
  }

  // Commit the batch write
      await batch.commit();
  // console.log("Order successfully created");
      clearCart();
      toast.success("Order placed successfully!", { autoClose: 500 });

      setTimeout(() => {
        router.push("/order_history");
      }, 1000);
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order. Try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoginModal(false);
      setJustLoggedIn(true); // ✅ Mark user as just logged in
      toast.success("You're logged in! Now you can place your order.", { autoClose: 2000 });

      // ✅ Remove the message after 5 seconds
      setTimeout(() => setJustLoggedIn(false), 10000);
    } catch {
      setError("Invalid email or password.");
      toast.error("Login Failed!");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>

      {/* ✅ Show message only when user just logged in */}
      {justLoggedIn && (
        <p className="text-green-600 mt-2 text-sm animate-fade-in">
          ✅ You're logged in! Now you can place your order.
        </p>
      )}

      {/* Login Modal */}
      {/* {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Login to Place Order</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                Login
              </button>
            </form>

            <button
              className="mt-3 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-all"
              onClick={() => setShowLoginModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}
      {showLoginModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">
        {isLogin ? "Login to Place Order" : "Register to Place Order"}
      </h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 relative">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p
        className="mt-3 text-center text-sm text-gray-600 cursor-pointer hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Don't have an account? Register here" : "Already have an account? Login"}
      </p>

      <button
        className="mt-3 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-all"
        onClick={() => setShowLoginModal(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
}
