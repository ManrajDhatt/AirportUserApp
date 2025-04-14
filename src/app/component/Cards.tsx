
// // // "use client";
// // // import React from "react";
// // // import { useRouter } from "next/navigation";
// // // import { BsCartPlus, BsCartDash } from "react-icons/bs";
// // // import { useStore } from "../context/StoreContext";

// // // interface Product {
// // //   id: string;
// // //   price: string;
// // //   productImageUrl?: string;
// // //   catalogueProductName: string;
// // //   catalogueCategoryId: string;
// // //   productDescription?: string;
// // //   stock: string;
// // // }

// // // interface CardProps {
// // //   product: Product;
// // //   storeId: string;
// // // }

// // // const Cards: React.FC<CardProps> = ({ product, storeId }) => {
// // //   const { addToCart, cartItems, removeFromCart, setCartItems, setSelectedProduct } = useStore();
// // //   const router = useRouter();

// // //   const isInCart = cartItems.some((item) => item.id === product.id);
// // //   const isOutOfStock = parseInt(product.stock, 10) === 0;

// // //   const handleCartToggle = async () => {
// // //     if (isOutOfStock) return;

// // //     if (isInCart) {
// // //       setCartItems((prev) => prev.filter((item) => item.id !== product.id));
// // //       await removeFromCart(product.id);
// // //     } else {
// // //       const newItem = {
// // //         id: product.id,
// // //         name: product.catalogueProductName,
// // //         price: parseFloat(product.price),
// // //         storeId: storeId,
// // //         quantity: 1,
// // //         productImageUrl: product.productImageUrl || "/default-image.jpg",
// // //         productDescription: product.productDescription || "A great product for you!",
// // //         CategoryName: "",
// // //         CategoryId: product.catalogueCategoryId,
// // //       };
// // //       setCartItems((prev) => [...prev, newItem]);
// // //       await addToCart(newItem, storeId);
// // //     }
// // //   };

// // //   const handleProductClick = (event: React.MouseEvent) => {
// // //     if (isOutOfStock) return;
// // //     event.preventDefault();
// // //     setSelectedProduct(product);
// // //     router.push(
// // //       `/store/${storeId}/product/${product.id}?categoryId=${product.catalogueCategoryId}`
// // //     );
// // //   };

// // //   return (
// // //     <div className="relative w-72 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
// // //       {/* Out of Stock Overlay - Covers entire card */}
// // //       {isOutOfStock && (
// // //         <div className="absolute inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center text-white text-2xl font-semibold opacity-0 hover:opacity-100 transition-opacity z-10">
// // //           Out of Stock
// // //         </div>
// // //       )}

// // //       <div className={`${isOutOfStock ? "  opacity-30" : "bg-white"} relative`}>
// // //         {/* Image Section */}
// // //         <a
// // //           onClick={handleProductClick}
// // //           className="block relative cursor-pointer"
// // //         >
// // //           <img
// // //             className="w-full h-56 object-cover rounded-t-xl"
// // //             src={product.productImageUrl || "/default-image.jpg"}
// // //             alt={product.catalogueProductName}
// // //           />
// // //         </a>

// // //         {/* Product Info */}
// // //         <div className="p-4 flex flex-col gap-2">
// // //           <h5 className="text-lg font-semibold text-gray-900">{product.catalogueProductName}</h5>
// // //           <p className="text-gray-500 text-sm line-clamp-2">
// // //             {product.productDescription || "A great product for you!"}
// // //           </p>

// // //           <div className="flex justify-between items-center mt-3">
// // //             <span className="text-xl font-bold text-black">₹{product.price}</span>

