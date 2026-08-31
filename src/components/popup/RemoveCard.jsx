import { useState } from "react";

export default function RemoveCard(props) {
  const { onConfirm, isLoading = false } = props;
  const [submitted, setSubmitted] = useState(false);
  const disabled = isLoading || submitted;

  function handleSubmit(e) {
    e.preventDefault();
    if (disabled) return;
    setSubmitted(true);
    onConfirm();
  }

  return (
    <form
      className="popup__form"
      name="confirm-form"
      id="confirm-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <button
        className="button popup__button"
        type="submit"
        disabled={disabled}
      >
        {isLoading ? "Guardando..." : "Sí"}
      </button>
    </form>
  );
}
