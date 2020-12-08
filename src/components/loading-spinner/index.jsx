import React, { useEffect } from "react";
import "./index.css";

const LoadingSpinner = () => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.getElementsByTagName("body")[0].className += "overlay";
    return () => {
      document.documentElement.style.overflow = "scroll";
      document.getElementsByTagName("body")[0].classList.remove("overlay");
    };
  }, []);

  return (
    <div className="loader__overlay">
      <div className="loader__spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
