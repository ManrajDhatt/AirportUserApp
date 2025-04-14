// "use client"
// import React, { useEffect, useState } from "react";
// import { ArrowRight, Star, Minus, Plus } from "lucide-react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { useStore } from "@/app/context/StoreContext";
// import { toast } from "react-toastify";
// import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
// import { db } from "@/app/lib/firebase";
// import { BsCartDash, BsCartPlus } from "react-icons/bs";

// interface Product {
//   id: string;
//   name: string;
//   price: string;
//   catalogueProductName: string;
//   catalogueCategoryName: string;
//   catalogueCategoryId: string;
//   productImageUrl: string;
//   productDescription: string;
//   stock: string;
// }

// export default function ProductPage() {
//   const { storeId, productId } = useParams() as { storeId: string; productId: string };
//   const { selectedProduct, addToCart, cartItems, removeFromCart, setCartItems } = useStore();
//   const searchParams = useSearchParams();
//   const categoryId = searchParams.get("categoryId");
//   const router = useRouter();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const isInCart = cartItems.some((item) => item.id === productId);

//   useEffect(() => {
//     if (selectedProduct?.id === productId) {
//       setProduct(selectedProduct);
//     }
//   }, [productId, selectedProduct]);

//   const handleQuantityChange = (type: "increase" | "decrease") => {
//     setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1));
//   };

//   const handleCartToggle = async () => {
//     if (!product) return;
    
//     const newItem = {
//       id: product.id,
//       catalogueProductName: product.catalogueProductName,
//       price: product.price,
//       storeId,
//       quantity,
//       productImageUrl: product.productImageUrl,
//       productDescription: product.productDescription,
//       catalogueCategoryId: product.catalogueCategoryId,
//       catalogueCategoryName: product.catalogueCategoryName,
//     };
    
//     if (isInCart) {
//       setCartItems((prev) => prev.filter((item) => item.id !== product.id));
//       await removeFromCart(product.id);
//     } else {
//       setCartItems((prev) => [...prev, newItem]);
//       await addToCart(newItem, storeId, newItem.quantity);
//     }
//   };

//   if (!categoryId) return <p className="p-10">Category ID is missing or invalid</p>;
//   if (!product) return <p className="p-10">Product not found</p>;

//   return (
//     <div className="bg-white text-gray-900 min-h-screen">
//       <div className="py-6 px-20 flex items-center gap-2 text-gray-500 text-sm">
//         <p>Home</p> <ArrowRight size={14} />
//         <p>Store</p> <ArrowRight size={14} />
//         <p>{product.catalogueCategoryName}</p> <ArrowRight size={14} />
//         <p className="font-semibold">{product.catalogueProductName}</p>
//       </div>

//       <div className="px-20 py-8 flex gap-12">
//         <div className="w-[40%] flex justify-center">
//           <img src={product.productImageUrl} alt={product.catalogueProductName} className="rounded-lg w-[400px] h-[400px] object-cover" />
//         </div>

//         <div className="flex-grow p-6 bg-gray-100 shadow-md rounded-lg">
//           <h2 className="text-3xl font-bold">{product.catalogueProductName}</h2>
//           <p className="text-gray-600 mt-1">{product.productDescription || "No description available"}</p>

//           <div className="flex items-center gap-1 mt-3">
//             {[...Array(4)].map((_, i) => <Star key={i} size={20} className="text-yellow-500" />)}
//             <Star size={20} className="text-gray-400" />
//           </div>

//           <p className="mt-4 text-red-500">Only ({product.stock}) left in stock!</p>
//           <div>

