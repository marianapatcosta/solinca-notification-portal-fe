import React, { useState } from "react";
import Checkbox from "../checkbox/checkbox";
import DownArrow from "../../assets/icons/down-arrow.svg";
import "./dropdown-multiselection.css";

const DropdownMultiSelection = ({
  options,
  selectedOptions,
  title,
  disabled,
  onOptionClick,
  labelKey,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isOptionSelected = (option) => {
    const selectedOptionsLabels = labelKey
      ? selectedOptions.map((option) => option[labelKey])
      : selectedOptions;
    return selectedOptionsLabels?.includes(
      labelKey ? option[labelKey] : option
    );
  };

  const toggleDropdownExpansion = () =>
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);

  return (
    <div className="dropdown-multiselection">
      <div
        className={`dropdown-multiselection__header ${
          disabled ? "dropdown-multiselection__header--disabled" : ""
        }`}
        onClick={toggleDropdownExpansion}
      >
        <div className="dropdown-multiselection__title">{title}</div>
        <img
          className={`dropdown-multiselection__header--arrow ${
            isExpanded ? "dropdown-multiselection__header--arrow-inverted" : ""
          }`}
          alt="dropdown arrow"
          src={DownArrow}
        />
      </div>
      {isExpanded && (
        <ul className="dropdown-multiselection__options">
          {options.map((option, index) => (
            <li
              key={index * Math.random()}
              className="dropdown-multiselection__option"
            >
              <Checkbox
                disabled={disabled}
                onClick={() => onOptionClick(option)}
                checked={isOptionSelected(option)}
                label={labelKey ? option[labelKey] : option}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMultiSelection;
