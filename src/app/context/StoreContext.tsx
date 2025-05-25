// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import { auth, db } from "@/app/lib/firebase";
// import { 
//   collection, 
//   doc, 
//   getDoc, 
//   setDoc, 
//   deleteDoc, 
//   getDocs, 
//   updateDoc 
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// // ✅ Provide default values to avoid undefined errors
// const StoreContext = createContext({
//   likedItems: [],
//   cartItems: [],
//   toggleLike: () => {},
//   addToCart: () => {},
//   removeFromCart: (id) => {},
//   updateCartQuantity: (id, newQuantity) => {},
//   clearCart: () => {},
//   setCartItems: () => {},
//   selectedProduct: null,
//   setSelectedProduct: () => {},
// });

// export function StoreProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [likedItems, setLikedItems] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//       setUser(authUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     const fetchCart = async () => {
//       try {
//         const cartRef = collection(db, "Carts", user.uid, "products");
//         const querySnapshot = await getDocs(cartRef);
//         const cartData = querySnapshot.docs.map((doc) => doc.data());
//         setCartItems(cartData);
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     };
//     fetchCart();
//   }, [user]);

//   const addToCart = async (product, storeId, quantity = 1) => {
//     // if (!user) {
//     //   console.error("User not authenticated");
//     //   return;
//     // }

//     try {
//       const productRef = doc(db, "Carts", "products", product.id);
//       const docSnapshot = await getDoc(productRef);
//       let updatedCartItems = [...cartItems];

//       if (docSnapshot.exists()) {
//         const currentQuantity = docSnapshot.data().quantity || 1;
//         const newQuantity = currentQuantity + quantity;
        
//         // Optimistic update
//         updatedCartItems = updatedCartItems.map((item) =>
//           item.id === product.id ? { ...item, quantity: newQuantity } : item
//         );
//         setCartItems(updatedCartItems);

//         // Background Firestore update
//         await updateDoc(productRef, { quantity: newQuantity });
//       } else {
//         const cartItem = {
//           id: product.id,
//           name: product.catalogueProductName,
//           price: parseFloat(product.price.replace("$", "")) || 0,
//           storeId: storeId,
//           quantity,
//           productImageUrl: product.productImageUrl,
//           productDescription: product.productDescription,
//           CategoryName: product.catalogueCategoryName,
//           CategoryId: product.catalogueCategoryId,
//         };

//         // Optimistic update
//         updatedCartItems = [...updatedCartItems, cartItem];
//         setCartItems(updatedCartItems);

//         // Background Firestore update
//         await setDoc(productRef, cartItem);
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       // Revert the optimistic update if there's an error
//       setCartItems(cartItems);
//     }
//   };

//   const removeFromCart = async (id) => {
//     // if (!user) {
//     //   console.error("User not authenticated");
//     //   return;
//     // }

//     // Optimistic update
//     const originalCartItems = [...cartItems];
//     setCartItems((prev) => prev.filter((item) => item.id !== id));

//     try {
//       const productRef = doc(db, "Carts", user.uid, "products", id);
//       await deleteDoc(productRef);
//     } catch (error) {
//       console.error("Error removing product from cart:", error);
//       // Revert to original cart items if deletion fails
//       setCartItems(originalCartItems);
//     }
//   };

//   const updateCartQuantity = async (id, newQuantity) => {
//     // if (!user) {
//     //   console.error("User not authenticated");
//     //   return;
//     // }

//     // Prevent negative quantities
//     if (newQuantity <= 0) {
//       await removeFromCart(id);
//       return;
//     }

//     // Optimistic update
//     const originalCartItems = [...cartItems];
//     setCartItems((prevItems) => 
//       prevItems.map((item) => 
//         item.id === id ? { ...item, quantity: newQuantity } : item
//       )
//     );

//     try {
//       const productRef = doc(db, "Carts", user.uid, "products", id);
      
//       // Background Firestore update
//       await updateDoc(productRef, { quantity: newQuantity });
//     } catch (error) {
//       console.error("Error updating cart quantity:", error);
//       // Revert to original cart items if update fails
//       setCartItems(originalCartItems);
//     }
//   };

//   return (
//     <StoreContext.Provider
//       value={{
//         likedItems,
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateCartQuantity,
//         setCartItems,
//         selectedProduct,
//         setSelectedProduct,
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// }

