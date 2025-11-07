import "./Navbar.scss";
import MobileSidebar from "../mobileSidebar/MobileSidebar";
import OverLay from "../overlay/OverLay";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { uploadUrl } from "../../../fileurl";
import Notification from "../notification/Notification";
import { NotifContext } from "../../contexts/NotificationContext";

//IMAGES
import logo from "../../assets/icons/vetmagic.png";

//ICONS
import { AiOutlineBell } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { PiMegaphone } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { FaCircleExclamation } from "react-icons/fa6";
import { LiaBellSolid } from "react-icons/lia";
import { CgMenuGridR } from "react-icons/cg";
import LogoutUI from "../logoutUI/LogoutUI";
import { SlRefresh } from "react-icons/sl";

const Navbar = ({ isHome }) => {
  const navigate = useNavigate();
  const { setFormToShow, setCurrentUser, currentUser, setModlToShow } =
    useContext(AuthContext);
  const { activeNotifCount } = useContext(NotifContext);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const [showLogoutUI, setShowLogoutUI] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //handleLogout
  const handleLogout = async (e) => {
    e.preventDefault();

    setShowLogoutUI(true);

    setTimeout(async () => {
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
      <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <img src={logo} alt="logo" className="logo" />
          <div className="nav-buttons">
            {currentUser !== null && (
              <div className={`top ${isHome ? "homee" : ""}`}>
                <span>Welcome, {currentUser?.fullname.split(" ")[0]}</span>
              </div>
            )}
            <div className="bot">
              {/* <Link to="/paymongo">PAYMONGO</Link> */}
              <Link
                to="/home/"
                onClick={() => setActiveLink("home")}
                title="Home"
                className={`list-icon ${
                  activeLink === "home" ? "active" : ""
                } `}
              >
                Home
              </Link>
              <Link
                to="/medicine/"
                onClick={() => setActiveLink("shop")}
                title="Vetcare Shop"
                className={`list-icon ${
                  activeLink === "shop" ? "active" : ""
                } `}
              >
                Shop
              </Link>
              {currentUser !== null && (
                <Link
                  to="/myappointment/"
                  onClick={() => setActiveLink("appointment")}
                  title="Appointment"
                  className={`list-icon ${
                    activeLink === "appointment" ? "active" : ""
                  } `}
                >
                  Appointment
                </Link>
              )}
              {/* {currentUser !== null && (
                <Link
                  title="Follow-up Appointment"
                  onClick={() => {
                    setModlToShow("follow-up");
                  }}
                  className="list-icon-notif"
                >
                  <SlRefresh className="nav-icon" />
                  <FaCircleExclamation className="exclamation-icon" />
                </Link>
              )}{" "} */}
              {currentUser !== null && (
                <Link
                  title="Announcement"
                  className="list-icon-notif"
                  onClick={() => setModlToShow("announcement")}
                >
                  <PiMegaphone className="nav-icon" />

                  <FaCircleExclamation className="exclamation-icon" />
                </Link>
              )}
              <Link
                title="Notification"
                className="list-icon-notif"
                onClick={() => setShowActiveModal("notif")}
              >
                <AiOutlineBell className="nav-icon" />

                {activeNotifCount > 0 && (
                  <div className="dot-wrapper">
                    <span>
                      {activeNotifCount > 9 ? "9+" : activeNotifCount}
                    </span>
                  </div>
                )}
              </Link>
              {currentUser !== null && (
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  className="user-prof"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {currentUser.profile ? (
                    <LazyLoadImage
                      effect="blur"
                      src={`${uploadUrl.uploadurl}/${currentUser?.profile}`}
                      className="nav-profile"
                    />
                  ) : (
                    <div className="initial-profile">
                      {currentUser?.fullname.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <IoIosArrowDown
                    style={{
                      marginBottom: "2px",
                      color: "gray",
                      cursor: "pointer",
                    }}
                  />
                </div>
              )}
              {currentUser === null && (
                <button
                  className="btn-signin"
                  onClick={() => setFormToShow("signin")}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          <div className="menu-notif-wrapper">
            <div
              className="notification-icon"
              onClick={() => setShowActiveModal("notif")}
            >
              <LiaBellSolid className="bell-icon" />

              {activeNotifCount > 0 && (
                <div className="count">
                  <span> {activeNotifCount > 9 ? "9+" : activeNotifCount}</span>
                </div>
              )}
            </div>
            <CgMenuGridR
              className={`menu-icon ${isHome ? "home_" : ""}`}
              onClick={() => setShowMobileSidebar(true)}
            />
          </div>
        </div>

        {showDropdown && (
          <div className="dropdown-client">
            <div className="container">
              <Link to="/profile/">
                <IoSettingsOutline className="icon" /> Profile
              </Link>
              <Link onClick={handleLogout}>
                <IoMdLogOut className="icon" /> Logout
              </Link>
            </div>
          </div>
        )}
      </div>

      {showMobileSidebar && (
        <MobileSidebar close={() => setShowMobileSidebar(false)} />
      )}
      {showMobileSidebar && (
        <OverLay closeMobileSidebar={() => setShowMobileSidebar(false)} />
      )}

      {showActiveModal === "notif" && (
        <Notification close={() => setShowActiveModal("")} />
      )}

      {showLogoutUI && <LogoutUI />}
    </>
  );
};

export default Navbar;
