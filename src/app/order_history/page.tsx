

// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// // // import { db } from "@/app/lib/firebase";

// // // import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// // // import Image from "next/image";
// // // import { motion } from "framer-motion";
// // // import { BadgeCheck, Clock, Package, Send, Truck, X } from "lucide-react";
// // // import OrderTimeline from "../component/orderTimeline";

// // // type OrderStatus = "pending" | "accepted" | "rejected" | "packaged" | "onway" | "delivered";

// // // interface Product {
// // //   productImageUrl: string;
// // //   productName: string;
// // //   price: number;
// // //   quantity: number;
// // // }

// // // interface StatusTimestamps {
// // //   pending?: string;
// // //   accepted?: string;
// // //   rejected?: string;
// // //   packaged?: string;
// // //   onway?: string;
// // //   delivered?: string;
// // // }

// // // interface Order {
// // //   id: string;
// // //   createdAt: string;
// // //   products: Product[];
// // //   status: OrderStatus;
// // //   statusTimestamps?: StatusTimestamps;
// // // }

// // // // Create our own Dialog components with proper TypeScript interfaces
// // // interface DialogProps {
// // //   open: boolean;
// // //   onOpenChange: (open: boolean) => void;
// // //   children: React.ReactNode;
// // // }


// // // // Update the Dialog component to trigger timeline animations when opened
// // // const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
// // //   if (!open) return null;

// // //   return (
// // //     <motion.div 
// // //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
// // //       onClick={() => onOpenChange(false)}
// // //       initial={{ opacity: 0 }}
// // //       animate={{ opacity: 1 }}
// // //       exit={{ opacity: 0 }}
// // //       transition={{ duration: 0.3 }}
// // //     >
// // //       <motion.div 
// // //         className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto" 
// // //         onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
// // //         initial={{ scale: 0.9, y: 20, opacity: 0 }}
// // //         animate={{ scale: 1, y: 0, opacity: 1 }}
// // //         transition={{ 
// // //           type: "spring", 
// // //           stiffness: 300,
// // //           damping: 30,
// // //           delay: 0.1
// // //         }}
// // //       >
// // //         {children}
// // //       </motion.div>
// // //     </motion.div>
// // //   );
// // // };

// // // interface DialogContentProps {
// // //   children: React.ReactNode;
// // //   className?: string;
// // // }

// // // const DialogContent = ({ children, className = "" }: DialogContentProps) => {
// // //   return <div className={`p-6 ${className}`}>{children}</div>;
// // // };

// // // interface DialogHeaderProps {
// // //   children: React.ReactNode;
// // // }

// // // const DialogHeader = ({ children }: DialogHeaderProps) => {
// // //   return <div className="mb-4">{children}</div>;
// // // };

// // // interface DialogTitleProps {
// // //   children: React.ReactNode;
// // //   className?: string;
// // // }

// // // const DialogTitle = ({ children, className = "" }: DialogTitleProps) => {
// // //   return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
// // // };



// // // const OrderTimelines = ({ 
// // //   status, 
// // //   timestamps 
// // // }: { 
// // //   status: OrderStatus; 
// // //   timestamps?: StatusTimestamps 
// // // }) => {
// // //   const steps = [
// // //     { status: "pending" as OrderStatus, label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
// // //     { status: "accepted" as OrderStatus, label: "Order Accepted", icon: <BadgeCheck className="w-6 h-6" /> },
// // //     { status: "packaged" as OrderStatus, label: "Order Packaged", icon: <Package className="w-6 h-6" /> },
// // //     { status: "onway" as OrderStatus, label: "On The Way", icon: <Truck className="w-6 h-6" /> },
// // //     { status: "delivered" as OrderStatus, label: "Delivered", icon: <Send className="w-6 h-6" /> },
// // //   ];

// // //   const statusMap: Record<OrderStatus, number> = {
// // //     pending: 0,
// // //     accepted: 1,
// // //     rejected: -1,
// // //     packaged: 2,
// // //     onway: 3,
// // //     delivered: 4,
// // //   };

// // //   const currentStatusIndex = statusMap[status];

// // //   // Animation variants
// // //   const containerVariants = {
// // //     hidden: { opacity: 0 },
// // //     visible: { 
// // //       opacity: 1,
// // //       transition: { 
// // //         staggerChildren: 0.3,
// // //         delayChildren: 0.2
// // //       }
// // //     }
// // //   };

// // //   const itemVariants = {
// // //     hidden: { y: 20, opacity: 0 },
// // //     visible: { 
// // //       y: 0, 
// // //       opacity: 1,
// // //       transition: { 
// // //         type: "spring",
// // //         stiffness: 120,
// // //         damping: 20
// // //       } 
// // //     }
// // //   };

// // //   const lineVariants = (index: number) => ({
// // //     hidden: { scaleY: 0, opacity: 0 },
// // //     visible: {
// // //       scaleY: 1,
// // //       opacity: 1,
// // //       transition: {
// // //         delay: index * 0.3,
// // //         duration: 0.6,
// // //         type: "spring",
// // //         bounce: 0.3
// // //       }
// // //     }
// // //   });

// // //   return (
// // //     <div className="py-4 px-2 relative">
// // //       {status === "rejected" ? (
// // //         <motion.div 
// // //           className="flex flex-col items-center"
// // //           initial={{ scale: 0.8, opacity: 0 }}
// // //           animate={{ scale: 1, opacity: 1 }}
// // //           transition={{ duration: 0.5, type: "spring" }}
// // //         >
// // //           <div className="bg-red-100 p-6 rounded-full relative">
// // //             <X className="w-8 h-8 text-red-500" />
// // //           </div>
// // //           <motion.h3 
// // //             className="font-bold text-red-600 mt-2"
// // //             initial={{ opacity: 0, y: 10 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             transition={{ delay: 0.3 }}
// // //           >
// // //             Order Rejected
// // //           </motion.h3>
// // //           {timestamps?.rejected && (
// // //             <motion.p className="text-sm text-gray-500">
// // //               {new Date(timestamps.rejected).toLocaleString()}
// // //             </motion.p>
// // //           )}
// // //         </motion.div>
// // //       ) : (
// // //         <motion.div 
// // //           className="relative"
// // //           variants={containerVariants}
// // //           initial="hidden"
// // //           animate="visible"
// // //         >
         
// // //           Progressive timeline line with stops
// // // <div className="absolute left-3/4 top-0 bottom-0 -translate-x-1/2 w-2 bg-gray-200 rounded-full overflow-hidden">
// // //   {steps.map((_, idx) => (
// // //     <div key={idx} className="absolute left-0 right-0" style={{ top: `${idx * 20}%` }}>
// // //       {/* Timeline segment */}
// // //       <motion.div
// // //         className="absolute w-full h-[20%] bg-emerald-500 origin-top"
// // //         variants={{
// // //           hidden: { scaleY: 0, opacity: 0 },
// // //           visible: { 
// // //             scaleY: 1, 
// // //             opacity: 1,
// // //             transition: {
// // //               duration: 0.6,
// // //               type: "spring",
// // //               bounce: 0.3
// // //             }
// // //           }
// // //         }}
// // //         animate={idx <= currentStatusIndex ? "visible" : "hidden"}
// // //         transition={{ delay: idx * 0.3 }}
// // //       />
      
// // //       {/* Timeline stop */}
// // //       <motion.div
// // //         className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
// // //         style={{ 
// // //           borderColor: idx <= currentStatusIndex ? "#10B981" : "#E5E7EB",
// // //           backgroundColor: idx <= currentStatusIndex ? "#10B981" : "transparent"
// // //         }}
// // //         initial={{ scale: 0 }}
// // //         animate={{ 
// // //           scale: 1,
// // //           transition: { 
// // //             delay: idx * 0.3 + 0.2,
// // //             type: "spring" 
// // //           }
// // //         }}
// // //       />
// // //     </div>
// // //   ))}
// // // </div>

// // //           <div className="space-y-16 relative">
// // //             {steps.map((step, idx) => {
// // //               const isActive = idx <= currentStatusIndex;
// // //               const isPast = idx < currentStatusIndex;
// // //               const isNext = idx === currentStatusIndex + 1;

// // //               return (
// // //                 <motion.div 
// // //                   key={step.status} 
// // //                   className="relative flex items-center"
// // //                   variants={itemVariants}
// // //                 >
// // //                   {/* Step connector */}
// // //                   {idx > 0 && (
// // //                     <motion.div 
// // //                       className={`absolute left-1/2 -translate-x-1/2 -top-16 w-1 h-16 ${
// // //                         isActive ? "bg-emerald-500" : "bg-gray-200"
// // //                       }`}
// // //                       initial={{ scaleY: 0 }}
// // //                       animate={{ scaleY: isActive ? 1 : 0 }}
// // //                       transition={{ duration: 0.4, delay: idx * 0.3 }}
// // //                     />
// // //                   )}

