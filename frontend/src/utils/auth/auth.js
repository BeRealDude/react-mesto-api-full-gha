const BASE_URL = 'https://api.nvs.mesto.nomoredomains.rocks';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
};

export function register(info) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: info.password,
      email: info.email,
    }),
  }).then((res) => checkResponse(res));
}

export function authorize(email, password) {
  console.log(email, password)
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => checkResponse(res))
    .then((info) => {
      if (info.token) {
        const { token } = info;
        localStorage.setItem("jwt", token);
        console.log('token: ', token)
        return token;
      }
    });
}

export function getContent(token) {
  console.log(token)
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  })
    .then(res => checkResponse(res))
    .then(user => user)
}
