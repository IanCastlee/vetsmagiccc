import "./About.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axios";
import { uploadUrl } from "../../../fileurl";

function About() {
  const [veterinarian, setVeterinarian] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode weird characters from database
  const fixEncoding = (text) => {
    if (!text) return "";
    return text
      .replace(/â€™/g, "’")
      .replace(/â€”/g, "—")
      .replace(/â€œ/g, "“")
      .replace(/â€/g, "”")
      .replace(/â€¦/g, "…")
      .replace(/â€“/g, "–")
      .replace(/â /g, " ");
  };

  useEffect(() => {
    const getVeterinarian = async () => {
      try {
        const res = await axiosInstance(
          "admin/veterinarian/getveterinarian.php"
        );

        if (res.data.success) {
          const cleanData = res.data.data.map((vet) => ({
            ...vet,
            about: fixEncoding(vet.about),
            certification: fixEncoding(vet.certification),
            experience: fixEncoding(vet.experience),
          }));

          setVeterinarian(cleanData);
        }
      } catch (error) {
        console.error("Error loading vet:", error);
      }

      setLoading(false);
    };

    getVeterinarian();
  }, []);

  return (
    <div className="about-container">
      {/* Title */}
      <motion.h1
        className="about-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span>VETSMAGIC</span> ANIMAL CLINIC AND GROOMING SERVICES
      </motion.h1>

      <p className="about-description">
        Welcome to <strong>VETSMAGIC</strong>, where we prioritize your pet’s
        health, comfort, and well-being. Our clinic provides professional
        veterinary care, grooming services, and advanced diagnostics with
        compassion and expertise.
      </p>

      {/* Veterinarian */}
      <div className="team-section">
        <h2>Our Veterinarian</h2>

        {loading ? (
          <p>Loading veterinarian...</p>
        ) : (
          <div className="team-members">
            {veterinarian.length > 0 ? (
              veterinarian.map((vet) => (
                <div className="team-card vet-card" key={vet.user_id}>
                  {/* Vet Photo */}
                  <img
                    src={`${uploadUrl.uploadurl}/${vet?.profile}`}
                    alt={vet.fullname}
                    className="vet-photo"
                  />

                  {/* Name */}
                  <h3>{vet.fullname}</h3>
                  <p className="role">{vet.specialization}</p>

                  {/* About */}
                  <p className="about-text">{vet.about}</p>

                  {/* Extra Info */}
                  <div className="vet-info">
                    <p>
                      <strong>Experience:</strong> {vet.experience}
                    </p>
                    <p>
                      <strong>Certification:</strong> {vet.certification}
                    </p>
                    <p>
                      <strong>Clinic Time:</strong> {vet.time}
                    </p>
                    <p>
                      <strong>Address:</strong> {vet.address}
                    </p>

                    <p>
                      <strong>Contact:</strong> {vet.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {vet.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No veterinarian data available</p>
            )}
          </div>
        )}
      </div>

      {/* Staff */}
      <div className="team-section">
        <h2>Our Staff</h2>
        <div className="team-members">
          <div className="team-card">
            <h3>Jose Marie</h3>
            <p>Staff Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