// // //                   {/* Step indicator */}
// // //                   <div className="relative z-10">
// // //                     <motion.div 
// // //                       className={`rounded-full p-4 relative ${
// // //                         isActive 
// // //                           ? "bg-emerald-500 shadow-lg" 
// // //                           : "bg-gray-200"
// // //                       }`}
// // //                       whileHover={{ scale: 1.05 }}
// // //                     >
// // //                       <motion.div
// // //                         className="text-white"
// // //                         animate={isActive ? { 
// // //                           scale: [1, 1.1, 1],
// // //                         } : {}}
// // //                         transition={{ 
// // //                           duration: 1.5,
// // //                           repeat: Infinity,
// // //                           delay: idx * 0.2
// // //                         }}
// // //                       >
// // //                         {step.icon}
// // //                       </motion.div>
// // //                     </motion.div>

// // //                     {/* Progress pulse */}
// // //                     {isPast && (
// // //                       <motion.div
// // //                         className="absolute inset-0 rounded-full border-2 border-emerald-500"
// // //                         initial={{ scale: 1, opacity: 1 }}
// // //                         animate={{ scale: 1.5, opacity: 0 }}
// // //                         transition={{ 
// // //                           duration: 1.5,
// // //                           repeat: Infinity
// // //                         }}
// // //                       />
// // //                     )}
// // //                   </div>

// // //                   {/* Step label */}
// // //                   <motion.div 
// // //                     className="ml-6 space-y-1"
// // //                     initial={{ opacity: 0, x: -20 }}
// // //                     animate={{ opacity: 1, x: 0 }}
// // //                     transition={{ delay: idx * 0.3 + 0.3 }}
// // //                   >
// // //                     <h3 className={`font-bold text-lg ${
// // //                       isActive ? "text-emerald-700" : "text-gray-400"
// // //                     }`}>
// // //                       {step.label}
// // //                     </h3>
// // //                     {timestamps && step.status in timestamps && timestamps[step.status] && (
// // //                       <p className="text-sm text-gray-500">
// // //                         {new Date(timestamps[step.status]!).toLocaleString()}
// // //                       </p>
// // //                     )}
// // //                   </motion.div>
// // //                 </motion.div>
// // //               );
// // //             })}
// // //           </div>
// // //         </motion.div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const OrderHistoryPage = () => {
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [orders, setOrders] = useState<Order[]>([]);
// // //   const [filteredStatus, setFilteredStatus] = useState<OrderStatus | "All">("All");
// // //   const [isTimelineOpen, setIsTimelineOpen] = useState(false);
// // //   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

// // //   useEffect(() => {
// // //     const auth = getAuth();
// // //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// // //       setUser(currentUser);
// // //     });
// // //     return () => unsubscribe();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!user) return;

// // //     const fetchOrders = async () => {
// // //       try {
// // //         const ordersQuery = query(
// // //           collection(db, "Orders"),
// // //           where("userId", "==", user.uid),
// // //           orderBy("createdAt", "desc")
// // //         );

// // //         const ordersSnapshot = await getDocs(ordersQuery);
// // //         const ordersData: Order[] = [];

// // //         for (const orderDoc of ordersSnapshot.docs) {
// // //           const orderData = orderDoc.data();
// // //           const createdAt = orderData.createdAt?.toDate
// // //             ? orderData.createdAt.toDate().toLocaleString()
// // //             : "Unknown Date";

// // //           const productsRef = collection(db, "Orders", orderDoc.id, "products");
// // //           const productsSnapshot = await getDocs(productsRef);

// // //           const products = productsSnapshot.docs.map((productDoc) => {
// // //             const productData = productDoc.data();
// // //             return {
// // //               productImageUrl: productData.productImageUrl || "",
// // //               productName: productData.name || "Unknown Product",
// // //               price: productData.price || 0,
// // //               quantity: productData.quantity || 0,
// // //             };
// // //           });

// // //           // Get timestamps for each status change (if they exist)
// // //           const statusTimestamps: StatusTimestamps = {
// // //             pending: orderData.createdAt?.toDate()?.toISOString(),
// // //             accepted: orderData.acceptedAt?.toDate()?.toISOString(),
// // //             rejected: orderData.rejectedAt?.toDate()?.toISOString(),
// // //             packaged: orderData.packagedAt?.toDate()?.toISOString(),
// // //             onway: orderData.onwayAt?.toDate()?.toISOString(),
// // //             delivered: orderData.deliveredAt?.toDate()?.toISOString(),
// // //           };

// // //           ordersData.push({
// // //             id: orderDoc.id,
// // //             createdAt,
// // //             products,
// // //             status: orderData.status,
// // //             statusTimestamps,
// // //           });
// // //         }

// // //         setOrders(ordersData);
// // //       } catch (error) {
// // //         console.error("Error fetching orders:", error);
// // //       }
// // //     };

// // //     fetchOrders();
// // //   }, [user]);

// // //   const filteredOrders =
// // //     filteredStatus === "All"
// // //       ? orders
// // //       : orders.filter((order) => order.status === filteredStatus);

// // //   const handleTrackOrder = (order: Order) => {
// // //     setSelectedOrder(order);
// // //     setIsTimelineOpen(true);
// // //   };

// // //   // Calculate total order amount
// // //   const getOrderTotal = (products: Product[]) => {
// // //     return products.reduce((total, product) => total + (product.price * product.quantity), 0);
// // //   };

// // //   const getStatusColor = (status: OrderStatus) => {
// // //     switch(status) {
// // //       case "accepted": return "from-green-400 to-green-600";
// // //       case "pending": return "from-yellow-400 to-yellow-600";
// // //       case "rejected": return "from-red-400 to-red-600";
// // //       case "packaged": return "from-indigo-400 to-indigo-600";
// // //       case "onway": return "from-blue-400 to-blue-600";
// // //       case "delivered": return "from-emerald-400 to-emerald-600";
// // //       default: return "from-gray-400 to-gray-600";
// // //     }
// // //   };

// // //   return (
// // //     <div className="mt-24 container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
// // //       <motion.div
// // //         initial={{ opacity: 0, y: 20 }}
// // //         animate={{ opacity: 1, y: 0 }}
// // //         transition={{ duration: 0.5 }}
// // //         className="mb-8 text-center"
// // //       >
// // //         <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
// // //           Your Orders
// // //         </h1>
// // //         <p className="text-gray-600">Track and manage your purchase history</p>
// // //       </motion.div>

// // //       {/* Filter Buttons */}
// // //       <div className="mb-8">
// // //         <div className="flex justify-center flex-wrap gap-2">
// // //           {["All", "pending", "accepted", "packaged", "onway", "delivered", "rejected"].map((status, index) => (
// // //             <motion.button
// // //               key={status}
// // //               initial={{ opacity: 0, y: 10 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ duration: 0.3, delay: index * 0.1 }}
// // //               onClick={() => setFilteredStatus(status as OrderStatus | "All")}
// // //               className={`px-5 py-2 rounded-full font-medium transition-all shadow-md text-white ${
// // //                 filteredStatus === status
// // //                   ? "bg-gradient-to-r from-gray-800 to-gray-900 scale-105 shadow-lg"
// // //                   : `bg-gradient-to-r ${
// // //                       status === "All" 
// // //                         ? "from-gray-500 to-gray-700" 
// // //                         : getStatusColor(status as OrderStatus)
// // //                     }`
// // //               }`}
// // //             >
// // //               {status.charAt(0).toUpperCase() + status.slice(1)}
// // //             </motion.button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Orders List */}
// // //       {filteredOrders.length > 0 ? (
// // //         <div className="space-y-6">
// // //           {filteredOrders.map((order, idx) => (
// // //             <motion.div
// // //               key={order.id}
// // //               initial={{ opacity: 0, y: 20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ duration: 0.4, delay: idx * 0.1 }}
// // //               className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto border-t-4 border-emerald-500"
// // //             >
// // //               <div className="p-6">
// // //                 <div className="flex flex-wrap justify-between items-center mb-4">
// // //                   <div>
// // //                     <p className="text-gray-700 font-semibold flex items-center">
// // //                       <Clock className="h-4 w-4 mr-2 text-emerald-500" />
// // //                       {order.createdAt}
// // //                     </p>
// // //                     <p className="text-xs text-gray-500 mt-1">Order #{order.id}</p>
// // //                   </div>
// // //                   <div className={`px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getStatusColor(order.status)}`}>
// // //                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
// // //                   </div>
// // //                 </div>

