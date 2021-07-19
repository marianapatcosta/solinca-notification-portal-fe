import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Card, LoadingSpinner, Modal} from "../../components";
import { AuthContext } from "../../context/auth-context";
import "./available-classes.css";

const AvailableClasses = () => {
  const [t] = useTranslation();
  const { authToken } = useContext(AuthContext);
  const [matchedAvailableClasses, setMatchedAvailableClasses] = useState([]);
  const [openAirMatchedAvailableClasses, setOpenAirMatchedAvailableClasses] = useState([]);
  const [otherAvailableClasses, setOtherAvailableClasses] = useState([]);
  const [otherOpenAirAvailableClasses, setOtherOpenAirAvailableClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/club/classes`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const classesData = response.data;
      setMatchedAvailableClasses(classesData.matchedClasses);
      setOtherAvailableClasses(classesData.otherClasses);
    } catch (error) {
      setErrorMessage(t("availableClasses.classesError"));
    } finally {
      setIsLoading(false);
    }
  }, [authToken, t]);

  const fetchOpenAirClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/club/open-air-classes`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const classesData = response.data;
      setOpenAirMatchedAvailableClasses(classesData.matchedClasses);
      setOtherOpenAirAvailableClasses(classesData.otherClasses);
    } catch (error) {
      setErrorMessage(t("availableClasses.classesError"));
    } finally {
      setIsLoading(false);
    }
  }, [authToken, t]);


  useEffect(() => {
    fetchClasses();
    fetchOpenAirClasses()
  }, [fetchClasses, fetchOpenAirClasses]);

  const areClassesAvailable = (classes) => {
    return !classes.every(
      ({ today, tomorrow }) => !today.length && !tomorrow.length
    );
  };

  const uniformizeDescription = (description) => {
    description = description.split(/ -(.+)/);
    description = description[1]
      ? description[1].split(" ")
      : description[0].split(" ");

    return description
      .map((word) => {
        if (word.match("^[0-9]+[a-zA-Z]$"))
          return `${word.slice(0, 2)}${word.slice(2).toLowerCase()}`;
        if (word.match("[a-zA-Z]"))
          return `${word.charAt(0)}${word.slice(1).toLowerCase()}`;
        return word;
      })
      .join(" ");
  };

  const onCloseModal = () => {
    setErrorMessage("");
  };

  const renderClassesCard = (title, classes) => (
      <Card className="page__card">
        {errorMessage && (
          <Modal
            header={t("modal.header")}
            onClose={onCloseModal}
            buttonLabel={t("modal.ok")}
            message={errorMessage}
          />
        )}
        <h3 className="page__card-title available-classes__title">{title}</h3>
        {!areClassesAvailable(classes) ? (
          <div className="available-classes__club-detail-item">
            {t("availableClasses.noFavoriteClassesAvailable")}
          </div>
        ) : (
          classes.map(renderClassesInfo)
        )}
      </Card>
    );

  const renderClassesInfo = ({ club, today, tomorrow }, index) => {
    return (
      (!!today.length || !!tomorrow.length) && (
        <Card
          className="available-classes__per-club"
          key={index * Math.random()}
        >
          <h4 className="available-classes__club-title">{club}</h4>
          <div className="available-classes__club">
            <Fragment>
              {renderClassesInfoPerDay(today, t("availableClasses.today"))}
              {renderClassesInfoPerDay(
                tomorrow,
                t("availableClasses.tomorrow")
              )}
            </Fragment>
          </div>
        </Card>
      )
    );
  };

  const renderClassesInfoPerDay = (dayInfo, dayTitle) => {
    return (
      <div className="available-classes__club-detail">
        <h5>{dayTitle}</h5>
        {dayInfo.length === 0 ? (
          <div className="available-classes__club-detail-item">
            {t("availableClasses.noFavoriteClasses", {
              day: dayTitle.toLowerCase(),
            })}
          </div>
        ) : (
          dayInfo.map((info, index) => (
            <div
              className="available-classes__club-detail-item"
              key={index * Math.random()}
            >
              {uniformizeDescription(info.description)}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          {renderClassesCard(
            t("availableClasses.favoriteClasses"),
            matchedAvailableClasses
          )}
          {renderClassesCard(
            t("availableClasses.favoriteOpenAirClasses"),
            openAirMatchedAvailableClasses
          )}
          {renderClassesCard(
            t("availableClasses.otherClasses"),
            otherAvailableClasses
          )}
          {renderClassesCard(
            t("availableClasses.otherOpenAirClasses"),
            otherOpenAirAvailableClasses
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default AvailableClasses;
