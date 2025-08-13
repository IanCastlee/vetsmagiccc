import "./Home.scss";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

//IMAGES
import waveImage from "../../assets/imges/wavebg3.png";
import dogImage from "../../assets/imges/dog.png";
import { Link } from "react-router-dom";
import axiosIntance from "../../../axios";
import { useContext, useEffect, useRef, useState } from "react";

//ICONS
import { CiSearch } from "react-icons/ci";
import { LuView } from "react-icons/lu";
import { CiStethoscope } from "react-icons/ci";
import { PiCalendarPlusLight } from "react-icons/pi";

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
  const [clientProfile, setClientProfile] = useState([]);
  const [loaderDot, setLoaderDot] = useState(false);
  const targetRef = useRef(null);

  // get veterinarian data
  useEffect(() => {
    setShowLoader2(true);
    const getVeterinarian = async () => {
      try {
        const res = await axiosIntance(
          "admin/veterinarian/getveterinarian.php"
        );

        if (res.data.success) {
          setVeterinarian(res.data.data);
          setShowLoader2(false);
        } else {
          console.log("Error from server:", res.data.data);
        }
      } catch (error) {
        setShowLoader2(false);
        console.error("Error:", error);
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

          setClientProfile(res.data.dta);
        } else {
          console.log("Error from db  : ", res.data);
        }
      } catch (error) {
        console.log("Error from fetching services : ", error);
      }
    };

    getGetservices();
  }, []);

  // GetTrustedClient
  useEffect(() => {
    const getProfileReview = async () => {
      setLoaderDot(true);
      try {
        const res = await axiosIntance.get(
          "client/appointment/GetTrustedClient.php"
        );
        if (res.data.success) {
          console.log("DATA :  ", res.data.data);
          setClientProfile(res.data.data);
          setLoaderDot(false);
        } else {
          console.log("Erro from DB : ", res.data);
          setLoaderDot(false);
        }
      } catch (error) {
        console.error("Error from frontend : ", error);
        setLoaderDot(false);
      }
    };
    getProfileReview();
  }, [currentUser]);

  const rotatingWords = ["Livestock", "Wildlife", "Exotic"];

  const handleScroll = () => {
    targetRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
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
                <span style={{ color: "#007bff", fontWeight: "bold" }}>
                  VETSMAGIC
                </span>{" "}
                ANIMAL CLINIC AND GROOMING SERVICES
              </motion.h1>

              <motion.h6
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                We cater all companion animals &nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[index]}
                    className="blue-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {rotatingWords[index]}
                  </motion.span>
                </AnimatePresence>
              </motion.h6>
              <div className="buttons">
                <button onClick={handleScroll}>Book Now</button>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <LazyLoadImage
              alt="Dog Image"
              src={dogImage}
              effect="blur"
              className="dog-img"
            />

            <div className="trusted-wrapper">
              <span>Trusted by</span>
              <div className="trusted">
                {loaderDot ? (
                  <h6>...</h6>
                ) : (
                  clientProfile &&
                  clientProfile.slice(0, 3).map((item, index) => (
                    <div className="img-card" key={index}>
                      {item.profile ? (
                        <img
                          src={`${uploadUrl.uploadurl}/${item?.profile}`}
                          className="client-profile"
                        />
                      ) : (
                        <div className="initial-fallback">
                          {item.fullname?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))
                )}

                <span>+5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="services">
          <h2>Services</h2>
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

        <div ref={targetRef} className="search-container">
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
                            <PiCalendarPlusLight className="btn-icon" /> Set
                            Appointment
                          </Link>
                        ) : (
                          <Link to={`/set-appointment/${item.user_id}`}>
                            <PiCalendarPlusLight className="btn-icon" /> Set
                            Appointment
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
