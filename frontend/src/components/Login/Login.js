import ModalWindows from "../ModalWindows/ModalWindows";
import React, { useState } from "react";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onLogin({
      email: email,
      password: password,
    });
  }

  return (
    <ModalWindows
      data={{
        classSelector: "login-modal",
        title: "Вход",
        user: "userLogin",
        submit: "Войти",
      }}
      onSubmit={handleSubmit}
    >
      <input
        value={email || ""}
        onChange={handleChangeEmail}
        autoComplete="on"
        required
        minLength="6"
        maxLength="40"
        className="modal__text"
        type="email"
        name="email"
        id="email"
        placeholder="Email"
      />
      <span className="form__error user-name-error" id="user-name-error">
        {props.message}
      </span>

      <input
        value={password || ""}
        onChange={handleChangePassword}
        autoComplete="current-password"
        required
        minLength="6"
        maxLength="40"
        className="modal__text"
        type="password"
        name="password"
        id="password"
        placeholder="Пароль"
      />
      <span
        className="form__error user-activity-error"
        id="user-activity-error"
      >
        {props.message}
      </span>
    </ModalWindows>
  );
}

export default Login;
