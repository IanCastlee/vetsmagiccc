import "./AppointmentHistory.scss";
import { motion } from "framer-motion";

//ICONS
import { IoCloseOutline } from "react-icons/io5";

//IMAGES
import { useContext, useEffect, useState } from "react";
import appointmentImg from "../../../../assets/icons/calendar.png";
import { Link } from "react-router-dom";
import axiosIntance from "../../../../../axios";
import Loader2 from "../../../../components/loader/Loader3";
import Emptydata from "../../../../components/emptydata/Emptydata";
import { AuthContext } from "../../../../contexts/AuthContext";

const AppointmentHistory = ({ close }) => {
  const { currentUser } = useContext(AuthContext);

  const [loader, setLoader] = useState(false);
  const [notif, setNotif] = useState([]);
  const [visibleNotif, setVisibleNotif] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE = 5;

  console.log(currentUser.user_id);
  //get notification
  useEffect(() => {
    const getNotification = async () => {
      setLoader(true);
      const res = await axiosIntance.get(
        `veterinarian/getAppointmentHistory.php?currentId=${currentUser.user_id}`
      );
      if (res.data.success) {
        console.log("getAppointmentHistory : ", res.data.data);
        setNotif(res.data.data);
        setVisibleNotif(res.data.data.slice(0, MAX_VISIBLE));
      } else {
        console.log("Error : ", res.data);
      }
      setLoader(false);
    };

    getNotification();
  }, []);

  const handleViewMore = () => {
    setShowAll(true);
    setVisibleNotif(notif);
  };

  // /handleUpdateAsRead
  const handleUpdateAsRead = async (notif_id) => {
    console.log(": ", notif_id);
    try {
      const res = await axiosIntance.post(
        `client/notif/updateasread.php?notifId=${notif_id}`
      );
      if (res.data.success) {
        const updateAuto = visibleNotif.map((item) =>
          item.notif_id == notif_id ? { ...item, status: 1 } : item
        );

        setVisibleNotif(updateAuto);
      } else {
        console.log("Error from be : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  return (
    <div className="history-overlay">
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="history"
      >
        <div className="top-card">
          <h6>Appointment History</h6>{" "}
          <IoCloseOutline className="icon" onClick={close} />
        </div>
        <div className="notification-content">
          {loader ? (
            <Loader2 />
          ) : visibleNotif.length > 0 ? (
            <>
              {visibleNotif.map((item) => (
                <div key={item.appointment_id} className="card">
                  <p>Owner : {item.petOwner}</p>
                  <p>Service : {item.service}</p>
                  <div className="pet">
                    Pet : <p>{item.pet_name}</p>
                    <p
                      style={{ color: "gray", fontSize: "12px" }}
                    >{`(${item.pet_type})`}</p>
                  </div>

                  <div className="pet">
                    <p>{item.pet_name}</p>
                    <p>{item.pet_type}</p>
                  </div>

                  <div className="pet">
                    <p>{item.appointment_date}</p>
                    <p>{item.appointment_time}</p>
                  </div>
                </div>
              ))}
              {!showAll && notif.length > MAX_VISIBLE && (
                <button className="view-more-btn" onClick={handleViewMore}>
                  View More
                </button>
              )}
            </>
          ) : (
            <Emptydata />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentHistory;
