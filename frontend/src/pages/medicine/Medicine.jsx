import "./Medicine.scss";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// IMAGES
import bgImage from "../../assets/imges/signinimaeg.png";

// ICONS
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

// HOOKS & HELPERS
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../../axios";
import { uploadUrl } from "../../../fileurl";
import { categories } from "../../../constant/catogories";

// COMPONENTS
import Loader3 from "../../components/loader/Loader3";
import Emptydata from "../../components/emptydata/Emptydata";
import { AuthContext } from "../../contexts/AuthContext";

// Medicine Card
const MedicineCard = React.memo(({ item, onReserve }) => {
  const { currentUser } = useContext(AuthContext);
  const { setFormToShow } = useContext(AuthContext);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="card"
      key={item.medicine_id}
    >
      <div className="med-items">
        <div className="item-card">
          <div className="left">
            <LazyLoadImage
              src={`${uploadUrl.uploadurl}/${item.med_image}`}
              alt="Medicine"
              effect="blur"
              className="med-img"
            />
          </div>
          <div className="right">
            <div className="info">
              <span className="med-name">{item.med_name}</span>
              <span>Stock: {item.stock}</span>
              <span>Price: ₱ {item.price}</span>
            </div>
            {currentUser ? (
              <button
                onClick={() => onReserve(item)}
                style={{
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  padding: "5px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Reserve
              </button>
            ) : (
              <button
                onClick={() => setFormToShow("signin")}
                style={{
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  padding: "5px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Reserve
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const Medicine = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [medicineData, setMedicineData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const getMedicine = async () => {
      setLoader(true);
      try {
        const res = await axiosIntance.get("admin/shop/getShop.php");
        if (res.data.success) {
          setMedicineData(res.data.data);
        } else {
          console.log("Error from DB:", res.data);
        }
      } catch (error) {
        console.error("Error fetching medicine:", error);
      } finally {
        setLoader(false);
      }
    };
    getMedicine();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const displayedMedicineData = medicineData.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.med_name.toLowerCase().includes(searchQuery) ||
      (item.specialization || "").toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleReserveClick = (item) => {
    setSelectedMedicine(item);
    setQuantity(1);
    setNotes("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedicine(null);
  };

  const handleSaveReservation = async () => {
    if (!selectedMedicine || !quantity || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const payload = {
        item_id: selectedMedicine.medicine_id,
        user_id: currentUser.user_id,
        price: selectedMedicine.price,
        qty: parseInt(quantity, 10),
        note: notes || "",
      };

      const res = await axiosIntance.post(
        "client/shop_reservation/reserve_medicine.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        alert("✅ Reservation saved successfully!");
        setShowModal(false);
        // Optional: Refresh the medicine data to update stock
        const updated = await axiosIntance.get("admin/shop/getShop.php");
        setMedicineData(updated.data.data);
      } else {
        alert("⚠️ " + res.data.message);
      }
    } catch (err) {
      console.error("Error saving reservation:", err);
      alert("An error occurred while saving reservation.");
    }
  };

  return (
    <>
      <div className="medicine-client">
        <div className="containerr">
          <div className="top">
            <div className="search-container">
              <FaArrowLeft
                className="back-icon-med"
                onClick={() => navigate(-1)}
              />
              <div className="search-input-icon">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <CiSearch className="search-icon" />
              </div>
            </div>

            <div className="title-image">
              <div className="left">
                <h1>VET'SMAGIC SHOP</h1>
              </div>
              <div className="right">
                <img src={bgImage} alt="bg_image" />
              </div>
            </div>
          </div>

          <div className="content">
            <div className="category">
              <div className="top-med">
                <span className="title-med">Categories</span>
              </div>
              <div className="med-navbar">
                <div className="scroll-wrapper">
                  {categories.map((item) => (
                    <motion.div
                      key={item.id}
                      className="category-card"
                      onClick={() => setActiveCategory(item.categoryName)}
                    >
                      <div
                        className={`img-wrapper ${
                          activeCategory === item.categoryName ? "active" : ""
                        }`}
                      >
                        <img src={item.img} alt={item.categoryName} />
                      </div>
                      <span
                        className={`capsule-label ${
                          activeCategory === item.categoryName ? "active" : ""
                        }`}
                      >
                        {item.categoryName}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="main-container">
              <div className="medicine-content">
                <div className="top-med">
                  <span className="title-med">{activeCategory}</span>
                </div>

                <div className="card-container">
                  {loader ? (
                    <Loader3 />
                  ) : displayedMedicineData.length === 0 ? (
                    <Emptydata message="No medicine found." />
                  ) : (
                    displayedMedicineData.map((item) => (
                      <MedicineCard
                        item={item}
                        key={item.medicine_id}
                        onReserve={handleReserveClick}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Modal */}
        {showModal && selectedMedicine && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="modal-content"
            >
              <button className="close-btn" onClick={closeModal}>
                <IoCloseOutline size={24} />
              </button>

              <div className="modal-body">
                <img
                  src={`${uploadUrl.uploadurl}/${selectedMedicine.med_image}`}
                  alt="medicine"
                  className="modal-img"
                />
                <h2>{selectedMedicine.med_name}</h2>
                <p>Price: ₱ {selectedMedicine.price}</p>
                <p>Stock: {selectedMedicine.stock}</p>

                <div className="input-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedMedicine.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Notes:</label>
                  <textarea
                    rows="3"
                    placeholder="Add special notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <button className="save-btn" onClick={handleSaveReservation}>
                  Save Reservation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Medicine;

//  {showModal && clickeMedicineData && (
//         <div className="modal-viewmore-overlay">
//           <div className="modal-viewmore">
//             <div className="top">
//               <div className="left" />
//               <IoCloseOutline onClick={closeModal} className="close-icon" />
//             </div>

//             <div className="content">
//               <div className="image-wraper">
//                 <LazyLoadImage
//                   src={`${uploadUrl.uploadurl}/${clickeMedicineData.med_image}`}
//                   alt={clickeMedicineData.med_name}
//                   effect="blur"
//                   className="view-medimg"
//                 />
//               </div>

//               <span className="med-name-modal">
//                 {clickeMedicineData.med_name}
//               </span>
//               <span>
//                 <strong>Price:</strong> ₱{clickeMedicineData.price}
//               </span>
//               <span>
//                 <strong>Category:</strong> {clickeMedicineData.category}
//               </span>

//               {activeCategory !== "Accessories" && (
//                 <span>
//                   <strong>Dosage:</strong> {clickeMedicineData.dosage}
//                 </span>
//               )}
//               <span>
//                 <strong>Stock:</strong> {clickeMedicineData.stock}
//               </span>
//               <span>
//                 <strong>Description:</strong> {clickeMedicineData.description}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