// // //             {/* Button Section */}
// // //             <button
// // //               onClick={handleCartToggle}
// // //               className={`px-4 py-2 flex items-center gap-2 rounded-lg shadow-md transition-all hover:scale-105 ${
// // //                 isOutOfStock
// // //                   ? "bg-gray-400 text-gray-700 pointer-events-none"
// // //                   : isInCart
// // //                   ? "bg-red-600 hover:bg-red-800 text-white"
// // //                   : "bg-[#525df3] hover:bg-[#4049c9] text-white"
// // //               }`}
// // //             >
// // //               {isOutOfStock ? (
// // //                 <span>Out of Stock</span>
// // //               ) : isInCart ? (
// // //                 <>
// // //                   <BsCartDash className="text-xl" />
// // //                   <span className="hidden lg:inline">Remove</span>
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <BsCartPlus className="text-xl" />
// // //                   <span className="hidden lg:inline">Add</span>
// // //                 </>
// // //               )}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Cards;

// // "use client";
// // import React, { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { BsCartPlus, BsCartDash } from "react-icons/bs";
// // import { useStore } from "../context/StoreContext";

// // interface Product {
// //   id: string;
// //   price: string;
// //   productImageUrl?: string;
// //   catalogueProductName: string;
// //   catalogueCategoryId: string;
// //   productDescription?: string;
// //   stock: string;
// // }

// // interface CardProps {
// //   product: Product;
// //   storeId: string;
// // }

// // const Cards: React.FC<CardProps> = ({ product: initialProduct, storeId }) => {
// //   const [currentProduct, setCurrentProduct] = useState(initialProduct);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const { addToCart, cartItems, removeFromCart, setCartItems, setSelectedProduct } = useStore();
// //   const router = useRouter();

// //   const isInCart = cartItems.some((item) => item.id === currentProduct.id);
// //   const isOutOfStock = parseInt(currentProduct.stock, 10) === 0;

// //   // Only poll for updates if product is in cart
// //   useEffect(() => {
// //     if (!isInCart) return;

// //     const checkStock = async () => {
// //       if (isLoading) return;
      
// //       setIsLoading(true);
// //       try {
// //         // Try a more standard API endpoint
// //         const response = await fetch(`/api/store/${storeId}/products/${currentProduct.id}/stock`);
        
// //         if (response.ok) {
// //           const data = await response.json();
// //           if (data.stock !== currentProduct.stock) {
// //             setCurrentProduct(prev => ({ ...prev, stock: data.stock }));
// //           }
// //         }
// //         // Don't worry about 404s - they just mean we can't check stock
// //       } catch (error) {
// //         console.error("Stock check failed:", error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     // Initial check
// //     checkStock();

// //     // Poll every 60 seconds if in cart
// //     const interval = setInterval(checkStock, 60000);
// //     return () => clearInterval(interval);
// //   }, [isInCart, currentProduct.id, storeId, isLoading]);

// //   const handleCartToggle = async () => {
// //     if (isOutOfStock) return;

// //     if (isInCart) {
// //       setCartItems((prev) => prev.filter((item) => item.id !== currentProduct.id));
// //       await removeFromCart(currentProduct.id);
// //     } else {
// //       const newItem = {
// //         id: currentProduct.id,
// //         name: currentProduct.catalogueProductName,
// //         price: parseFloat(currentProduct.price),
// //         storeId: storeId,
// //         quantity: 1,
// //         productImageUrl: currentProduct.productImageUrl || "/default-image.jpg",
// //         productDescription: currentProduct.productDescription || "A great product for you!",
// //         CategoryName: "",
// //         CategoryId: currentProduct.catalogueCategoryId,
// //       };
// //       setCartItems((prev) => [...prev, newItem]);
// //       await addToCart(newItem, storeId);
// //     }
// //   };

// //   const handleProductClick = (event: React.MouseEvent) => {
// //     if (isOutOfStock) return;
// //     event.preventDefault();
// //     setSelectedProduct(currentProduct);
// //     router.push(
// //       `/store/${storeId}/product/${currentProduct.id}?categoryId=${currentProduct.catalogueCategoryId}`
// //     );
// //   };

// //   return (
// //     <div className="relative w-72 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
// //       {isOutOfStock && (
// //         <div className="absolute inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center text-white text-2xl font-semibold opacity-0 hover:opacity-100 transition-opacity z-10">
// //           Out of Stock
// //         </div>
// //       )}

