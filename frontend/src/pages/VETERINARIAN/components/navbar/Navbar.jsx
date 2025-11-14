import "./Navbar.scss";
import axiosIntance from "../../../../../axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import logo from "../../../../assets/icons/logo.png";

//ICONS
import { LiaBell } from "react-icons/lia";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";

import { LiaHistorySolid } from "react-icons/lia";
import AppointmentHistory from "../history/AppointmentHistory";
import LogoutUI from "../../../../components/logoutUI/LogoutUI";
import Notification_vet from "../notification/Notification_vet";
import { NotifContext } from "../../../../contexts/NotificationContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { activeNotifCount } = useContext(NotifContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const { setFormToShow, setCurrentUser } = useContext(AuthContext);

  const [loader, setLoader] = useState(false);
  const [notif, setNotif] = useState([]);
  const [visibleNotif, setVisibleNotif] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [showLogoutUI, setShowLogoutUI] = useState(false);

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
      <div className="vnavbar">
        <div className="nav-container">
          <img src={logo} alt="logo" className="logo" />
          <div className="vnav-buttons">
            <div
              title="Notification"
              className="list-icon-bell"
              onClick={() => setActiveModal("notif")}
              style={{ cursor: "pointer" }}
            >
              <LiaBell className="nav-icon" />
              {activeNotifCount > 0 && (
                <div className="dot">
                  <span>{activeNotifCount > 9 ? "9+" : activeNotifCount}</span>
                </div>
              )}
            </div>

            <div
              title="Appointment History"
              className="list-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <LiaHistorySolid
                className="nav-icon"
                onClick={() => setActiveModal("history")}
              />
            </div>

            <div title="Logout" className="list-icon" onClick={handleLogout}>
              <IoIosLogOut className="nav-icon" />
            </div>
          </div>
        </div>
      </div>

      {activeModal === "notif" && (
        <Notification_vet close={() => setActiveModal("")} />
      )}

      {activeModal === "history" && (
        <AppointmentHistory close={() => setActiveModal("")} />
      )}

      {showLogoutUI && <LogoutUI />}
    </>
  );
};

export default Navbar;