// // ✅ Always check if StoreProvider is used before calling useStore
// export const useStore = () => {
//   const context = useContext(StoreContext);
//   if (!context) {
//     throw new Error("useStore must be used within a StoreProvider");
//   }
//   return context;
// };

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define CartItem interface
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

// Define Product interface
interface Product {
  id: string;
  price: string;
  productImageUrl?: string;
  catalogueProductName: string;
  catalogueCategoryId: string;
  productDescription?: string;
  stock: string;
  discount?: number;
  finalPrice?: string;
}

// Define StoreContextType
interface StoreContextType {
  likedItems: any[];
  cartItems: CartItem[];
  toggleLike: () => void;
  addToCart: (item: CartItem, storeId: string, quantity?: number) => void; // Changed to CartItem
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

// Create context
const StoreContext = createContext<StoreContextType>({
  likedItems: [],
  cartItems: [],
  toggleLike: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartQuantity: () => {},
  clearCart: () => {},
  setCartItems: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
});

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart: CartItem[] = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(storedCart.filter((item) => item.id && item.storeId && item.CategoryId));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem, storeId: string, quantity = 1) => {
    if (!item.id || !item.CategoryId) {
      console.warn("Invalid cart item data:", item);
      return;
    }

    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    const updatedCartItems: CartItem[] = existingItem
      ? cartItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        )
      : [...cartItems, { ...item, storeId, quantity }];

    setCartItems(updatedCartItems);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        likedItems,
        cartItems,
        toggleLike: () => {}, // Placeholder
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart: () => setCartItems([]),
        setCartItems,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const StoreContext = createContext({
//   likedItems: [],
//   cartItems: [],
//   toggleLike: () => {},
//   addToCart: () => {},
//   removeFromCart: (id) => {},
//   updateCartQuantity: (id, newQuantity) => {},
//   clearCart: () => {},
//   setCartItems: () => {},
//   selectedProduct: null,
//   setSelectedProduct: () => {},
// });
// // Normalizes price to a float value regardless of input format
// function normalizePrice(price) {
//   if (typeof price === 'number') {
//     return price; // already a number, no action needed
//   }

//   if (typeof price === 'string') {
//     // Remove currency symbols (₹, $, etc.), commas, and whitespace
//     const cleaned = price.replace(/[^\d.-]+/g, '');
//     const parsed = parseFloat(cleaned);

//     // Return parsed if valid, otherwise fallback
//     return isNaN(parsed) ? 0 : parsed;
//   }

//   // If price is neither number nor string, fallback to 0
//   return 0;
// }

// export function StoreProvider({ children }) {
//   const [likedItems, setLikedItems] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Load cart from localStorage on mount
//   // useEffect(() => {
//   //   const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
//   //   setCartItems(storedCart);
//   // }, []);
// useEffect(() => {
//   const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
//   setCartItems(storedCart.filter(item => item.id && item.storeId && item.CategoryId));
// }, []);
//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product, storeId, quantity = 1) => {
//     const existingItem = cartItems.find((item) => item.id === product.id);

//     let updatedCartItems;
//     if (existingItem) {
//       updatedCartItems = cartItems.map((item) =>
//         item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
//       );
//     } else {
//       // price: parseFloat(product.price.replace("$", "")) || 0,
//           // price: parseFloat(product.price.replace(/[$,]/g, "")) || 0,
//       updatedCartItems = [
//         ...cartItems,
//         {
//           id: product.id,
//           name: product.catalogueProductName,
          
//           price:normalizePrice(product.price),
//           storeId: storeId,
//           quantity,
//           productImageUrl: product.productImageUrl,
//           productDescription: product.productDescription,
//           CategoryName: product.catalogueCategoryName,
//           CategoryId: product.catalogueCategoryId,
//         },
//       ];
//     }

//     setCartItems(updatedCartItems);
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const updateCartQuantity = (id, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(id);
//       return;
//     }
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   return (
//     <StoreContext.Provider
//       value={{
//         likedItems,
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateCartQuantity,
//         clearCart: () => setCartItems([]), // Add this

//         setCartItems,
//         selectedProduct,
//         setSelectedProduct,
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// }

// export const useStore = () => {
//   const context = useContext(StoreContext);
//   if (!context) {
//     throw new Error("useStore must be used within a StoreProvider");
//   }
//   return context;
// };