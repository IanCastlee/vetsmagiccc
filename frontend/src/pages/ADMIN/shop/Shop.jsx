import "./Shop.scss";

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
import Emptydata from "../../../components/emptydata/Emptydata";
import { uploadUrl } from "../../../../fileurl";

const Shop = () => {
  const [data, setData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const [activeFormModal, setActiveFormModal] = useState("");
  const [showDelForm, setShowDelForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    medicine_id: "",
    specialization: "",
    category: "",
    med_name: "",
    stock: "",
    price: "",
    dosage: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(formData.image);
  //handle submmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataAppend = new FormData();
    formDataAppend.append("specialization", formData.specialization);
    formDataAppend.append("category", formData.category);
    formDataAppend.append("med_name", formData.med_name);
    formDataAppend.append("stock", formData.stock);
    formDataAppend.append("price", formData.price);
    formDataAppend.append("dosage", formData.dosage);
    formDataAppend.append("description", formData.description);
    formDataAppend.append("image", formData.image);

    try {
      const res = await axiosIntance.post(
        "admin/shop/PostMedicine.php",
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
      const res = await axiosIntance.get("admin/shop/GetShop.php");
      if (res.data.success) {
        setData(res.data.data);
        console.log("PROD : ", res.data.data);
      } else {
        console.log("Error : ", res.data.data);
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
      medicine_id: item.medicine_id || "",
      specialization: item.specialization || "",
      category: item.category || "",
      med_name: item.med_name || "",
      stock: item.stock || "",
      price: item.price || "",
      dosage: item.dosage || "",
      description: item.description || "",
    });

    setActiveFormModal("update");
  };

  //closeFormModal
  const closeFormModal = () => {
    setFormData({
      medicine_id: "",
      specialization: "",
      category: "",
      med_name: "",
      stock: "",
      price: "",
      dosage: "",
      description: "",
      image: "",
    });
    setActiveFormModal("");
  };

  //handleUpdate Veterinarian Information
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const formDataAppend = new FormData();
    formDataAppend.append("medicine_id", formData.medicine_id);
    formDataAppend.append("specialization", formData.specialization);
    formDataAppend.append("category", formData.category);
    formDataAppend.append("med_name", formData.med_name);
    formDataAppend.append("stock", formData.stock);
    formDataAppend.append("price", formData.price);
    formDataAppend.append("dosage", formData.dosage);
    formDataAppend.append("description", formData.description);
    formDataAppend.append("image", formData.image);

    try {
      const res = await axiosIntance.post(
        "admin/shop/UpdateMedicine.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        console.log("Response: ", res.data.message);
        console.log("Updated data: ", data);
        console.log("formData.medicine_id:", formData.medicine_id);

        setData((prevData) =>
          prevData.map((d) => {
            console.log("Checking row with ID:", d.medicine_id);
            if (Number(d.medicine_id) === Number(formData.medicine_id)) {
              console.log("Updating row:", d);
              return { ...d, ...formData };
            }
            return d;
          })
        );

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
        `admin/shop/RemoveMedicine.php?medicine_id=${showDelForm}`
      );

      if (res.data.success) {
        console.log("RES : ", res.data.message);

        setData((prevData) =>
          prevData.filter((d) => d.medicine_id !== showDelForm)
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
      text: "Medicine Updated",
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
      text: "New Product Added",
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
      item.med_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h3>SHOP MANAGEMENT</h3>
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
                  <th>ID</th>
                  <th>Image</th>
                  <th>Med Name</th>
                  <th>Specialization</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Orig_Stock</th>
                  <th>Stock</th>
                  <th className="action-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item) => (
                    <tr key={item.user_id}>
                      <td style={{ fontWeight: "700" }}>{item.medicine_id}</td>
                      <td>
                        <img
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                          }}
                          src={`${uploadUrl.uploadurl}/${item.med_image}`}
                          alt="profile_pic"
                        />
                      </td>
                      <td>{item.med_name}</td>
                      <td>{item.specialization}</td>
                      <td>{item.category}</td>
                      <td>{item.price}</td>
                      <td>{item.orig_stock}</td>
                      <td>{item.stock}</td>
                      <td className="btns-wrapper">
                        <button title="Delete" className="btn">
                          <FaTrashAlt
                            className="icon"
                            onClick={() => setShowDelForm(item.medicine_id)}
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
        <div className="overlay-shop">
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
                    ? "UPDATE PRODUCT"
                    : activeFormModal === "add"
                    ? "ADD NEW PRODUCT"
                    : ""}
                </h3>
                <IoMdClose className="icon" onClick={closeFormModal} />
              </div>

              <form
                onSubmit={
                  activeFormModal === "add"
                    ? handleSubmit
                    : activeFormModal === "update"
                    ? handleUpdateProduct
                    : (e) => e.preventDefault()
                }
                className="form"
              >
                <div className="form-wrapper">
                  <div className="input-label-wrapper">
                    <label htmlFor="specialization">
                      Animal Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={handleChange}
                      name="specialization"
                      id="specialization"
                      required
                    >
                      <option value="">Animal Specialization</option>
                      <option value="Dog Medicine">Dog Medicine</option>
                      <option value="Cat Medicine">Cat Medicine</option>
                      <option value="Bird Medicine">Bird Medicine</option>
                    </select>
                  </div>

                  <div className="input-label-wrapper">
                    <label htmlFor="category">Category</label>
                    <select
                      value={formData.category}
                      onChange={handleChange}
                      name="category"
                      id="category"
                      required
                    >
                      <option value="">Category</option>
                      <option value="Flea & Tick Prevention">
                        Flea & Tick Prevention
                      </option>
                      <option value="Dewormer">Dewormer</option>
                    </select>
                  </div>
                </div>

                <div className="form-wrapper">
                  <div className="input-label-wrapper">
                    <label htmlFor="med_name">Medicine Name</label>
                    <input
                      className="input"
                      type="text"
                      id="med_name"
                      name="med_name"
                      placeholder="Medicine Name"
                      value={formData.med_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-label-wrapper">
                    <label htmlFor="stock">Stock</label>
                    <input
                      className="input"
                      type="number"
                      id="stock"
                      name="stock"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-wrapper">
                  <div className="input-label-wrapper">
                    <label htmlFor="price">Price</label>
                    <input
                      className="input"
                      type="text"
                      id="price"
                      name="price"
                      placeholder="Price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-label-wrapper">
                    <label htmlFor="dosage">Dosage</label>
                    <input
                      className="input"
                      type="text"
                      id="dosage"
                      name="dosage"
                      placeholder="Dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-address-wrapper">
                  <div className="input-label-wrapper">
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

            <p>Are you sure you want to remove this product from the shop?</p>

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

export default Shop;
