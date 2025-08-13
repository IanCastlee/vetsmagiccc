import "./Signin.scss";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import ConfirmationForm from "./ConfirmationForm";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import Loader from "../loader/Loader";

//IMAGE
import catdog from "../../assets/imges/signinimaeg.png";
import logo from "../../assets/icons/vetmagic.png";

//ICONS
import { AiOutlineClose } from "react-icons/ai";

const Signin = () => {
  const [showLoader, setshowLoader] = useState(false);

  const { setFormToShow, errorMessage, setCurrentUser } =
    useContext(AuthContext);

  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorResponse, setErrorResponse] = useState(null);
  const [emptyEmail, setEmptyEmail] = useState("");
  const [emptyPassword, setEmptyPassword] = useState("");

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setEmptyEmail("");
    setEmptyPassword("");
    setErrorResponse(null);
    setSigninData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  ///signin
  const handleSignIn = async (e) => {
    e.preventDefault();

    setshowLoader(true);

    if (signinData.email === "" || signinData.password === "") {
      if (signinData.email === "") {
        setEmptyEmail("Email is required");
      }
      if (signinData.password === "") {
        setEmptyPassword("Password is required");
      }

      setshowLoader(false);
      return;
    }

    try {
      const res = await axiosIntance.post("client/auth/Signin.php", {
        email: signinData.email,
        password: signinData.password,
      });

      if (res.data.success) {
        setCurrentUser(res.data.data);
        setTimeout(() => {
          setshowLoader(false);

          if (res.data.userType === "client") {
            setFormToShow(null);
          } else if (res.data.userType === "veterinarian") {
            window.location.href = `/veterinarian/home/${res.data.uid}`;
          } else {
            window.location.href = `/admin/home/`;
          }
        }, 3000);
      } else {
        setErrorResponse(res.data.message);
        console.log("ERROR : ", res.data);
        setshowLoader(false);
      }
    } catch (error) {
      console.log("Error : ", error);
      setshowLoader(false);
    }
  };

  return (
    <>
      <div className="signin">
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
        >
          <div className="left">
            <div className="top">
              <img
                style={{ height: "100px" }}
                src={logo}
                alt="logo"
                className="logo"
              />

              <div className="signin-label-wrapper">
                <h3 className="h3">SIGN IN</h3>
                <span>to your VETSMAGIC account</span>
                <div className="div">
                  <strong>OR</strong>
                </div>{" "}
                <span
                  style={{ color: "blue" }}
                  className="sign-up-btn"
                  onClick={() => {
                    setFormToShow("signup");
                    nav;
                  }}
                >
                  SIGN UP
                </span>
              </div>
            </div>

            <div className="bot">
              <img src={catdog} alt="cat_and_dog" className="image-bg" />
            </div>
          </div>
          <div className="right">
            <span className="errorMessage">{errorResponse}</span>
            <div className="form">
              <div className="input-wrapper">
                <label
                  style={{ color: emptyEmail !== "" ? "red" : "" }}
                  htmlFor="email"
                >
                  {emptyEmail !== "" ? emptyEmail : "Email"}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  onChange={handleChangeData}
                />
              </div>
              <div className="input-wrapper">
                <label
                  style={{ color: emptyPassword !== "" ? "red" : "" }}
                  htmlFor="password"
                >
                  {emptyPassword !== "" ? emptyPassword : "Password"}
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  onChange={handleChangeData}
                />
              </div>

              <button className="btn-signin" onClick={handleSignIn}>
                SIGN IN
              </button>
              <div className="showpass-wrapper">
                <input
                  type="checkbox"
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span>Show password</span>
              </div>
              <div className="forgotpassword">
                <span onClick={() => setFormToShow("forgot")}>
                  Forgot passord
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <AiOutlineClose
          className="close-icon"
          onClick={() => setFormToShow(null)}
        />
      </div>

      {showConfirmationForm && (
        <ConfirmationForm close={() => setFormToShow(null)} />
      )}

      {showLoader && <Loader _label="Please wait..." />}
    </>
  );
};

export default Signin;
