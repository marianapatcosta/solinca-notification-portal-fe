import React from "react";
import './emoji.css';

const Emoji = ({ label, emoji }) => (
  <span
    className="emoji"
    role="img"
    aria-label={label ? label : ""}
    aria-hidden={label ? "false" : "true"}
  >
    {emoji}
  </span>
);

export default Emoji;
