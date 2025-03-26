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
  removeFromCart: () => {},
  updateCartQuantity: () => {},
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
        await updateDoc(productRef, { quantity: newQuantity });
        updatedCartItems = updatedCartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
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
        await setDoc(productRef, cartItem);
        updatedCartItems = [...updatedCartItems, cartItem];
      }

      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (id) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const productRef = doc(db, "Carts", user.uid, "products", id);
      await deleteDoc(productRef);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        likedItems,
        cartItems,
        addToCart,
        removeFromCart,
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
