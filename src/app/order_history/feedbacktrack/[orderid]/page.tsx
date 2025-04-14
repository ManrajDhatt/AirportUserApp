// app/order_history/feedbacktrack/[orderid]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { motion } from "framer-motion";
import { Star, Check, X, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  productImageUrl: string;
  name: string;
  price: number;
  quantity: number;
  status?: string;
}

interface StoreOrder {
  id: string;
  storeId: string;
  status: string;
  products?: Product[];
}

interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  storeOrders: StoreOrder[];
}

interface FeedbackData {
  productId: string;
  productName: string;
  productImageUrl: string;
  rating: number;
  comment: string;
  storeId: string;
}

export default function FeedbackPage() {
  const { orderid } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [feedbackData, setFeedbackData] = useState<Record<string, FeedbackData>>({});

  // Handle authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch order data
  useEffect(() => {
    if (!orderid || !user) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderDoc = await getDoc(doc(db, "Orders", orderid as string));
        
        if (!orderDoc.exists()) {
          throw new Error("Order not found");
        }

        const orderData = orderDoc.data();
        
        // Fetch store orders
        const storeOrdersQuery = query(
          collection(db, "Orders", orderid as string, "StoreOrders")
        );
        const storeOrdersSnapshot = await getDocs(storeOrdersQuery);
        
        const storeOrders: StoreOrder[] = [];
        for (const storeOrderDoc of storeOrdersSnapshot.docs) {
          const storeOrderData = storeOrderDoc.data();
          
          // Fetch products for each store order
          const productsQuery = query(
            collection(db, "Orders", orderid as string, "StoreOrders", storeOrderDoc.id, "products")
          );
          const productsSnapshot = await getDocs(productsQuery);
          
          const products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          
          storeOrders.push({
            id: storeOrderDoc.id,
            storeId: storeOrderData.storeId,
            status: storeOrderData.status,
            products
          });
        }

        setOrder({
          id: orderDoc.id,
          userId: orderData.userId,
          createdAt: orderData.createdAt?.toDate?.()?.toLocaleString() || "Unknown",
          status: orderData.status,
          storeOrders
        });

        // Initialize feedback data structure
        const initialFeedback: Record<string, FeedbackData> = {};
        storeOrders.forEach(storeOrder => {
          storeOrder.products?.forEach(product => {
            initialFeedback[product.id] = {
              productId: product.id,
              productName: product.name,
              productImageUrl: product.productImageUrl,
              storeId: storeOrder.storeId,
              rating: 0,
              comment: ""
            };
          });
        });
        setFeedbackData(initialFeedback);

      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderid, user]);

  const handleRatingChange = (productId: string, rating: number) => {
    setFeedbackData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating
      }
    }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setFeedbackData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment
      }
    }));
  };

  const submitFeedback = async () => {
    if (!user || !order) return;

    try {
      setSubmitting(true);
      
      // Prepare feedback data for submission
      const feedbacks = Object.values(feedbackData);
      
      // Add feedback to Firestore
      await addDoc(collection(db, "Feedback"), {
        orderId: order.id,
        userId: user.uid,
        createdAt: new Date(),
        feedbacks,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/order_history");
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const allRated = Object.values(feedbackData).every(fb => fb.rating > 0);
  const totalProducts = order?.storeOrders.reduce((total, storeOrder) => 
    total + (storeOrder.products?.length || 0), 0) || 0;
  const ratedCount = Object.values(feedbackData).filter(fb => fb.rating > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for. Please check your order history.
          </p>
          <Link href="/order_history">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Back to Order History
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your time!
          </p>
          <Link href="/order_history">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Back to Order History
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/order_history">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-emerald-600 font-medium mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Orders
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Feedback</h1>
              <p className="text-gray-600 mt-1">
                Order #{order.id.substring(0, 8)} • {order.createdAt}
              </p>
            </div>

            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Rated {ratedCount} of {totalProducts} products
              </span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {order.storeOrders.map((storeOrder) => (
            <motion.div
              key={storeOrder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Store: {storeOrder.storeId}
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {storeOrder.products?.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 flex flex-col sm:flex-row gap-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.productImageUrl}
                          alt={product.name}
                          fill
                          className="object-cover" 
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            ₹{product.price.toLocaleString()} × {product.quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingChange(product.id, star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  feedbackData[product.id]?.rating >= star
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor={`comment-${product.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Feedback (optional)
                        </label>
                        <textarea
                          id={`comment-${product.id}`}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Share your experience with this product..."
                          value={feedbackData[product.id]?.comment || ""}
                          onChange={(e) => handleCommentChange(product.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={submitFeedback}
            disabled={!allRated || submitting}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              allRated
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-md"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors flex items-center gap-2`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}