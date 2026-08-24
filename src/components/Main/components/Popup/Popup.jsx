import { useEffect } from "react";

export default function Popup(props) {
  const { onClose, title, children } = props;

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target.classList.contains("popup")) {
      onClose();
    }
  }

  return (
    <div className="popup" onClick={handleOverlayClick}>
      <div
        className={`popup__content ${!title ? "popup__content_content_image" : ""}`}
      >
        <button
          aria-label="Close modal"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        {title && <h3 className="popup__title">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
