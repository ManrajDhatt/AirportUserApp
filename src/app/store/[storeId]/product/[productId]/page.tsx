"use client"
import React, { useEffect, useState } from "react";
import { ArrowRight, Star, Minus, Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/app/context/StoreContext";
import { toast } from "react-toastify";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { BsCartDash, BsCartPlus } from "react-icons/bs";

interface Product {
  id: string;
  name: string;
  price: string;
  catalogueProductName: string;
  catalogueCategoryName: string;
  catalogueCategoryId: string;
  productImageUrl: string;
  productDescription: string;
  stock: string;
}

export default function ProductPage() {
  const { storeId, productId } = useParams() as { storeId: string; productId: string };
  const { selectedProduct, addToCart, cartItems, removeFromCart, setCartItems } = useStore();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const isInCart = cartItems.some((item) => item.id === productId);

  useEffect(() => {
    if (selectedProduct?.id === productId) {
      setProduct(selectedProduct);
    }
  }, [productId, selectedProduct]);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleCartToggle = async () => {
    if (!product) return;
    
    const newItem = {
      id: product.id,
      catalogueProductName: product.catalogueProductName,
      price: product.price,
      storeId,
      quantity,
      productImageUrl: product.productImageUrl,
      productDescription: product.productDescription,
      catalogueCategoryId: product.catalogueCategoryId,
      catalogueCategoryName: product.catalogueCategoryName,
    };
    
    if (isInCart) {
      setCartItems((prev) => prev.filter((item) => item.id !== product.id));
      await removeFromCart(product.id);
    } else {
      setCartItems((prev) => [...prev, newItem]);
      await addToCart(newItem, storeId, newItem.quantity);
    }
  };

  if (!categoryId) return <p className="p-10">Category ID is missing or invalid</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="py-6 px-20 flex items-center gap-2 text-gray-500 text-sm">
        <p>Home</p> <ArrowRight size={14} />
        <p>Store</p> <ArrowRight size={14} />
        <p>{product.catalogueCategoryName}</p> <ArrowRight size={14} />
        <p className="font-semibold">{product.catalogueProductName}</p>
      </div>

      <div className="px-20 py-8 flex gap-12">
        <div className="w-[40%] flex justify-center">
          <img src={product.productImageUrl} alt={product.catalogueProductName} className="rounded-lg w-[400px] h-[400px] object-cover" />
        </div>

        <div className="flex-grow p-6 bg-gray-100 shadow-md rounded-lg">
          <h2 className="text-3xl font-bold">{product.catalogueProductName}</h2>
          <p className="text-gray-600 mt-1">{product.productDescription || "No description available"}</p>

          <div className="flex items-center gap-1 mt-3">
            {[...Array(4)].map((_, i) => <Star key={i} size={20} className="text-yellow-500" />)}
            <Star size={20} className="text-gray-400" />
          </div>

          <p className="mt-4 text-red-500">Only ({product.stock}) left in stock!</p>
          <div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
            <div className="flex items-center border border-gray-300 rounded-xl">
              <button className="p-3 bg-transparent rounded-l-xl hover:bg-gray-100" onClick={() => handleQuantityChange("decrease")}>
                <Minus size={18} />
              </button>
              <p className="text-lg font-semibold px-4">{quantity}</p>
              <button className="p-3 bg-transparent rounded-r-xl hover:bg-gray-100" onClick={() => handleQuantityChange("increase")}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              className={`px-6 py-2 rounded-lg ${isInCart ? "bg-red-600" : "bg-blue-600"} text-white flex items-center gap-2`}
              onClick={handleCartToggle}
            >
              {isInCart ? (
                <><BsCartDash className="text-2xl" /><span>Remove from Cart</span></>
              ) : (
                <><BsCartPlus className="text-2xl" /><span>Add to Cart</span></>
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}