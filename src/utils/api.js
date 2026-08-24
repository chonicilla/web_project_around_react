class Api {
  constructor(options) {
    this._options = options;
  }

  _request(endpoint, method = "GET", body = undefined) {
    const apiOptions = {
      method,
      headers: {
        authorization: this._options.apiAuthorization,
      },
    };

    if (body !== undefined && method !== "GET") {
      apiOptions.body = JSON.stringify(body);
      apiOptions.headers = {
        authorization: apiOptions.headers.authorization,
        "content-type": "application/json",
      };
    }

    return fetch(`${this._options.apiUrl}${endpoint}`, apiOptions).then(
      (res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      },
    );
  }

  getInitialCards() {
    return this._request("v1/cards/");
  }

  deleteCard(cardId) {
    const method = "DELETE";
    return this._request("v1/cards/" + cardId, method);
  }

  setUserInformation(name, about) {
    const data = { name, about };
    const method = "PATCH";

    return this._request("v1/users/me", method, data);
  }

  setUserInfo(data) {
    const { name, about } = data;
    return this.setUserInformation(name, about);
  }

  getUserInformation() {
    return this._request("v1/users/me");
  }

  getUserInfo() {
    return this.getUserInformation();
  }

  toggleLike(method, cardId) {
    return this._request("v1/cards/" + cardId + "/likes", method);
  }

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "PUT" : "DELETE";
    return this.toggleLike(method, cardId);
  }

  addCard(name, link) {
    const data = { name, link };
    const method = "POST";

    return this._request("v1/cards/", method, data);
  }

  getAppData() {
    return Promise.all([this.getUserInformation(), this.getInitialCards()]);
  }

  updateUserImage(avatar) {
    const data = { avatar };
    const method = "PATCH";

    return this._request("v1/users/me/avatar", method, data);
  }

  setUserAvatar(data) {
    const { avatar } = data;
    return this.updateUserImage(avatar);
  }

  getInitialCards() {
    return this._request("v1/cards/");
  }

  getCardList() {
    return this.getInitialCards();
  }
}

const api = new Api({
  apiUrl: "https://around-api.es.tripleten-services.com/",
  apiAuthorization: "c9e7bc5c-4ea1-48aa-a8be-944bc0639a88",
});

export default api;
