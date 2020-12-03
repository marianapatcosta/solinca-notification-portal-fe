import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/card/card";
import "./about.css";

const About = () => {
  const [t] = useTranslation();

  return (
    <Card className="page__card">
      <h3 className="page__card-title">{t("about.title")}</h3>
      <div className="about__content">{t("about.description")}</div>
    </Card>
  );
};

export default About;
