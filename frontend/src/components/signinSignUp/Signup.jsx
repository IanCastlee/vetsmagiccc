import "./Signup.scss";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import TermsAndCondations from "../termsAndCondations/TermsAndCondations";

//IMAGE
import catdog from "../../assets/imges/signinimaeg.png";
import logo from "../../assets/icons/vetmagic.png";

//ICONS
import { AiOutlineClose } from "react-icons/ai";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import Signin from "./Signin";
import axiosIntance from "../../../axios";
import Loader from "../loader/Loader";
import Toaster from "../toaster/Toaster";
import { AuthContext } from "../../contexts/AuthContext";

const Signup = () => {
  const { setFormToShow, setMessageFromMail, password } =
    useContext(AuthContext);
  const [formToShow, setformToShow] = useState("1");
  const [showSignInForm, setshowSignInForm] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const [toasterMessage, setToasterMessage] = useState(null);

  const [showTerms, setShowTerms] = useState(false);
  const [agree, setAgree] = useState(true);
  const [showTermsNote, setShowTermsNote] = useState(false);

  const [emptyFirstname, setEmptyFirstname] = useState("");
  const [emptyLastname, setEmptyLastname] = useState("");
  const [emptySuffix, setEmptySuffix] = useState("");
  const [emptyAddress, setEmptyAddress] = useState("");
  const [emptyPhone, setEmptyPhone] = useState("");
  const [emptyEmail, setEmptyEmail] = useState("");
  const [emptyPassword, setEmptyPassword] = useState("");
  const [emptyCPassword, setEmptyCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [signUpdata, setSignUptData] = useState({
    firstname: "",
    lastname: "",
    suffix: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleSignUpDataChange = (e) => {
    const { name, value } = e.target;

    setEmptyFirstname("");
    setEmptyLastname("");
    setEmptySuffix("");
    setEmptyAddress("");
    setEmptyPhone("");
    setEmptyEmail("");
    setEmptyPassword("");
    setEmptyCPassword("");

    setSignUptData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    let hasError = false;

    // Reset previous error messages
    setEmptyFirstname("");
    setEmptyLastname("");
    setEmptyAddress("");
    setEmptyPhone("");

    // Check for empty fields
    if (signUpdata.firstname === "") {
      setEmptyFirstname("Firstname is required");
      hasError = true;
    }
    if (signUpdata.lastname === "") {
      setEmptyLastname("Lastname is required");
      hasError = true;
    }

    if (signUpdata.address === "") {
      setEmptyAddress("Address is required");
      hasError = true;
    }

    if (signUpdata.phone === "") {
      setEmptyPhone("Phone is required");
      hasError = true;
    } else if (!/^[0-9]{10}$/.test(signUpdata.phone)) {
      setEmptyPhone("Phone must be exactly 10 digits");
      hasError = true;
    }

    if (hasError) return;

    // If all validations pass
    setformToShow("2");
  };

  //SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setshowLoader(true);
    if (
      signUpdata.email === "" ||
      signUpdata.password === "" ||
      signUpdata.cpassword === ""
    ) {
      if (signUpdata.email === "") {
        setEmptyEmail("Email is required");
      }
      if (signUpdata.password === "") {
        setEmptyPassword("Password is required");
      }
      if (signUpdata.cpassword === "") {
        setEmptyCPassword("Confirm your password");
      }

      setshowLoader(false);
      return;
    }

    // Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(signUpdata.email)) {
      setEmptyEmail("Please enter a valid Gmail address.");

      setshowLoader(false);
      return;
    }

    if (signUpdata.password !== signUpdata.cpassword) {
      setEmptyCPassword("Passwords and confirm password not matched!");

      setshowLoader(false);

      return;
    }

    const passwordCriteria = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (!passwordCriteria.test(signUpdata.password)) {
      setEmptyPassword(
        "Password must be at least 8 characters long and include a capital letter and a number."
      );
      setshowLoader(false);

      return;
    }

    if (!agree) {
      setShowTermsNote(true);

      setshowLoader(false);

      setTimeout(() => {
        setShowTermsNote(false);
      }, 3000);
      return;
    }

    try {
      const fullname = `${signUpdata.firstname} ${signUpdata.lastname}${
        signUpdata.suffix ? ` ${signUpdata.suffix}` : ""
      }`;

      const res = await axiosIntance.post("client/auth/signup.php", {
        fullname: fullname,
        address: signUpdata.address,
        phone: `+63${signUpdata.phone}`,
        email: signUpdata.email,
        password: signUpdata.cpassword,
      });
      if (res.data.success) {
        setSignUptData({
          firstname: "",
          lastname: "",
          suffix: "",
          address: "",
          phone: "",
          email: "",
          password: "",
          cpassword: "",
        });
        setshowLoader(true);

        setTimeout(() => {
          setshowLoader(false);
          setMessageFromMail({
            message: `Check your email ${signUpdata.email} to verify your account. If you don't see the email, please check your Spam or Junk folder.`,
            email: res.data.email,
            password: signUpdata.cpassword,
          });
          setFormToShow("confirm");
        }, 2000);
      } else {
        setshowLoader(false);
        console.log(res.data);
        setEmptyEmail(res.data.message);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  return (
    <>
      <div className="signup">
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
                <h3 className="h3">SIGN UP</h3>
                <span>to VETSMAGIC</span>
                <div className="div">
                  <strong>OR</strong>
                </div>
                <span
                  style={{ color: "blue" }}
                  className="sign-up-btn"
                  onClick={() => {
                    setFormToShow("signin");
                  }}
                >
                  SIGN IN
                </span>
              </div>
            </div>

            <div className="bot">
              <img src={catdog} alt="cat_and_dog" className="image-bg" />
            </div>
          </div>
          <div className="right">
            <h3 className="active-form-label">
              {formToShow === "1" ? "Pet Owner Information" : "Credentials"}
            </h3>
            {formToShow === "1" && (
              <div className="form">
                <p style={{ fontSize: "10px" }}>
                  {signUpdata.firstname +
                    " " +
                    signUpdata.lastname +
                    " " +
                    signUpdata.suffix}
                </p>
                <div
                  className="fullname-wrapper"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {/* Row 1 */}
                  <div style={{ display: "flex", gap: "2px" }}>
                    <div className="input-wrapper" style={{ flex: 1 }}>
                      <label
                        style={{ color: emptyFirstname !== "" ? "red" : "" }}
                        htmlFor="firstname"
                      >
                        {emptyFirstname !== "" ? emptyFirstname : "Firstname"}
                      </label>
                      <input
                        id="firstname"
                        type="text"
                        placeholder="Firstname"
                        name="firstname"
                        onChange={handleSignUpDataChange}
                        value={signUpdata.firstname}
                      />
                    </div>

                    <div className="input-wrapper" style={{ flex: 1 }}>
                      <label
                        style={{ color: emptyLastname !== "" ? "red" : "" }}
                        htmlFor="lastname"
                      >
                        {emptyLastname !== "" ? emptyLastname : "Lastname"}
                      </label>
                      <input
                        id="lastname"
                        type="text"
                        placeholder="Lastname"
                        name="lastname"
                        onChange={handleSignUpDataChange}
                        value={signUpdata.lastname}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="input-wrapper" style={{ flex: 1 }}>
                      <label
                        style={{ color: emptyFirstname !== "" ? "red" : "" }}
                        htmlFor="middlename"
                      >
                        {emptyFirstname !== "" ? emptyFirstname : "Middlename"}
                      </label>
                      <input
                        id="middlename"
                        type="text"
                        placeholder="Middlename"
                        // name="middlename"
                        // onChange={handleSignUpDataChange}
                        // value={signUpdata.middlename}
                      />
                    </div>

                    <div className="input-wrapper-suff" style={{ flex: 1 }}>
                      <label
                        style={{ color: emptySuffix !== "" ? "red" : "" }}
                        htmlFor="suffix"
                      >
                        {emptySuffix !== "" ? emptySuffix : "Suffix"}
                      </label>
                      <select
                        id="suffix"
                        name="suffix"
                        value={signUpdata.suffix}
                        onChange={handleSignUpDataChange}
                        style={{
                          width: "100%",
                          height: "40px",
                          borderRadius: "5px",
                          border: "1px solid #161179",
                          padding: "0 10px",
                        }}
                      >
                        <option disabled value="">
                          Select suffix (optional)
                        </option>
                        <option value="Jr">Jr</option>
                        <option value="Sr">Sr</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                        <option value="V">V</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="input-wrapper">
                  <label
                    style={{ color: emptyAddress !== "" ? "red" : "" }}
                    htmlFor="Address"
                  >
                    {emptyAddress !== "" ? emptyAddress : "Address"}
                  </label>
                  <input
                    id="Address"
                    type="text"
                    placeholder="Enter your Address"
                    name="address"
                    onChange={handleSignUpDataChange}
                    value={signUpdata.address}
                  />
                </div>

                <div className="input-wrapper">
                  <label
                    style={{ color: emptyPhone !== "" ? "red" : "" }}
                    htmlFor="phone"
                  >
                    {emptyPhone !== "" ? emptyPhone : "Phone"}
                  </label>

                  <div
                    className="phone-input"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #161179",
                      height: "40px",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      padding: "0 10px",
                      gap: "7px",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem" }}>+63</span>
                    <input
                      id="phone"
                      type="number"
                      placeholder="946 7021 ***"
                      name="phone"
                      onChange={handleSignUpDataChange}
                      value={signUpdata.phone}
                      style={{
                        border: "none",
                        height: "35px",
                        borderLeft: "1px solid lightgrey",
                        borderRadius: "0",
                        padding: "0 5px",
                      }}
                    />
                  </div>
                </div>
                <div className="button-wrapper-continue">
                  <FaArrowCircleRight
                    onClick={handleNext}
                    style={{
                      fontSize: "1.875rem",
                      cursor: "pointer",
                      color: "#007bff",
                    }}
                  />
                </div>
              </div>
            )}
            {formToShow === "2" && (
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
                    type="Email"
                    placeholder="Enter your Email"
                    name="email"
                    onChange={handleSignUpDataChange}
                    value={signUpdata.email}
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
                    placeholder="Enter your Password"
                    name="password"
                    onChange={handleSignUpDataChange}
                    value={signUpdata.password}
                  />
                </div>
                <div className="input-wrapper">
                  <label
                    style={{ color: emptyCPassword !== "" ? "red" : "" }}
                    htmlFor="cpassword"
                  >
                    {emptyCPassword !== ""
                      ? emptyCPassword
                      : "Confirm Password"}
                  </label>
                  <input
                    id="cpassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your Password"
                    name="cpassword"
                    onChange={handleSignUpDataChange}
                    value={signUpdata.cpassword}
                  />
                </div>
                <div className="showpass-wrapper">
                  <input
                    type="checkbox"
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <span>Show password</span>
                </div>

                <div className="button-wrapper">
                  <FaArrowCircleLeft
                    onClick={() => setformToShow("1")}
                    style={{
                      fontSize: "1.875rem",
                      cursor: "pointer",
                      color: "#0C0950",
                    }}
                  />
                  <button className="btn-signin" onClick={handleSubmit}>
                    SIGN UP
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <AiOutlineClose
          className="close-icon"
          onClick={() => setFormToShow(null)}
        />
      </div>
      {showSignInForm && <Signin close={() => setshowSignInForm(false)} />}{" "}
      {showLoader && <Loader _label="Please wait..." />}
      {toasterMessage != null && !showLoader && (
        <Toaster
          message={toasterMessage}
          _click={() => setToasterMessage(null)}
        />
      )}
      {showTerms && <TermsAndCondations close={() => setShowTerms(false)} />}
      {showTermsNote && (
        <div className="note-terms">
          <p>To continue, You need to agree to the terms and conditions</p>
        </div>
      )}
    </>
  );
};

export default Signup;