// //       <div className={`${isOutOfStock ? "opacity-30" : "bg-white"} relative`}>
// //         <a onClick={handleProductClick} className="block relative cursor-pointer">
// //           <img
// //             className="w-full h-56 object-cover rounded-t-xl"
// //             src={currentProduct.productImageUrl || "/default-image.jpg"}
// //             alt={currentProduct.catalogueProductName}
// //           />
// //         </a>

// //         <div className="p-4 flex flex-col gap-2">
// //           <h5 className="text-lg font-semibold text-gray-900">{currentProduct.catalogueProductName}</h5>
// //           <p className="text-gray-500 text-sm line-clamp-2">
// //             {currentProduct.productDescription || "A great product for you!"}
// //           </p>

// //           <div className="flex justify-between items-center mt-3">
// //             <span className="text-xl font-bold text-black">₹{currentProduct.price}</span>

// //             <button
// //               onClick={handleCartToggle}
// //               disabled={isOutOfStock}
// //               className={`px-4 py-2 flex items-center gap-2 rounded-lg shadow-md transition-all hover:scale-105 ${
// //                 isOutOfStock
// //                   ? "bg-gray-400 text-gray-700 cursor-not-allowed"
// //                   : isInCart
// //                   ? "bg-red-600 hover:bg-red-800 text-white"
// //                   : "bg-[#525df3] hover:bg-[#4049c9] text-white"
// //               }`}
// //             >
// //               {isOutOfStock ? (
// //                 <span>Out of Stock</span>
// //               ) : isInCart ? (
// //                 <>
// //                   <BsCartDash className="text-xl" />
// //                   <span className="hidden lg:inline">Remove</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <BsCartPlus className="text-xl" />
// //                   <span className="hidden lg:inline">Add</span>
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Cards;






// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { BsCartPlus, BsCartDash } from "react-icons/bs";
// import { useStore } from "../context/StoreContext";

// interface Product {
//   id: string;
//   price: string;
//   productImageUrl?: string;
//   catalogueProductName: string;
//   catalogueCategoryId: string;
//   productDescription?: string;
//   stock: string;
//   discount?: number;
//   finalPrice?: string;
// }

// interface CardProps {
//   product: Product;
//   storeId: string;
// }

// const Cards: React.FC<CardProps> = ({ product: initialProduct, storeId }) => {
//   const [currentProduct, setCurrentProduct] = useState(initialProduct);
//   const [isLoading, setIsLoading] = useState(false);
//   const { addToCart, cartItems, removeFromCart, setCartItems, setSelectedProduct } = useStore();
//   const router = useRouter();

//   const isInCart = cartItems.some((item) => item.id === currentProduct.id);
//   const isOutOfStock = parseInt(currentProduct.stock, 10) === 0;
//   const hasDiscount = currentProduct.discount && currentProduct.finalPrice;

//   // Only poll for updates if product is in cart
//   useEffect(() => {
//     if (!isInCart) return;

//     const checkStock = async () => {
//       if (isLoading) return;
      
