import ModalWindows from "../ModalWindows/ModalWindows";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const { onInfoTooltip } = props;
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

    props.onRegister({
      email: email,
      password: password,
    });
  }

  return (
    <>
      <ModalWindows
        data={{
          classSelector: "register-modal",
          title: "Регистрация",
          user: "userRegister",
          submit: "Зарегистрироваться",
        }}
        onSubmit={handleSubmit}
        onInfoTooltip={onInfoTooltip}
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
        <span className="form__error user-name-error" id="user-name-error">
          {props.message}
        </span>
        <div className="modal__signin">
          <p>Уже зарегистрированы?</p>
          <Link to="/signin" className="modal__signin-link">
            Войти
          </Link>
        </div>
      </ModalWindows>
    </>
  );
}

export default Register;
