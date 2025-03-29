// import { useStore } from "../context/StoreContext"; // Import cart context
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { BsCartPlusFill } from "react-icons/bs";

// const StickyCartBanner = () => {
//   const { cartItems } = useStore(); // Get cart items from context
//   const pathname = usePathname();

//   // Hide the banner when cart is empty or user is on the cart page
//   if (cartItems.length === 0 || pathname === "/store/Cart") return null;

//   return (
//     <div className=" flex   justify-center fixed bottom-0 left-0 max-w-[800px] min-w-[500px] bg-blue-500 text-white items-center px-4 py-3 shadow-md transition-all duration-300">
//       <div className="flex items-center space-x-3">
//         <BsCartPlusFill className="text-2xl" />
//         <p className="text-sm font-medium">{cartItems.length} item(s) added to cart!</p>
//       </div>
//       <Link href="/store/Cart">
//         <button className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition">
//           Go to Cart
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default StickyCartBanner;



import { useStore } from "../context/StoreContext"; // Import cart context
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BsCartPlusFill } from "react-icons/bs";

const StickyCartBanner = () => {
  const { cartItems } = useStore(); // Get cart items from context
  const pathname = usePathname();

  // Hide the banner when cart is empty or user is on the cart page
  if (cartItems.length === 0 || pathname === "/store/Cart") return null;

  return (
    <div className="fixed bottom-0 w-full flex justify-center px-3 pb-1">
      <div className="max-w-[500px] w-full md:min-w-[500px] bg-gray-800 text-white flex items-center justify-between px-4 py-3 shadow-md rounded-lg transition-all duration-300">
        <div className="flex items-center space-x-3">
          <BsCartPlusFill className="text-2xl" />
          <p className="text-sm font-medium">{cartItems.length} item(s) added to cart!</p>
        </div>
        <Link href="/store/Cart">
          <button className="bg-white text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition">
            Go to Cart
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StickyCartBanner;
