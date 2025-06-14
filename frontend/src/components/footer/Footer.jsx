import "./Footer.scss";
import logo from "../../assets/icons/logo.png";
import { Link } from "react-router-dom";
import { IoMdContact } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <div className="logo">
        <img src={logo} alt="" />
        <p>
          One Paw Closer to Better Care. Book your next vet visit in seconds
          with our smart clinic system. Trusted by pet parents. Loved by furry
          friends.
        </p>
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
        <Link className="qlinks">Vaccination</Link>{" "}
        <Link className="qlinks">Deworming</Link>
        <Link className="qlinks">Dental</Link>
        <Link className="qlinks">General Check-up</Link>
        <Link className="qlinks">Surgery</Link>
        <Link className="qlinks">Deworming</Link>
      </div>

      <div className="links">
        <span>Contacts</span>
        <Link className="qlinks">
          <IoMdContact className="icon" /> +63 9877 xxx xxxx
        </Link>{" "}
        <Link className="qlinks">
          <MdEmail className="icon" /> vetcareinfo.gmail.com
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.101011198024!2d123.87176231483047!3d12.6717755909819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a07b41dc94ad4b%3A0x39f716b63079fa27!2sBulan%2C%20Sorsogon!5e0!3m2!1sen!2sph!4v1717933096221!5m2!1sen!2sph"
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
