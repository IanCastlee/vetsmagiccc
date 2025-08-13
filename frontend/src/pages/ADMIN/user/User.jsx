import { useEffect, useState } from "react";
import "./User.scss";
import { motion } from "framer-motion";
import axiosIntance from "../../../../axios";
import Swal from "sweetalert2";

//ICONS
import { FiSearch } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";

const User = () => {
  const [veterinarian, setVeterinarian] = useState([]);

  const [showDelForm, setShowDelForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  //get veterinarian
  useEffect(() => {
    const veterinarian = async () => {
      try {
        const res = await axiosIntance.get("admin/user/getactiveuser.php");
        if (res.data.success) {
          setVeterinarian(res.data.data);
          console.log("DATA : ", res.data.data);
        } else {
          console.log("Error : ", res.data.data);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };

    veterinarian();
  }, []);

  //handle Delete
  // Assuming `setVeterinarian` is your state setter and `veterinarian` is your array
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosIntance.post(
        `admin/user/setuserasnotactive.php?user_id=${showDelForm}`
      );

      if (res.data.success) {
        console.log("RES : ", res.data.message);

        setVeterinarian((prevData) =>
          prevData.filter((vet) => vet.user_id !== showDelForm)
        );

        setShowDelForm(null);
        showSuccessAlert();
      } else {
        console.log("Delete failed:", res.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  //filteredVeterinarians
  const filteredVeterinarians = veterinarian.filter(
    (item) =>
      item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSuccessAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Client set as not-active",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <>
      <div className="admin-veterinarian">
        <div className="top">
          <div className="left">
            <h3>
              <GoDotFill style={{ color: "lightgreen" }} /> ACTIVE CLIENT
            </h3>
          </div>
          <div className="right">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search Name, Specialization, Address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="icon" />
            </div>
          </div>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Fullname</th>
                <th>Address</th>
                <th>Email</th>

                <th className="action-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVeterinarians.length > 0 ? (
                filteredVeterinarians.map((item) => (
                  <tr key={item.user_id}>
                    <td style={{ fontWeight: "700" }}>{item.user_id}</td>

                    <td>{item.fullname}</td>
                    <td>{item.address}</td>
                    <td>{item.email}</td>
                    <td className="btns-wrapper">
                      <button
                        style={{ color: "#fff", backgroundColor: "gray" }}
                        title="Delete"
                        onClick={() => setShowDelForm(item.user_id)}
                        className="btn"
                      >
                        Set As Not Active
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDelForm !== null && (
        <div className="delete-overlay">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="delete"
          >
            <div className="top">
              <h6>Confirmation</h6>
            </div>

            <p>Are you sure you want to set this client as not-active?</p>

            <div className="bot">
              <button
                style={{ backgroundColor: "blue" }}
                className="btn-yes"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button className="btn-no" onClick={() => setShowDelForm(null)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default User;
