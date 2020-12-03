import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./home.css";

const Home = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { isLoggingOut, setIsLoggingOut } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push("/authentication");
      setIsLoggingOut(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [history, setIsLoggingOut]);

  return (
    <div className="home">
      <h1>{isLoggingOut ? t("home.seeYou") : t("home.welcome")}</h1>
    </div>
  );
};

export default Home;
