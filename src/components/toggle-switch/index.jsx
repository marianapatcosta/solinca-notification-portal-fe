import React from "react";
import { isEventValid } from "../../util/shared-methods";
import "./index.css";

const ToggleSwitch = ({
  label,
  leftLabel,
  rightLabel,
  isOn,
  disabled,
  handleToggle,
  style,
}) => {
  const onHandleToggle = (event) => !disabled && isEventValid(event) && handleToggle()
  return (
    <label
      onClick={onHandleToggle}
      onKeyDown={onHandleToggle}
      className={`toggle-switch ${label ? "toggle-switch--with-label" : ""}`}
      style={style}
    >
      {label && (
        <span
          className={`toggle-switch__label ${
            disabled ? "toggle-switch__label--disabled" : ""
          }`}
        >
          {label}
        </span>
      )}
      <input
        className="toggle-switch__input"
        type="checkbox"
        checked={isOn}
        disabled={disabled}
        onChange={handleToggle}
      />
      <span
        className={`toggle-switch__slider ${
          disabled ? "toggle-switch__slider--disabled" : ""
        }  ${isOn ? "toggle-switch__slider--on" : ""}`}
      >
        <span className={`{disabled ? 'toggle-switch__label--disabled' : ''}`}>
          {isOn && leftLabel}
        </span>

        <span className={`{disabled ? 'toggle-switch__label--disabled' : ''}`}>
          {!isOn && rightLabel}
        </span>
      </span>
    </label>
  );
};

export default ToggleSwitch;
