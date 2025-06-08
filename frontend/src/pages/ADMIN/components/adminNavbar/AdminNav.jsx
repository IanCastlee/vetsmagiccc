import "./AdminNav.scss";

//ICONS
import { FaRegCircleUser } from "react-icons/fa6";
import { RiMenuLine } from "react-icons/ri";

const AdminNav = () => {
  const toggleSidebar = () => {
    const sidebar = document.getElementById("admin-sidebar", "overlay-admin");
    const overlay = document.getElementById("overlay-admin");
    if (sidebar && overlay) {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
    }
  };
  return (
    <div className="admin-nav">
      <h3>DASHBOARD</h3>
      <FaRegCircleUser className="admin-icon" />
      <RiMenuLine className="menu-icon" onClick={toggleSidebar} />
    </div>
  );
};

export default AdminNav;
