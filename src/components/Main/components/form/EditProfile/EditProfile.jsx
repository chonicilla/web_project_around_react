import { useRef, useState, useContext } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext.js";

export default function EditProfile() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;

  const initialName = currentUser.name ?? "";
  const initialDescription = currentUser.about ?? "";

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameDirty, setNameDirty] = useState(false);
  const [descriptionDirty, setDescriptionDirty] = useState(false);
  const isSubmittingRef = useRef(false);
  const lastContextNameRef = useRef(initialName);
  const lastContextDescriptionRef = useRef(initialDescription);

  if (
    !nameDirty &&
    !isSubmittingRef.current &&
    lastContextNameRef.current !== initialName &&
    name === lastContextNameRef.current
  ) {
    lastContextNameRef.current = initialName;
    setName(initialName);
  }
  if (
    !descriptionDirty &&
    !isSubmittingRef.current &&
    lastContextDescriptionRef.current !== initialDescription &&
    description === lastContextDescriptionRef.current
  ) {
    lastContextDescriptionRef.current = initialDescription;
    setDescription(initialDescription);
  }

  const handleNameChange = (event) => {
    setNameDirty(true);
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescriptionDirty(true);
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) return;
    isSubmittingRef.current = true;
    handleUpdateUser({ name: name.trim(), about: description.trim() });
  };

  return (
    <form
      className="popup__form"
      name="profile-form"
      id="edit-profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_name"
          id="owner-name"
          maxLength="40"
          minLength="2"
          name="userName"
          placeholder="Nombre de usuario"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span className="popup__error" id="owner-name-error"></span>
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_description"
          id="owner-description"
          maxLength="200"
          minLength="2"
          name="userDescription"
          placeholder="Acerca de mí"
          required
          type="text"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="popup__error" id="owner-description-error"></span>
      </label>
      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
}
