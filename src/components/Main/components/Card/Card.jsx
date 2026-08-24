import { useContext, useState } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 19"
      width="18"
      height="19"
      aria-hidden="true"
    >
      <path
        d="M3 6H15M6 6V4.5C6 3.67157 6.67157 3 7.5 3H10.5C11.3284 3 12 3.67157 12 4.5V6M5.5 6L6 15.5C6 16.3284 6.67157 17 7.5 17H10.5C11.3284 17 12 16.3284 12 15.5L12.5 6"
        stroke="white"
        strokeWidth="1.6"
        paintOrder="stroke fill markers"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          filter:
            "drop-shadow(0 0 0.5px #000) drop-shadow(0 0 0.5px #000) drop-shadow(0 1px 1px rgba(0,0,0,0.45))",
        }}
      />
    </svg>
  );
}

function HeartIcon({ liked, animating }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 19"
      className={`heart-icon ${animating ? "heart-icon--animating" : ""}`}
      fill={liked ? "#000" : "none"}
      stroke="#000"
      strokeWidth="1.5"
    >
      <path d="M10.5 17.5C10.5 17.5 1.5 11.5 1.5 6C1.5 3.5 3.5 1.5 6 1.5C7.73 1.5 9.27 2.5 10.5 4C11.73 2.5 13.27 1.5 15 1.5C17.5 1.5 19.5 3.5 19.5 6C19.5 11.5 10.5 17.5 10.5 17.5Z" />
    </svg>
  );
}

export default function Card(props) {
  const { card, onCardLike, onCardDelete, onOpenImage } = props;
  const { name, link, isLiked, owner } = card;
  const { currentUser } = useContext(CurrentUserContext);
  const [likeAnimating, setLikeAnimating] = useState(false);

  let cardOwnerId = null;
  if (typeof owner === "string" && owner.length > 0) {
    cardOwnerId = owner;
  } else if (owner && typeof owner === "object") {
    cardOwnerId =
      typeof owner._id === "string" && owner._id.length > 0 ? owner._id : null;
  }

  const currentUserId =
    currentUser && typeof currentUser._id === "string" && currentUser._id.length
      ? currentUser._id
      : null;

  const isOwn = Boolean(
    currentUserId && cardOwnerId && cardOwnerId === currentUserId,
  );

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  function handleLikeClick(e) {
    e.stopPropagation();
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
    onCardLike(card);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => onOpenImage(card)}
      />
      {isOwn && (
        <button
          aria-label="Delete card"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
        >
          <TrashIcon />
        </button>
      )}
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Like card"
          type="button"
          className={`like-button ${cardLikeButtonClassName}`}
          onClick={handleLikeClick}
        >
          <HeartIcon liked={isLiked} animating={likeAnimating} />
        </button>
      </div>
    </li>
  );
}
