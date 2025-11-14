import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import "./ForgotPassword.scss";

//IMAGE
import catdog from "../../assets/imges/signinimaeg.png";
import logo from "../../assets/icons/vetmagic.png";

//ICONS
import axiosIntance from "../../../axios";
import Loader from "../loader/Loader";
import { AiOutlineClose } from "react-icons/ai";

const ForgotPassword = () => {
  const { setFormToShow, setMessageFromMail } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setshowLoader] = useState(false);

  const [confirm, setConfirm] = useState({
    email: "",
    npassword: "",
    cpassword: "",
  });

  const [emptyEmail, setEmptyEmail] = useState("");
  const [emptyNPassword, setEmptyNPassword] = useState("");
  const [emptyCPassword, setEmptyCPassword] = useState("");

  const handleChangeData = (e) => {
    const { name, value } = e.target;

    setConfirm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setshowLoader(true);

    // Clear previous errors
    setEmptyEmail("");
    setEmptyNPassword("");
    setEmptyCPassword("");

    // Empty fields check
    if (
      confirm.email === "" ||
      confirm.npassword === "" ||
      confirm.cpassword === ""
    ) {
      if (confirm.email === "") {
        setEmptyEmail("Email is required");
      }
      if (confirm.npassword === "") {
        setEmptyNPassword("New Password is required");
      }
      if (confirm.cpassword === "") {
        setEmptyCPassword("Confirm your New Password");
      }

      setshowLoader(false);
      return;
    }

    // Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(confirm.email)) {
      setEmptyEmail("Please enter a valid email address.");
      setshowLoader(false);
      return;
    }

    // Password match check
    if (confirm.npassword !== confirm.cpassword) {
      setEmptyCPassword("Passwords and confirm password do not match.");
      setshowLoader(false);
      return;
    }

    // Password strength validation
    const passwordCriteria = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordCriteria.test(confirm.npassword)) {
      setEmptyNPassword(
        "Password must be at least 8 characters long and include a capital letter and a number."
      );
      setshowLoader(false);
      return;
    }

    // Submit to server
    try {
      const res = await axiosIntance.post("client/auth/forgotpassword.php", {
        email: confirm.email,
        password: confirm.cpassword,
      });

      if (res.data.success) {
        setTimeout(() => {
          setshowLoader(false);
          setMessageFromMail({
            message: res.data.message,
            email: res.data.email,
            password: confirm.cpassword,
          });
          setFormToShow("confirm");
        }, 2000);
      } else {
        setshowLoader(false);
        setEmptyEmail(res.data.message);
        console.log("ERROR : ", res.data);
      }
    } catch (error) {
      setshowLoader(false);
      console.log("Error : ", error);
    }
  };

  return (
    <>
      <div className="forgotpass">
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
        >
          <div className="left">
            <div className="top">
              <img src={logo} alt="logo" className="logo" />

              <div className="signin-label-wrapper">
                <h3 className="h3">ACCOUNT RECOVERY</h3>

                <span
                  className="sign-up-btn"
                  onClick={() => {
                    setFormToShow("signin");
                    nav;
                  }}
                >
                  Back
                </span>
              </div>
            </div>

            <div className="bot">
              <img src={catdog} alt="cat_and_dog" className="image-bg" />
            </div>
          </div>
          <div className="right">
            <div className="form">
              <div className="input-wrapper">
                <label
                  style={{ color: emptyEmail ? "red" : "" }}
                  htmlFor="email"
                >
                  {emptyEmail || "Email"}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={confirm.email}
                  onChange={(e) => {
                    handleChangeData(e);
                    setEmptyEmail("");
                  }}
                />
              </div>

              <div className="input-wrapper">
                <label
                  style={{ color: emptyNPassword ? "red" : "" }}
                  htmlFor="npassword"
                >
                  {emptyNPassword || "New Password"}
                </label>
                <input
                  id="npassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  name="npassword"
                  value={confirm.npassword}
                  onChange={(e) => {
                    handleChangeData(e);
                    setEmptyNPassword("");
                  }}
                />
              </div>

              <div className="input-wrapper">
                <label
                  style={{ color: emptyCPassword ? "red" : "" }}
                  htmlFor="cpassword"
                >
                  {emptyCPassword || "Confirm Password"}
                </label>
                <input
                  id="cpassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="cpassword"
                  value={confirm.cpassword}
                  onChange={(e) => {
                    handleChangeData(e);
                    setEmptyCPassword("");
                  }}
                />
              </div>

              <button className="btn-signin" onClick={handleSubmit}>
                SUBMIT
              </button>

              <div className="showpass-wrapper">
                <input
                  type="checkbox"
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span>Show password</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {showLoader && <Loader _label="Please wait..." />}

      <AiOutlineClose
        className="close-iconn"
        onClick={() => setFormToShow(null)}
      />
    </>
  );
};

export default ForgotPassword;
