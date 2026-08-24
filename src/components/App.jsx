import { useEffect, useState } from "react";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api";
import EditProfile from "./Main/components/form/EditProfile/EditProfile.jsx";
import NewCard from "./Main/components/form/NewCard/NewCard.jsx";
import EditAvatar from "./Main/components/form/EditAvatar/EditAvatar.jsx";
import ImagePopup from "./Main/components/ImagePopup/ImagePopup.jsx";
import PopupWithConfirmation from "./Main/components/PopupWithConfirmation/PopupWithConfirmation.jsx";

export const POPUPS = {
  EDIT_PROFILE: "EDIT_PROFILE",
  NEW_CARD: "NEW_CARD",
  EDIT_AVATAR: "EDIT_AVATAR",
  IMAGE: "IMAGE",
  CONFIRM: "CONFIRM",
};

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "Jacques Cousteau",
    about: "Explorador",
    avatar:
      "https://practicum-content.s3.us-west-1.amazonaws.com/frontend-developer/common/avatar.jpg",
    _id: "7db464fb0536b983646b92b4",
  });
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [imageCard, setImageCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    api
      .getCardList()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function handleOpenPopup(popupName) {
    setPopup(popupName);
  }

  function handleClosePopup() {
    setPopup(null);
    setImageCard(null);
    setCardToDelete(null);
  }

  const handleUpdateUser = async (data) => {
    try {
      await api.setUserInfo(data);
      setCurrentUser((prev) => ({ ...prev, ...data }));
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAvatar = async (data) => {
    try {
      await api.setUserAvatar(data);
      setCurrentUser((prev) => ({ ...prev, avatar: data.avatar }));
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  };

  async function handleCardLike(card) {
    const isLiked = card.isLiked;
    try {
      const newCard = await api.changeLikeCardStatus(card._id, !isLiked);
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function handleRequestDelete(card) {
    setCardToDelete(card);
    setPopup(POPUPS.CONFIRM);
  }

  async function handleConfirmDelete() {
    if (!cardToDelete) return;
    try {
      await api.deleteCard(cardToDelete._id);
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== cardToDelete._id),
      );
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddPlaceSubmit({ name, link }) {
    try {
      const newCard = await api.addCard(name, link);
      setCards((prevCards) => [newCard, ...prevCards]);
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  }

  function handleOpenImage(card) {
    setImageCard(card);
    handleOpenPopup(POPUPS.IMAGE);
  }

  function handleSubmitNewCard(data) {
    handleAddPlaceSubmit(data);
  }

  const popupConfig = (() => {
    switch (popup) {
      case POPUPS.EDIT_PROFILE:
        return {
          title: "Editar perfil",
          children: <EditProfile />,
        };
      case POPUPS.NEW_CARD:
        return {
          title: "Nuevo lugar",
          children: <NewCard onSubmit={handleSubmitNewCard} />,
        };
      case POPUPS.EDIT_AVATAR:
        return {
          title: "Cambiar foto de perfil",
          children: <EditAvatar />,
        };
      case POPUPS.IMAGE:
        return {
          title: null,
          children: <ImagePopup card={imageCard} />,
        };
      case POPUPS.CONFIRM:
        return {
          title: "¿Estás seguro/a?",
          children: <PopupWithConfirmation onConfirm={handleConfirmDelete} />,
        };
      default:
        return null;
    }
  })();

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="page">
        <Header />
        <Main
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleRequestDelete}
          onOpenPopup={handleOpenPopup}
          onOpenImage={handleOpenImage}
          popupConfig={popupConfig}
          onClosePopup={handleClosePopup}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