// // //                 <div className="my-4 border-t border-dashed border-gray-200 pt-4">
// // //                   <h3 className="font-bold text-gray-700 mb-2">Order Items</h3>
// // //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// // //                     {order.products.map((product, index) => (
// // //                       <motion.div
// // //                         key={index}
// // //                         whileHover={{ scale: 1.02 }}
// // //                         className="flex items-center bg-gray-50 p-3 rounded-lg"
// // //                       >
// // //                         <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
// // //                           <Image
// // //                             src={product.productImageUrl}
// // //                             alt={product.productName}
// // //                             fill
// // //                             className="object-cover"
// // //                           />
// // //                         </div>
// // //                         <div className="ml-3 flex-1">
// // //                           <p className="font-medium text-gray-900 line-clamp-1">{product.productName}</p>
// // //                           <div className="flex justify-between mt-1 text-sm text-gray-600">
// // //                             <p>₹{product.price.toLocaleString()}</p>
// // //                             <p>x{product.quantity}</p>
// // //                           </div>
// // //                         </div>
// // //                       </motion.div>
// // //                     ))}
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-4 flex justify-between items-center">
// // //                   <div className="text-gray-800">
// // //                     <span className="text-sm text-gray-500">Total:</span>
// // //                     <span className="font-bold text-lg ml-2">₹{getOrderTotal(order.products).toLocaleString()}</span>
// // //                   </div>
// // //                   <motion.button
// // //                     whileHover={{ scale: 1.05 }}
// // //                     whileTap={{ scale: 0.95 }}
// // //                     onClick={() => handleTrackOrder(order)}
// // //                     className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition font-medium flex items-center"
// // //                   >
// // //                     <Truck className="w-4 h-4 mr-2" />
// // //                     Track Order
// // //                   </motion.button>
// // //                 </div>
// // //               </div>
// // //             </motion.div>
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <motion.div
// // //           initial={{ opacity: 0 }}
// // //           animate={{ opacity: 1 }}
// // //           className="text-center p-10 bg-gray-50 rounded-xl max-w-lg mx-auto"
// // //         >
// // //           <Image 
// // //             src="/api/placeholder/120/120" 
// // //             width={120} 
// // //             height={120} 
// // //             alt="No orders" 
// // //             className="mx-auto mb-4" 
// // //           />
// // //           <p className="text-xl font-medium text-gray-500">No orders found.</p>
// // //           <p className="text-gray-400 mt-2">Your order history will appear here once you make a purchase.</p>
// // //         </motion.div>
// // //       )}

// // //       {/* Timeline Modal Dialog */}
// // //       <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
// // //         <DialogContent className="sm:max-w-lg">
// // //           <DialogHeader>
// // //             <DialogTitle className="text-center text-xl font-bold text-emerald-700">
// // //               Tracking Order #{selectedOrder?.id.substring(0, 8)}
// // //             </DialogTitle>
// // //           </DialogHeader>
          
// // //           {selectedOrder && (
// // //             <div className="py-4">
// // //               <OrderTimeline 
// // //                 status={selectedOrder.status} 
// // //                 timestamps={selectedOrder.statusTimestamps} 
// // //               />

// // //               <div className="mt-6 bg-gray-50 p-4 rounded-lg">
// // //                 <h4 className="font-medium text-gray-900 mb-2 text-xl">Order Summary</h4>
// // //                 <div className="text-sm text-gray-600">
// // //                   <div className="flex justify-between">
// // //                     <span>Order Date:</span>
// // //                     <span>{selectedOrder.createdAt}</span>
// // //                   </div>
// // //                   <div className="flex justify-between mt-1">
// // //                     <span>Total Items:</span>
// // //                     <span>{selectedOrder.products.length}</span>
// // //                   </div>
// // //                   <div className="flex justify-between mt-1">
// // //                     <span>Order Amount:</span>
// // //                     <span className="font-semibold">₹{getOrderTotal(selectedOrder.products).toLocaleString()}</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </DialogContent>
// // //       </Dialog>
// // //     </div>
// // //   );
// // // };

// // // export default OrderHistoryPage;


// // "use client";
// // import { useState, useEffect } from "react";
// // import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// // import { db } from "@/app/lib/firebase";
// // import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// // import Image from "next/image";
// // import { motion } from "framer-motion";
// // import { BadgeCheck, Clock, Package, Send, Truck, X } from "lucide-react";
// // import OrderTimeline from "../component/orderTimeline";

// // type OrderStatus = "pending" | "accepted" | "rejected" | "packaged" | "onway" | "delivered";

// // interface Product {
// //   productImageUrl: string;
// //   productName: string;
// //   price: number;
// //   quantity: number;
// // }

// // interface StatusTimestamps {
// //   pending?: string;
// //   accepted?: string;
// //   rejected?: string;
// //   packaged?: string;
// //   onway?: string;
// //   delivered?: string;
// // }

// // interface Order {
// //   id: string;
// //   createdAt: string;
// //   products: Product[];
// //   status: OrderStatus;
// //   statusTimestamps?: StatusTimestamps;
// // }

// // // Create our own Dialog components with proper TypeScript interfaces
// // interface DialogProps {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   children: React.ReactNode;
// // }


// // // Update the Dialog component to trigger timeline animations when opened
// // const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
// //   if (!open) return null;

// //   return (
// //     <motion.div 
// //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
// //       onClick={() => onOpenChange(false)}
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       exit={{ opacity: 0 }}
// //       transition={{ duration: 0.3 }}
// //     >
// //       <motion.div 
// //         className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto" 
// //         onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
// //         initial={{ scale: 0.9, y: 20, opacity: 0 }}
// //         animate={{ scale: 1, y: 0, opacity: 1 }}
// //         transition={{ 
// //           type: "spring", 
// //           stiffness: 300,
// //           damping: 30,
// //           delay: 0.1
// //         }}
// //       >
// //         {children}
// //       </motion.div>
// //     </motion.div>
// //   );
// // };

// // interface DialogContentProps {
// //   children: React.ReactNode;
// //   className?: string;
// // }

// // const DialogContent = ({ children, className = "" }: DialogContentProps) => {
// //   return <div className={`p-6 ${className}`}>{children}</div>;
// // };

// // interface DialogHeaderProps {
// //   children: React.ReactNode;
// // }

// // const DialogHeader = ({ children }: DialogHeaderProps) => {
// //   return <div className="mb-4">{children}</div>;
// // };

// // interface DialogTitleProps {
// //   children: React.ReactNode;
// //   className?: string;
// // }

// // const DialogTitle = ({ children, className = "" }: DialogTitleProps) => {
// //   return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
// // };



// // const OrderTimelines = ({ 
// //   status, 
// //   timestamps 
// // }: { 
// //   status: OrderStatus; 
// //   timestamps?: StatusTimestamps 
// // }) => {
// //   const steps = [
// //     { status: "pending" as OrderStatus, label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
// //     { status: "accepted" as OrderStatus, label: "Order Accepted", icon: <BadgeCheck className="w-6 h-6" /> },
// //     { status: "packaged" as OrderStatus, label: "Order Packaged", icon: <Package className="w-6 h-6" /> },
// //     { status: "onway" as OrderStatus, label: "On The Way", icon: <Truck className="w-6 h-6" /> },
// //     { status: "delivered" as OrderStatus, label: "Delivered", icon: <Send className="w-6 h-6" /> },
// //   ];

// //   const statusMap: Record<OrderStatus, number> = {
// //     pending: 0,
// //     accepted: 1,
// //     rejected: -1,
// //     packaged: 2,
// //     onway: 3,
// //     delivered: 4,
// //   };

// //   const currentStatusIndex = statusMap[status];

// //   // Animation variants
// //   const containerVariants = {
// //     hidden: { opacity: 0 },
// //     visible: { 
// //       opacity: 1,
// //       transition: { 
// //         staggerChildren: 0.3,
// //         delayChildren: 0.2
// //       }
// //     }
// //   };

// //   const itemVariants = {
// //     hidden: { y: 20, opacity: 0 },
// //     visible: { 
// //       y: 0, 
// //       opacity: 1,
// //       transition: { 
// //         type: "spring",
// //         stiffness: 120,
// //         damping: 20
// //       } 
// //     }
// //   };

// //   const lineVariants = (index: number) => ({
// //     hidden: { scaleY: 0, opacity: 0 },
// //     visible: {
// //       scaleY: 1,
// //       opacity: 1,
// //       transition: {
// //         delay: index * 0.3,
// //         duration: 0.6,
// //         type: "spring",
// //         bounce: 0.3
// //       }
// //     }
// //   });

// //   return (
// //     <div className="py-4 px-2 relative">
// //       {status === "rejected" ? (
// //         <motion.div 
// //           className="flex flex-col items-center"
// //           initial={{ scale: 0.8, opacity: 0 }}
// //           animate={{ scale: 1, opacity: 1 }}
// //           transition={{ duration: 0.5, type: "spring" }}
// //         >
// //           <div className="bg-red-100 p-6 rounded-full relative">
// //             <X className="w-8 h-8 text-red-500" />
// //           </div>
// //           <motion.h3 
// //             className="font-bold text-red-600 mt-2"
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.3 }}
// //           >
// //             Order Rejected
// //           </motion.h3>
// //           {timestamps?.rejected && (
// //             <motion.p className="text-sm text-gray-500">
// //               {new Date(timestamps.rejected).toLocaleString()}
// //             </motion.p>
// //           )}
// //         </motion.div>
// //       ) : (
// //         <motion.div 
// //           className="relative"
// //           variants={containerVariants}
// //           initial="hidden"
// //           animate="visible"
// //         >
         
