import React, { Fragment, useContext, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Button, Card, Input, LoadingSpinner, Modal, Toast } from "../../components";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_PHONE_NUMBER,
} from "../../util/validators";
import { AuthContext } from "../../context/auth-context";
import { Hide, Show } from "../../assets/icons";
import { toastTypes, initialInputState } from "../constants";
import { encryptPassword, handleInputChange, handleInputTouch, toggleIsPasswordVisible } from "../../util/shared-methods";
import "./authentication.css";

const Authentication = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState(initialInputState);
  const [password, setPassword] = useState({
    ...initialInputState,
    isVisible: false,
  });
  const [solincaAuth, setSolincaAuth] = useState(initialInputState);
  const [email, setEmail] = useState(initialInputState);
  const [phoneNumber, setPhoneNumber] = useState({
    ...initialInputState,
    value: "+351",
    isRequired: false,
    isValid: true,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastData, setToastData] = useState({});

  const toggleShowLogin = () => {
    resetForm();
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  const onCloseModal = () => setErrorMessage("");

  const resetForm = () => {
    setUsername(initialInputState);
    setPassword(initialInputState);
    setSolincaAuth(initialInputState);
    setEmail(initialInputState);
    setPhoneNumber({
      ...initialInputState,
      value: "+351",
      isRequired: false,
      isValid: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    !showLogin
      ? submitSignUp()
      : (resetPassword
      ? submitResetPassword()
      : submitLogin());
  };

  const submitResetPassword = async () => {
    const isFormValid = email.isValid;
    if (!isFormValid) {
      setToastData({
        message: t("authentication.invalidData"),
        type: toastTypes.WARNING,
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/reset-password`,
        { email: email.value}
      );
      setToastData({
        message: t("authentication.resetPasswordSuccess"),
        type: toastTypes.SUCCESS,
      });
      setEmail(initialInputState);
      setResetPassword(false);
    } catch (error) {
      setErrorMessage(
        error.request.status === 403
          ? t("authentication.noEmailError")
          : t("authentication.resetPasswordError")
      );
      setIsLoading(false);
    }
  };

  const submitLogin = async () => {
    const isFormValid = !!username.value && !!password.value;
    if (!isFormValid) {
      setToastData({
        message: t("authentication.invalidData"),
        type: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/signin`,
        {
          username: username.value,
          password: encryptPassword(password.value),
        }
      );
      login(response.data.userId, response.data.token, response.data.username);
      history.push("/classes");
    } catch (error) {
      setErrorMessage(
        error.request.status === 403
          ? t("authentication.credentialsError")
          : t("authentication.loginError")
      );
      setIsLoading(false);
    }
  };

  const submitSignUp = async () => {
    const isFormValid =
      username.isValid &&
      password.isValid &&
      solincaAuth.isValid &&
      email.isValid &&
      phoneNumber.isValid;

    if (!isFormValid) {
      setToastData({
        message: t("authentication.invalidData"),
        type: toastTypes.WARNING,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
        {
          username: username.value,
          password: encryptPassword(password.value),
          solincaAuth: solincaAuth.value,
          email: email.value,
          phoneNumber: phoneNumber.value,
        }
      );
      login(response.data.userId, response.data.token, response.data.username);
    } catch (error) {
      setErrorMessage(
        error.request.status === 422
          ? t("authentication.existingUserError")
          : t("authentication.signUpError")
      );
      setIsLoading(false);
    }
  };

  const renderResetPasswordForm = () => {
    return (
      <div className="form__item">
        <Input
          id="email"
          type="email"
          label={t("authentication.email")}
          isRequired={email.isRequired}
          value={email.value}
          isInvalid={!email.isValid && email.isTouched}
          onChange={(event) =>
            handleInputChange(event.target.value, [VALIDATOR_EMAIL()], setEmail)
          }
          onBlur={() => handleInputTouch(setEmail)}
          errorText={t("authentication.emailError")}
        />
      </div>
    );
  };

  const renderLoginForm = () => {
    return (
      <Fragment>
        <div className="form__item">
          <Input
            id="username"
            label={t("authentication.username")}
            isRequired={username.isRequired}
            value={username.value}
            isInvalid={!username.isValid && username.isTouched}
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                [VALIDATOR_REQUIRE()],
                setUsername
              )
            }
            onBlur={() => handleInputTouch(setUsername)}
            errorText={t("authentication.usernameError")}
          />
        </div>
        <div className="form__item">
          <Input
            id="password"
            type={password.isVisible ? "text" : "password"}
            label={t("authentication.password")}
            isRequired={password.isRequired}
            value={password.value}
            isInvalid={!password.isValid && password.isTouched}
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                showLogin ? [VALIDATOR_REQUIRE()] : [VALIDATOR_MINLENGTH(8)],
                setPassword
              )
            }
            onBlur={() => handleInputTouch(setPassword)}
            errorText={t("authentication.passwordError", { characters: 8 })}
            icon={password.isVisible ? Hide : Show}
            onIconClick={() => toggleIsPasswordVisible(setPassword)}
          />
        </div>
        {showLogin && (
          <div className="form__item">
            <span className="link" onClick={() => setResetPassword(true)}>
              {t("authentication.forgotPassword")}
            </span>
          </div>
        )}
      </Fragment>
    );
  };

  const renderSignUpForm = () => {
    return (
      <div>
        {renderLoginForm()}
        <div className="form__item">
          <Input
            id="solincaAuth"
            label={t("authentication.solincaAuth")}
            link={
              <Link className="help-link" to={"/help"}>
                {t("authentication.howToGet")}
              </Link>
            }
            isRequired={solincaAuth.isRequired}
            value={solincaAuth.value}
            isInvalid={!solincaAuth.isValid && solincaAuth.isTouched}
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                [VALIDATOR_REQUIRE()],
                setSolincaAuth
              )
            }
            onBlur={() => handleInputTouch(setSolincaAuth)}
            errorText={t("authentication.solincaAuthError")}
          />
        </div>
        <div className="form__item">
          <Input
            id="email"
            type="email"
            label={t("authentication.email")}
            isRequired={email.isRequired}
            value={email.value}
            isInvalid={!email.isValid && email.isTouched}
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                [VALIDATOR_EMAIL()],
                setEmail
              )
            }
            onBlur={() => handleInputTouch(setEmail)}
            errorText={t("authentication.emailError")}
          />
        </div>
        <div className="form__item">
          <Input
            id="phoneNumber"
            label={t("authentication.phoneNumber")}
            isRequired={phoneNumber.isRequired}
            value={phoneNumber.value}
            isInvalid={
              phoneNumber.isTouched && !!phoneNumber.value.split("+351")[1]
                ? !phoneNumber.isValid
                : false
            }
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                [VALIDATOR_PHONE_NUMBER()],
                setPhoneNumber
              )
            }
            onBlur={() => handleInputTouch(setPhoneNumber)}
            errorText={t("authentication.phoneNumberError")}
          />
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return !showLogin
      ? renderSignUpForm()
      : resetPassword
      ? renderResetPasswordForm()
      : renderLoginForm();
  };

  const renderLabel = () => {
    return !showLogin
      ? t("authentication.signUp")
      : resetPassword
      ? t("authentication.resetPassword")
      : t("authentication.login");
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
        <h3 className="page__card-title">{renderLabel()}</h3>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className="form__item form__button">
            <Button
              label={renderLabel()}
              type="submit"
              size="large"
              onClick={handleSubmit}
            />
          </div>
        </form>
        {!resetPassword && (
          <span className="page__card-footer" onClick={toggleShowLogin}>
            {showLogin
              ? t("authentication.createAccount")
              : t("authentication.alreadyHaveAccount")}
          </span>
        )}
      </Card>
    </Fragment>
  );
};

export default Authentication;
