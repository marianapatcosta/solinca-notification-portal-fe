import React, { useState } from "react";
import { Checkbox } from "../";
import { DownArrow } from "../../assets/icons";
import { isEventValid } from "../../util/shared-methods";
import "./index.css";

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
    <div className="dropdown-multiselection" >
      <div
        className={`dropdown-multiselection__header ${
          disabled ? "dropdown-multiselection__header--disabled" : ""
        }`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`label`}
        aria-labelledby="dropdown-multiselection__title"
        onClick={toggleDropdownExpansion}
        onKeyDown={(event) => isEventValid(event) && toggleDropdownExpansion()}
       
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
                onChange={() => onOptionClick(option)}
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
