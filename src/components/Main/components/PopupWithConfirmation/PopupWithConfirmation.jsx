export default function PopupWithConfirmation(props) {
  const { onConfirm } = props;

  function handleSubmit(e) {
    e.preventDefault();
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
      <button className="button popup__button" type="submit">
        Sí
      </button>
    </form>
  );
}
