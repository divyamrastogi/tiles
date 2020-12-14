import React, { useRef } from "react";
import { createPortal } from "react-dom";
import cx from "classnames";
import css from "./modal.module.css";

export default function Modal({
  children,
  width,
  height,
  isVisible = true,
  onOverlayClick,
}) {
  const modalBodyRef = useRef(null);
  const style = {};

  if (width) {
    style.width = width;
  }

  if (height) {
    style.height = height;
  }

  const handleOverlayClick = (event) => {
    if (modalBodyRef.current?.contains(event.target)) {
      return;
    }

    onOverlayClick();
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      className={cx(css.Overlay, {
        [css.Hidden]: !isVisible,
      })}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalBodyRef}
        aria-modal="true"
        role="dialog"
        className={css.Modal}
        style={style}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
