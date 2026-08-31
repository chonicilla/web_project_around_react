import { useEffect, useState } from "react";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api";
import EditProfile from "./popup/EditProfile.jsx";
import NewCard from "./popup/NewCard.jsx";
import EditAvatar from "./popup/EditAvatar.jsx";
import ImagePopup from "./popup/ImagePopup.jsx";
import RemoveCard from "./popup/RemoveCard.jsx";

export const POPUPS = {
  EDIT_PROFILE: "EDIT_PROFILE",
  NEW_CARD: "NEW_CARD",
  EDIT_AVATAR: "EDIT_AVATAR",
  IMAGE: "IMAGE",
  REMOVE_CARD: "REMOVE_CARD",
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
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCardList()])
      .then(([userInfo, initialCards]) => {
        setCurrentUser(userInfo);
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
      const response = await api.setUserInfo(data);
      setCurrentUser(response);
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAvatar = async (data) => {
    try {
      const response = await api.setUserAvatar(data);
      setCurrentUser(response);
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
    setPopup(POPUPS.REMOVE_CARD);
  }

  async function handleConfirmDelete() {
    if (!cardToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteCard(cardToDelete._id);
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== cardToDelete._id),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      handleClosePopup();
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
      case POPUPS.REMOVE_CARD:
        return {
          title: "¿Estás seguro/a?",
          children: (
            <RemoveCard
              onConfirm={handleConfirmDelete}
              isLoading={isDeleting}
            />
          ),
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
