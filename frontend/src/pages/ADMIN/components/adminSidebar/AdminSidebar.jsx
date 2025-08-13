import "./AdminSidebar.scss";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

//IMAGES

//ICONS
import { LuStethoscope } from "react-icons/lu";
import { TbShoppingBagEdit } from "react-icons/tb";
import { PiMegaphoneSimple } from "react-icons/pi";
import { RiHomeLine } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import axiosIntance from "../../../../../axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import LogoutUI from "../../../../components/logoutUI/LogoutUI";

const AdminSidebar = () => {
  const { setFormToShow, setCurrentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const [activeDropdown, setActiveDropdown] = useState("");
  const [showLogoutUI, setShowLogoutUI] = useState(false);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("admin-sidebar", "overlay-admin");
    const overlay = document.getElementById("overlay-admin");
    if (sidebar && overlay) {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    }
  };

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
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        id="admin-sidebar"
        className="admin-sidebar"
      >
        <div className="top">
          <div className="top-container">
            <h3 style={{ color: "#fff" }}>VETSMAGIC</h3>
          </div>
        </div>

        <ul>
          <Link
            to="/admin/home/"
            className={`item ${activeLink === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveLink("dashboard");
              toggleSidebar;
              setActiveDropdown("");
            }}
          >
            <RiHomeLine className="link-icon" />
            Dashboard
          </Link>
          <li
            className={`item ${activeLink === "appointment" ? "active" : ""}`}
            onClick={() => {
              setShowAppointmentDropdown(!showAppointmentDropdown);
              setActiveLink("appointment");
            }}
          >
            <MdOutlineDateRange className="link-icon" />
            Appointment
          </li>
          {showAppointmentDropdown && (
            <div className="dropdown" onClick={toggleSidebar}>
              <Link to="/admin/pending-appointment/" className="btn-li">
                Appointments
              </Link>
              <Link to="/admin/done-appointment/" className="btn-li">
                Completed Appointments
              </Link>
              <Link to="/admin/followup-appointment/" className="btn-li">
                Follow-up Appointments
              </Link>
              <Link
                to="/admin/completed-followup-appointment/"
                className="btn-li"
              >
                Completed FA
              </Link>
              <Link to="/admin/appointment-history/" className="btn-li">
                Appointment History
              </Link>
            </div>
          )}

          <li
            className={`item ${activeLink === "vet" ? "active" : ""}`}
            onClick={() => {
              setActiveDropdown(
                activeDropdown === "veterinarian" ? "" : "veterinarian"
              );
              setActiveLink("vet");
            }}
          >
            <LuStethoscope className="link-icon" />
            Veterinarian
          </li>

          {activeDropdown === "veterinarian" && (
            <div className="dropdown" onClick={toggleSidebar}>
              <Link
                onClick={toggleSidebar}
                className="btn-li"
                to="/admin/active-veterinarian/"
              >
                Active Veterinarian
              </Link>
              <Link
                onClick={toggleSidebar}
                to="/admin/not-active-veterinarian/"
                className="btn-li"
              >
                Not-active Veterinarian
              </Link>
            </div>
          )}

          <li
            className={`item ${activeLink === "user" ? "active" : ""}`}
            onClick={() => {
              setActiveDropdown(activeDropdown === "user" ? "" : "user");
              setActiveLink("user");
            }}
          >
            <PiUsersThreeBold className="link-icon" />
            User
          </li>

          {activeDropdown === "user" && (
            <div className="dropdown" onClick={toggleSidebar}>
              <Link to="/admin/active-user/" className="btn-li">
                Active
              </Link>
              <Link to="/admin/not-active-user/" className="btn-li">
                Not Active
              </Link>
            </div>
          )}

          {/* <li className={`item ${activeLink === "shop" ? "active" : ""}`}>
            <Link
              className="btn-li"
              to="/admin/shop/"
              // onClick={() => {
              //   setActiveLink("shop");
              //   toggleSidebar;
              //   setActiveDropdown("");
              // }}

              onClick={() => {
                setActiveDropdown(activeDropdown === "user" ? "" : "user");
                setActiveLink("user");
              }}
            >
              <TbShoppingBagEdit className="link-icon" />
              Manage Shop
            </Link>
          </li> */}

          <li
            className={`item ${activeLink === "shop" ? "active" : ""}`}
            onClick={() => {
              setActiveDropdown(activeDropdown === "shop" ? "" : "shop");
              setActiveLink("shop");
            }}
          >
            <TbShoppingBagEdit className="link-icon" />
            Shop Management
          </li>

          {activeDropdown === "shop" && (
            <div className="dropdown" onClick={toggleSidebar}>
              <Link to="/admin/shop/" className="btn-li">
                Products
              </Link>
              <Link to="/admin/low-stock/" className="btn-li">
                Products with Low Stock
              </Link>
              <Link to="/admin/soon-expired/" className="btn-li">
                Expires Soon
              </Link>
            </div>
          )}

          <li className={`item ${activeLink === "service" ? "active" : ""}`}>
            <Link
              className="btn-li"
              to="/admin/service/"
              onClick={() => {
                setActiveLink("service");
                toggleSidebar;
                setActiveDropdown("");
              }}
            >
              <MdOutlineMedicalServices className="link-icon" />
              Services
            </Link>
          </li>

          <li
            className={`item ${activeLink === "announcement" ? "active" : ""}`}
          >
            <Link
              className="btn-li"
              to="/admin/announcement/"
              onClick={() => {
                setActiveLink("announcement");
                toggleSidebar;
                setActiveDropdown("");
              }}
            >
              <PiMegaphoneSimple className="link-icon" />
              Announcement
            </Link>
          </li>
          <li className="item" onClick={handleLogout}>
            <IoMdLogOut className="link-icon" />
            Logout
          </li>
        </ul>
      </motion.div>

      <div
        id="overlay-admin"
        className="overlay-admin"
        onClick={toggleSidebar}
      ></div>

      {showLogoutUI && <LogoutUI />}
    </>
  );
};

export default AdminSidebar;
