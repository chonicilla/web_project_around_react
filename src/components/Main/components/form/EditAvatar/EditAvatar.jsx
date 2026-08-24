import { useRef, useContext } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext.js";

export default function EditAvatar() {
  const avatarRef = useRef(null);
  const userContext = useContext(CurrentUserContext);
  const { handleUpdateAvatar } = userContext;

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <form
      className="popup__form"
      name="avatar-form"
      id="edit-avatar-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="popup__label">
        <input
          ref={avatarRef}
          className="popup__input popup__input_type_avatar-url"
          id="avatar-link"
          name="avatar"
          placeholder="URL de la imagen del avatar"
          required
          type="url"
        />
        <span className="popup__error" id="avatar-link-error"></span>
      </label>

      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
}
