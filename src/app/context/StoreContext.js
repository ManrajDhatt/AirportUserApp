"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/app/lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  updateDoc 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Provide default values to avoid `undefined` errors
const StoreContext = createContext({
  likedItems: [],
  cartItems: [],
  toggleLike: () => {},
  addToCart: () => {},
  removeFromCart: (id) => {},
  updateCartQuantity: (id, newQuantity) => {},
  clearCart: () => {},
  setCartItems: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
});

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        const cartRef = collection(db, "Carts", user.uid, "products");
        const querySnapshot = await getDocs(cartRef);
        const cartData = querySnapshot.docs.map((doc) => doc.data());
        setCartItems(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product, storeId, quantity = 1) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const productRef = doc(db, "Carts", user.uid, "products", product.id);
      const docSnapshot = await getDoc(productRef);
      let updatedCartItems = [...cartItems];

      if (docSnapshot.exists()) {
        const currentQuantity = docSnapshot.data().quantity || 1;
        const newQuantity = currentQuantity + quantity;
        
        // Optimistic update
        updatedCartItems = updatedCartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);

        // Background Firestore update
        await updateDoc(productRef, { quantity: newQuantity });
      } else {
        const cartItem = {
          id: product.id,
          name: product.catalogueProductName,
          price: parseFloat(product.price.replace("$", "")) || 0,
          storeId: storeId,
          quantity,
          productImageUrl: product.productImageUrl,
          productDescription: product.productDescription,
          CategoryName: product.catalogueCategoryName,
          CategoryId: product.catalogueCategoryId,
        };

        // Optimistic update
        updatedCartItems = [...updatedCartItems, cartItem];
        setCartItems(updatedCartItems);

        // Background Firestore update
        await setDoc(productRef, cartItem);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Revert the optimistic update if there's an error
      setCartItems(cartItems);
    }
  };

  const removeFromCart = async (id) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    // Optimistic update
    const originalCartItems = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const productRef = doc(db, "Carts", user.uid, "products", id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error removing product from cart:", error);
      // Revert to original cart items if deletion fails
      setCartItems(originalCartItems);
    }
  };

  const updateCartQuantity = async (id, newQuantity) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    // Prevent negative quantities
    if (newQuantity <= 0) {
      await removeFromCart(id);
      return;
    }

    // Optimistic update
    const originalCartItems = [...cartItems];
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const productRef = doc(db, "Carts", user.uid, "products", id);
      
      // Background Firestore update
      await updateDoc(productRef, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      // Revert to original cart items if update fails
      setCartItems(originalCartItems);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        likedItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        setCartItems,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ✅ Always check if `StoreProvider` is used before calling `useStore`
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};