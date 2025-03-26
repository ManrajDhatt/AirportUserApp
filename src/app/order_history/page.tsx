

"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/app/lib/firebase";

import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, Package, Send, Truck, X } from "lucide-react";
import OrderTimeline from "../component/orderTimeline";

type OrderStatus = "pending" | "accepted" | "rejected" | "packaged" | "onway" | "delivered";

interface Product {
  productImageUrl: string;
  productName: string;
  price: number;
  quantity: number;
}

interface StatusTimestamps {
  pending?: string;
  accepted?: string;
  rejected?: string;
  packaged?: string;
  onway?: string;
  delivered?: string;
}

interface Order {
  id: string;
  createdAt: string;
  products: Product[];
  status: OrderStatus;
  statusTimestamps?: StatusTimestamps;
}

// Create our own Dialog components with proper TypeScript interfaces
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}


// Update the Dialog component to trigger timeline animations when opened
const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
      onClick={() => onOpenChange(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto" 
        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300,
          damping: 30,
          delay: 0.1
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContent = ({ children, className = "" }: DialogContentProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface DialogHeaderProps {
  children: React.ReactNode;
}

const DialogHeader = ({ children }: DialogHeaderProps) => {
  return <div className="mb-4">{children}</div>;
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const DialogTitle = ({ children, className = "" }: DialogTitleProps) => {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
};



const OrderTimelines = ({ 
  status, 
  timestamps 
}: { 
  status: OrderStatus; 
  timestamps?: StatusTimestamps 
}) => {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 20
      } 
    }
  };

  const lineVariants = (index: number) => ({
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        delay: index * 0.3,
        duration: 0.6,
        type: "spring",
        bounce: 0.3
      }
    }
  });

  return (
    <div className="py-4 px-2 relative">
      {status === "rejected" ? (
        <motion.div 
          className="flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="bg-red-100 p-6 rounded-full relative">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <motion.h3 
            className="font-bold text-red-600 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Order Rejected
          </motion.h3>
          {timestamps?.rejected && (
            <motion.p className="text-sm text-gray-500">
              {new Date(timestamps.rejected).toLocaleString()}
            </motion.p>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
         
          Progressive timeline line with stops
<div className="absolute left-3/4 top-0 bottom-0 -translate-x-1/2 w-2 bg-gray-200 rounded-full overflow-hidden">
  {steps.map((_, idx) => (
    <div key={idx} className="absolute left-0 right-0" style={{ top: `${idx * 20}%` }}>
      {/* Timeline segment */}
      <motion.div
        className="absolute w-full h-[20%] bg-emerald-500 origin-top"
        variants={{
          hidden: { scaleY: 0, opacity: 0 },
          visible: { 
            scaleY: 1, 
            opacity: 1,
            transition: {
              duration: 0.6,
              type: "spring",
              bounce: 0.3
            }
          }
        }}
        animate={idx <= currentStatusIndex ? "visible" : "hidden"}
        transition={{ delay: idx * 0.3 }}
      />
      
      {/* Timeline stop */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
        style={{ 
          borderColor: idx <= currentStatusIndex ? "#10B981" : "#E5E7EB",
          backgroundColor: idx <= currentStatusIndex ? "#10B981" : "transparent"
        }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          transition: { 
            delay: idx * 0.3 + 0.2,
            type: "spring" 
          }
        }}
      />
    </div>
  ))}
</div>

          <div className="space-y-16 relative">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStatusIndex;
              const isPast = idx < currentStatusIndex;
              const isNext = idx === currentStatusIndex + 1;

              return (
                <motion.div 
                  key={step.status} 
                  className="relative flex items-center"
                  variants={itemVariants}
                >
                  {/* Step connector */}
                  {idx > 0 && (
                    <motion.div 
                      className={`absolute left-1/2 -translate-x-1/2 -top-16 w-1 h-16 ${
                        isActive ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.3 }}
                    />
                  )}

                  {/* Step indicator */}
                  <div className="relative z-10">
                    <motion.div 
                      className={`rounded-full p-4 relative ${
                        isActive 
                          ? "bg-emerald-500 shadow-lg" 
                          : "bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="text-white"
                        animate={isActive ? { 
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: idx * 0.2
                        }}
                      >
                        {step.icon}
                      </motion.div>
                    </motion.div>

                    {/* Progress pulse */}
                    {isPast && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-emerald-500"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity
                        }}
                      />
                    )}
                  </div>

                  {/* Step label */}
                  <motion.div 
                    className="ml-6 space-y-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.3 + 0.3 }}
                  >
                    <h3 className={`font-bold text-lg ${
                      isActive ? "text-emerald-700" : "text-gray-400"
                    }`}>
                      {step.label}
                    </h3>
                    {timestamps && step.status in timestamps && timestamps[step.status] && (
                      <p className="text-sm text-gray-500">
                        {new Date(timestamps[step.status]!).toLocaleString()}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const OrderHistoryPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<OrderStatus | "All">("All");
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
          const createdAt = orderData.createdAt?.toDate
            ? orderData.createdAt.toDate().toLocaleString()
            : "Unknown Date";

          const productsRef = collection(db, "Orders", orderDoc.id, "products");
          const productsSnapshot = await getDocs(productsRef);

          const products = productsSnapshot.docs.map((productDoc) => {
            const productData = productDoc.data();
            return {
              productImageUrl: productData.productImageUrl || "",
              productName: productData.name || "Unknown Product",
              price: productData.price || 0,
              quantity: productData.quantity || 0,
            };
          });

          // Get timestamps for each status change (if they exist)
          const statusTimestamps: StatusTimestamps = {
            pending: orderData.createdAt?.toDate()?.toISOString(),
            accepted: orderData.acceptedAt?.toDate()?.toISOString(),
            rejected: orderData.rejectedAt?.toDate()?.toISOString(),
            packaged: orderData.packagedAt?.toDate()?.toISOString(),
            onway: orderData.onwayAt?.toDate()?.toISOString(),
            delivered: orderData.deliveredAt?.toDate()?.toISOString(),
          };

          ordersData.push({
            id: orderDoc.id,
            createdAt,
            products,
            status: orderData.status,
            statusTimestamps,
          });
        }

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders =
    filteredStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filteredStatus);

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsTimelineOpen(true);
  };

  // Calculate total order amount
  const getOrderTotal = (products: Product[]) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case "accepted": return "from-green-400 to-green-600";
      case "pending": return "from-yellow-400 to-yellow-600";
      case "rejected": return "from-red-400 to-red-600";
      case "packaged": return "from-indigo-400 to-indigo-600";
      case "onway": return "from-blue-400 to-blue-600";
      case "delivered": return "from-emerald-400 to-emerald-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="mt-24 container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
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
              className={`px-5 py-2 rounded-full font-medium transition-all shadow-md text-white ${
                filteredStatus === status
                  ? "bg-gradient-to-r from-gray-800 to-gray-900 scale-105 shadow-lg"
                  : `bg-gradient-to-r ${
                      status === "All" 
                        ? "from-gray-500 to-gray-700" 
                        : getStatusColor(status as OrderStatus)
                    }`
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto border-t-4 border-emerald-500"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-700 font-semibold flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                      {order.createdAt}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Order #{order.id}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-700 mb-2">Order Items</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.products.map((product, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={product.productImageUrl}
                            alt={product.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-900 line-clamp-1">{product.productName}</p>
                          <div className="flex justify-between mt-1 text-sm text-gray-600">
                            <p>₹{product.price.toLocaleString()}</p>
                            <p>x{product.quantity}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-gray-800">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="font-bold text-lg ml-2">₹{getOrderTotal(order.products).toLocaleString()}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTrackOrder(order)}
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
            src="/api/placeholder/120/120" 
            width={120} 
            height={120} 
            alt="No orders" 
            className="mx-auto mb-4" 
          />
          <p className="text-xl font-medium text-gray-500">No orders found.</p>
          <p className="text-gray-400 mt-2">Your order history will appear here once you make a purchase.</p>
        </motion.div>
      )}

      {/* Timeline Modal Dialog */}
      <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-emerald-700">
              Tracking Order #{selectedOrder?.id.substring(0, 8)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <OrderTimeline 
                status={selectedOrder.status} 
                timestamps={selectedOrder.statusTimestamps} 
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
                    <span>{selectedOrder.products.length}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Order Amount:</span>
                    <span className="font-semibold">₹{getOrderTotal(selectedOrder.products).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderHistoryPage;