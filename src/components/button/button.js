import React, { forwardRef } from "react";
import "./button.css";

const Button = forwardRef(({ disabled, onClick, type, size, label }, ref) => {
  return (
    <button
      className={`button ${size === "large" ? "button--large" : ""}`}
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      {label}
    </button>
  );
});

export default Button;
