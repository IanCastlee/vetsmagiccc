import { useEffect, useState } from "react";
import "./ShopReservation.scss";
import axiosIntance from "../../../../axios";

//ICONS
import { FiSearch } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { uploadUrl } from "../../../../fileurl";
import { LuHistory } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const ShopReservation = () => {
  const [doneAppointment, setDoneAppointment] = useState([]);
  const navigate = useNavigate();

  //get veterinarian
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axiosIntance.get(
          "admin/shop/get_shop_reservation.php?status=0"
        );
        if (res.data.success) {
          setDoneAppointment(res.data.data);
        } else {
          console.log("Error : ", res.data);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };

    fetchReservations();
  }, []);

  // Mark as Sold handler
  const handleMarkAsSold = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this item as sold?"
    );
    if (!confirmed) return;

    try {
      const res = await axiosIntance.post(
        "admin/shop/mark_as_sold.php",
        { id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        alert("Item marked as sold!");
        setDoneAppointment((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 1 } : item))
        );
      } else {
        alert("Failed to mark as sold: " + res.data.message);
      }
    } catch (error) {
      console.error("Error marking as sold:", error);
      alert("An error occurred while marking as sold.");
    }
  };

  //filteredData
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = doneAppointment.filter(
    (item) =>
      item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.med_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.qty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [vetsPerPage, setVetsPerPage] = useState(7);

  // Pagination logic
  const indexOfLastData = currentPage * vetsPerPage;
  const indexOfFirstVet = indexOfLastData - vetsPerPage;
  const currentData = filteredData.slice(indexOfFirstVet, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / vetsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Handle change in rows per page
  const handleVetsPerPageChange = (e) => {
    setVetsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="admin-appointment">
      <div className="top">
        <div className="left">
          <h3>SHOP RESERVATION</h3>
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
        </div>
      </div>
      <div className="table">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="row-per-page"
        >
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

          <LuHistory
            onClick={() => navigate("/admin/shop-reservation-history")}
            title="Appointment History"
            style={{ fontSize: "25px", cursor: "pointer" }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Note</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData && currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id}>
                  <td>{item.fullname}</td>
                  <td>{item.med_name}</td>
                  <td>{item.price}</td>
                  <td>{item.qty}</td>
                  <td>{item.note}</td>
                  <td style={{ color: "blue" }}>
                    {item.status === 0 && "Reserved"}
                  </td>

                  <td
                    style={{
                      color: item.status === 0 ? "red" : "green",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {item.status === 0 ? (
                      <button
                        onClick={() => handleMarkAsSold(item.id)}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#218838")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#28a745")
                        }
                      >
                        Mark as Sold
                      </button>
                    ) : (
                      <span
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        Sold
                      </span>
                    )}
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

        {/* Pagination Controls */}
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
  );
};

export default ShopReservation;
