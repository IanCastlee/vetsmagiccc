import "./AdminSidebar.scss";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

//IMAGES
import logo from "../../../../assets/icons/logo.png";
import { RiHomeLine } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { MdOutlineMedicalServices } from "react-icons/md";
import { MdOutlineEventNote } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useState } from "react";

//ICONS
import { LuStethoscope } from "react-icons/lu";
import { TbShoppingBagEdit } from "react-icons/tb";

const AdminSidebar = () => {
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState("");

  const toggleSidebar = () => {
    const sidebar = document.getElementById("admin-sidebar", "overlay-admin");
    const overlay = document.getElementById("overlay-admin");
    if (sidebar && overlay) {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    }
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
            <h3 style={{ color: "#fff" }}>VETCARE</h3>
          </div>
        </div>

        <ul onClick={toggleSidebar}>
          <Link to="/admin/home/" className="item">
            <RiHomeLine className="link-icon" />
            Homie
          </Link>
          <li
            className="item"
            onClick={() => setShowAppointmentDropdown(!showAppointmentDropdown)}
          >
            <MdOutlineDateRange className="link-icon" />
            Appointment
          </li>
          {showAppointmentDropdown && (
            <div className="dropdown">
              <Link to="/admin/pending-appointment/" className="btn-li">
                Appointment
              </Link>
              <Link to="/admin/done-appointment/" className="btn-li">
                Copleted Appointment
              </Link>
              <Link to="/admin/followup-appointment/" className="btn-li">
                Follow-up Appointment
              </Link>
              <Link
                to="/admin/completed-followup-appointment/"
                className="btn-li"
              >
                Copleted FA
              </Link>
            </div>
          )}

          <li
            className="item"
            onClick={() =>
              setActiveDropdown(
                activeDropdown === "veterinarian" ? "" : "veterinarian"
              )
            }
          >
            <LuStethoscope className="link-icon" />
            Veterinarian
          </li>

          {activeDropdown === "veterinarian" && (
            <div className="dropdown">
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
            className="item"
            onClick={() =>
              setActiveDropdown(activeDropdown === "user" ? "" : "user")
            }
          >
            <PiUsersThreeBold className="link-icon" />
            User
          </li>

          {activeDropdown === "user" && (
            <div className="dropdown">
              <Link to="/admin/active-user/" className="btn-li">
                Active
              </Link>
              <Link to="/admin/not-active-user/" className="btn-li">
                Not Active
              </Link>
            </div>
          )}

          <li className="item">
            <Link className="btn-li" to="/admin/shop/">
              <TbShoppingBagEdit className="link-icon" />
              Manage Shop
            </Link>
          </li>

          {activeDropdown === "shop" && (
            <div className="dropdown">
              <button className="btn-li">Active</button>
              <button className="btn-li">Not Active</button>
            </div>
          )}

          <li className="item">
            <Link className="btn-li" to="/admin/service/">
              <MdOutlineMedicalServices className="link-icon" />
              Services
            </Link>
          </li>
          <li className="item">
            <MdOutlineEventNote className="link-icon" />
            Event
          </li>
          <li className="item">
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
    </>
  );
};

export default AdminSidebar;
