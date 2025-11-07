import { useEffect, useState } from "react";
import "./Appointment.scss";
import axiosIntance from "../../../../axios";

// ICONS
import { FiSearch } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { uploadUrl } from "../../../../fileurl";

const CancelledAppointment = () => {
  const [doneAppointment, setDoneAppointment] = useState([]);

  // Get cancelled appointments
  useEffect(() => {
    const getCancelledAppointments = async () => {
      try {
        const res = await axiosIntance.get(
          "admin/appointment/get_cancelled_appointment.php"
        );
        if (res.data.success) {
          setDoneAppointment(res.data.data);
          console.log("DATA : ", res.data.data);
        } else {
          console.log("Error : ", res.data);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };

    getCancelledAppointments();
  }, []);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = doneAppointment.filter(
    (item) =>
      item.drFullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.history_health_issue
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.appointment_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pet_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [vetsPerPage, setVetsPerPage] = useState(7);

  const indexOfLastData = currentPage * vetsPerPage;
  const indexOfFirstVet = indexOfLastData - vetsPerPage;
  const currentData = filteredData.slice(indexOfFirstVet, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / vetsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleVetsPerPageChange = (e) => {
    setVetsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // 🟢 Mark as Refunded Function
  const handleMarkAsRefunded = async (appointment_id) => {
    const confirmed = window.confirm(
      "Are you sure this appointment is already refunded?"
    );

    if (!confirmed) return;

    try {
      const res = await axiosIntance.post(
        "admin/appointment/mark_as_refunded.php",
        { appointment_id }
      );

      if (res.data.success) {
        alert("Appointment marked as refunded!");
        // Remove from UI
        setDoneAppointment((prev) =>
          prev.filter((item) => item.appointment_id !== appointment_id)
        );
      } else {
        alert(res.data.message || "Failed to update appointment.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("An error occurred while updating the appointment.");
    }
  };

  return (
    <>
      <div className="admin-appointment">
        <div className="top">
          <div className="left">
            <h3>CANCELLED APPOINTMENT</h3>
          </div>
          <div className="right">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="icon" />
            </div>

            <button
              title="Add New Record"
              className="btn-addnew"
              onClick={() => setActiveFormModal("add")}
            >
              <IoIosAdd className="icon" />
            </button>
          </div>
        </div>

        <div className="table">
          <div className="row-per-page">
            <label>
              Rows per page:{" "}
              <select
                className="selector"
                value={vetsPerPage}
                onChange={handleVetsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Profile</th>
                <th>Client Fullname</th>
                <th>Pet Type</th>
                <th>Pet Name</th>
                <th>Service</th>
                <th>Medical History</th>
                <th>Pet Health Issue</th>
                <th>Dr Incharge</th>
                <th>Date Sched</th>
                <th>Time Sched</th>
                <th>Payment Method</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData && currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item.appointment_id}>
                    <td style={{ fontWeight: "700" }}>{item.appointment_id}</td>
                    <td>
                      <img
                        style={{
                          height: "40px",
                          width: "40px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        src={`${uploadUrl.uploadurl}/${item.image}`}
                        alt="profile_pic"
                      />
                    </td>
                    <td>{item.clientName}</td>
                    <td>{item.pet_type}</td>
                    <td>{item.pet_name}</td>
                    <td>{item.service}</td>
                    <td>{item.history_health_issue}</td>
                    <td>{item.current_health_issue}</td>
                    <td>Dr. {item.drFullname}</td>
                    <td>{item.appointment_date}</td>
                    <td>{item.appointment_time}</td>
                    <td>{item.payment_method}</td>
                    <td>₱ {item.paid_payment}</td>
                    <td>Cancelled</td>
                    <td>
                      {item.status === "2" || item.status === 2 ? (
                        <button
                          onClick={() =>
                            handleMarkAsRefunded(item.appointment_id)
                          }
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            padding: "3px 6px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Mark as Refunded
                        </button>
                      ) : item.status === "3" || item.status === 3 ? (
                        <span
                          style={{
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          Refunded
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={15}
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

          {currentData?.length > 0 && (
            <div
              className="pagination"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              <button onClick={prevPage} disabled={currentPage === 1}>
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  style={{
                    fontWeight: currentPage === i + 1 ? "bold" : "normal",
                    margin: "0 5px",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CancelledAppointment;
