import "./Home.scss";
import { motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

//IMAGES
import waveImage from "../../assets/imges/wavebg3.png";
import dogImage from "../../assets/imges/dog.png";
import ttt from "../../assets/imges/user5.jpg";
import { Link } from "react-router-dom";
import axiosIntance from "../../../axios";
import { useContext, useEffect, useState } from "react";

//ICONS
import { CiSearch } from "react-icons/ci";
import { LuView } from "react-icons/lu";
import { CiStethoscope } from "react-icons/ci";

//IMAGES (services)

import Loader3 from "../../components/loader/Loader3";
import { uploadUrl } from "../../../fileurl";
import Footer from "../../components/footer/Footer";

const Home = () => {
  const { setFormToShow, currentUser } = useContext(AuthContext);
  const [showLoader2, setShowLoader2] = useState(false);
  const [veterinarian, setVeterinarian] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loaded, setLoaded] = useState(false);

  // get veterinarian data
  useEffect(() => {
    setShowLoader2(true);
    const getVeterinarian = async () => {
      try {
        const res = await axiosIntance(
          "admin/veterinarian/getveterinarian.php"
        );
        // const res = await axios.get(
        //   `https://vetcare002.kesug.com/backend/admin/veterinarian/getveterinarian.php`
        // );
        if (res.data.success) {
          setVeterinarian(res.data.data);
          setShowLoader2(false);
        } else {
          console.log("Error from server:", res.data.data);
        }
      } catch (error) {
        setShowLoader2(false);
        console.log("Error:", error);
      }
    };

    getVeterinarian();
  }, []);

  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  //get services
  useEffect(() => {
    const getGetservices = async () => {
      try {
        const res = await axiosIntance.get("client/service/getGetservices.php");
        if (res.data.success) {
          console.log("services : ", res.data.data);
          setServices(res.data.data);
        } else {
          console.log("Error from db  : ", res.data);
        }
      } catch (error) {
        console.log("Error from fetching services : ", error);
      }
    };

    getGetservices();
  }, []);

  return (
    <>
      <div className="client-home">
        <div className="hero">
          <div className="hero-left">
            <img src={waveImage} alt="wave-bg" className="wave-bg" />

            <div className="hero-wrapper">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                One Paw Closer to Better Care. Book your next vet visit in
                seconds with our smart clinic system.
              </motion.h1>
              <motion.h6
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Trusted by pet parents. Loved by furry friends.
              </motion.h6>

              <div className="buttons">
                <button>Book Now</button>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <LazyLoadImage
              alt="Dog Image"
              src={dogImage}
              effect="none"
              className="dog-img"
            />

            <div className="trusted-wrapper">
              <span>Trusted by</span>
              <div className="trusted">
                <img src={ttt} alt="" /> <img src={ttt} alt="" />
                <img src={ttt} alt="" />
                <img src={ttt} alt="" />
                <img src={ttt} alt="" />
                <span>9+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="services">
          <h2>Our Services</h2>
          <div className="servives-container">
            {showLoader2 ? (
              <Loader3 />
            ) : (
              services &&
              services.map((item, index) => (
                <div className="services-card" key={index}>
                  <img src={`${uploadUrl.uploadurl}/${item.image}`} alt="" />
                  <span>{item.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="search-container">
          <div className="search-input-icon">
            <input
              type="text"
              placeholder="Search Veterinarian name or specialization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CiSearch className="search-icon" />
          </div>
        </div>

        <div className="veterinarian-container">
          <h2>Available Veterinarian</h2>
          <div className="veterinarian">
            {showLoader2 ? (
              <Loader3 />
            ) : veterinarian.length > 0 ? (
              veterinarian
                .filter((item) =>
                  `${item.fullname} ${item.specialization}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="veterinarian-wrapper"
                  >
                    <LazyLoadImage
                      alt="veterinarian-profile"
                      src={`${uploadUrl.uploadurl}/${item?.profile}`}
                      effect="blur"
                      className="veterinarian-profile"
                    />

                    <div className="veterinarian-info">
                      <div className="veterinarian-name-button-wrapper">
                        <div className="name-rule">
                          <span className="name">
                            <CiStethoscope className="icon" />
                            {highlightMatch(item.fullname, searchTerm)}
                          </span>
                          <span className="rule">
                            {highlightMatch(item.specialization, searchTerm)}
                          </span>
                        </div>

                        <Link to={`/view-veterinarian/${item.user_id}`}>
                          <button>
                            <LuView className="icon-view" />
                          </button>
                        </Link>
                      </div>

                      <button className="btn-set-appointment">
                        {currentUser === null ? (
                          <Link onClick={() => setFormToShow("signin")}>
                            Set Appointment
                          </Link>
                        ) : (
                          <Link to={`/set-appointment/${item.user_id}`}>
                            Set Appointment
                          </Link>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
            ) : (
              <p>No Data Record</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
