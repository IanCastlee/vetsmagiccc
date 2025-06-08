import "./Navbar.scss";
import MobileSidebar from "../mobileSidebar/MobileSidebar";
import OverLay from "../overlay/OverLay";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";

//IMAGES
import logo from "../../assets/icons/logo.png";

//ICONS
import { AiOutlineBell } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiMenu3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import Notification from "../notification/Notification";
import { AiFillBell } from "react-icons/ai";

const Navbar = ({ isHome }) => {
  const navigate = useNavigate();
  const { setFormToShow, setCurrentUser, currentUser, setModlToShow } =
    useContext(AuthContext);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState("");
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosIntance.post(
        "client/auth/Logout.php",
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.removeItem("data");
        localStorage.clear();
        navigate("/home/");
        setCurrentUser(null);
        setFormToShow("signin");
      } else {
        console.error("Logout failed: ", res.data.message);
      }
    } catch (error) {
      console.log("Error in logging out", error);
    }
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
              <Link
                to="/home/"
                onClick={() => setActiveLink("home")}
                title="Home"
                className={`list-icon ${
                  activeLink === "home" ? "active" : ""
                } `}
              >
                {/* <RiHomeLine className="nav-icon" /> */}
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
                {/* <AiOutlineMedicineBox className="nav-icon" /> */}
                Shop
              </Link>
              <Link
                to="/myappointment/"
                onClick={() => setActiveLink("appointment")}
                title="Appointment"
                className={`list-icon ${
                  activeLink === "appointment" ? "active" : ""
                } `}
              >
                {/* <RiCalendarScheduleLine className="nav-icon" /> */}
                Appointment
              </Link>
              <Link
                title="Follow-up Appointment"
                onClick={() => {
                  setModlToShow("follow-up");
                  setActiveLink("fa-appointment");
                }}
                className={`list-icon ${
                  activeLink === "fa-appointment" ? "active" : ""
                } `}
              >
                {/* <LuCalendarSync className="nav-icon" /> */}
                Follow-up Appointment
              </Link>
              <Link
                title="Notification"
                className="list-icon-notif"
                onClick={() => setShowActiveModal("notif")}
              >
                <AiOutlineBell className="nav-icon" />

                <div className="dot-wrapper">
                  <span>9</span>
                </div>
              </Link>
              <Link
                onClick={() => setShowDropdown(!showDropdown)}
                className="list-icon"
              >
                <FaRegCircleUser className="nav-icon" />
              </Link>

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
              onClick={() => setShowNotifModal(true)}
            >
              <AiFillBell className="bell-icon" />
              <div className="count">
                <span>8</span>
              </div>
            </div>
            <RiMenu3Line
              className={`menu-icon ${isHome ? "home_" : ""}`}
              onClick={() => setShowMobileSidebar(true)}
            />
          </div>
        </div>

        {showDropdown && (
          <div className="dropdown-client">
            <div className="container">
              <span>
                <IoSettingsOutline className="icon" /> Setting
              </span>
              <span onClick={handleLogout}>
                <IoMdLogOut className="icon" /> Logout
              </span>
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
    </>
  );
};

export default Navbar;
