
import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, BadgeCheck, Package, Truck, Send, X } from 'lucide-react';

type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'packaged' | 'onway' | 'delivered';

type StatusTimestamps = {
  [key in OrderStatus]?: string;
};

interface OrderTimelineProps {
  status: OrderStatus;
  timestamps?: StatusTimestamps;
}

const OrderTimeline = ({ status, timestamps }: OrderTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  
  const steps = [
    { status: 'pending' as OrderStatus, label: 'Order Placed', icon: <Clock className="w-6 h-6" /> },
    { status: 'accepted' as OrderStatus, label: 'Order Accepted', icon: <BadgeCheck className="w-6 h-6" /> },
    { status: 'packaged' as OrderStatus, label: 'Order Packaged', icon: <Package className="w-6 h-6" /> },
    { status: 'onway' as OrderStatus, label: 'On The Way', icon: <Truck className="w-6 h-6" /> },
    { status: 'delivered' as OrderStatus, label: 'Delivered', icon: <Send className="w-6 h-6" /> },
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
  
  // Auto-scroll to active step
  useEffect(() => {
    if (isInView && containerRef.current && status !== 'rejected') {
      const activeElement = containerRef.current.querySelector('.active-step');
      if (activeElement) {
        setTimeout(() => {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 500);
      }
    }
  }, [isInView, status]);

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

  if (status === 'rejected') {
    return (
      <motion.div
        className="flex flex-col items-center py-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="bg-red-100 p-6 rounded-full relative shadow-md">
          <X className="w-10 h-10 text-red-500" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity
            }}
          />
        </div>
        <motion.h3
          className="font-bold text-red-600 mt-4 text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Order Rejected
        </motion.h3>
        {timestamps?.rejected && (
          <motion.p 
            className="text-sm text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {new Date(timestamps.rejected).toLocaleString()}
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="py-8 px-4 relative overflow-hidden" ref={containerRef}>
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Timeline center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 rounded-full">
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-full bg-emerald-500 origin-top rounded-full"
            initial={{ scaleY: 0 }}
            animate={{ 
              scaleY: currentStatusIndex >= 0 ? currentStatusIndex / (steps.length - 1) : 0 
            }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="space-y-20 relative">
          {steps.map((step, idx) => {
            // Fix: Correctly determine if the step is active (exactly matches current status)
            const isActive = idx === currentStatusIndex;
            // Fix: Correctly determine past steps (all steps before current status)
            const isPast = idx < currentStatusIndex;
            // Future steps remain the same
            const isFuture = idx > currentStatusIndex;
            
            // Logic for step color based on state
            const stepColor = isActive || isPast ? "emerald" : "gray";

            return (
              <motion.div 
                key={step.status} 
                className={`relative flex items-center ${isActive ? 'active-step' : ''}`}
                variants={itemVariants}
              >
                {/* Step indicator */}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    className={`rounded-full p-4 shadow-md relative ${
                      isActive 
                        ? "bg-emerald-500 ring-4 ring-emerald-200" 
                        : isPast
                          ? "bg-emerald-500"
                          : "bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: idx * 0.2
                    }}
                  >
                    <motion.div
                      className="text-white"
                      animate={isActive ? { 
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>

                  {/* Pulse effect for active step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-emerald-500"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ 
                        duration: 1.8,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                  )}
                </div>

                {/* Content box */}
                <motion.div 
                  className={`ml-6 bg-white p-4 rounded-lg shadow-md border-l-4 ${
                    isActive 
                      ? "border-emerald-500" 
                      : isPast
                        ? "border-emerald-300"
                        : "border-gray-200"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 + 0.3 }}
                  whileHover={{ x: 5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <h3 className={`font-bold text-lg ${
                    isActive 
                      ? "text-emerald-700" 
                      : isPast
                        ? "text-emerald-600"
                        : "text-gray-400"
                  }`}>
                    {step.label}
                  </h3>
                  {timestamps && step.status in timestamps && timestamps[step.status] && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(timestamps[step.status]!).toLocaleString()}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderTimeline;