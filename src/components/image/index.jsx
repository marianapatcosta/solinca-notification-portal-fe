import React, { useState, useEffect } from "react";
import { isEventValid } from "../../util/shared-methods";
import "./index.css";

const Image = ({ isClickable, src, alt, className, placeholderClass }) => {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [wasImageClicked, setWasImageClicked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageClick = () => {
    isClickable && setIsZoomedIn((prevIsZoomedIn) => !prevIsZoomedIn);
    isClickable && setWasImageClicked(true);
  };

  useEffect(() => {
    if (isZoomedIn) {
      document.getElementsByTagName("body")[0].className += "overlay";
      document.documentElement.style.overflow = "hidden";
      return;
    }

    document.getElementsByTagName("body")[0].classList.remove("overlay");
    document.documentElement.style.overflow = "scroll";
  }, [isZoomedIn]);

  return (
    <div className={`${isClickable && isZoomedIn ? "image__overlay" : ""}`}>
      {!isLoaded && (
        <div className={`image__placeholder ${placeholderClass}`}></div>
      )}
      <img
        role={isClickable ? "button" : ""}
        tabIndex={isClickable ? "0" : "-1"}
        className={`image ${className} ${
          wasImageClicked ? "image--zoomed-out" : ""
        } ${isClickable ? "image--clickable" : ""} ${
          isZoomedIn ? "image--zoomed-in" : ""
        } `}
        style={!isLoaded ? { visibility: "hidden" } : {}}
        src={src}
        alt={alt}
        loading="lazy"
        onClick={handleImageClick}
        onKeyDown={(event) => isEventValid(event) && handleImageClick()}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default Image;
