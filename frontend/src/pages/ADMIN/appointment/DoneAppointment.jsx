import { useEffect, useState } from "react";
import "./Appointment.scss";
import axiosIntance from "../../../../axios";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ICONS
import { FiSearch } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { uploadUrl } from "../../../../fileurl";

const DoneAppointment = () => {
  const [doneAppointment, setDoneAppointment] = useState([]);

  // =========================
  // GET PENDING APPOINTMENTS
  // =========================
  useEffect(() => {
    const veterinarian = async () => {
      try {
        const res = await axiosIntance.get(
          "admin/appointment/getPendingAppointment.php"
        );
        if (res.data.success) {
          setDoneAppointment(res.data.data);
          console.log("DATA : ", res.data.data);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };

    veterinarian();
  }, []);

  // =========================
  // SEARCH FILTER
  // =========================
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = doneAppointment.filter(
    (item) =>
      item.drFullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.history_health_issue
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.appointment_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pet_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================
  // PAGINATION
  // =========================
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

  // ======================================
  // 📌 PDF EXPORT – PENDING APPOINTMENTS
  // ======================================
  const downloadPendingAppointmentPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const downloadDate = new Date().toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("VETSMAGIC", pageWidth / 2, 12, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Magsaysay st., Cogon Bibincahan, Sorsogon", pageWidth / 2, 17, {
      align: "center",
    });

    doc.setLineWidth(0.4);
    doc.line(14, 21, pageWidth - 14, 21);

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Pending Appointment", pageWidth / 2, 28, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("All Records", pageWidth / 2, 33, { align: "center" });

    // DATA (PENDING ONLY)
    const allData = filteredData.filter((x) => x.status === 0);

    if (!allData.length) {
      alert("No pending appointments found.");
      return;
    }

    const tableRows = allData.map((item) => [
      item.appointment_id,
      item.clientName,
      item.pet_type,
      item.pet_name,
      item.service,
      item.history_health_issue,
      item.current_health_issue,
      `Dr. ${item.drFullname}`,
      item.appointment_date,
      item.appointment_time,
      item.payment_method,
      item.paid_payment,
      "Pending",
    ]);

    autoTable(doc, {
      startY: 38,
      head: [
        [
          "ID",
          "Client",
          "Pet Type",
          "Pet Name",
          "Service",
          "Medical History",
          "Health Issue",
          "Doctor",
          "Date",
          "Time",
          "Payment",
          "Amount",
          "Status",
        ],
      ],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.6 },
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center" },
        12: { halign: "center" },
      },
    });

    // FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(
        `Downloaded on: ${downloadDate}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
      doc.setTextColor(0);
    }

    doc.save("Pending_Appointments.pdf");
  };

  return (
    <>
      <div className="admin-appointment">
        <div className="top">
          <div className="left">
            <h3>APPOINTMENT</h3>
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
              style={{
                color: "white",
                fontSize: "10px",
                height: "30px",
                padding: "0 10px",
              }}
              className="btn-addnew"
              title="Download PDF"
              onClick={downloadPendingAppointmentPDF}
            >
              Download PDF
            </button>

            <button title="Add New Record" className="btn-addnew">
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
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Payment Method</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item.user_id}>
                    <td style={{ fontWeight: "700" }}>{item.appointment_id}</td>
                    <td>
                      <img
                        src={`${uploadUrl.uploadurl}/${item.image}`}
                        alt="profile"
                        style={{
                          height: "40px",
                          width: "40px",
                          objectFit: "cover",
                        }}
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
                    <td>{item.paid_payment}</td>
                    <td>{item.status === 0 ? "Pending" : "Done"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} style={{ textAlign: "center", padding: 10 }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {currentData.length > 0 && (
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  style={{
                    fontWeight: currentPage === i + 1 ? "bold" : "normal",
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

export default DoneAppointment;
