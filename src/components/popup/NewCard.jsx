import { useState } from "react";

export default function NewCard(props) {
  const { onSubmit } = props;
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const isValid = name.trim().length >= 1 && link.trim().length >= 1;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ name: name.trim(), link: link.trim() });
    setName("");
    setLink("");
  }

  return (
    <form
      className="popup__form"
      name="card-form"
      id="new-card-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_card-name"
          id="card-name"
          maxLength="30"
          minLength="1"
          name="card-name"
          placeholder="Título"
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="popup__error" id="card-name-error"></span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          id="card-link"
          name="link"
          placeholder="Enlace de la imagen"
          required
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <span className="popup__error" id="card-link-error"></span>
      </label>

      <button
        className="button popup__button"
        type="submit"
        disabled={!isValid}
      >
        Guardar
      </button>
    </form>
  );
}
