import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Image }from "../../components";
import { TutorialSolincaAuth1, TutorialSolincaAuth2, TutorialSolincaAuth3 } from "../../assets/images";
import "./help.css";

const Help = () => {
  const [t] = useTranslation();

  return (
    <Card className="page__card">
      <h3 className="page__card-title">{t("help.title")}</h3>
      <div className="help__content">
        <Card className="help__steps">
          <h4 className="help__steps-title">
            {t("help.getSolincaAuth.title")}
          </h4>
          <div className="help__step">
            <div>{t("help.getSolincaAuth.step1")}</div>
            <Image
              className="help__image"
              placeholderClass="help__image--placeholder"
              src={TutorialSolincaAuth1}
              alt="tutorial get Solinca Auth step1"
              isClickable={true}
            ></Image>
          </div>
          <div className="help__step">
            <div>{t("help.getSolincaAuth.step2")}</div>
            <Image
              className="help__image"
              placeholderClass="help__image--placeholder"
              src={TutorialSolincaAuth2}
              alt="tutorial get Solinca Auth step2"
              isClickable={true}
            ></Image>
          </div>
          <div className="help__step">
            <div>{t("help.getSolincaAuth.step3")}</div>
            <Image
              className="help__image"
              placeholderClass="help__image--placeholder"
              src={TutorialSolincaAuth3}
              alt="tutorial get Solinca Auth step3"
              isClickable={true}
            ></Image>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default Help;
