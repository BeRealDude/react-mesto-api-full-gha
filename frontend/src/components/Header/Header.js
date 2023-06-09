import { Link, Route, Routes } from "react-router-dom";

function Header(props) {
  const { onSignOut, infoUser, setLoggedIn } = props;

  return (
    <header className="header">
      <div className="logo logo_place_header"></div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="header__nav">
                <button onClick={onSignOut} className="header__signOut">
                  {setLoggedIn ? "Выйти" : ""}
                </button>
                <p className="header__email">{infoUser.email}</p>
              </div>
            </>
          }
        />

        <Route
          path="/signin"
          element={
            <Link to="/signup" className="header__signOut">
              Регистрация
            </Link>
          }
        />
        <Route
          path="/signup"
          element={
            <Link to="/signin" className="header__signOut">
              Войти
            </Link>
          }
        />
      </Routes>
      <div className="header__line"></div>
    </header>
  );
}

export default Header;
