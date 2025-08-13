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
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../../axios";
import { uploadUrl } from "../../../fileurl";
import { categories } from "../../../constant/catogories";

// COMPONENTS
import Loader3 from "../../components/loader/Loader3";
import Emptydata from "../../components/emptydata/Emptydata";

const MedicineCard = React.memo(({ item, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="card"
      key={item.medicine_id}
      onClick={() => onClick(item)}
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
              <span>Stock : {item.stock}</span>
              <span>Price : ₱ {item.price}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
const Medicine = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [medicineData, setMedicineData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [clickeMedicineData, setClickeMedicineData] = useState(null);

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
      item.specialization.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const clickedReadMore = (item) => {
    setClickeMedicineData(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setClickeMedicineData(null);
    setShowModal(false);
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
                  placeholder="Search Medicine"
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
                        onClick={clickedReadMore}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && clickeMedicineData && (
        <div className="modal-viewmore-overlay">
          <div className="modal-viewmore">
            <div className="top">
              <div className="left" />
              <IoCloseOutline onClick={closeModal} className="close-icon" />
            </div>

            <div className="content">
              <div className="image-wraper">
                <LazyLoadImage
                  src={`${uploadUrl.uploadurl}/${clickeMedicineData.med_image}`}
                  alt={clickeMedicineData.med_name}
                  effect="blur"
                  className="view-medimg"
                />
              </div>

              <span className="med-name-modal">
                {clickeMedicineData.med_name}
              </span>
              <span>
                <strong>Price:</strong> ₱{clickeMedicineData.price}
              </span>
              <span>
                <strong>Category:</strong> {clickeMedicineData.category}
              </span>
              {/* <span>
                <strong>Specialization:</strong>{" "}
                {clickeMedicineData.specialization}
              </span> */}
              {activeCategory !== "Accessories" && (
                <span>
                  <strong>Dosage:</strong> {clickeMedicineData.dosage}
                </span>
              )}
              <span>
                <strong>Stock:</strong> {clickeMedicineData.stock}
              </span>
              <span>
                <strong>Description:</strong> {clickeMedicineData.description}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Medicine;