// //           Progressive timeline line with stops
// // <div className="absolute left-3/4 top-0 bottom-0 -translate-x-1/2 w-2 bg-gray-200 rounded-full overflow-hidden">
// //   {steps.map((_, idx) => (
// //     <div key={idx} className="absolute left-0 right-0" style={{ top: `${idx * 20}%` }}>
// //       {/* Timeline segment */}
// //       <motion.div
// //         className="absolute w-full h-[20%] bg-emerald-500 origin-top"
// //         variants={{
// //           hidden: { scaleY: 0, opacity: 0 },
// //           visible: { 
// //             scaleY: 1, 
// //             opacity: 1,
// //             transition: {
// //               duration: 0.6,
// //               type: "spring",
// //               bounce: 0.3
// //             }
// //           }
// //         }}
// //         animate={idx <= currentStatusIndex ? "visible" : "hidden"}
// //         transition={{ delay: idx * 0.3 }}
// //       />
      
// //       {/* Timeline stop */}
// //       <motion.div
// //         className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
// //         style={{ 
// //           borderColor: idx <= currentStatusIndex ? "#10B981" : "#E5E7EB",
// //           backgroundColor: idx <= currentStatusIndex ? "#10B981" : "transparent"
// //         }}
// //         initial={{ scale: 0 }}
// //         animate={{ 
// //           scale: 1,
// //           transition: { 
// //             delay: idx * 0.3 + 0.2,
// //             type: "spring" 
// //           }
// //         }}
// //       />
// //     </div>
// //   ))}
// // </div>

// //           <div className="space-y-16 relative">
// //             {steps.map((step, idx) => {
// //               const isActive = idx <= currentStatusIndex;
// //               const isPast = idx < currentStatusIndex;
// //               const isNext = idx === currentStatusIndex + 1;

// //               return (
// //                 <motion.div 
// //                   key={step.status} 
// //                   className="relative flex items-center"
// //                   variants={itemVariants}
// //                 >
// //                   {/* Step connector */}
// //                   {idx > 0 && (
// //                     <motion.div 
// //                       className={`absolute left-1/2 -translate-x-1/2 -top-16 w-1 h-16 ${
// //                         isActive ? "bg-emerald-500" : "bg-gray-200"
// //                       }`}
// //                       initial={{ scaleY: 0 }}
// //                       animate={{ scaleY: isActive ? 1 : 0 }}
// //                       transition={{ duration: 0.4, delay: idx * 0.3 }}
// //                     />
// //                   )}

// //                   {/* Step indicator */}
// //                   <div className="relative z-10">
// //                     <motion.div 
// //                       className={`rounded-full p-4 relative ${
// //                         isActive 
// //                           ? "bg-emerald-500 shadow-lg" 
// //                           : "bg-gray-200"
// //                       }`}
// //                       whileHover={{ scale: 1.05 }}
// //                     >
// //                       <motion.div
// //                         className="text-white"
// //                         animate={isActive ? { 
// //                           scale: [1, 1.1, 1],
// //                         } : {}}
// //                         transition={{ 
// //                           duration: 1.5,
// //                           repeat: Infinity,
// //                           delay: idx * 0.2
// //                         }}
// //                       >
// //                         {step.icon}
// //                       </motion.div>
// //                     </motion.div>

// //                     {/* Progress pulse */}
// //                     {isPast && (
// //                       <motion.div
// //                         className="absolute inset-0 rounded-full border-2 border-emerald-500"
// //                         initial={{ scale: 1, opacity: 1 }}
// //                         animate={{ scale: 1.5, opacity: 0 }}
// //                         transition={{ 
// //                           duration: 1.5,
// //                           repeat: Infinity
// //                         }}
// //                       />
// //                     )}
// //                   </div>

// //                   {/* Step label */}
// //                   <motion.div 
// //                     className="ml-6 space-y-1"
// //                     initial={{ opacity: 0, x: -20 }}
// //                     animate={{ opacity: 1, x: 0 }}
// //                     transition={{ delay: idx * 0.3 + 0.3 }}
// //                   >
// //                     <h3 className={`font-bold text-lg ${
// //                       isActive ? "text-emerald-700" : "text-gray-400"
// //                     }`}>
// //                       {step.label}
// //                     </h3>
// //                     {timestamps && step.status in timestamps && timestamps[step.status] && (
// //                       <p className="text-sm text-gray-500">
// //                         {new Date(timestamps[step.status]!).toLocaleString()}
// //                       </p>
// //                     )}
// //                   </motion.div>
// //                 </motion.div>
// //               );
// //             })}
// //           </div>
// //         </motion.div>
// //       )}
// //     </div>
// //   );
// // };

// // const OrderHistoryPage = () => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [filteredStatus, setFilteredStatus] = useState<OrderStatus | "All">("All");
// //   const [isTimelineOpen, setIsTimelineOpen] = useState(false);
// //   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

