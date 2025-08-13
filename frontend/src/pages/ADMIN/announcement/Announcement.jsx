import "./Announcement.css";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosIntance from "../../../../axios";
import Loader2 from "../../../components/loader/Loader2";
import Swal from "sweetalert2";

//ICONS
import { FaTrashAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { uploadUrl } from "../../../../fileurl";
import { VscMegaphone } from "react-icons/vsc";

const Announcement = () => {
  const [data, setData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const [activeFormModal, setActiveFormModal] = useState("");
  const [showDelForm, setShowDelForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    announcement_name: "",
    announcement: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(formData);

  //handle submmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataAppend = new FormData();
    formDataAppend.append("announcement_name", formData.announcement_name);
    formDataAppend.append("description", formData.description);
    formDataAppend.append("image", formData.image);

    try {
      const res = await axiosIntance.post(
        "admin/announcement/postannouncement.php",
        formDataAppend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        console.log("Response : ", res.data.message);
        setActiveFormModal("");

        fetchedData();
        showSuccessAlert_add_prod();
      } else {
        console.log("Error : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  //get data
  const fetchedData = async () => {
    try {
      const res = await axiosIntance.get(
        "admin/announcement/getannouncement.php"
      );
      if (res.data.success) {
        setData(res.data.data);
        console.log("SERVICES : ", res.data.data);
      } else {
        console.log("Error : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  useEffect(() => {
    fetchedData();
  }, []);

  const setShowEditModal = (item) => {
    setFormData({
      id: item.announcement_id || "",
      description: item.description || "",
      announcement_name: item.title || "",
    });

    setActiveFormModal("update");
  };

  //closeFormModal
  const closeFormModal = () => {
    setFormData({
      id: "",
      announcement_name: "",
      description: "",
      image: "",
    });
    setActiveFormModal("");
  };

  //handleUpdate Veterinarian Information
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formDataAppend = new FormData();
    formDataAppend.append("id", formData.id);
    formDataAppend.append("announcement_name", formData.announcement_name);
    formDataAppend.append("description", formData.description);
    formDataAppend.append("image", formData.image);

    try {
      const res = await axiosIntance.post(
        "admin/announcement/updateannouncement.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        fetchedData();

        closeFormModal();
        showSuccessAlert_update_prod();
      } else {
        console.log("Error : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  //handle Delete
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosIntance.post(
        `admin/announcement/removeannouncement.php?announcement_id=${showDelForm}`
      );

      if (res.data.success) {
        console.log("RES : ", res.data.message);

        setData((prevData) =>
          prevData.filter((d) => d.announcement_id !== showDelForm)
        );

        setShowDelForm(null);
      } else {
        console.log("Delete failed:", res.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  //SWEET ALTERT
  const showSuccessAlert_update_prod = () => {
    Swal.fire({
      title: "Success!",
      text: "Announcement Updated",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const showSuccessAlert_add_prod = () => {
    Swal.fire({
      title: "Success!",
      text: "New Announcement Added",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  //filteredData
  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.postdate.toLowerCase().includes(searchQuery.toLowerCase())
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
    <>
      <div className="admin-shop">
        <div className="top">
          <div className="left">
            <h3>
              <VscMegaphone /> ANNOUNCEMENT
            </h3>
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
          {/* Rows per page control */}
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

          {/* Table */}
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th> ID</th>
                  <th>Image</th>
                  <th>Announcement Title</th>
                  <th>Description</th>

                  <th className="action-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: "700", width: "50px" }}>
                        {item.announcement_id}
                      </td>
                      <td>
                        <img
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                          }}
                          src={`${uploadUrl.uploadurl}/${item.image}`}
                          alt="Service_Image"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>

                      <td className="btns-wrapper">
                        <button title="Delete" className="btn">
                          <FaTrashAlt
                            className="icon"
                            onClick={() => setShowDelForm(item.announcement_id)}
                          />
                        </button>
                        <button
                          title="Edit"
                          className="btn"
                          onClick={() => setShowEditModal(item)}
                        >
                          <FaEdit style={{ color: "blue" }} className="icon" />
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

      {activeFormModal !== "" && (
        <div className="overlay-service">
          <motion.div
            initial={{ opacity: 0, y: -200 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="modaladdshop"
          >
            <div className="container">
              <div className="top">
                <h3 className="title">
                  {activeFormModal === "update"
                    ? "UPDATE ANNOUNCEMENT"
                    : activeFormModal === "add"
                    ? "ADD ANNOUNCEMENT"
                    : ""}
                </h3>
                <IoMdClose className="icon" onClick={closeFormModal} />
              </div>

              <form
                onSubmit={
                  activeFormModal === "add"
                    ? handleSubmit
                    : activeFormModal === "update"
                    ? handleUpdate
                    : (e) => e.preventDefault()
                }
                className="form"
              >
                <div className="form-wrapper">
                  <div
                    style={{ width: "100%" }}
                    className="input-label-wrapper"
                  >
                    <label htmlFor="announcement_name">
                      Announcement Title
                    </label>
                    <input type="hidden" name="id" value={formData.id} />

                    <input
                      value={formData.announcement_name}
                      onChange={handleChange}
                      className="input"
                      type="text"
                      id="announcement_name"
                      name="announcement_name"
                      placeholder="Announcement Title"
                      required
                    />
                  </div>
                </div>

                <div className="form-address-wrapper">
                  <div
                    style={{ width: "100%" }}
                    className="input-label-wrapper"
                  >
                    <label htmlFor="description">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                      placeholder="Description"
                      id="description"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="form-textarea-wrapper">
                  <label htmlFor="image">Medicine Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                      }))
                    }
                    required={activeFormModal === "add"}
                  />
                </div>

                <div className="button-wrapper">
                  <button type="submit" className="btn-submit">
                    {showLoader ? (
                      <Loader2 />
                    ) : activeFormModal === "add" ? (
                      "SUBMIT"
                    ) : activeFormModal === "update" ? (
                      "UPDATE"
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

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

            <p>
              Are you sure you want to remove this announcement from the shop?
            </p>

            <div className="bot">
              <button className="btn-yes" onClick={handleDelete}>
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

export default Announcement;
