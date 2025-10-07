import { createContext, useEffect, useState } from "react";
import Signin from "../components/signinSignUp/Signin";
import Signup from "../components/signinSignUp/Signup";
import ConfirmationForm from "../components/signinSignUp/ConfirmationForm";
import ForgotPassword from "../components/signinSignUp/ForgotPassword";
import FollowupAppointment from "../pages/followupAppointment/FollowupAppointment";
import Announcement from "../components/announcement/Announcement";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [formToShow, setFormToShow] = useState(null);
  const [messageFromMail, setMessageFromMail] = useState({
    message: null,
    email: null,
    password: "",
  });

  const [modalToShow, setModlToShow] = useState("");

  const [currentUser, setCurrentUser] = useState(() => {
    const storedData = localStorage.getItem("data");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [currUserType, setCurrUserType] = useState(null);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setCurrUserType(currentUser.acc_type);
    } else {
      setCurrUserType(null);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        setFormToShow,
        formToShow,
        setMessageFromMail,
        currentUser,
        setCurrentUser,
        setModlToShow,
        currUserType,
      }}
    >
      {children}

      {modalToShow === "follow-up" && <FollowupAppointment />}
      {modalToShow === "announcement" && <Announcement />}
      {formToShow === "signin" && <Signin />}
      {formToShow === "signup" && <Signup />}
      {formToShow === "forgot" && <ForgotPassword />}
      {formToShow === "confirm" && (
        <ConfirmationForm
          _message={messageFromMail.message}
          email={messageFromMail.email}
          password={messageFromMail.password}
        />
      )}
    </AuthContext.Provider>
  );
};
