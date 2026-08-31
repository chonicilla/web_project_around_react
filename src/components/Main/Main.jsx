import { useContext } from "react";
import avatarImg from "../../images/profile-photo.png";
import Card from "./components/Card/Card";
import Popup from "../popup/Popup.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import { POPUPS } from "../App.jsx";
import "../../blocks/page.css";
import "../../blocks/profile.css";
import "../../blocks/edit-button.css";
import "../../blocks/add-button.css";
import "../../blocks/gallery.css";

function Main(props) {
  const {
    cards,
    onCardLike,
    onCardDelete,
    onOpenPopup,
    onOpenImage,
    popupConfig,
    onClosePopup,
  } = props;

  const userContext = useContext(CurrentUserContext);
  const { currentUser } = userContext;

  function handleOpenEditProfile() {
    onOpenPopup(POPUPS.EDIT_PROFILE);
  }
  function handleOpenNewCard() {
    onOpenPopup(POPUPS.NEW_CARD);
  }
  function handleOpenEditAvatar() {
    onOpenPopup(POPUPS.EDIT_AVATAR);
  }

  const avatar = currentUser.avatar || avatarImg;

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <img className="profile__avatar" src={avatar} alt="Avatar" />
          <button
            id="openAvatarEdit"
            className="profile__avatar-edit-button"
            type="button"
            onClick={handleOpenEditAvatar}
          >
            <svg
              className="profile__avatar-edit-icon"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.42 5.74L20.26 0.58C19.88 0.2 19.38 0 18.88 0C18.38 0 17.88 0.2 17.5 0.58L2.34 15.74C2.12 15.96 2 16.24 2 16.56V24.5C2 25.32 2.68 26 3.5 26H11.44C11.76 26 12.04 25.88 12.26 25.66L27.42 10.5C28.2 9.72 28.2 8.46 27.42 7.68L25.42 5.74ZM10.56 24H4V17.44L15.66 5.78L22.22 12.34L10.56 24ZM23.64 10.92L17.08 4.36L18.88 2.56L25.44 9.12L23.64 10.92Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div className="profile__info">
          <div className="profile__name-edit">
            <h2 className="profile__name">{currentUser.name}</h2>
            <button
              id="openPopup"
              className="edit-button"
              type="button"
              onClick={handleOpenEditProfile}
            >
              <svg
                id="editButton"
                className="pencil-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.5" y="0.5" width="23" height="23" stroke="white" />
                <path
                  d="M17 8.32827L9.60377 15.7666L8.28302 14.4194L15.6604 7L17 8.32827ZM7 17L8.96226 16.4118L7.58491 15.0835L7 17Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <p className="profile__role">{currentUser.about}</p>
        </div>

        <button
          className="add-button"
          id="openAdd"
          type="button"
          onClick={handleOpenNewCard}
        >
          <p className="add-icon">+</p>
        </button>
      </section>

      <ul className="cards__list">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
            onOpenImage={onOpenImage}
          />
        ))}
      </ul>

      {popupConfig && (
        <Popup onClose={onClosePopup} title={popupConfig.title}>
          {popupConfig.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
