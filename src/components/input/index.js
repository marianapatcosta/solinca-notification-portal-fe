import React from "react";
import "./index.css";

const Input = ({
  id,
  label,
  type,
  isRequired,
  isInvalid,
  maxLength,
  value,
  icon,
  link,
  placeholder,
  errorText,
  onChange,
  onBlur,
  onIconClick
}) => {
  return (
    <div
      className={`input__wrapper ${isInvalid ? "input__wrapper--invalid" : ""}`}
    >
      <label htmlFor={id}>
        {`${label} `}
        {isRequired && <span className="input__label-mandatory">*</span>} {link}
      </label>
      <input
        id={id}
        type={type || "text"}
        maxLength={maxLength || 150}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {icon && (
          <img
            className="input__icon"
            alt="input icon"
            src={icon}
            onClick={onIconClick}
          />
        )}
      {isInvalid && <p>{errorText}</p>}
    </div>
  );
};

export default Input;
