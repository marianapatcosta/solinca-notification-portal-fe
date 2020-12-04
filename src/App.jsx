import React, { Suspense, useCallback, useState, useEffect, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./context/auth-context";
import { Header, LoadingSpinner } from "./components";
import "./App.css";

const About = lazy(() => import("./pages/about/about"));
const AvailableClasses = lazy(() => import("./pages/available-classes/available-classes"));
const Authentication = lazy(() => import("./pages/authentication/authentication"));
const Help = lazy(() => import("./pages/help/help"));
const Home = lazy(() => import("./pages/home/home"));
const ResetPassword = lazy(() => import("./pages/reset-password/reset-password"));
const UserData = lazy(() => import("./pages/user-data/user-data"));

function App() {
  const [t, i18n] = useTranslation();
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const routes = authToken ? (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/classes" exact>
        <AvailableClasses />
      </Route>
      <Route path="/configurations" exact>
        <UserData />
      </Route>
      <Route path="/help" exact>
        <Help />
      </Route>
      <Route path="/about" exact>
        <About />
      </Route>
      <Redirect to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/authentication" exact>
        <Authentication />
      </Route>
      <Route path="/reset-password/:userId/:tokenId" exact>
        <ResetPassword />
      </Route>
      <Route path="/help" exact>
        <Help />
      </Route>
      <Route path="/about" exact>
        <About />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  const login = useCallback((userId, authToken, username) => {
    setAuthToken(authToken);
    setUserId(userId);
    setUsername(username);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        authToken,
        username
      })
    );
  }, []);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    setAuthToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const storedUserPreferences = JSON.parse(localStorage.getItem("userPreferences"));
    storedUserPreferences && storedUserPreferences.language && i18n.changeLanguage(storedUserPreferences.language);;
    storedUserData &&
      storedUserData.authToken &&
      login(storedUserData.userId, storedUserData.authToken, storedUserData.username);
  }, [login, i18n]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!authToken,
        authToken,
        userId,
        username,
        isLoggingOut,
        setIsLoggingOut,
        login,
        logout,
      }}
    >
      <Router>
        <div className="app">
          <Header title={t("header.title")} />
          <div className="app__spacer">&nbsp;</div>
          <main className="app__page-content">
            <Suspense fallback={<LoadingSpinner />}>{routes}</Suspense>
          </main>
        </div>
        <footer className="app__footer">
          <div>
            <div>{t("footer.main")}</div>
            <div>{t("footer.secondary")}</div>
          </div>
        </footer>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
