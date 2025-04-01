

"use client";
import { useState, useEffect, JSX } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, Package, Send, Truck, X, Check, Ban, UserIcon, ShoppingBag, CheckCircle2, CheckCircle, ClockIcon, CheckCircleIcon, TruckIcon, PackageIcon, XCircleIcon, ShoppingCart, XCircle, ClipboardCheck, UserCircle, PackageOpen, PackageCheck } from "lucide-react";
import Link from "next/link";
import AnimatedComponent from "../component/AnimatedComponent";

type OrderStatus = "pending" | "reviewed" | "accepted" | "rejected" | "assigned" | "picked" | "onway" | "delivered";

// type OrderStatus = "pending" | "reviewed" | "accepted" | "rejected" | "assigned" | "picked" | "onway" | "delivered";
type ProductStatus = "pending" | "accepted" |"reviewed" | "rejected" | "picked" | "onway" | "delivered";

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
    picked?: string;
    assigned?: string;
    reviewed?: string;
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
//   timestamps?: {
//     created?: Date | string | { toDate: () => Date };
//     reviewed?: Date | string | { toDate: () => Date };
//     accepted?: Date | string | { toDate: () => Date };
//     rejected?: Date | string | { toDate: () => Date };
//     assigned?: Date | string | { toDate: () => Date };
//     picked?: Date | string | { toDate: () => Date };
//     onway?: Date | string | { toDate: () => Date };
//     delivered?: Date | string | { toDate: () => Date };
//   };
// }) => {
//   const formatTimestamp = (timestamp: any) => {
//     if (!timestamp) return "Not yet";
//     if (timestamp.toDate) return timestamp.toDate().toLocaleString();
//     return new Date(timestamp).toLocaleString();
//   };

//   // Dynamic steps based on available timestamps
//   const steps = [
//     { 
//       status: "pending" as const,
//       label: "Order Placed", 
//       icon: <ShoppingCart className="w-5 h-5" />,
//       timestamp: timestamps?.created 
//     },
//     { 
//       status: "reviewed" as const,
//       label: status === 'rejected' ? "Order Rejected" : "Order Reviewed",
//       icon: status === 'rejected' ? 
//         <XCircle className="w-5 h-5" /> : 
//         <ClipboardCheck className="w-5 h-5" />,
//       timestamp: status === 'rejected' ? timestamps?.rejected : (timestamps?.reviewed || timestamps?.accepted)
//     },
//     { 
//       status: "assigned" as const,
//       label: "Agent Assigned",
//       icon: <UserCircle className="w-5 h-5" />,
//       timestamp: timestamps?.assigned
//     },
//     { 
//       status: "picked" as const,
//       label: "Order Picked",
//       icon: <PackageOpen className="w-5 h-5" />,
//       timestamp: timestamps?.picked
//     },
//     { 
//       status: "onway" as const,
//       label: "On The Way",
//       icon: <Truck className="w-5 h-5" />,
//       timestamp: timestamps?.onway
//     },
//     { 
//       status: "delivered" as const,
//       label: "Delivered",
//       icon: <PackageCheck className="w-5 h-5" />,
//       timestamp: timestamps?.delivered
//     }
//   ];

//   const statusMap: Record<OrderStatus, number> = {
//     pending: 0,
//     reviewed: 1,
//     accepted: 1,
//     rejected: 1,
//     assigned: 2,
//     picked: 3,
//     onway: 4,
//     delivered: 5,
//   };

//   const currentStatusIndex = statusMap[status];

//   return (
//     <div className="py-4 px-2 relative overflow-visible">
//       {status === "rejected" ? (
//         <motion.div 
//           className="flex flex-col items-center"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
//         >
//           <div className="bg-red-100 p-6 rounded-full relative">
//             <X className="w-8 h-8 text-red-500" />
//           </div>
//           <motion.h3 
//             className="font-bold text-red-600 mt-2"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//           >
//             Order Rejected
//           </motion.h3>
//           {timestamps?.rejected && (
//             <motion.p 
//               className="text-sm text-gray-500"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8, duration: 0.5 }}
//             >
//               {formatTimestamp(timestamps.rejected)}
//             </motion.p>
//           )}
//         </motion.div>
//       ) : (
//         <div className="relative space-y-8">
//           {steps.map((step, idx) => {
//             const isActive = idx <= currentStatusIndex;
//             const isCurrent = idx === currentStatusIndex;
            
