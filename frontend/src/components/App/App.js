import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import PopupWithForm from "../PopupWithForm/PopupWithForm";
import ImagePopup from "../ImagePopup/ImagePopup";
import { api } from "../../utils/Api";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import EditProfilePopup from "../EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";

import Register from "../Register/Register";
import Login from "../Login/Login";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import * as auth from "../../utils/auth/auth";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import { useNavigate } from "react-router-dom";

function App() {
  const [isRegistration, setRegistration] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [infoUser, setInfoUser] = useState({
    email: "",
  });

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const [isInfoTooltip, setIsInfoTooltip] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  function tokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setInfoUser({
            email: res.data.email,
          });
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log("Ошибка", err);
        });
    }
  }

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInfo(), api.getCards()])
        .then(([info, data]) => {
          setCurrentUser(info);
          setCards(data);
        })
        .catch((err) => {
          console.log("Ошибка", err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck();
  }, []);

  function handleOpenInfoTooltip() {
    setIsInfoTooltip(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleDeletePopupClick() {
    setDeletePopupOpen(true);
  }

  function handleCardClick(data) {
    setSelectedCard(data);
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setDeletePopupOpen(false);
    setIsInfoTooltip(false);
    setSelectedCard({});
  }

  function handleSignOut() {
    localStorage.removeItem("jwt");
    navigate("/sign-up");
    setLoggedIn(false);
    setInfoUser({ email: "" });
  }

  function handleCardLike(data) {
    const isLiked = data.likes.some((i) => i._id === currentUser._id);
    console.log(isLiked);
    api
      .addLike(data._id, !isLiked)
      .then((data) => {
        setCards((state) => state.map((c) => (c._id === data._id ? data : c)));
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleCardDelete(data) {
    api
      .dltCard(data._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== data._id));
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleUpdateUser(info) {
    api
      .editInfo(info)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleUpdateAvatar(info) {
    api
      .editAvatar(info)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .addNewCard(data)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleRegister(info) {
    auth
      .register(info)
      .then(() => {
        setRegistration(true);
        setMessage("Вы успешно зарегистрировались!");
        handleOpenInfoTooltip();
        navigate("/sign-in");
      })
      .catch(() => {
        setMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setRegistration(false);
        handleOpenInfoTooltip();
        console.log("тултип ошибка");
      });
  }

  function handleLogin(info) {
    auth
      .authorize(info)
      .then((jwt) => {
        if (jwt) {
          setLoggedIn(true);
          setInfoUser({
            email: info.email,
          });
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        setMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setRegistration(false);
        handleOpenInfoTooltip();
        console.log("тултип ошибка");
      });
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          setLoggedIn={loggedIn}
          onSignOut={handleSignOut}
          infoUser={infoUser}
        />

        <Routes>
          <Route
            path="/sign-up"
            element={
              <Register
                onRegister={handleRegister}
                onError={message}
                onInfoTooltip={handleOpenInfoTooltip}
              />
            }
          />
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLogin} onError={message} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                component={Main}
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onDeletePopup={handleDeletePopupClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            }
          />

          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-up" />
            }
          />
        </Routes>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          data={{
            classSelector: "delete-popup",
            title: "Вы уверены?",
            user: "formDelete",
            submit: "Да",
          }}
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
        />

        <ImagePopup data={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
          message={message}
          isRegistration={isRegistration}
        />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
