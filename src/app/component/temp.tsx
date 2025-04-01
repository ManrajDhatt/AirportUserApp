            
            // {/* Animated Delivery Scooter */}
            // <div className="flex-1 flex items-center justify-center bg-emerald-50 rounded-lg p-4">
            //   <motion.div
            //     animate={{
            //       x: [0, 20, 0],
            //       y: [0, -5, 0]
            //     }}
            //     transition={{
            //       duration: 3,
            //       repeat: Infinity,
            //       repeatType: "reverse"
            //     }}
            //     className="relative"
            //   >
            //     {selectedOrder.status === "onway" ? (
            //       <motion.svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            //         {/* Scooter Body */}
            //         <motion.path 
            //           d="M30 80 L90 80 L100 60 L110 60 L115 80 L120 80" 
            //           stroke="#10b981" 
            //           strokeWidth="4" 
            //           fill="none"
            //         />
                    
            //         {/* Delivery Box */}
            //         <rect x="80" y="40" width="30" height="20" rx="2" fill="#34d399" />
                    
            //         {/* Wheels - with animation */}
            //         <motion.circle 
            //           cx="30" 
            //           cy="80" 
            //           r="15" 
            //           fill="#d1d5db" 
            //           stroke="#4b5563" 
            //           strokeWidth="2"
            //           animate={{ rotate: 360 }}
            //           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            //         />
            //         <motion.circle 
            //           cx="120" 
            //           cy="80" 
            //           r="15" 
            //           fill="#d1d5db" 
            //           stroke="#4b5563" 
            //           strokeWidth="2"
            //           animate={{ rotate: 360 }}
            //           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            //         />
                    
            //         {/* Handle Bars */}
            //         <path d="M100 60 L95 50 L105 50" stroke="#4b5563" strokeWidth="3" fill="none" />
                    
            //         {/* Rider */}
            //         <circle cx="95" cy="40" r="8" fill="#4b5563" />
            //         <path d="M95 48 L95 65" stroke="#4b5563" strokeWidth="2" />
            //         <path d="M95 50 L85 60" stroke="#4b5563" strokeWidth="2" />
            //         <path d="M95 50 L105 60" stroke="#4b5563" strokeWidth="2" />
            //       </motion.svg>
            //     ) : selectedOrder.status === "delivered" ? (
            //       <motion.div 
            //         initial={{ scale: 0.8 }}
            //         animate={{ scale: 1 }}
            //         transition={{ duration: 0.5 }}
            //       >
            //         <div className="bg-emerald-100 p-6 rounded-full relative">
            //           <BadgeCheck className="w-16 h-16 text-emerald-500" />
            //         </div>
            //         <p className="text-center mt-2 text-emerald-600 font-medium">Delivered Successfully</p>
            //       </motion.div>
            //     ) : (
            //       <motion.div 
            //         initial={{ scale: 0.8 }}
            //         animate={{ scale: 1 }}
            //         transition={{ duration: 0.5 }}
            //       >
            //         <Package className="w-16 h-16 text-blue-500" />
            //         <p className="text-center mt-2 text-blue-600 font-medium">Preparing Your Order</p>
            //       </motion.div>
            //     )}
            //   </motion.div>
            // </div>