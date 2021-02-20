import React, { useState, Fragment } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { Button, Card, Input, LoadingSpinner, Modal, Toast } from "../../components";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../util/validators";
import { initialInputState, toastTypes } from "../../constants";
import { handleInputTouch, handleInputChange, encryptPassword } from "../../util/shared-methods";
import { Hide, Show } from "../../assets/icons";
import "./reset-password.css";

const initialInputStatePassword = {
  ...initialInputState,
  isVisible: false,
};

const ResetPassword = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const userId = useParams().userId;
  const resetPasswordToken = useParams().tokenId;
  const [password, setPassword] = useState(initialInputStatePassword);
  const [confirmationPassword, setConfirmationPassword] = useState(
    initialInputStatePassword
  );
  const [isLoading, setIsLoading] = useState(false);
  const [toastData, setToastData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const toggleIsPasswordVisible = (setter) =>
    setter((prevPassword) => ({
      ...prevPassword,
      isVisible: !prevPassword.isVisible,
    }));

  const resetPasswordsForm = () => {
    setPassword(initialInputStatePassword);
    setConfirmationPassword(initialInputStatePassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid =
      password.isValid && password.value === confirmationPassword.value;

    if (!isFormValid) {
      setToastData({
        message: t("resetPassword.invalidData"),
        type: toastTypes.WARNING,
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/restore-password`, {
        userId,
        resetPasswordToken,
        password: encryptPassword(password.value),
      });
      setToastData({
        message: t("resetPassword.success"),
        type: toastTypes.SUCCESS,
      });
      resetPasswordsForm();
      setTimeout(() => history.push("/authentication"), 2000);
    } catch (error) {
      setErrorMessage(
        error.request.status === 403
          ? t("resetPassword.invalidLink")
          : t("resetPassword.submissionError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseModal = () => {
    setErrorMessage("");
  };

  return (
    <Fragment>
      {errorMessage && (
        <Modal
          header={t("modal.header")}
          onClose={onCloseModal}
          buttonLabel={t("modal.ok")}
          message={errorMessage}
        />
      )}
      {isLoading && <LoadingSpinner />}
      <Card className="page__card page__card--relative">
        {toastData.message && <Toast {...toastData} onClean={setToastData} />}
        <h3 className="page__card-title">{t("resetPassword.resetPassword")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form__item">
            <Input
              id="password"
              type={password.isVisible ? "text" : "password"}
              label={t("resetPassword.newPassword")}
              isRequired={password.isRequired}
              value={password.value}
              isInvalid={!password.isValid && password.isTouched}
              onChange={(event) =>
                handleInputChange(
                  event.target.value,
                  [VALIDATOR_MINLENGTH(8)],
                  setPassword
                )
              }
              onBlur={() => handleInputTouch(setPassword)}
              errorText={t("userData.newPasswordError", { characters: 8 })}
              icon={password.isVisible ? Hide : Show}
              onIconClick={() => toggleIsPasswordVisible(setPassword)}
            />
          </div>
          <div className="form__item">
            <Input
              id="confirmation-password"
              type={confirmationPassword.isVisible ? "text" : "password"}
              label={t("resetPassword.confirmationPassword")}
              isRequired={confirmationPassword.isRequired}
              value={confirmationPassword.value}
              isInvalid={
                confirmationPassword.isTouched &&
                (!confirmationPassword.isValid ||
                  confirmationPassword.value !== password.value)
              }
              onChange={(event) =>
                handleInputChange(
                  event.target.value,
                  [VALIDATOR_REQUIRE()],
                  setConfirmationPassword
                )
              }
              onBlur={() => handleInputTouch(setConfirmationPassword)}
              errorText={t("resetPassword.confirmationPasswordError", {
                characters: 8,
              })}
              icon={confirmationPassword.isVisible ? Hide : Show}
              onIconClick={() =>
                toggleIsPasswordVisible(setConfirmationPassword)
              }
            />
          </div>
          <div className="form__item form__button">
            <Button
              label={t("resetPassword.resetPassword")}
              type="submit"
              size="large"
              onClick={handleSubmit}
            />
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default ResetPassword;
