import "./Navbar.scss";
import axiosIntance from "../../../../../axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import logo from "../../../../assets/icons/logo.png";
import { motion } from "framer-motion";
import Loader2 from "../../../../components/loader/Loader3";
import Emptydata from "../../../../components/emptydata/Emptydata";
//ICONS
import { LiaBell } from "react-icons/lia";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import appointmentImg from "../../../../assets/icons/calendar.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { setFormToShow, setCurrentUser } = useContext(AuthContext);

  const [loader, setLoader] = useState(false);
  const [notif, setNotif] = useState([]);
  const [visibleNotif, setVisibleNotif] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const MAX_VISIBLE = 5;
  const toggleSidebar = () => {
    const sidebar = document.getElementById("admin-sidebar", "overlay-admin");
    const overlay = document.getElementById("overlay-admin");
    if (sidebar && overlay) {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
    }
  };
  //get notification
  useEffect(() => {
    const getNotification = async () => {
      setLoader(true);
      const res = await axiosIntance.get("veterinarian/getNotification.php");
      if (res.data.success) {
        console.log("NOTIFICATION : ", res.data.data);
        setNotif(res.data.data);
        setVisibleNotif(res.data.data.slice(0, MAX_VISIBLE));
      } else {
        console.log("Error : ", res.data);
      }
      setLoader(false);
    };

    getNotification();
  }, []);

  const handleViewMore = () => {
    setShowAll(true);
    setVisibleNotif(notif);
  };

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
      <div className="vnavbar">
        <div className="nav-container">
          <img src={logo} alt="logo" className="logo" />
          <div className="vnav-buttons">
            {/* <Link className="list-icon">
              <GoHomeFill className="nav-icon" />
            </Link>
            <Link className="list-icon">
              <BiSolidMessageRoundedDetail className="nav-icon" />
            </Link> */}
            <Link
              title="Notification"
              className="list-icon-bell"
              onClick={() => setShowNav(!showNav)}
            >
              <LiaBell className="nav-icon" />
              <div className="dot">
                <span>9</span>
              </div>
            </Link>
            <Link
              title="Logout"
              className="list-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <IoIosLogOut className="nav-icon" />
            </Link>

            {/* {showDropdown && (
              <div className="dropdown-vet">
                <div className="container">
                  <span>
                    <IoSettingsOutline className="icon" /> Setting
                  </span>
                  <span onClick={handleLogout}>
                    <IoMdLogOut className="icon" /> Logout
                  </span>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {showNav && (
        <div className="notification-overlayv">
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="notification-vet"
          >
            <div className="top">
              <h6>Notification</h6>{" "}
              <IoCloseOutline
                className="icon"
                onClick={() => setShowNav(false)}
              />
            </div>
            <div className="notification-content">
              {loader ? (
                <Loader2 />
              ) : visibleNotif.length > 0 ? (
                <>
                  {visibleNotif.map((item) => (
                    <div key={item.notif_id} className="card">
                      <div className="left">
                        <img src={appointmentImg} alt="" />
                      </div>
                      <div className="right">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                          }}
                          className="top"
                        >
                          <span className="title">{item.title}</span>
                          <p>{item.description}</p>
                        </div>
                        <div className="bot">
                          <span>{item.sentDate}</span>
                          <button>Mark As Read</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!showAll && notif.length > MAX_VISIBLE && (
                    <button className="view-more-btn" onClick={handleViewMore}>
                      View More
                    </button>
                  )}
                </>
              ) : (
                <Emptydata />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Navbar;
