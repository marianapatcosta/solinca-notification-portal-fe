import React from "react";
import { Tick } from "../../assets/icons";
import "./index.css";

const Checkbox = ({ disabled, onClick, checked, label }) => {
  return (
    <div className="checkbox">
      <div
        className={`checkbox__toggle ${
          disabled ? "checkbox__toggle--disabled" : ""
        }`}
        onClick={onClick}
      >
        {checked && (
          <img
            className="checkbox__toggle--tick"
            alt="checkbox tick"
            src={Tick}
          />
        )}
      </div>
      <div
        className={`checkbox__label ${
          disabled ? "checkbox__label--disabled" : ""
        }`}
        onClick={onClick}
      >
        {label}
      </div>
    </div>
  );
};

export default Checkbox;