//           <div className="flex items-center justify-between mt-6">
//             <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
//             <div className="flex items-center border border-gray-300 rounded-xl">
//               <button className="p-3 bg-transparent rounded-l-xl hover:bg-gray-100" onClick={() => handleQuantityChange("decrease")}>
//                 <Minus size={18} />
//               </button>
//               <p className="text-lg font-semibold px-4">{quantity}</p>
//               <button className="p-3 bg-transparent rounded-r-xl hover:bg-gray-100" onClick={() => handleQuantityChange("increase")}>
//                 <Plus size={18} />
//               </button>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button
//               className={`px-6 py-2 rounded-lg ${isInCart ? "bg-red-600" : "bg-blue-600"} text-white flex items-center gap-2`}
//               onClick={handleCartToggle}
//             >
//               {isInCart ? (
//                 <><BsCartDash className="text-2xl" /><span>Remove from Cart</span></>
//               ) : (
//                 <><BsCartPlus className="text-2xl" /><span>Add to Cart</span></>
//               )}
//             </button>
//           </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



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
  discount?: number;
  finalPrice?: string;
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
  const hasDiscount = product?.discount && product?.finalPrice;
  const isOutOfStock = product?.stock && parseInt(product.stock, 10) === 0;

  useEffect(() => {
    if (selectedProduct?.id === productId) {
      setProduct(selectedProduct);
    }
  }, [productId, selectedProduct]);

  // const handleQuantityChange = (type: "increase" | "decrease") => {
  //   setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  // };
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) => {
      if (type === "increase") {
        return product?.stock && prev < parseInt(product.stock) ? prev + 1 : prev;
      } else {
        return prev > 1 ? prev - 1 : 1;
      }
    });
  };
  

  const handleCartToggle = async () => {
    if (!product || isOutOfStock) return;
    
    const newItem = {
      id: product.id,
      catalogueProductName: product.catalogueProductName,
      price: hasDiscount ? parseFloat(product.finalPrice!) : parseFloat(product.price),
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
      toast.success("Removed from cart!");
    } else {
      setCartItems((prev) => [...prev, newItem]);
      await addToCart(newItem, storeId, newItem.quantity);
      toast.success("Added to cart!");
    }
  };

  if (!categoryId) return <p className="p-10">Category ID is missing or invalid</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="py-4 px-4 md:px-8 lg:px-20 flex items-center gap-2 text-gray-500 text-sm bg-white shadow-sm">
        <p className="hover:text-blue-600 cursor-pointer">Home</p> <ArrowRight size={14} />
        <p className="hover:text-blue-600 cursor-pointer">Store</p> <ArrowRight size={14} />
        <p className="hover:text-blue-600 cursor-pointer">{product.catalogueCategoryName}</p> <ArrowRight size={14} />
        <p className="font-semibold text-gray-700">{product.catalogueProductName}</p>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image Section */}
            <div className="md:w-2/5 relative">
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-blue-600 text-white font-bold text-sm py-1 px-3">
                    {product.discount}% OFF
                  </div>
                </div>
              )}
              
              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-10">
                  <span className="text-white text-2xl font-semibold">Out of Stock</span>
                </div>
              )}

              <div className="flex items-center justify-center p-8">
                <img 
                  src={product.productImageUrl} 
                  alt={product.catalogueProductName} 
                  className={`rounded-lg w-full max-w-md h-auto object-cover ${isOutOfStock ? "opacity-60" : ""}`}
                />
              </div>
            </div>

            {/* Product Details Section */}
            <div className="md:w-3/5 p-6 md:p-8 border-l border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{product.catalogueProductName}</h2>
              
              <div className="flex items-center gap-1 mt-3">
                {[...Array(4)].map((_, i) => <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />)}
                <Star size={18} className="text-gray-300 fill-gray-300" />
                <span className="text-gray-500 text-sm ml-2">(4.0)</span>
              </div>
              
              <p className="text-gray-600 mt-4 leading-relaxed">{product.productDescription || "No description available"}</p>

              {/* Price Section */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">₹{product.finalPrice}</p>
                      <p className="text-lg text-gray-500 line-through">₹{product.price}</p>
                      <p className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">Save {product.discount}%</p>
                    </>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">₹{product.price}</p>
                  )}
                </div>
                
                {/* Stock Information */}
                {!isOutOfStock ? (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Only {product.stock} left in stock!
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-red-500 font-semibold">Currently out of stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              {/* {!isOutOfStock && (
                <div className="mt-6">
                  <p className="text-gray-700 font-medium mb-2">Quantity</p>
                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        className="p-2 bg-gray-100 rounded-l-lg hover:bg-gray-200 transition-colors" 
                        onClick={() => handleQuantityChange("decrease")}
                      >
                        <Minus size={18} />
                      </button>
                      <p className="text-lg font-semibold px-6">{quantity}</p>
                      <button 
                        className="p-2 bg-gray-100 rounded-r-lg hover:bg-gray-200 transition-colors" 
                        onClick={() => handleQuantityChange("increase")}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Quantity Selector */}
{!isOutOfStock && (
  <div className="mt-6">
    <p className="text-gray-700 font-medium mb-2">Quantity</p>
    <div className="flex items-center gap-2">
      {/* - Button */}
      <button
        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-300"
        onClick={() => handleQuantityChange("decrease")}
      >
        <Minus size={18} />
      </button>

      {/* Quantity Input */}
      <input
        type="number"
        min={1}
        max={parseInt(product.stock)}
        value={quantity}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value)) {
            if (value > parseInt(product.stock)) {
              toast.error(`Only ${product.stock} items in stock`);
              setQuantity(parseInt(product.stock));
            } else if (value < 1) {
              setQuantity(1);
            } else {
              setQuantity(value);
            }
          } else {
            setQuantity(1);
          }
        }}
        className="w-20 px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none"
      />

      {/* + Button */}
      <button
        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-300"
        onClick={() => handleQuantityChange("increase")}
      >
        <Plus size={18} />
      </button>
    </div>
  </div>
)}


              {/* Add to Cart Button */}
              <div className="mt-8">
                <button
                  disabled={isOutOfStock}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : isInCart
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#525df3] hover:bg-[#4049c9] text-white"
                  }`}
                  onClick={handleCartToggle}
                >
                  {isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : isInCart ? (
                    <>
                      <BsCartDash className="text-xl" />
                      <span>Remove from Cart</span>
                    </>
                  ) : (
                    <>
                      <BsCartPlus className="text-xl" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Free Delivery Section */}
              {/* <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free delivery available</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}