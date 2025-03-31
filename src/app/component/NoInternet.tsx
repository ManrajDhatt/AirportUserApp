import Image from "next/image";
import { motion } from "framer-motion";

const NoInternet = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image src="/no_internet.png" alt="No Internet" width={400} height={400} />
      </motion.div>
      <motion.p
        className="mt-4 text-lg font-semibold text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        No Internet Connection
      </motion.p>
    </div>
  );
};

export default NoInternet;
