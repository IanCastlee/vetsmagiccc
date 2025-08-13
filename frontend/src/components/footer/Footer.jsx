import "./Footer.scss";
import logo from "../../assets/icons/vetmagic.png";
import { Link } from "react-router-dom";
import { IoMdContact } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import axiosIntance from "../../../axios";
import { useEffect, useState } from "react";

const Footer = () => {
  const [services, setServices] = useState([]);

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

  return (
    <div className="footer">
      <div className="logo">
        <img src={logo} alt="" />
        <p>VETSMAGIC ANIMAL CLINIC AND GROOMING SERVICES</p>
      </div>

      <div className="links">
        <span>Quick Links</span>
        <Link to="/home/" className="qlinks">
          Home
        </Link>{" "}
        <Link to="/medicine/" className="qlinks">
          Shop
        </Link>
        <Link to="/myappointment/" className="qlinks">
          Appointment
        </Link>
      </div>

      <div className="links">
        <span>Services</span>
        {services &&
          services.map((item, index) => (
            <Link key={index} className="qlinks">
              {item.name}
            </Link>
          ))}
      </div>

      <div className="links">
        <span>Contacts</span>
        <Link className="qlinks">
          <IoMdContact className="icon" /> 0917 639 9344
        </Link>{" "}
        <Link className="qlinks">
          <MdEmail className="icon" /> billyjoelbutay@yahoo.com
        </Link>
      </div>

      <div className="links-soc">
        <span>Social Links</span>
        <div className="soc-wrapper">
          <FaFacebook className="soc-icon" />
          <FaSquareInstagram className="soc-icon" />
          <FaSquareXTwitter className="soc-icon" />
          <FaTiktok className="soc-icon" />
        </div>
      </div>

      <div className="links-soc">
        <span>Our Location</span>
        <div className="map-wrapper">
          <iframe
            title="Clinic Location"
            src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d31101.455930541895!2d124.0052605!3d12.9921803!3m2!1i1024!2i768!4f13.1!2m1!1sMagsaysay%20st%20Cogon%20bibincahan%20Sorsogon%20Philippines!5e0!3m2!1sen!2sph!4v1754319695038!5m2!1sen!2sph"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: "8px", marginTop: "10px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Footer;
