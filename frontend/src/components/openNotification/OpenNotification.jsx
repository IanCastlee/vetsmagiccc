import { useEffect, useState } from "react";
import "./OpenNotification.scss";
import axiosIntance from "../../../axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { uploadUrl } from "../../../fileurl";
import { motion } from "framer-motion";

import { AiOutlineClose } from "react-icons/ai";

function OpenNotification({ appointment_id, appointment_title, isVet, close }) {
  const [notifDetails, setNotifDetails] = useState([]);

  //get DATA
  useEffect(() => {
    const getNotificationDetails = async () => {
      const res = await axiosIntance.get(
        `client/notif/getNotificationDetails.php?appointment_id=${appointment_id}`
      );
      if (res.data.success) {
        console.log("NOTIFICATION : ", res.data.data);
        setNotifDetails(res.data.data[0]);
      } else {
        console.log("Error : ", res.data);
      }
    };

    getNotificationDetails();
  }, []);

  return (
    <>
      <div className="open-notif-overlay">
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="open-notif-details"
        >
          <div className="open-pet-header">
            <h2>{appointment_title && appointment_title}</h2>

            <AiOutlineClose className="close-open" onClick={close} />
          </div>
          <div className="image-pet-deatils">
            <LazyLoadImage
              src={`${uploadUrl.uploadurl}/${notifDetails.image}`}
              effect="blur"
              className="view-medimg2"
            />

            <div className="open-pet-details">
              <span className="span-details">
                <span style={{ fontSize: "10px", color: "gray" }}>
                  Pet Name:{" "}
                </span>{" "}
                {notifDetails.pet_name}
              </span>
              <span className="span-details">
                <span style={{ fontSize: "10px", color: "gray" }}>
                  Pet Type:{" "}
                </span>{" "}
                {notifDetails.pet_type}
              </span>
              <span className="span-details">
                <span style={{ fontSize: "10px", color: "gray" }}>Breed: </span>{" "}
                {notifDetails.breed}
              </span>
              <span className="span-details">
                <span style={{ fontSize: "10px", color: "gray" }}>
                  Gender:{" "}
                </span>{" "}
                {notifDetails.gender}
              </span>
            </div>
          </div>

          <div className="appointment-open-info">
            <span className="span-details">
              <span style={{ fontSize: "10px", color: "gray" }}>
                Vet Incharge:{" "}
              </span>{" "}
              {notifDetails.drFullname}
            </span>
            <span className="span-details">
              <span style={{ fontSize: "10px", color: "gray" }}>Service: </span>{" "}
              {notifDetails.service}
            </span>
            <span className="span-details">
              <span style={{ fontSize: "10px", color: "gray" }}>
                Healh Issue or Concern:{" "}
              </span>{" "}
              {notifDetails.current_health_issue}
            </span>
            {isVet && (
              <span className="span-details">
                <span style={{ fontSize: "10px", color: "gray" }}>
                  Appointment History:{" "}
                </span>{" "}
                {notifDetails.history_health_issue}
              </span>
            )}
            <span className="span-details">
              <span style={{ fontSize: "10px", color: "gray" }}>
                Appointment Date:{" "}
              </span>{" "}
              {notifDetails.appointment_date}
            </span>
            <span className="span-details">
              <span style={{ fontSize: "10px", color: "gray" }}>
                Appointment Time:{" "}
              </span>{" "}
              {notifDetails.appointment_time}
            </span>

            {!isVet && (
              <span className="span-price">
                <span style={{ fontSize: "10px", color: "gray" }}>
                  Online Payment: ₱
                </span>{" "}
                {notifDetails.paid_payment}
              </span>
            )}
          </div>

          {!isVet && (
            <div className="open-status-wrapper">
              <span className="open-status">
                {notifDetails.status === 0
                  ? "Pending"
                  : notifDetails.status === 1
                  ? "Completed"
                  : notifDetails.status === 2
                  ? "Cancelled"
                  : null}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default OpenNotification;
