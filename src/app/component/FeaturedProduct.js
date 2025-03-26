import React from "react";

const storeBackgrounds = {
  apple: "/images/airport_images/appleatorejp.jpeg",
  "jacob & co": "/images/airport_images/jacobjp.jpeg",
  nike: "/images/airport_images/nikejp.jpeg",
  samsung: "/images/airport_images/samsung.jpeg",
  tanishq: "/images/airport_images/tanishqjp.jpeg",
  zara: "/images/airport_images/zarajp.jpeg",
  haldirams: "/images/airport_images/haldiramjp.jpeg",
  
};

const FeaturedProduct = ({ store }) => {
  // Ensure storeName is lowercase to match keys
  const backgroundImage = storeBackgrounds[store.storeName.toLowerCase()] || "/images/default-bg.jpg";

  return (
    <div
      className="min-w-[320px] relative w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 bg-white/90 backdrop-blur-lg text-black border border-gray-200"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="relative p-6 min-h-[220px] mt-4 flex flex-col items-center z-10 -sm rounded-lg shadow-md">

        {/* Store Name */}
        <h3 className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-lg text-lg font-semibold">
  {store.storeName}


         
        </h3>
      </div>
    </div>
  );
};

export default FeaturedProduct;
