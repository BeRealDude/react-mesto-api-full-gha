class Api {
  constructor() {
    this._baseUrl = 'http://localhost:3001';
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  };

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json',
      },
    });
  }

  getCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json',
      },
    });
  }

  editInfo(info) {
    //console.log('api', info)
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json'
    },
      body: JSON.stringify({
        name: info.name,
        about: info.about,
      }),
    });
  }

  addNewCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json'
    },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    });
  }

  dltCard(id) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json'
    },
    });
  }

  addLike(id, isLiked) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-type': 'application/json'
      },
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-type': 'application/json'
      },
      });
    }
  }

  editAvatar(info) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json'
    },
      body: JSON.stringify({
        avatar: info.avatar,
      }),
    });
  }
}

export const api = new Api();