// //   useEffect(() => {
// //     const auth = getAuth();
// //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// //       setUser(currentUser);
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   useEffect(() => {
// //     if (!user) return;

// //     const fetchOrders = async () => {
// //       try {
// //         const ordersQuery = query(
// //           collection(db, "Orders"),
// //           where("userId", "==", user.uid),
// //           orderBy("createdAt", "desc")
// //         );

// //         const ordersSnapshot = await getDocs(ordersQuery);
// //         const ordersData: Order[] = [];

// //         for (const orderDoc of ordersSnapshot.docs) {
// //           const orderData = orderDoc.data();
// //           const createdAt = orderData.createdAt?.toDate
// //             ? orderData.createdAt.toDate().toLocaleString()
// //             : "Unknown Date";

// //           const productsRef = collection(db, "Orders", orderDoc.id, "products");
// //           const productsSnapshot = await getDocs(productsRef);

// //           const products = productsSnapshot.docs.map((productDoc) => {
// //             const productData = productDoc.data();
// //             return {
// //               productImageUrl: productData.productImageUrl || "",
// //               productName: productData.name || "Unknown Product",
// //               price: productData.price || 0,
// //               quantity: productData.quantity || 0,
// //             };
// //           });

// //           // Get timestamps for each status change (if they exist)
// //           const statusTimestamps: StatusTimestamps = {
// //             pending: orderData.createdAt?.toDate()?.toISOString(),
// //             accepted: orderData.acceptedAt?.toDate()?.toISOString(),
// //             rejected: orderData.rejectedAt?.toDate()?.toISOString(),
// //             packaged: orderData.packagedAt?.toDate()?.toISOString(),
// //             onway: orderData.onwayAt?.toDate()?.toISOString(),
// //             delivered: orderData.deliveredAt?.toDate()?.toISOString(),
// //           };

// //           ordersData.push({
// //             id: orderDoc.id,
// //             createdAt,
// //             products,
// //             status: orderData.status,
// //             statusTimestamps,
// //           });
// //         }

// //         setOrders(ordersData);
// //       } catch (error) {
// //         console.error("Error fetching orders:", error);
// //       }
// //     };

// //     fetchOrders();
// //   }, [user]);

// //   const filteredOrders =
// //     filteredStatus === "All"
// //       ? orders
// //       : orders.filter((order) => order.status === filteredStatus);

// //   const handleTrackOrder = (order: Order) => {
// //     setSelectedOrder(order);
// //     setIsTimelineOpen(true);
// //   };

// //   // Calculate total order amount
// //   const getOrderTotal = (products: Product[]) => {
// //     return products.reduce((total, product) => total + (product.price * product.quantity), 0);
// //   };

// //   const getStatusColor = (status: OrderStatus) => {
// //     switch(status) {
// //       case "accepted": return "from-green-400 to-green-600";
// //       case "pending": return "from-yellow-400 to-yellow-600";
// //       case "rejected": return "from-red-400 to-red-600";
// //       case "packaged": return "from-indigo-400 to-indigo-600";
// //       case "onway": return "from-blue-400 to-blue-600";
// //       case "delivered": return "from-emerald-400 to-emerald-600";
// //       default: return "from-gray-400 to-gray-600";
// //     }
// //   };

// //   return (
// //     <div className="mt-24 container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="mb-8 text-center"
// //       >
// //         <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
// //           Your Orders
// //         </h1>
// //         <p className="text-gray-600">Track and manage your purchase history</p>
// //       </motion.div>

// //       {/* Filter Buttons */}
// //       <div className="mb-8">
// //         <div className="flex justify-center flex-wrap gap-2">
// //           {["All", "pending", "accepted", "packaged", "onway", "delivered", "rejected"].map((status, index) => (
// //             <motion.button
// //               key={status}
// //               initial={{ opacity: 0, y: 10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.3, delay: index * 0.1 }}
// //               onClick={() => setFilteredStatus(status as OrderStatus | "All")}
// //               className={`px-5 py-2 rounded-full font-medium transition-all shadow-md text-white ${
// //                 filteredStatus === status
// //                   ? "bg-gradient-to-r from-gray-800 to-gray-900 scale-105 shadow-lg"
// //                   : `bg-gradient-to-r ${
// //                       status === "All" 
// //                         ? "from-gray-500 to-gray-700" 
// //                         : getStatusColor(status as OrderStatus)
// //                     }`
// //               }`}
// //             >
// //               {status.charAt(0).toUpperCase() + status.slice(1)}
// //             </motion.button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Orders List */}
// //       {filteredOrders.length > 0 ? (
// //         <div className="space-y-6">
// //           {filteredOrders.map((order, idx) => (
// //             <motion.div
// //               key={order.id}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.4, delay: idx * 0.1 }}
// //               className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto border-t-4 border-emerald-500"
// //             >
// //               <div className="p-6">
// //                 <div className="flex flex-wrap justify-between items-center mb-4">
// //                   <div>
// //                     <p className="text-gray-700 font-semibold flex items-center">
// //                       <Clock className="h-4 w-4 mr-2 text-emerald-500" />
// //                       {order.createdAt}
// //                     </p>
// //                     <p className="text-xs text-gray-500 mt-1">Order #{order.id}</p>
// //                   </div>
// //                   <div className={`px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getStatusColor(order.status)}`}>
// //                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
// //                   </div>
// //                 </div>

// //                 <div className="my-4 border-t border-dashed border-gray-200 pt-4">
// //                   <h3 className="font-bold text-gray-700 mb-2">Order Items</h3>
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                     {order.products.map((product, index) => (
// //                       <motion.div
// //                         key={index}
// //                         whileHover={{ scale: 1.02 }}
// //                         className="flex items-center bg-gray-50 p-3 rounded-lg"
// //                       >
// //                         <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
// //                           <Image
// //                             src={product.productImageUrl}
// //                             alt={product.productName}
// //                             fill
// //                             className="object-cover"
// //                           />
// //                         </div>
// //                         <div className="ml-3 flex-1">
// //                           <p className="font-medium text-gray-900 line-clamp-1">{product.productName}</p>
// //                           <div className="flex justify-between mt-1 text-sm text-gray-600">
// //                             <p>₹{product.price.toLocaleString()}</p>
// //                             <p>x{product.quantity}</p>
// //                           </div>
// //                         </div>
// //                       </motion.div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div className="mt-4 flex justify-between items-center">
// //                   <div className="text-gray-800">
// //                     <span className="text-sm text-gray-500">Total:</span>
// //                     <span className="font-bold text-lg ml-2">₹{getOrderTotal(order.products).toLocaleString()}</span>
// //                   </div>
// //                   <motion.button
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     onClick={() => handleTrackOrder(order)}
// //                     className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition font-medium flex items-center"
// //                   >
// //                     <Truck className="w-4 h-4 mr-2" />
// //                     Track Order
// //                   </motion.button>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       ) : (
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           className="text-center p-10 bg-gray-50 rounded-xl max-w-lg mx-auto"
// //         >
// //           <Image 
// //             src="/api/placeholder/120/120" 
// //             width={120} 
// //             height={120} 
// //             alt="No orders" 
// //             className="mx-auto mb-4" 
// //           />
// //           <p className="text-xl font-medium text-gray-500">No orders found.</p>
// //           <p className="text-gray-400 mt-2">Your order history will appear here once you make a purchase.</p>
// //         </motion.div>
// //       )}

// //       {/* Timeline Modal Dialog */}
// //       <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
// //         <DialogContent className="sm:max-w-lg">
// //           <DialogHeader>
// //             <DialogTitle className="text-center text-xl font-bold text-emerald-700">
// //               Tracking Order #{selectedOrder?.id.substring(0, 8)}
// //             </DialogTitle>
// //           </DialogHeader>
          
// //           {selectedOrder && (
// //             <div className="py-4">
// //               <OrderTimeline 
// //                 status={selectedOrder.status} 
// //                 timestamps={selectedOrder.statusTimestamps} 
// //               />

// //               <div className="mt-6 bg-gray-50 p-4 rounded-lg">
// //                 <h4 className="font-medium text-gray-900 mb-2 text-xl">Order Summary</h4>
// //                 <div className="text-sm text-gray-600">
// //                   <div className="flex justify-between">
// //                     <span>Order Date:</span>
// //                     <span>{selectedOrder.createdAt}</span>
// //                   </div>
// //                   <div className="flex justify-between mt-1">
// //                     <span>Total Items:</span>
// //                     <span>{selectedOrder.products.length}</span>
// //                   </div>
// //                   <div className="flex justify-between mt-1">
// //                     <span>Order Amount:</span>
// //                     <span className="font-semibold">₹{getOrderTotal(selectedOrder.products).toLocaleString()}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // };

// // export default OrderHistoryPage;



// "use client";
// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { db } from "@/app/lib/firebase";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { BadgeCheck, Clock, Package, Send, Truck, X } from "lucide-react";
// import OrderTimeline from "../component/orderTimeline";
// import Link from "next/link";

// type OrderStatus = "pending" | "accepted" | "rejected" | "packaged" | "onway" | "delivered";

// interface Product {
//   productImageUrl: string;
//   productName: string;
//   price: number;
//   quantity: number;
// }

// interface StatusTimestamps {
//   pending?: string;
//   accepted?: string;
//   rejected?: string;
//   packaged?: string;
//   onway?: string;
//   delivered?: string;
// }

// interface Order {
//   id: string;
//   createdAt: string;
//   products: Product[];
//   status: OrderStatus;
//   statusTimestamps?: StatusTimestamps;
// }

// // Create our own Dialog components with proper TypeScript interfaces
// interface DialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   children: React.ReactNode;
// }


// const OrderShimmer = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto "
//     >
//       <div className="p-6">
//         <div className="flex flex-wrap justify-between items-center mb-4">
//           <div className="space-y-2">
//             <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
//             <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
//           </div>
//           <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
//         </div>

//         <div className="my-4 border-t border-dashed border-gray-200 pt-4">
//           <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {[0, 1].map((i) => (
//               <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg">
//                 <div className="w-16 h-16 rounded-md bg-gray-200 animate-pulse"></div>
//                 <div className="ml-3 flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
//                   <div className="flex justify-between">
//                     <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
//                     <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-4 flex justify-between items-center">
//           <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
//           <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Update the Dialog component to trigger timeline animations when opened
// const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
//   if (!open) return null;

//   return (
//     <motion.div 
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
//       onClick={() => onOpenChange(false)}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div 
//         className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto" 
//         onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
//         initial={{ scale: 0.9, y: 20, opacity: 0 }}
//         animate={{ scale: 1, y: 0, opacity: 1 }}
//         transition={{ 
//           type: "spring", 
//           stiffness: 300,
//           damping: 30,
//           delay: 0.1
//         }}
//       >
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// };

// interface DialogContentProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const DialogContent = ({ children, className = "" }: DialogContentProps) => {
//   return <div className={`p-6 ${className}`}>{children}</div>;
// };

// interface DialogHeaderProps {
//   children: React.ReactNode;
// }

// const DialogHeader = ({ children }: DialogHeaderProps) => {
//   return <div className="mb-4">{children}</div>;
// };

// interface DialogTitleProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const DialogTitle = ({ children, className = "" }: DialogTitleProps) => {
//   return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
// };



// const OrderTimelines = ({ 
//   status, 
//   timestamps 
// }: { 
//   status: OrderStatus; 
//   timestamps?: StatusTimestamps 
// }) => {

//   const formatTimestamp = (timestamp: any) => {
//     if (!timestamp) return "Not yet";


//     // if (timestamp.toDate) return timestamp.toDate().toLocaleString();
//     if (typeof timestamp === 'object' && timestamp.toDate) return timestamp;
//     return "Invalid date";
//   };
//   const steps = [
//     { status: "pending" as OrderStatus, label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
//     { status: "accepted" as OrderStatus, label: "Order Accepted", icon: <BadgeCheck className="w-6 h-6" /> },
//     { status: "packaged" as OrderStatus, label: "Order Packaged", icon: <Package className="w-6 h-6" /> },
//     { status: "onway" as OrderStatus, label: "On The Way", icon: <Truck className="w-6 h-6" /> },
//     { status: "delivered" as OrderStatus, label: "Delivered", icon: <Send className="w-6 h-6" /> },
//   ];
  

//   const statusMap: Record<OrderStatus, number> = {
//     pending: 0,
//     accepted: 1,
//     rejected: -1,
//     packaged: 2,
//     onway: 3,
//     delivered: 4,
//   };

//   const currentStatusIndex = statusMap[status];

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.3,
//         delayChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { 
//         type: "spring",
//         stiffness: 120,
//         damping: 20
//       } 
//     }
//   };

//   const lineVariants = (index: number) => ({
//     hidden: { scaleY: 0, opacity: 0 },
//     visible: {
//       scaleY: 1,
//       opacity: 1,
//       transition: {
//         delay: index * 0.3,
//         duration: 0.6,
//         type: "spring",
//         bounce: 0.3
//       }
//     }
//   });

//   return (
//     <div className="py-4 px-2 relative">
//       {status === "rejected" ? (
//         <motion.div 
//           className="flex flex-col items-center"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5, type: "spring" }}
//         >
//           <div className="bg-red-100 p-6 rounded-full relative">
//             <X className="w-8 h-8 text-red-500" />
//           </div>
//           <motion.h3 
//             className="font-bold text-red-600 mt-2"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             Order Rejected
//           </motion.h3>
//           {timestamps?.rejected && (
//             <motion.p className="text-sm text-gray-500">
//               {new Date(timestamps.rejected).toLocaleString()}
//             </motion.p>
//           )}
//         </motion.div>
//       ) : (
//         <motion.div 
//           className="relative"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
         
//           Progressive timeline line with stops
// <div className="absolute left-3/4 top-0 bottom-0 -translate-x-1/2 w-2 bg-gray-200 rounded-full overflow-hidden">
//   {steps.map((_, idx) => (
//     <div key={idx} className="absolute left-0 right-0" style={{ top: `${idx * 20}%` }}>
//       {/* Timeline segment */}
//       <motion.div
//         className="absolute w-full h-[20%] bg-emerald-500 origin-top"
//         variants={{
//           hidden: { scaleY: 0, opacity: 0 },
//           visible: { 
//             scaleY: 1, 
//             opacity: 1,
//             transition: {
//               duration: 0.6,
//               type: "spring",
//               bounce: 0.3
//             }
//           }
//         }}
//         animate={idx <= currentStatusIndex ? "visible" : "hidden"}
//         transition={{ delay: idx * 0.3 }}
//       />
      
//       {/* Timeline stop */}
//       <motion.div
//         className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
//         style={{ 
//           borderColor: idx <= currentStatusIndex ? "#10B981" : "#E5E7EB",
//           backgroundColor: idx <= currentStatusIndex ? "#10B981" : "transparent"
//         }}
//         initial={{ scale: 0 }}
//         animate={{ 
//           scale: 1,
//           transition: { 
//             delay: idx * 0.3 + 0.2,
//             type: "spring" 
//           }
//         }}
//       />
//     </div>
//   ))}
// </div>

//           <div className="space-y-16 relative">
//             {steps.map((step, idx) => {
//               const isActive = idx <= currentStatusIndex;
//               const isPast = idx < currentStatusIndex;
//               const isNext = idx === currentStatusIndex + 1;

//               return (
//                 <motion.div 
//                   key={step.status} 
//                   className="relative flex items-center"
//                   variants={itemVariants}
//                 >
//                   {/* Step connector */}
//                   {idx > 0 && (
//                     <motion.div 
//                       className={`absolute left-1/2 -translate-x-1/2 -top-16 w-1 h-16 ${
//                         isActive ? "bg-emerald-500" : "bg-gray-200"
//                       }`}
//                       initial={{ scaleY: 0 }}
//                       animate={{ scaleY: isActive ? 1 : 0 }}
//                       transition={{ duration: 0.4, delay: idx * 0.3 }}
//                     />
//                   )}

//                   {/* Step indicator */}
//                   <div className="relative z-10">
//                     <motion.div 
//                       className={`rounded-full p-4 relative ${
//                         isActive 
//                           ? "bg-emerald-500 shadow-lg" 
//                           : "bg-gray-200"
//                       }`}
//                       whileHover={{ scale: 1.05 }}
//                     >
//                       <motion.div
//                         className="text-white"
//                         animate={isActive ? { 
//                           scale: [1, 1.1, 1],
//                         } : {}}
//                         transition={{ 
//                           duration: 1.5,
//                           repeat: Infinity,
//                           delay: idx * 0.2
//                         }}
//                       >
//                         {step.icon}
//                       </motion.div>
//                     </motion.div>

//                     {/* Progress pulse */}
//                     {isPast && (
//                       <motion.div
//                         className="absolute inset-0 rounded-full border-2 border-emerald-500"
//                         initial={{ scale: 1, opacity: 1 }}
//                         animate={{ scale: 1.5, opacity: 0 }}
//                         transition={{ 
//                           duration: 1.5,
//                           repeat: Infinity
//                         }}
//                       />
//                     )}
//                   </div>

//                   {/* Step label */}
//                   <motion.div 
//                     className="ml-6 space-y-1"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.3 + 0.3 }}
//                   >
//                     <h3 className={`font-bold text-lg ${
//                       isActive ? "text-emerald-700" : "text-gray-400"
//                     }`}>
//                       {step.label}
//                     </h3>
//                     {/* {timestamps && step.status in timestamps && timestamps[step.status] && ( */}
//                       <p className="text-sm text-gray-500">
//                         {/* {new Date(timestamps[step.status]!).toLocaleString()} */}
//                         {formatTimestamp(timestamps?.[step.status as keyof StatusTimestamps])}

//                       </p>
                    
//                   </motion.div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };




// const OrderHistoryPage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredStatus, setFilteredStatus] = useState<OrderStatus | "All">("All");
//   const [isTimelineOpen, setIsTimelineOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {

//     if(!user){
//       return;
//     }
  

//     const fetchOrders = async () => {
//       setIsLoading(true); // Start loading
//       try {
//         const ordersQuery = query(
//           collection(db, "Orders"),
//           where("userId", "==", user.uid),
//           orderBy("createdAt", "desc")
//         );

//         const ordersSnapshot = await getDocs(ordersQuery);
//         const ordersData: Order[] = [];

//         for (const orderDoc of ordersSnapshot.docs) {
//           const orderData = orderDoc.data();
//           const createdAt = orderData.createdAt?.toDate
//             ? orderData.createdAt.toDate().toLocaleString()
//             : "Unknown Date";

//           const productsRef = collection(db, "Orders", orderDoc.id, "products");
//           const productsSnapshot = await getDocs(productsRef);

//           const products = productsSnapshot.docs.map((productDoc) => {
//             const productData = productDoc.data();
//             return {
//               productImageUrl: productData.productImageUrl || "",
//               productName: productData.name || "Unknown Product",
//               price: productData.price || 0,
//               quantity: productData.quantity || 0,
//             };
//           });

//           // Get timestamps for each status change (if they exist)
//           const statusTimestamps: StatusTimestamps = {
//             pending: orderData.createdAt,
//             accepted: orderData.acceptedAt,
//             rejected: orderData.rejectedAt,
//             packaged: orderData.packagedAt,
//             onway: orderData.onwayAt,
//             delivered:orderData.delivered,
//             // delivered: orderData.deliveredAt?.toDate()?.toISOString(),
//           };

//           ordersData.push({
//             id: orderDoc.id,
//             createdAt,
//             products,
//             status: orderData.status,
//             statusTimestamps,
//           });
//         }

//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }finally{
//         setIsLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   const filteredOrders =
//     filteredStatus === "All"
//       ? orders
//       : orders.filter((order) => order.status === filteredStatus);

//   const handleTrackOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsTimelineOpen(true);
//   };

//   // Calculate total order amount
//   const getOrderTotal = (products: Product[]) => {
//     return products.reduce((total, product) => total + (product.price * product.quantity)+ ((product.price * product.quantity)/10), 0);
//   };

//   const getStatusColor = (status: OrderStatus) => {
//     switch(status) {
//       case "accepted": return "from-blue-500 to-blue-500";
//       case "pending": return "from-blue-500 to-blue-500";
//       case "rejected": return "from-blue-500 to-blue-500";
//       // case "packaged": return "from-indigo-400 to-indigo-600";
//       case "packaged": return "from-blue-500 to-blue-500";

//       case "onway": return "from-blue-500 to-blue-500";
//       // case "delivered": return "from-emerald-400 to-emerald-600";
//       case "delivered": return "from-blue-500 to-blue-500";

//       default: return "from-blue-500 to-blue-500";
//     }
//   };
//   if (!user) return(
//     <div className="mt-2 container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.5 }}
//       className="text-center max-w-md"
//     >
//       <div className="mb-8">
//         <Image
//           src="/login_first.png" // You can use any vector image here
//           alt="Login required"
//           width={500}
//           height={500}
//           className="mx-auto"
//         />
//       </div>
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         Oops! You're not logged in
//       </h2>
//       <p className="text-gray-600 mb-6">
//         Please login to view your order history and track your purchases.
//       </p>
//       <div className="flex gap-4 justify-center">
//         <Link href="/LoginPage">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
//           >
//             Login Now
//           </motion.button>
//         </Link>
//         <Link href="/">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-300"
//           >
//             Continue Shopping
//           </motion.button>
//         </Link>
//       </div>
//     </motion.div>
//   </div>
//   );
//   return (
    
//     <div className="mt-24 container mx-auto p-4 min-h-screen ">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8 text-center"
//       >
//         <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
//           Your Orders
//         </h1>
//         <p className="text-gray-600">Track and manage your purchase history</p>
//       </motion.div>

//       {/* Filter Buttons */}
//       <div className="mb-8">
//         <div className="flex justify-center flex-wrap gap-2">
//           {["All", "pending", "accepted", "packaged", "onway", "delivered", "rejected"].map((status, index) => (
//             <motion.button
//               key={status}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//               onClick={() => setFilteredStatus(status as OrderStatus | "All")}
//               className={`px-5 py-2 rounded-full font-medium transition-all shadow-md text-white ${
//                 filteredStatus === status
//                   ? "bg-gradient-to-r from-gray-800 to-gray-900 scale-105 shadow-lg"
//                   : `bg-gradient-to-r ${
//                       status === "All" 
//                         ? "from-blue-500 to-blue-700" 
//                         : getStatusColor(status as OrderStatus)
//                     }`
//               }`}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Orders List */}
//       {isLoading ? (
//         <div className="space-y-6">
//           {[0, 1, 2].map((i) => (
//             <OrderShimmer key={i} />
//           ))}
//         </div>
//       ) : 
//       filteredOrders.length > 0 ? (
//         <div className="space-y-6">
//           {filteredOrders.map((order, idx) => (
//             <motion.div
//               key={order.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: idx * 0.1 }}
//               className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto "
//             >
//               <div className="p-6">
//                 <div className="flex flex-wrap justify-between items-center mb-4">
//                   <div>
//                     <p className="text-gray-700 font-semibold flex items-center">
//                       <Clock className="h-4 w-4 mr-2 text-emerald-500" />
//                       {order.createdAt}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">Order #{order.id}</p>
//                   </div>
//                   <div className={`px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getStatusColor(order.status)}`}>
//                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                   </div>
//                 </div>

//                 <div className="my-4 border-t border-dashed border-gray-200 pt-4">
//                   <h3 className="font-bold text-gray-700 mb-2">Order Items</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     {order.products.map((product, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ scale: 1.02 }}
//                         className="flex items-center bg-gray-50 p-3 rounded-lg"
//                       >
//                         <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
//                           <Image
//                             src={product.productImageUrl}
//                             alt={product.productName}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="ml-3 flex-1">
//                           <p className="font-medium text-gray-900 line-clamp-1">{product.productName}</p>
//                           <div className="flex justify-between mt-1 text-sm text-gray-600">
//                             <p>₹{product.price.toLocaleString()}</p>
//                             <p>x{product.quantity}</p>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-4 flex justify-between items-center">
//                   <div className="text-gray-800">
//                     <span className="text-sm text-gray-500">Total:</span>
//                     <span className="font-bold text-lg ml-2">₹{getOrderTotal(order.products).toLocaleString()}</span>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleTrackOrder(order)}
//                     className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition font-medium flex items-center"
//                   >
//                     <Truck className="w-4 h-4 mr-2" />
//                     Track Order
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center p-10 bg-gray-50 rounded-xl max-w-lg mx-auto"
//         >
//           <Image 
//             src="/no_orders.png" 
//             width={420} 
//             height={400} 
//             alt="No orders" 
//             className="mx-auto mb-4" 
//           />
//           {/* <p className="text-xl font-medium text-gray-500">No orders found.</p> */}
//           <p className="text-gray-400 mt-2">Your order history will appear here once you make a purchase.</p>
//         </motion.div>
//       )}

//       {/* Timeline Modal Dialog */}
//       <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="text-center text-xl font-bold text-emerald-700">
//               Tracking Order #{selectedOrder?.id.substring(0, 8)}
//             </DialogTitle>
//           </DialogHeader>
          
//           {selectedOrder && (
//             <div className="py-4">
//               <OrderTimeline 
//                 status={selectedOrder.status} 
//                 timestamps={selectedOrder.statusTimestamps} 
//               />

//               <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//                 <h4 className="font-medium text-gray-900 mb-2 text-xl">Order Summary</h4>
//                 <div className="text-sm text-gray-600">
//                   <div className="flex justify-between">
//                     <span>Order Date:</span>
//                     <span>{selectedOrder.createdAt}</span>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <span>Total Items:</span>
//                     <span>{selectedOrder.products.length}</span>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <span>Order Amount:</span>
//                     <span className="font-semibold">₹{getOrderTotal(selectedOrder.products).toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default OrderHistoryPage;





























"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, Package, Send, Truck, X, Check, Ban } from "lucide-react";
import Link from "next/link";

type OrderStatus = "pending" | "accepted" | "rejected" | "packaged" | "onway" | "delivered";
type ProductStatus = "pending" | "accepted" | "rejected" | "packaged" | "onway" | "delivered";

interface Product {
  id: string;
  productImageUrl: string;
  name: string;
  price: number;
  quantity: number;
  status?: ProductStatus;
  updatedPrice?: number; // For rejected/price-adjusted items
  rejectionReason?: string;
}

interface StoreOrder {
  id: string;
  storeId: string;
  status: OrderStatus;
  createdAt: string;
  products?: Product[];
  timestamps?: {
    accepted?: string;
    rejected?: string;
    packaged?: string;
    onway?: string;
    delivered?: string;
  };
}

interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  storeStatuses: Record<string, OrderStatus>;
  storeOrders: StoreOrder[];
  timestamps?: {
    created?: string;
    accepted?: string;
    rejected?: string;
    packaged?: string;
    onway?: string;
    delivered?: string;
  };
}

const OrderShimmer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto"
    >
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        </div>

        <div className="my-4 border-t border-dashed border-gray-200 pt-4">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg">
                <div className="w-16 h-16 rounded-md bg-gray-200 animate-pulse"></div>
                <div className="ml-3 flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

// const OrderTimeline = ({ 
//   status, 
//   timestamps 
// }: { 
//   status: OrderStatus; 
//   timestamps?: Order['timestamps'] 
// }) => {
//   const formatTimestamp = (timestamp: any) => {
//     if (!timestamp) return "Not yet";
//     if (timestamp.toDate) return timestamp.toDate().toLocaleString();
//     return new Date(timestamp).toLocaleString();
//   };

//   const steps = [
//     { status: "pending" as OrderStatus, label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
//     { status: "accepted" as OrderStatus, label: "Order Accepted", icon: <BadgeCheck className="w-6 h-6" /> },
//     { status: "packaged" as OrderStatus, label: "Order Packaged", icon: <Package className="w-6 h-6" /> },
//     { status: "onway" as OrderStatus, label: "On The Way", icon: <Truck className="w-6 h-6" /> },
//     { status: "delivered" as OrderStatus, label: "Delivered", icon: <Send className="w-6 h-6" /> },
//   ];

//   const statusMap: Record<OrderStatus, number> = {
//     pending: 0,
//     accepted: 1,
//     rejected: -1,
//     packaged: 2,
//     onway: 3,
//     delivered: 4,
//   };

//   const currentStatusIndex = statusMap[status];

//   return (
//     <div className="py-4 px-2 relative">
//       {status === "rejected" ? (
//         <motion.div 
//           className="flex flex-col items-center"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5, type: "spring" }}
//         >
//           <div className="bg-red-100 p-6 rounded-full relative">
//             <X className="w-8 h-8 text-red-500" />
//           </div>
//           <motion.h3 
//             className="font-bold text-red-600 mt-2"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             Order Rejected
//           </motion.h3>
//           {timestamps?.rejected && (
//             <motion.p className="text-sm text-gray-500">
//               {formatTimestamp(timestamps.rejected)}
//             </motion.p>
//           )}
//         </motion.div>
//       ) : (
//         <div className="relative space-y-8">
//           {steps.map((step, idx) => {
//             const isActive = idx <= currentStatusIndex;
//             const isCurrent = idx === currentStatusIndex;
//             const timestamp = timestamps?.[step.status as keyof typeof timestamps];

//             return (
//               <motion.div 
//                 key={step.status}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="flex items-start gap-4"
//               >
//                 <div className="relative">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     isActive ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"
//                   }`}>
//                     {step.icon}
//                   </div>
//                   {idx < steps.length - 1 && (
//                     <div className={`absolute left-1/2 -translate-x-1/2 top-10 w-1 h-8 ${
//                       isActive ? "bg-emerald-500" : "bg-gray-200"
//                     }`}></div>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className={`font-bold ${
//                     isActive ? "text-emerald-700" : "text-gray-400"
//                   }`}>
//                     {step.label}
//                   </h3>
//                   {timestamp && (
//                     <p className="text-sm text-gray-500">
//                       {formatTimestamp(timestamp)}
//                     </p>
//                   )}
//                   {isCurrent && !timestamp && (
//                     <p className="text-sm text-gray-400">Processing...</p>
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };
const OrderTimeline = ({
  status,
  timestamps
}: {
  status: OrderStatus;
  timestamps?: Order['timestamps']
}) => {
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Not yet";
    // Handle Firebase Timestamp objects
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    // Handle regular Date objects or ISO strings
    return new Date(timestamp).toLocaleString();
  };

  const steps = [
    { status: "pending" as OrderStatus, label: "Order Placed", icon: <Clock className="w-6 h-6" /> },
    { status: "accepted" as OrderStatus, label: "Order Accepted", icon: <BadgeCheck className="w-6 h-6" /> },
    { status: "packaged" as OrderStatus, label: "Order Packaged", icon: <Package className="w-6 h-6" /> },
    { status: "onway" as OrderStatus, label: "On The Way", icon: <Truck className="w-6 h-6" /> },
    { status: "delivered" as OrderStatus, label: "Delivered", icon: <Send className="w-6 h-6" /> },
  ];

  const statusMap: Record<OrderStatus, number> = {
    pending: 0,
    accepted: 1,
    rejected: -1,
    packaged: 2,
    onway: 3,
    delivered: 4,
  };

  const currentStatusIndex = statusMap[status];

  return (
    <div className="py-4 px-2 relative">
      {status === "rejected" ? (
        <motion.div 
          className="flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <div className="bg-red-100 p-6 rounded-full relative">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <motion.h3 
            className="font-bold text-red-600 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Order Rejected
          </motion.h3>
          {timestamps?.rejected && (
            <motion.p 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {formatTimestamp(timestamps.rejected)}
            </motion.p>
          )}
        </motion.div>
      ) : (
        <div className="relative space-y-8">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            const timestamp = timestamps?.[step.status as keyof typeof timestamps];
            
            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="flex items-start gap-4"
              >
                <div className="relative">
                  {/* Icon container */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${
                    isActive ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {step.icon}
                  </div>
                  
                  {/* Pulsing effect for current step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-emerald-300 opacity-70 z-0"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  
                  {/* Connecting line */}
                  {idx < steps.length - 1 && (
                    <div className={`absolute left-1/2 -translate-x-1/2 top-10 w-1 h-8 ${
                      isActive && idx !== currentStatusIndex ? "bg-emerald-500" : 
                      idx < currentStatusIndex ? "bg-emerald-500" : "bg-gray-200"
                    }`}></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold ${
                    isActive ? "text-emerald-700" : "text-gray-400"
                  }`}>
                    {step.label}
                  </h3>
                  {timestamp && (
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(timestamp)}
                    </p>
                  )}
                  {isCurrent && !timestamp && (
                    <motion.p 
                      className="text-sm text-emerald-600"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Processing...
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
    accepted: { color: "bg-green-100 text-green-800", icon: <Check className="w-4 h-4" /> },
    rejected: { color: "bg-red-100 text-red-800", icon: <Ban className="w-4 h-4" /> },
    packaged: { color: "bg-blue-100 text-blue-800", icon: <Package className="w-4 h-4" /> },
    onway: { color: "bg-purple-100 text-purple-800", icon: <Truck className="w-4 h-4" /> },
    delivered: { color: "bg-emerald-100 text-emerald-800", icon: <Send className="w-4 h-4" /> },
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderHistoryPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<OrderStatus | "All">("All");
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const ordersQuery = query(
          collection(db, "Orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData: Order[] = [];

        for (const orderDoc of ordersSnapshot.docs) {
          const orderData = orderDoc.data();
          
          // Fetch store orders
          const storeOrdersQuery = query(
            collection(db, "Orders", orderDoc.id, "StoreOrders")
          );
          const storeOrdersSnapshot = await getDocs(storeOrdersQuery);
          
          const storeOrders: StoreOrder[] = [];
          
          for (const storeOrderDoc of storeOrdersSnapshot.docs) {
            const storeOrderData = storeOrderDoc.data();
            
            // Fetch products for this store order
            const productsQuery = query(
              collection(db, "Orders", orderDoc.id, "StoreOrders", storeOrderDoc.id, "products")
            );
            const productsSnapshot = await getDocs(productsQuery);
            
            const products = productsSnapshot.docs.map(productDoc => ({
              id: productDoc.id,
              ...productDoc.data()
            })) as Product[];
            
            storeOrders.push({
              id: storeOrderDoc.id,
              storeId: storeOrderData.storeId,
              status: storeOrderData.status,
              createdAt: storeOrderData.createdAt?.toDate?.()?.toLocaleString() || "Unknown",
              products,
              timestamps: {
                accepted: storeOrderData.acceptedAt,
                rejected: storeOrderData.rejectedAt,
                packaged: storeOrderData.packagedAt,
                onway: storeOrderData.onwayAt,
                delivered: storeOrderData.deliveredAt,
              }
            });
          }

          ordersData.push({
            id: orderDoc.id,
            userId: orderData.userId,
            createdAt: orderData.createdAt?.toDate?.()?.toLocaleString() || "Unknown",
            status: orderData.status,
            storeStatuses: orderData.storeStatuses || {},
            storeOrders,
            timestamps: {
              created: orderData.createdAt,
              accepted: orderData.acceptedAt,
              rejected: orderData.rejectedAt,
              packaged: orderData.packagedAt,
              onway: orderData.onwayAt,
              delivered: orderData.deliveredAt,
            }
          });
        }

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders = filteredStatus === "All" 
    ? orders 
    : orders.filter(order => order.status === filteredStatus);

  const getOrderTotal = (order: Order) => {
    let total = 0;
    order.storeOrders.forEach(storeOrder => {
      storeOrder.products?.forEach(product => {
        if (product.status !== "rejected") {
          total += (product.updatedPrice || product.price) * product.quantity;
        }
      });
    });
    return total;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "packaged": return "bg-indigo-100 text-indigo-800";
      case "onway": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) return (
    <div className="mt-2 container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <Image
            src="/login_first.png"
            alt="Login required"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! You're not logged in
        </h2>
        <p className="text-gray-600 mb-6">
          Please login to view your order history and track your purchases.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/LoginPage">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Login Now
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-300"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="mt-24 container mx-auto p-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          Your Orders
        </h1>
        <p className="text-gray-600">Track and manage your purchase history</p>
      </motion.div>

      {/* Filter Buttons */}
      <div className="mb-8">
        <div className="flex justify-center flex-wrap gap-2">
          {["All", "pending", "accepted", "packaged", "onway", "delivered", "rejected"].map((status, index) => (
            <motion.button
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => setFilteredStatus(status as OrderStatus | "All")}
              className={`px-5 py-2 rounded-full font-medium transition-all shadow-md ${
                filteredStatus === status
                  ? "bg-gray-800 text-white scale-105 shadow-lg"
                  : `bg-white text-gray-800 border ${
                      status === "All" ? "border-blue-500" : "border-gray-300"
                    }`
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <OrderShimmer key={i} />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-700 font-semibold flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                      {order.createdAt}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Order #{order.id.substring(0, 8)}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-700 mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {order.storeOrders.map((storeOrder) => (
                      <div key={storeOrder.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Store: {storeOrder.storeId}</h4>
                          {/* <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(storeOrder.status)}`}> */}
                            {/* {storeOrder.status} */}
                          {/* </span> */}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {storeOrder.products?.map((product, index) => (
                            <motion.div
                              key={`${storeOrder.id}-${product.id}`}
                              whileHover={{ scale: 1.02 }}
                              className={`flex items-center p-3 rounded-lg ${
                                product.status === "rejected" 
                                  ? "bg-red-50 border border-red-200" 
                                  : "bg-gray-50"
                              }`}
                            >
                              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                                <Image
                                  src={product.productImageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                                {product.status === "rejected" && (
                                  <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                                    <X className="w-6 h-6 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between items-start">
                                  <p className={`font-medium text-gray-900 line-clamp-1 ${
                                    product.status === "rejected" ? "line-through" : ""
                                  }`}>
                                    {product.name}
                                  </p>
                                  <ProductStatusBadge status={product.status || "pending"} />
                                </div>
                                <div className="flex justify-between mt-1 text-sm text-gray-600">
                                  <div>
                                    {product.status === "rejected" ? (
                                      <>
                                        <span className="line-through text-red-500">₹{product.price.toLocaleString()}</span>
                                        {product.updatedPrice !== undefined && (
                                          <span className="ml-2 text-green-600">
                                          ₹{product.updatedPrice != null ? product.updatedPrice.toLocaleString() : "N/A"}
                                        </span>
                                        
                                          // <span className="ml-2 text-green-600">₹{product.updatedPrice.toLocaleString()}</span>
                                        )}
                                      </>
                                    ) : (
                                      <span>₹{product.price.toLocaleString()}</span>
                                    )}
                                  </div>
                                  <p>x{product.quantity}</p>
                                </div>
                                {product.status === "rejected" && product.rejectionReason && (
                                  <p className="text-xs text-red-500 mt-1">
                                    Reason: {product.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-gray-800">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="font-bold text-lg ml-2">₹{getOrderTotal(order).toLocaleString()}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsTimelineOpen(true);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition font-medium flex items-center"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-10 bg-gray-50 rounded-xl max-w-lg mx-auto"
        >
          <Image 
            src="/no_orders.png" 
            width={420} 
            height={400} 
            alt="No orders" 
            className="mx-auto mb-4" 
          />
          <p className="text-gray-400 mt-2">Your order history will appear here once you make a purchase.</p>
        </motion.div>
      )}

      {/* Timeline Modal */}
      {isTimelineOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-emerald-700">
                  Tracking Order #{selectedOrder.id.substring(0, 8)}
                </h2>
                <button 
                  onClick={() => setIsTimelineOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="py-4">
                <OrderTimeline 
                  status={selectedOrder.status} 
                  timestamps={selectedOrder.timestamps} 
                />

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-xl">Order Summary</h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Order Date:</span>
                      <span>{selectedOrder.createdAt}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Total Items:</span>
                      <span>
                        {selectedOrder.storeOrders.reduce((total, storeOrder) => 
                          total + (storeOrder.products?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Order Amount:</span>
                      <span className="font-semibold">₹{getOrderTotal(selectedOrder).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;