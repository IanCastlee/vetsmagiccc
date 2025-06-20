import "./MobileSidebar.scss";
import { motion } from "framer-motion";
import Signin from "../signinSignUp/Signin";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import Loader from "../loader/Loader";

//ICONS
import { RiHomeLine } from "react-icons/ri";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { IoMdPower } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { PiShoppingBagBold } from "react-icons/pi";
import { LuCalendarSync } from "react-icons/lu";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

const MobileSidebar = ({ close }) => {
  const {
    setFormToShow,
    formToShow,
    currentUser,
    setCurrentUser,
    setModlToShow,
  } = useContext(AuthContext);

  const [showLoader, setshowLoader] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    setshowLoader(true);
    try {
      const res = await axiosIntance.post(
        "client/auth/Logout.php",
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.removeItem("data");
        localStorage.clear();

        setCurrentUser(null);
        setFormToShow("signin");
        setshowLoader(false);
      } else {
        console.error("Logout failed: ", res.data.message);
        setshowLoader(false);
      }
    } catch (error) {
      setshowLoader(false);
      console.log("Error in logging out", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="sidebar"
      >
        <div className="top-wrapper">
          {currentUser !== null && (
            <Link to="/profile/" className="user-profile">
              <FaUserCircle className="profile" />
              <div className="name">{currentUser?.fullname}</div>
              <p>{currentUser?.email}</p>
            </Link>
          )}

          {currentUser === null && (
            <button
              className="btn-signin"
              onClick={() => {
                setFormToShow("signin");
                close();
              }}
            >
              SIGN IN
            </button>
          )}
        </div>
        <div className="menu-btn" onClick={close}>
          <Link className="btn-link" to={"/home/"}>
            <RiHomeLine className="icon" /> Home
          </Link>
          {currentUser !== null && (
            <Link
              className="btn-link"
              onClick={() => setModlToShow("follow-up")}
            >
              <LuCalendarSync className="icon" />
              Follow-up Check-up
            </Link>
          )}
          {currentUser !== null && (
            <Link className="btn-link" to="/myappointment/">
              <HiMiniCalendarDateRange className="icon" /> Appointment
            </Link>
          )}
          <Link className="btn-link" to="/medicine/">
            <PiShoppingBagBold className="icon" /> Vetcare Shop
          </Link>

          <Link className="btn-link">
            <HiOutlineChatBubbleOvalLeft className="icon" /> Message
          </Link>
          {currentUser !== null && (
            <Link className="btn-link" onClick={handleLogout}>
              <IoMdPower className="icon" /> Logout
            </Link>
          )}
        </div>
      </motion.div>
      {formToShow === "signin" && <Signin close={() => setFormToShow(null)} />}
      {showLoader && <Loader _label="Logging out..." />}{" "}
    </>
  );
};

export default MobileSidebar;
