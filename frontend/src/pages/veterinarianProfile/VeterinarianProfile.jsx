import "./VeterinarianProfile.scss";
import axiosIntance from "../../../axios";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

//IMAGES
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//IC0NS
import { CiStethoscope } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { PiCertificateBold } from "react-icons/pi";
import { LuBadgeCheck } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { PiPhone } from "react-icons/pi";
import { uploadUrl } from "../../../fileurl";
import { FaArrowLeft } from "react-icons/fa6";

const VeterinarianProfile = () => {
  const userId = useParams();
  const [veterinarianInfo, setVeterinarianInfo] = useState([]);
  const [veterinarianServices, setVeterinarianServices] = useState([]);

  useEffect(() => {
    const getClickedVeterinarian = async () => {
      try {
        const res = await axiosIntance.post(
          "admin/veterinarian/GetClickedVeterinarian.php",
          { user_id: userId.userId }
        );

        if (res.data.success) {
          setVeterinarianInfo(res.data.data.veterinarianInfo);
          console.log(res.data.data.veterinarianInfo);
          setVeterinarianServices(res.data.data.services);

          console.log(res.data.data.veterinarianInfo);
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };
    getClickedVeterinarian();
  }, [userId]);

  return (
    <div className="veterinarian">
      <div className="veterinarian-container">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="veterinarian-top"
        >
          <Link to="/home/" className="btn-backlink">
            <FaArrowLeft className="back-icon" />
          </Link>
          <div className="profile-wrapper">
            {
              <img
                src={`${uploadUrl.uploadurl}/${veterinarianInfo?.profile}`}
                alt="profile"
                className="profile"
              />
            }
          </div>
          <div className="name-rules">
            <h3>
              <CiStethoscope className="icon" /> Dr.{" "}
              {veterinarianInfo?.fullname}
            </h3>
            <span className="rule">{veterinarianInfo?.specialization}</span>
          </div>
        </motion.div>
        <div className="veterinarian-bottom">
          <div className="profile-wrapper">
            <LazyLoadImage
              alt="profile"
              src={`${uploadUrl.uploadurl}/${veterinarianInfo?.profile}`}
              effect="blur"
              className="profile"
            />
          </div>
          <div className="name-rule">
            <h3>Dr. {veterinarianInfo?.fullname}</h3>
            <span className="rule">{veterinarianInfo?.specialization}</span>
          </div>
          <div className="veterinarian-userinfo-card-wrapper">
            <div className="services">
              <h3>Services</h3>
              <div className="services-wrapper">
                {veterinarianServices &&
                  veterinarianServices.map((item, index) => (
                    <div key={index} className="card">
                      <span className="service">{item.vservices}</span>
                      <span className="price">₱ {item.price}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="vet-info">
              <span>
                <IoMdTime className="icon" />
                Time Schedule : {veterinarianInfo?.time}
              </span>
              <span>
                <PiCertificateBold className="icon" />
                Certification : {veterinarianInfo?.certification}
              </span>

              <span>
                <LuBadgeCheck className="icon" />
                Experience : {veterinarianInfo?.experience}
              </span>
            </div>

            <div className="contact">
              <h3>Contact</h3>
              <span>
                <MdOutlineMail className="icon" />
                Email : {veterinarianInfo?.email}
              </span>
              <span>
                <PiPhone className="icon" />
                Phone : {veterinarianInfo?.phone}
              </span>
            </div>
          </div>

          <div className="about">
            <h3>About</h3>
            <p className="about">{veterinarianInfo?.about}</p>
          </div>

          <button className="btn-sent-appointment">
            <Link to={`/set-appointment/${veterinarianInfo?.user_id}`}>
              Set Appointment
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianProfile;
