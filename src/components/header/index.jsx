import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Emoji, ToggleSwitch } from "../";
import { AuthContext } from "../../context/auth-context";
import { Home } from "../../assets/icons";
import { PtFlag, UkFlag } from "../../assets/images";
import "./index.css";
import { isEventValid } from "../../util/shared-methods";

const languages = {
  EN: "en",
  PT: "pt",
};

const themes = {
  DARK: "dark",
  LIGHT: "light",
};

const Header = ({ title }) => {
  const { isLoggedIn, logout, username } = useContext(AuthContext);
  const [t, i18n] = useTranslation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const sideMenuRef = useRef();
  const hamburgerMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const element = event.target;

      if (
        sideMenuRef.current &&
        !hamburgerMenuRef.current.contains(element) &&
        !sideMenuRef.current.contains(element)
      ) {
        event.preventDefault();
        event.stopPropagation();
        setIsMenuOpened(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [sideMenuRef]);

  const toggleMode = () => {
    setIsDarkTheme((prevIsDarkTheme) => !prevIsDarkTheme);
    const storedData = JSON.parse(localStorage.getItem("userPreferences"));
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        ...storedData,
        isDarkTheme,
      })
    );
  };

  const toggleOpenMenu = () =>
    setIsMenuOpened((prevIsMenuOpened) => !prevIsMenuOpened);

  const setTheme = useCallback(() => {
    isDarkTheme
      ? document.documentElement.setAttribute("theme", themes.DARK)
      : document.documentElement.setAttribute("theme", themes.LIGHT);
  }, [isDarkTheme]);

  const changeLanguage = useCallback(
    (event, language) => {
      if (isEventValid(event)) {
        const storedData = JSON.parse(localStorage.getItem("userPreferences"));
        i18n.changeLanguage(language);
        localStorage.setItem(
          "userPreferences",
          JSON.stringify({
            ...storedData,
            language,
          })
        );
      }
    },
    [i18n]
  );

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userPreferences"));
    storedData &&
      storedData.isDarkTheme &&
      setIsDarkTheme(storedData.isDarkTheme);
  }, []);

  useEffect(() => {
    setTheme();
  }, [isDarkTheme, setTheme]);

  const renderNavLinks = () => {
    return (
      <div className="header__links">
        <NavLink
          className="header__link"
          activeClassName="header__link--active"
          to="/"
          exact
        >
          <img className="header__link--icon" src={Home} alt="home" />
        </NavLink>
        {isLoggedIn ? (
          <Fragment>
            <NavLink
              className="header__link"
              activeClassName="header__link--active"
              to="/classes"
              exact
            >
              {t("header.availableClasses")}
            </NavLink>
            <NavLink
              className="header__link"
              activeClassName="header__link--active"
              to="/configurations"
            >
              {t("header.configurations")}
            </NavLink>
          </Fragment>
        ) : (
          <NavLink
            className="header__link"
            activeClassName="header__link--active"
            to="/authentication"
            exact
          >
            {t("header.authentication")}
          </NavLink>
        )}
        <NavLink
          className="header__link"
          activeClassName="header__link--active"
          to="/help"
          exact
        >
          {t("header.help")}
        </NavLink>
        <NavLink
          className="header__link"
          activeClassName="header__link--active"
          to="/about"
          exact
        >
          {t("header.about")}
        </NavLink>
      </div>
    );
  };

  const renderPreferences = () => {
    return (
      <div className="header__preferences">
        <ToggleSwitch
          isOn={isDarkTheme}
          leftLabel={<Emoji label="sun" emoji="☀️" />}
          rightLabel={<Emoji label="moon" emoji="🌙" />}
          handleToggle={toggleMode}
        />
        <div className="header__flags-container">
          <img
            className="header__flag"
            role="button"
            tabIndex="0"
            src={UkFlag}
            alt="uk flag"
            onClick={(event) => changeLanguage(event, languages.EN)}
            onKeyDown={(event) => changeLanguage(event, languages.EN)}
          />
          <img
            className="header__flag"
            role="button"
            tabIndex="0"
            src={PtFlag}
            alt="pt flag"
            onClick={(event) => changeLanguage(event, languages.PT)}
            onKeyDown={(event) => changeLanguage(event, languages.PT)}
          />
        </div>
      </div>
    );
  };

  return (
    <header className="header">
      <div
        className="header__hamburger-menu"
        ref={hamburgerMenuRef}
        onClick={toggleOpenMenu}
      >
        <span />
        <span />
        <span />
      </div>
      <h2 className="header__title">
        <Link className="header__title--link" to="/">
          {title}
        </Link>
      </h2>
      <div
        className={`header__side-menu ${
          isMenuOpened ? "header__side-menu--opened" : ""
        }`}
        ref={sideMenuRef}
      >
        {isMenuOpened && (
          <Fragment>
            {isLoggedIn && (
              <div className="header__user--mobile">{`${t(
                "header.hello"
              )}${username}`}</div>
            )}
            {renderNavLinks()}
            {renderPreferences()}
            {isLoggedIn && (
              <div className="header__logout" onClick={logout}>
                {t("header.logout")}
              </div>
            )}
          </Fragment>
        )}
      </div>
      <div className="header__content">
        {renderNavLinks()}
        <div className="header__right-side">
          <div className="header__right-side-top">
            {isLoggedIn && (
              <div className="header__user">{`${t(
                "header.hello"
              )}${username}`}</div>
            )}
            {renderPreferences()}
          </div>
          {isLoggedIn && (
            <span className="header__logout" onClick={logout}>
              {t("header.logout")}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
