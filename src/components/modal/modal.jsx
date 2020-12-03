import React, { useRef, useEffect } from "react";
import Button from "../button/button";
import "./modal.css";

const Modal = ({
  header,
  message,
  buttonLabel,
  confirmationLabel,
  confirmationModal = false,
  onClose,
  onConfirmation,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const buttonIndex = modalRef.current.children[1].children.length - 1;
    const modalFocusButton = modalRef.current.children[1].children[buttonIndex];
    modalFocusButton.focus();

    const handleClickOutside = (event) => {
      const element = event.target;

      if (modalRef.current && !modalRef.current.contains(element)) {
        event.preventDefault();
        event.stopPropagation();

        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [modalRef, onClose]);

  return (
    <div className="modal">
      <div className="modal__overlay">
        <div className="modal__content" ref={modalRef}>
          {header && (
            <header className="modal__header">
              <h4 className="modal__header--title">{header}</h4>
              <span
                className="modal__header--close"
                onClick={onClose}
                aria-hidden="true"
              >
                x
              </span>
            </header>
          )}
          <main>
            <p className="modal__body">{message}</p>
          </main>
          <footer className="modal__footer">
            {confirmationModal && (
              <Button
                className="modal__footer--button"
                label={confirmationLabel}
                onClick={onConfirmation}
              />
            )}
            <Button
              className="modal__footer--button"
              ref={modalRef}
              label={buttonLabel}
              onClick={onClose}
            />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Modal;
