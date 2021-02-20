import React from "react";
import { Tick } from "../../assets/icons";
import { isEventValid } from "../../util/shared-methods";
import "./index.css";

const Checkbox = ({ disabled, onChange, checked, label }) => {
  return (
    <div className="checkbox">
      <div
        className={`checkbox__toggle ${
          disabled ? "checkbox__toggle--disabled" : ""
        }`}
        role="checkbox"
        tabIndex={disabled ? -1 : 0}
        aria-checked={checked}
        onClick={onChange}
        onKeyDown={(event) => isEventValid(event) && onChange()}
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
        onClick={onChange}
      >
        {label}
      </div>
    </div>
  );
};

export default Checkbox;
