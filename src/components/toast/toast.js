import React, { useEffect } from "react";
import "./toast.css";

const Toast = ({ type, message, onClean }) => {
  const typeClass = () => {
    const toastTypesClasses = {
      alert: 'toast--alert',
      info: 'toast--info',
      success: 'toast--success',
      warning: 'toast--warning',
    };
    return toastTypesClasses[type];
  };

  useEffect(() => {
    let timer;
    if (message) timer = setTimeout(() => onClean({}), 2000);
    return () => clearTimeout(timer);
  }, [message, onClean]);

  return (
    <div className={`toast ${typeClass()}`}>
      <div className="toast__message">{message}</div>
    </div>
  );
};

export default Toast;
