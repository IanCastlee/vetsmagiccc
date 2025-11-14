import "./MobileSidebar.scss";
import { motion } from "framer-motion";
import Signin from "../signinSignUp/Signin";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import Loader from "../loader/Loader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { uploadUrl } from "../../../fileurl";

//ICONS

import { PiMegaphoneSimpleLight } from "react-icons/pi";
import { TfiHome } from "react-icons/tfi";
import { SlRefresh } from "react-icons/sl";
import { PiShoppingBag } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { PiCalendarPlusLight } from "react-icons/pi";
import LogoutUI from "../logoutUI/LogoutUI";

const MobileSidebar = ({ close }) => {
  const {
    setFormToShow,
    formToShow,
    currentUser,
    setCurrentUser,
    setModlToShow,
  } = useContext(AuthContext);

  const [showLoader, setshowLoader] = useState(false);
  const [showLogoutUI, setShowLogoutUI] = useState(false);

  //handleLogout
  const handleLogout = async (e) => {
    e.preventDefault();

    setShowLogoutUI(true);

    setTimeout(async () => {
      try {
        const res = await axiosIntance.post(
          "client/auth/logout.php",
          {},
          { withCredentials: true }
        );

        if (res.data.success) {
          localStorage.removeItem("data");
          localStorage.clear();
          setCurrentUser(null);
          setFormToShow("signin");
          navigate("/home/");
        } else {
          console.error("Logout failed: ", res.data.message);
        }
      } catch (error) {
        console.log("Error in logging out", error);
      } finally {
        setShowLogoutUI(false);
      }
    }, 3000);
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
              {currentUser.profile ? (
                <LazyLoadImage
                  className="profile-image"
                  effect="blur"
                  src={`${uploadUrl.uploadurl}/${currentUser.profile}`}
                />
              ) : (
                <div className="initial">
                  {currentUser.fullname?.charAt(0).toUpperCase()}
                </div>
              )}

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
        <div className="menu-btn">
          <Link className="btn-link" to={"/home/"} onClick={close}>
            <TfiHome className="icon" /> Home
          </Link>
          {/* {currentUser !== null && (
            <Link
              className="btn-link"
              onClick={() => {
                setModlToShow("follow-up");
                close;
              }}
            >
              <SlRefresh className="icon" />
              Follow-up Check-up
            </Link>
          )} */}
          {currentUser !== null && (
            <Link className="btn-link" to="/myappointment/" onClick={close}>
              <PiCalendarPlusLight className="icon" /> Appointment
            </Link>
          )}
          <Link className="btn-link" to="/medicine/" onClick={close}>
            <PiShoppingBag className="icon" /> Shop
          </Link>

          <Link
            onClick={() => {
              setModlToShow("announcement");
              close;
            }}
            className="btn-link"
          >
            <PiMegaphoneSimpleLight className="icon" /> Announcement
          </Link>
          {currentUser !== null && (
            <Link className="btn-link" onClick={handleLogout}>
              <CiLogout className="icon" /> Logout
            </Link>
          )}
        </div>
      </motion.div>
      {formToShow === "signin" && <Signin close={() => setFormToShow(null)} />}
      {showLoader && <Loader _label="Logging out..." />}{" "}
      {showLogoutUI && <LogoutUI />}
    </>
  );
};

export default MobileSidebar;
