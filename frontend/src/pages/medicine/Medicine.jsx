import "./Medicine.scss";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// IMAGES
import bgImage from "../../assets/imges/signinimaeg.png";
import dog from "../../assets/imges/pets (1).png";
import cat from "../../assets/imges/animal-shelter.png";
import bird from "../../assets/imges/dove.png";

// ICONS
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import axiosIntance from "../../../axios";
import Loader3 from "../../components/loader/Loader3";
import { uploadUrl } from "../../../fileurl";
import axios from "axios";
import Emptydata from "../../components/emptydata/Emptydata";

const Medicine = () => {
  const [showModal, setShowModal] = useState(false);
  const [medicineData, setMedicineData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activeCategory, setActiveCategory] = useState("dog");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // Get medicines data
  useEffect(() => {
    const getmedicine = async () => {
      setLoader(true);
      try {
        const res = await axiosIntance.get("admin/shop/getShop.php");

        if (res.data.success) {
          setMedicineData(res.data.data);
          setLoader(false);
        } else {
          console.log("Error from  DB : ", res.data);
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
      }
    };

    getmedicine();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredMedicineData = (category) => {
    return medicineData.filter(
      (item) =>
        item.specialization.toLowerCase().includes(category) &&
        item.med_name.toLowerCase().includes(searchQuery)
    );
  };

  const [clickeMedicineData, setClickeMedicineData] = useState(null);
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
            <div className="left">
              <h1>VETCARE SHOP</h1>
            </div>
            <div className="right">
              <img src={bgImage} alt="" />
            </div>
          </div>

          <div className="content">
            <div className="search-container">
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
            <div className="category">
              <div className="top-med">
                <span className="title-med">Categories</span>
              </div>
              <div className="med-navbar">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  onClick={() => setActiveCategory("dog")}
                  className={`category-card ${
                    activeCategory === "dog" ? "active" : ""
                  }`}
                >
                  <img src={dog} alt="Dog" />
                  <span className="capsule-label">DOG</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  onClick={() => setActiveCategory("cat")}
                  className={`category-card ${
                    activeCategory === "cat" ? "active" : ""
                  }`}
                >
                  <img src={cat} alt="Cat" />
                  <span className="capsule-label">CAT</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  onClick={() => setActiveCategory("bird")}
                  className={`category-card ${
                    activeCategory === "bird" ? "active" : ""
                  }`}
                >
                  <img src={bird} alt="Bird" />
                  <span className="capsule-label">BIRD</span>
                </motion.div>
              </div>
            </div>

            {activeCategory === "dog" && (
              <div className="main-container">
                <div className="medicine-content">
                  <div className="top-med">
                    <span className="title-med">Flea & Tick Prevention</span>
                  </div>
                  <div className="card-container">
                    {loader ? (
                      <Loader3 />
                    ) : filteredMedicineData("dog").length > 0 ? (
                      filteredMedicineData("dog").map((item) => (
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
                                  alt="Medicine Image"
                                  effect="blur"
                                  className="med-img"
                                />
                              </div>
                              <div className="right">
                                <div className="info">
                                  <span className="med-name">
                                    {item.med_name}
                                  </span>
                                  <span>
                                    Stock :{" "}
                                    {item.stock.length > 0
                                      ? "In Stock"
                                      : "Out of Stock"}{" "}
                                    ({item.stock})
                                  </span>
                                  <span>Price : ₱ {item.price}</span>
                                </div>
                                <button onClick={() => clickedReadMore(item)}>
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <Emptydata />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "cat" && (
              <div className="main-container">
                <div className="medicine-content">
                  <div className="top-med">
                    <span className="title-med">Flea & Tick Prevention</span>
                  </div>
                  <div className="card-container">
                    {loader ? (
                      <Loader3 />
                    ) : filteredMedicineData("cat").length > 0 ? (
                      filteredMedicineData("cat").map((item) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="card"
                          key={item.id}
                        >
                          <div className="med-items">
                            <div className="item-card">
                              <div className="left">
                                <img
                                  src={`${uploadUrl.uploadurl}/${item.med_image}`}
                                  alt=""
                                />
                              </div>
                              <div className="right">
                                <div className="info">
                                  <span className="med-name">
                                    {item.med_name}
                                  </span>
                                  <span>
                                    Stock :{" "}
                                    {item.stock.length > 0
                                      ? "In Stock"
                                      : "Out of Stock"}{" "}
                                    ({item.stock})
                                  </span>
                                  <span>Price : ₱ {item.price}</span>
                                </div>
                                <button onClick={() => clickedReadMore(item)}>
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <Emptydata />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "bird" && (
              <div className="main-container">
                <div className="medicine-content">
                  <div className="top-med">
                    <span className="title-med">Flea & Tick Prevention</span>
                  </div>
                  <div className="card-container">
                    {loader ? (
                      <Loader3 />
                    ) : filteredMedicineData("bird").length > 0 ? (
                      filteredMedicineData("bird").map((item) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="card"
                          key={item.id}
                        >
                          <div className="med-items">
                            <div className="item-card">
                              <div className="left">
                                <img
                                  src={`${uploadUrl.uploadurl}/${item.med_image}`}
                                  alt=""
                                />
                              </div>
                              <div className="right">
                                <div className="info">
                                  <span className="med-name">
                                    {item.med_name}
                                  </span>
                                  <span>
                                    Stock :{" "}
                                    {item.stock.length > 0
                                      ? "In Stock"
                                      : "Out of Stock"}{" "}
                                    ({item.stock})
                                  </span>
                                  <span>Price : ₱ {item.price}</span>
                                </div>
                                <button onClick={() => clickedReadMore(item)}>
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <Emptydata />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && clickeMedicineData && (
        <div className="modal-viewmore-overlay">
          <div className="modal-viewmore">
            <div className="top">
              <div className="left"></div>

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

              <span
                style={{
                  marginBottom: "10px",
                  width: "80%",
                  fontSize: "1.125rem",
                  fontWeight: "500",
                }}
              >
                {clickeMedicineData.med_name}
              </span>
              <span>
                <strong>Price:</strong> ₱{clickeMedicineData.price}
              </span>
              <span>
                <strong>Category:</strong> {clickeMedicineData.category}
              </span>
              <span>
                <strong>Specialization:</strong>{" "}
                {clickeMedicineData.specialization}
              </span>
              <span>
                <strong>Dosage:</strong> {clickeMedicineData.dosage}
              </span>
              <span>
                <strong>Stock:</strong> {clickeMedicineData.stock}
              </span>
              <span>
                <strong>Description:</strong>
                {clickeMedicineData.description}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Medicine;
