import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/scooterAnimation.json"; // Adjust path if needed


const ScooterAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default ScooterAnimation;
