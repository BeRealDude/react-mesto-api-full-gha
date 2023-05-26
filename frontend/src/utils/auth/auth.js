const BASE_URL = "http://localhost:3001";

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

export function authorize(info) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: info.password,
      email: info.email,
    }),
  })
    .then((res) => checkResponse(res))
    .then((info) => {
      if (info.token) {
        const token = info.token;
        localStorage.setItem("jwt", token);

        return token;
      }
    });
}

export function getContent(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkResponse(res))
    .then((data) => data);
}
