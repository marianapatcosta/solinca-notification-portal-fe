import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  Fragment,
} from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  DropdownMultiSelection,
  Input,
  LoadingSpinner,
  Modal,
  ToggleSwitch,
  Toast,
} from "../../components";
import { AuthContext } from "../../context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PHONE_NUMBER,
} from "../../util/validators";
import {
  CLASSES,
  NOTIFICATION_TYPES,
  toastTypes,
  initialInputState,
} from "../../constants";
import {
  encryptPassword,
  handleInputChange,
  handleInputTouch,
  isEventValid,
  toggleIsPasswordVisible,
} from "../../util/shared-methods";
import { Hide, Show } from "../../assets/icons";
import "./user-data.css";

const initialInputStatePassword = {
  ...initialInputState,
  isVisible: false,
};

const UserData = () => {
  const [t] = useTranslation();
  const { authToken, userId } = useContext(AuthContext);
  const [fetchedClubs, setFetchedClubs] = useState([]);
  const [fetchedOpenAirClubs, setFetchedOpenAirClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [selectedOpenAirClubs, setSelectedOpenAirClubs] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState(
    []
  );
  const [isWatcherOn, setIsWatcherOn] = useState(false);
  const [isOpenAirWatcherOn, setIsOpenAirWatcherOn] = useState(false);
  const [isNotificationRepeatOn, setIsNotificationRepeatOn] = useState(false);
  const [password, setPassword] = useState(initialInputStatePassword);
  const [confirmationPassword, setConfirmationPassword] = useState(
    initialInputStatePassword
  );
  const [oldPassword, setOldPassword] = useState(initialInputStatePassword);
  const [solincaAuth, setSolincaAuth] = useState(initialInputState);
  const [email, setEmail] = useState(initialInputState);
  const [phoneNumber, setPhoneNumber] = useState({
    ...initialInputState,
    value: "+351",
    isValid: true,
  });
  const [showUserDataForm, setShowUserDataForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastData, setToastData] = useState({});

  const fetchClubs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/club/locations`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFetchedClubs(
        response.data.locations.sort((a, b) => (a.name < b.name ? -1 : 1))
      );
    } catch (error) {
      setErrorMessage(t("userData.clubsError"));
    } finally {
      setIsLoading(false);
    }
  }, [authToken, t]);
    
  const fetchOpenAirClubs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/club/open-air-locations`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFetchedOpenAirClubs(
        response.data.locations.sort((a, b) => (a.name < b.name ? -1 : 1))
      );
    } catch (error) {
      setErrorMessage(t("userData.clubsError"));
    } finally {
      setIsLoading(false);
    }
  }, [authToken, t]);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const userData = response.data;
      setSelectedClasses(userData.classesToWatch);
      setSelectedClubs(userData.selectedClubs);
      setSelectedOpenAirClubs(userData.selectedOpenAirClubs);
      setSelectedNotificationTypes(userData.notificationTypes);
      userData.isWatcherOn && setIsWatcherOn(userData.isWatcherOn);
      userData.isOpenAirWatcherOn && setIsOpenAirWatcherOn(userData.isOpenAirWatcherOn);
      userData.isNotificationRepeatOn &&
        setIsNotificationRepeatOn(userData.isNotificationRepeatOn);
      userData.email &&
        setEmail((prevEmail) => ({ ...prevEmail, value: userData.email }));
      userData.phoneNumber &&
        setPhoneNumber((prevPhoneNumber) => ({
          ...prevPhoneNumber,
          value: userData.phoneNumber,
        }));
    } catch (error) {
      setErrorMessage(t("userData.userDataError"));
    } finally {
      setIsLoading(false);
    }
  }, [authToken, t, userId]);

  useEffect(() => {
    fetchUserData();
    fetchClubs();
    fetchOpenAirClubs();
  }, [fetchUserData, fetchClubs, fetchOpenAirClubs]);

  const handleDropdownMultiSelectionClick = (
    clickedItem,
    selectedItemsCollection,
    setter,
    labelKey
  ) => {
    const isItemSelected = selectedItemsCollection.includes(clickedItem);
    isItemSelected
      ? setter((prevCollectionState) =>
          prevCollectionState.filter((item) =>
            labelKey
              ? item[labelKey] !== clickedItem[labelKey]
              : item !== clickedItem
          )
        )
      : setter((prevCollectionState) => [...prevCollectionState, clickedItem]);
  };

  const handleToggleVariable = (setter) => setter((prevValue) => !prevValue);

  const getSubmitPreferencesBody = () => ({
    classesToWatch: selectedClasses,
    selectedClubs,
    selectedOpenAirClubs,
    notificationTypes: selectedNotificationTypes,
    isWatcherOn,
    isOpenAirWatcherOn,
    isNotificationRepeatOn,
  });

  const getSubmitUserDataBody = () => {
    const body = {};
    !!password.value && (body.password = encryptPassword(password.value));
    !!oldPassword.value &&
      (body.oldPassword = encryptPassword(oldPassword.value));
    !!solincaAuth.value && (body.solincaAuth = solincaAuth.value);
    !!email.value && (body.email = email.value);
    !!phoneNumber.value && (body.phoneNumber = phoneNumber.value);
    return body;
  };

  const getIsFormValid = () => {
    if (!!solincaAuth.isTouched && !!solincaAuth.value && !solincaAuth.isValid)
      return false;
    if (!!email.isTouched && !!email.value && !email.isValid) return false;
    if (!!phoneNumber.isTouched && !!phoneNumber.value && !phoneNumber.isValid)
      return false;

    if (showChangePassword && !!password.value) {
      if (!password.isValid) return false;
      if (!oldPassword.isValid) return false;
      if (!confirmationPassword.isValid) return false;
      if (confirmationPassword.value !== password.value) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = showUserDataForm
      ? getSubmitUserDataBody()
      : getSubmitPreferencesBody();
    const isFormValid = showUserDataForm ? getIsFormValid() : true;

    if (!isFormValid) {
      setToastData({
        message: t("userData.invalidData"),
        type: toastTypes.WARNING,
      });
      return;
    }

    if (
      !phoneNumber.value &&
      selectedNotificationTypes.includes(NOTIFICATION_TYPES[1])
    ) {
      setErrorMessage(t("userData.whatsAppNotificationError"));
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/user/${userId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setToastData({
        message: t("userData.success"),
        type: toastTypes.SUCCESS,
      });
      fetchUserData();
      if (showChangePassword) resetPasswordsForm();
    } catch (error) {
      setErrorMessage(
        error.request.status === 403
          ? t("userData.wrongOldPassword")
          : t("userData.submissionError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordsForm = () => {
    setPassword(initialInputStatePassword);
    setOldPassword(initialInputStatePassword);
    setConfirmationPassword(initialInputStatePassword);
  };

  const onCloseModal = () => {
    setErrorMessage("");
  };

  const renderUserPreferencesForm = () => {
    return (
      <Fragment>
        <div className="form__item form__toggle">
          <ToggleSwitch
            label={t("userData.watchClasses")}
            isOn={isWatcherOn}
            style={{ justifyContent: "space-between" }}
            handleToggle={() => handleToggleVariable(setIsWatcherOn)}
          />
        </div>
        <div className="form__item form__toggle">
          <ToggleSwitch
            label={t("userData.watchOpenAirClasses")}
            isOn={isOpenAirWatcherOn}
            style={{ justifyContent: "space-between" }}
            handleToggle={() => handleToggleVariable(setIsOpenAirWatcherOn)}
          />
        </div>
        <div className="form__item form__toggle">
          <ToggleSwitch
            label={t("userData.repeatNotifications")}
            isOn={isNotificationRepeatOn}
            style={{ justifyContent: "space-between" }}
            handleToggle={() => handleToggleVariable(setIsNotificationRepeatOn)}
          />
        </div>
          <div className="form__item">
            <DropdownMultiSelection
              disabled={!isWatcherOn && !isOpenAirWatcherOn}
              options={NOTIFICATION_TYPES}
              selectedOptions={selectedNotificationTypes}
              title={t("userData.notifiedBy")}
              onOptionClick={(clickedItem) =>
                handleDropdownMultiSelectionClick(
                  clickedItem,
                  selectedNotificationTypes,
                  setSelectedNotificationTypes
                )
              }
            />
          </div>
          <div className="form__item">
            <DropdownMultiSelection
              disabled={!isWatcherOn}
              options={fetchedClubs}
              selectedOptions={selectedClubs}
              title={t("userData.selectClubs")}
              labelKey="name"
              onOptionClick={(clickedItem) =>
                handleDropdownMultiSelectionClick(
                  clickedItem,
                  selectedClubs,
                  setSelectedClubs,
                  "name"
                )
            }
          />
        </div>
        <div className="form__item">
          <DropdownMultiSelection
            disabled={!isOpenAirWatcherOn}
            options={fetchedOpenAirClubs}
            selectedOptions={selectedOpenAirClubs}
            title={t("userData.selectOpenAirClubs")}
            labelKey="name"
            onOptionClick={(clickedItem) =>
              handleDropdownMultiSelectionClick(
                clickedItem,
                selectedOpenAirClubs,
                setSelectedOpenAirClubs,
                "name"
              )
            }
          />
        </div>
        <div className="form__item">
          <DropdownMultiSelection
            disabled={!isWatcherOn && !isOpenAirWatcherOn}
            options={CLASSES.sort()}
            selectedOptions={selectedClasses}
            title={t("userData.selectClasses")}
            onOptionClick={(clickedItem) =>
              handleDropdownMultiSelectionClick(
                clickedItem,
                selectedClasses,
                setSelectedClasses
              )
            }
          />
        </div>
      </Fragment>
    );
  };

  const renderUserInfoForm = () => {
    return (
      <Fragment>
        <div className="form__item">
          <Input
            id="solincaAuth"
            label={t("userData.solincaAuth")}
            value={solincaAuth.value}
            isInvalid={
              solincaAuth.isTouched && !!solincaAuth.value
                ? !solincaAuth.isValid
                : false
            }
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                [VALIDATOR_REQUIRE()],
                setSolincaAuth
              )
            }
            onBlur={() => handleInputTouch(setSolincaAuth)}
            errorText={t("userData.solincaAuthError")}
          />
        </div>
        <div className="form__item">
          <Input
            id="email"
            type="email"
            label={t("userData.email")}
            value={email.value}
            isInvalid={
              email.isTouched && !!email.value ? !email.isValid : false
            }
            onChange={(event) =>
              handleInputChange(
                event.target.value,
                [VALIDATOR_EMAIL()],
                setEmail
              )
            }
            onBlur={() => handleInputTouch(setEmail)}
            errorText={t("userData.emailError")}
          />
        </div>
        <div className="form__item">
          <Input
            id="phoneNumber"
            label={t("userData.phoneNumber")}
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
            errorText={t("userData.phoneNumberError")}
          />
        </div>
        {showChangePassword ? (
          <Fragment>
            <div className="form__item">
              <Input
                id="old-password"
                type={oldPassword.isVisible ? "text" : "password"}
                label={t("userData.oldPassword")}
                isRequired={oldPassword.isRequired}
                value={oldPassword.value}
                isInvalid={!oldPassword.isValid && oldPassword.isTouched}
                onChange={(event) =>
                  handleInputChange(
                    event.target.value,
                    [VALIDATOR_REQUIRE()],
                    setOldPassword
                  )
                }
                onBlur={() => handleInputTouch(setOldPassword)}
                errorText={t("userData.oldPasswordError", { characters: 8 })}
                icon={oldPassword.isVisible ? Hide : Show}
                onIconClick={() => toggleIsPasswordVisible(setOldPassword)}
              />
            </div>
            <div className="form__item">
              <Input
                id="password"
                type={password.isVisible ? "text" : "password"}
                label={t("userData.newPassword")}
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
                label={t("userData.confirmationPassword")}
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
                errorText={t("userData.confirmationPasswordError", {
                  characters: 8,
                })}
                icon={confirmationPassword.isVisible ? Hide : Show}
                onIconClick={() =>
                  toggleIsPasswordVisible(setConfirmationPassword)
                }
              />
            </div>
          </Fragment>
        ) : (
          <div className="form__item">
            <span
              className="link"
              onClick={() => handleToggleVariable(setShowChangePassword)}
            >
              {t("userData.changePassword")}
            </span>
          </div>
        )}
      </Fragment>
    );
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card className="page__card page__card--relative">
          {toastData.message && <Toast {...toastData} onClean={setToastData} />}
          <h3 className="page__card-title">
            {!showUserDataForm
              ? t("userData.choosePreferences")
              : t("userData.editYourPersonalInfo")}
          </h3>
          <form onSubmit={handleSubmit}>
            {!showUserDataForm
              ? renderUserPreferencesForm()
              : renderUserInfoForm()}
            <div className="form__item form__button">
              <Button
                label={
                  !showUserDataForm
                    ? t("userData.submitPreferences")
                    : t("userData.submitUserData")
                }
                type="submit"
                size="large"
                onClick={handleSubmit}
              />
            </div>
            <span
              role="button"
              tabIndex="0"
              className="page__card-footer"
              onClick={() => handleToggleVariable(setShowUserDataForm)}
              onKeyDown={(event) =>
                isEventValid(event) && handleToggleVariable(setShowUserDataForm)
              }
            >
              {!showUserDataForm
                ? t("userData.editPersonalInfo")
                : t("userData.editUserPreferences")}
            </span>
          </form>
        </Card>
      )}
    </Fragment>
  );
};

export default UserData;