//             return (
//               <motion.div
//                 key={`${step.status}-${idx}`}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.2, duration: 0.8 }}
//                 className="flex items-start gap-4"
//               >
//                 <div className="relative">
//                   {/* Icon container */}
//                   <motion.div 
//                     className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${
//                       isActive ? 
//                         (status === 'rejected' && idx === 1 ? "bg-red-500" : "bg-emerald-500") : 
//                         "bg-gray-200"
//                     } ${
//                       status === 'rejected' && idx === 1 ? "text-white" : 
//                       isActive ? "text-white" : "text-gray-500"
//                     }`}
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                   >
//                     {step.icon}
//                   </motion.div>
                  
//                   {/* Pulsing effect for current step */}
//                   {isCurrent && status !== 'rejected' && (
//                     <motion.div
//                       className="absolute -inset-1 rounded-full bg-emerald-300 opacity-70 z-0"
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ 
//                         scale: [0.8, 1.1, 0.8],
//                         opacity: [0.2, 0.5, 0.2]
//                       }}
//                       transition={{
//                         duration: 2.5,
//                         repeat: Infinity,
//                         repeatType: "loop",
//                         ease: "easeInOut"
//                       }}
//                     />
//                   )}
                  
//                   {/* Connecting line */}
//                   {idx < steps.length - 1 && (
//                     <div className="absolute left-1/2 -translate-x-1/2 top-10 w-1 h-8 bg-gray-200 overflow-hidden">
//                       {isActive && (
//                         <motion.div
//                           className={`w-full h-full ${
//                             status === 'rejected' && idx === 0 ? "bg-red-500" : "bg-emerald-500"
//                           }`}
//                           initial={{ scaleY: 0, originY: 0 }}
//                           animate={{ scaleY: 1 }}
//                           transition={{ 
//                             delay: idx * 0.3,
//                             duration: 0.8,
//                             ease: "easeInOut"
//                           }}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex-1">
//                   <h3 className={`font-bold ${
//                     isActive ? 
//                       (status === 'rejected' && idx === 1 ? "text-red-600" : "text-emerald-700") : 
//                       "text-gray-400"
//                   }`}>
//                     {step.label}
//                   </h3>
//                   {step.timestamp && (
//                     <p className={`text-sm ${
//                       status === 'rejected' && idx === 1 ? "text-red-500" : "text-gray-500"
//                     }`}>
//                       {formatTimestamp(step.timestamp)}
//                     </p>
//                   )}
//                   {isCurrent && !step.timestamp && status !== 'rejected' && (
//                     <motion.p 
//                       className="text-sm text-emerald-600"
//                       animate={{ opacity: [0.5, 1, 0.5] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       Processing...
//                     </motion.p>
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
  timestamps?: {
    created?: Date | string | { toDate: () => Date };
    reviewed?: Date | string | { toDate: () => Date };
    accepted?: Date | string | { toDate: () => Date };
    rejected?: Date | string | { toDate: () => Date };
    assigned?: Date | string | { toDate: () => Date };
    picked?: Date | string | { toDate: () => Date };
    onway?: Date | string | { toDate: () => Date };
    delivered?: Date | string | { toDate: () => Date };
  };
}) => {
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Not yet";
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    return new Date(timestamp).toLocaleString();
  };

  // Dynamic steps based on available timestamps
  const steps = [
    { 
      status: "pending" as const,
      label: "Order Placed", 
      icon: <ShoppingCart className="w-5 h-5" />,
      timestamp: timestamps?.created 
    },
    { 
      status: "reviewed" as const,
      label: "Order Reviewed",
      icon: <ClipboardCheck className="w-5 h-5" />,
      timestamp: timestamps?.reviewed || timestamps?.accepted
    },
    { 
      status: "assigned" as const,
      label: "Agent Assigned",
      icon: <UserCircle className="w-5 h-5" />,
      timestamp: timestamps?.assigned
    },
    { 
      status: "picked" as const,
      label: "Order Picked",
      icon: <PackageOpen className="w-5 h-5" />,
      timestamp: timestamps?.picked
    },
    { 
      status: "onway" as const,
      label: "On The Way",
      icon: <Truck className="w-5 h-5" />,
      timestamp: timestamps?.onway
    },
    { 
      status: "delivered" as const,
      label: "Delivered",
      icon: <PackageCheck className="w-5 h-5" />,
      timestamp: timestamps?.delivered
    }
  ];

  const statusMap: Record<OrderStatus, number> = {
    pending: 0,
    reviewed: 1,
    accepted: 1,
    rejected: 1, // Will be handled separately
    assigned: 2,
    picked: 3,
    onway: 4,
    delivered: 5,
  };

  const currentStatusIndex = statusMap[status];

  return (
    <div className="py-4 px-2 relative overflow-visible">
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
            
            return (
              <motion.div
                key={`${step.status}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="flex items-start gap-4"
              >
                <div className="relative">
                  {/* Icon container */}
                  <motion.div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${
                      isActive ? "bg-emerald-500" : "bg-gray-200"
                    } ${isActive ? "text-white" : "text-gray-500"}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  {/* Pulsing effect for current step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-emerald-300 opacity-70 z-0"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [0.8, 1.1, 0.8],
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
                    <div className="absolute left-1/2 -translate-x-1/2 top-10 w-1 h-8 bg-gray-200 overflow-hidden">
                      {isActive && (
                        <motion.div
                          className="w-full h-full bg-emerald-500"
                          initial={{ scaleY: 0, originY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ 
                            delay: idx * 0.3,
                            duration: 0.8,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold ${
                    isActive ? "text-emerald-700" : "text-gray-400"
                  }`}>
                    {step.label}
                  </h3>
                  {step.timestamp && (
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(step.timestamp)}
                    </p>
                  )}
                  {isCurrent && !step.timestamp && (
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
  const statusConfig: Record<ProductStatus, { color: string; icon: JSX.Element }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
    accepted: { color: "bg-green-100 text-green-800", icon: <Check className="w-4 h-4" /> },
    reviewed: { color: "bg-blue-100 text-blue-800", icon: <Check className="w-4 h-4" /> },
    rejected: { color: "bg-red-100 text-red-800", icon: <Ban className="w-4 h-4" /> },
    picked: { color: "bg-blue-100 text-blue-800", icon: <Package className="w-4 h-4" /> },
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
  const [authChecked, setAuthChecked] = useState(false);

  // Handle authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true); // Mark auth check as complete
    });
    return () => unsubscribe();
  }, []);

  // Real-time updates using onSnapshot
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    // Create query for user's orders
    const ordersQuery = query(
      collection(db, "Orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    // Set up real-time listener for orders
    const unsubscribeOrders = onSnapshot(ordersQuery, async (ordersSnapshot) => {
      const ordersData: Order[] = [];
      
      const fetchPromises = ordersSnapshot.docs.map(async (orderDoc) => {
        const orderData = orderDoc.data();
        
        // Set up real-time listener for store orders
        const storeOrdersQuery = query(
          collection(db, "Orders", orderDoc.id, "StoreOrders")
        );
        
        return new Promise<Order>((resolve) => {
          const unsubscribeStoreOrders = onSnapshot(storeOrdersQuery, async (storeOrdersSnapshot) => {
            const storeOrders: StoreOrder[] = [];
            
            const storeOrderPromises = storeOrdersSnapshot.docs.map(async (storeOrderDoc) => {
              const storeOrderData = storeOrderDoc.data();
              
              // Set up real-time listener for products
              const productsQuery = query(
                collection(db, "Orders", orderDoc.id, "StoreOrders", storeOrderDoc.id, "products")
              );
              
              return new Promise<StoreOrder>((resolveStore) => {
                const unsubscribeProducts = onSnapshot(productsQuery, (productsSnapshot) => {
                  const products = productsSnapshot.docs.map(productDoc => ({
                    id: productDoc.id,
                    ...productDoc.data()
                  })) as Product[];
                  
                  const storeOrder: StoreOrder = {
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
                  };
                  
                  resolveStore(storeOrder);
                });
                
                // Clean up listener when component unmounts
                return () => unsubscribeProducts();
              });
            });
            
            const resolvedStoreOrders = await Promise.all(storeOrderPromises);
            storeOrders.push(...resolvedStoreOrders);
            
            const order: Order = {
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
                reviewed: orderData.reviewedAt,
                assigned: orderData.assignedAt,
                picked: orderData.pickedAt,
                packaged: orderData.packagedAt,
                onway: orderData.onwayAt,
                delivered: orderData.deliveredAt,
              }
            };
            
            resolve(order);
          });
          
          // Clean up listener when component unmounts
          return () => unsubscribeStoreOrders();
        });
      });
      
      const resolvedOrders = await Promise.all(fetchPromises);
      setOrders(resolvedOrders);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    });
    
    // Clean up listener when component unmounts
    return () => unsubscribeOrders();
  }, [user]);

  const filteredOrders = filteredStatus === "All" 
    ? orders 
    : orders.filter(order => order.status === filteredStatus);

  // Calculate order total with 10% tax
  const getOrderTotal = (order: Order) => {
    let subtotal = 0;
    order.storeOrders.forEach(storeOrder => {
      storeOrder.products?.forEach(product => {
        if (product.status !== "rejected") {
          subtotal += (product.updatedPrice || product.price) * product.quantity;
        }
      });
    });
    return subtotal;
  };

  // Get total with tax
  const getOrderTotalWithTax = (order: Order) => {
    const subtotal = getOrderTotal(order);
    return subtotal * 1.1; // Add 10% tax
  };
  
  // Update status badge colors
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "reviewed": return "bg-blue-100 text-blue-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "assigned": return "bg-indigo-100 text-indigo-800";
      case "picked": return "bg-purple-100 text-purple-800";
      case "onway": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Only show login prompt if authentication check is complete and user is not logged in
  if (authChecked && !user) return (
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

  // Show loading state while authentication is being checked
  if (!authChecked) {
    return (
      <div className="mt-24 container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="space-y-6 w-full max-w-4xl">
          {[0, 1, 2].map((i) => (
            <OrderShimmer key={i} />
          ))}
        </div>
      </div>
    );
  }

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
          {["All", "pending", "accepted", "rejected","reviewed", "assigned","picked", "onway", "delivered"].map((status, index) => (
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
                    <span className="text-sm text-gray-500">Total (incl. 10% tax):</span>
                    <span className="font-bold text-lg ml-2"> ₹{Math.floor(getOrderTotal(order) * 1.1).toLocaleString()}</span>

                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsTimelineOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition font-medium flex items-center"
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
        // <motion.div
        //   initial={{ opacity: 0 }}
        //   animate={{ opacity: 1


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
              {/* Timeline Modal */}
{isTimelineOpen && selectedOrder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div 
      className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
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
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side: Timeline */}
          <div className="md:w-1/2">
            <OrderTimeline 
              status={selectedOrder.status} 
              timestamps={selectedOrder.timestamps} 
            />
          </div>
          
          {/* Right side: Order Summary & Animation */}
          <div className="md:w-1/2 flex flex-col">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
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
                  <span className="font-semibold">₹{Math.floor(getOrderTotal(selectedOrder) * 1.1).toLocaleString()}</span>
                </div>
              </div>
            </div>
{/* Animated Delivery Status */}
<div className="flex-1 flex max-h-[400px] items-center justify-center bg-gray-50 rounded-lg p-4">
<AnimatedComponent />

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
        