//       setIsLoading(true);
//       try {
//         const response = await fetch(`/api/store/${storeId}/products/${currentProduct.id}/stock`);
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.stock !== currentProduct.stock) {
//             setCurrentProduct(prev => ({ ...prev, stock: data.stock }));
//           }
//         }
//       } catch (error) {
//         console.error("Stock check failed:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkStock();
//     const interval = setInterval(checkStock, 60000);
//     return () => clearInterval(interval);
//   }, [isInCart, currentProduct.id, storeId, isLoading]);

//   const handleCartToggle = async () => {
//     if (isOutOfStock) return;

//     if (isInCart) {
//       setCartItems((prev) => prev.filter((item) => item.id !== currentProduct.id));
//       await removeFromCart(currentProduct.id);
//     } else {
//       const newItem = {
//         id: currentProduct.id,
//         name: currentProduct.catalogueProductName,
//         price: parseFloat(hasDiscount ? currentProduct.finalPrice! : currentProduct.price),
//         storeId: storeId,
//         quantity: 1,
//         productImageUrl: currentProduct.productImageUrl || "/default-image.jpg",
//         productDescription: currentProduct.productDescription || "A great product for you!",
//         CategoryName: "",
//         CategoryId: currentProduct.catalogueCategoryId,
//       };
//       setCartItems((prev) => [...prev, newItem]);
//       await addToCart(newItem, storeId);
//     }
//   };

//   const handleProductClick = (event: React.MouseEvent) => {
//     if (isOutOfStock) return;
//     event.preventDefault();
//     setSelectedProduct(currentProduct);
//     router.push(
//       `/store/${storeId}/product/${currentProduct.id}?categoryId=${currentProduct.catalogueCategoryId}`
//     );
//   };

//   return (
//     <div className="relative w-72 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
//       <div className={`${isOutOfStock ? "opacity-60" : "bg-white"} relative`}>
//         {/* New Discount Badge - Top Right Corner */}
//         {hasDiscount && (
//   <div className="absolute top-0 left-0 z-10 ml-2 ">
//     <div className="bg-indigo-600 text-white text-sm font-bold mx-1 py-2 w-14 text-center relative">
//       <div className="leading-tight">
//         {currentProduct.discount}%<br />OFF
//       </div>
//       <div className="absolute bottom-[-6px] left-0 w-full flex justify-between">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <div
//             key={i}
//             className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-indigo-700"
//           />
//         ))}
//       </div>
//     </div>
//   </div>
// )}


//         {/* Out of Stock Overlay */}
//         {isOutOfStock && (
//           <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-10">
//             <span className="text-white text-2xl font-semibold">Out of Stock</span>
//           </div>
//         )}

//         <a onClick={handleProductClick} className="block relative cursor-pointer">
//           <img
//             className="w-full h-56 object-cover rounded-t-xl"
//             src={currentProduct.productImageUrl || "/default-image.jpg"}
//             alt={currentProduct.catalogueProductName}
//           />
//         </a>

//         <div className="p-4 flex flex-col gap-2">
//           <h5 className="text-lg font-semibold text-gray-900">{currentProduct.catalogueProductName}</h5>
//           <p className="text-gray-500 text-sm line-clamp-2">
//             {currentProduct.productDescription || "A great product for you!"}
//           </p>

//           <div className="flex justify-between items-center mt-3">
//             <div className="flex flex-col">
//               {hasDiscount ? (
//                 <>
//                   <span className="text-xl font-bold text-green-600">
//                     ₹{currentProduct.finalPrice}
//                   </span>
//                   <span className="text-lg text-gray-500 line-through">
//                     ₹{currentProduct.price}
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-xl font-bold text-black">₹{currentProduct.price}</span>
//               )}
//             </div>

//             <button
//               onClick={handleCartToggle}
//               disabled={isOutOfStock}
//               className={`px-4 py-2 flex items-center gap-2 rounded-lg shadow-md transition-all hover:scale-105 ${
//                 isOutOfStock
//                   ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                   : isInCart
//                   ? "bg-red-600 hover:bg-red-800 text-white"
//                   : "bg-[#525df3] hover:bg-[#4049c9] text-white"
//               }`}
//             >
//               {isOutOfStock ? (
//                 <span>Out of Stock</span>
//               ) : isInCart ? (
//                 <>
//                   <BsCartDash className="text-xl" />
//                   <span className="hidden lg:inline">Remove</span>
//                 </>
//               ) : (
//                 <>
//                   <BsCartPlus className="text-xl" />
//                   <span className="hidden lg:inline">Add</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cards;






"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsCartPlus, BsCartDash } from "react-icons/bs";
import { useStore } from "../context/StoreContext";

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

interface CardProps {
  product: Product;
  storeId: string;
}

const Cards: React.FC<CardProps> = ({ product: initialProduct, storeId }) => {
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, cartItems, removeFromCart, setCartItems, setSelectedProduct } = useStore();
  const router = useRouter();

  const isInCart = cartItems.some((item) => item.id === currentProduct.id);
  const isOutOfStock = parseInt(currentProduct.stock, 10) === 0;
  const hasDiscount = currentProduct.discount && currentProduct.finalPrice;

  // Only poll for updates if product is in cart
  useEffect(() => {
    if (!isInCart) return;

    const checkStock = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/store/${storeId}/products/${currentProduct.id}/stock`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.stock !== currentProduct.stock) {
            setCurrentProduct(prev => ({ ...prev, stock: data.stock }));
          }
        }
      } catch (error) {
        console.error("Stock check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStock();
    const interval = setInterval(checkStock, 60000);
    return () => clearInterval(interval);
  }, [isInCart, currentProduct.id, storeId, isLoading]);

  const handleCartToggle = async () => {
    if (isOutOfStock) return;

    if (isInCart) {
      setCartItems((prev) => prev.filter((item) => item.id !== currentProduct.id));
      await removeFromCart(currentProduct.id);
    } else {
      const newItem = {
        id: currentProduct.id,
        name: currentProduct.catalogueProductName,
        price: parseFloat(hasDiscount ? currentProduct.finalPrice! : currentProduct.price),
        storeId: storeId,
        quantity: 1,
        productImageUrl: currentProduct.productImageUrl || "/default-image.jpg",
        productDescription: currentProduct.productDescription || "A great product for you!",
        CategoryName: "",
        CategoryId: currentProduct.catalogueCategoryId,
      };
      setCartItems((prev) => [...prev, newItem]);
      await addToCart(newItem, storeId);
    }
  };

  const handleProductClick = (event: React.MouseEvent) => {
    if (isOutOfStock) return;
    event.preventDefault();
    setSelectedProduct(currentProduct);
    router.push(
      `/store/${storeId}/product/${currentProduct.id}?categoryId=${currentProduct.catalogueCategoryId}`
    );
  };

  return (
    <div className="relative w-72 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl bg-white">
      <div className={`${isOutOfStock ? "opacity-60" : ""} relative h-full flex flex-col`}>
        {/* Discount Badge - Top Left Corner - Updated to blue */}
        {hasDiscount && (
          <div className="absolute top-0 left-0 z-10 ml-2">
            <div className="bg-blue-600 text-white text-sm font-bold mx-1 py-2 w-14 text-center relative">
              <div className="leading-tight">
                {currentProduct.discount}%<br />OFF
              </div>
              <div className="absolute bottom-[-6px] left-0 w-full flex justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-700"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-10">
            <span className="text-white text-2xl font-semibold">Out of Stock</span>
          </div>
        )}

        <a onClick={handleProductClick} className="block relative cursor-pointer">
          <img
            className="w-full h-56 object-cover rounded-t-xl"
            src={currentProduct.productImageUrl || "/default-image.jpg"}
            alt={currentProduct.catalogueProductName}
          />
        </a>

        <div className="p-4 flex flex-col gap-2 flex-grow">
          <h5 className="text-lg font-semibold text-gray-900 line-clamp-1">{currentProduct.catalogueProductName}</h5>
          <p className="text-gray-500 text-sm line-clamp-2">
            {currentProduct.productDescription || "A great product for you!"}
          </p>

          <div className="flex justify-between items-center mt-auto pt-3">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-green-600">
                    ₹{currentProduct.finalPrice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{currentProduct.price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-black">₹{currentProduct.price}</span>
              )}
            </div>

            <button
              onClick={handleCartToggle}
              disabled={isOutOfStock}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg shadow-md transition-all hover:scale-105 ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : isInCart
                  ? "bg-red-600 hover:bg-red-800 text-white"
                  : "bg-[#525df3] hover:bg-[#4049c9] text-white"
              }`}
            >
              {isOutOfStock ? (
                <span>Out of Stock</span>
              ) : isInCart ? (
                <>
                  <BsCartDash className="text-xl" />
                  <span className="hidden lg:inline">Remove</span>
                </>
              ) : (
                <>
                  <BsCartPlus className="text-xl" />
                  <span className="hidden lg:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;