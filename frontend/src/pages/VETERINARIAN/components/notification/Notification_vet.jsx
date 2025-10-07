import "./Notification_vet.scss";
import { motion } from "framer-motion";

//ICONS
import { IoCloseOutline } from "react-icons/io5";

//IMAGES
import { useContext, useEffect, useState } from "react";
import appointmentImg from "../../../../assets/icons/calendar.png";
import { Link } from "react-router-dom";
import axiosIntance from "../../../../../axios";
import { NotifContext } from "../../../../contexts/NotificationContext";
import Loader2 from "../../../../components/loader/Loader3";
import Emptydata from "../../../../components/emptydata/Emptydata";
import OpenNotification from "../../../../components/openNotification/OpenNotification";

const Notification_vet = ({ close }) => {
  const { fetchNotifCount, setActiveNotifCount } = useContext(NotifContext);
  const [loader, setLoader] = useState(false);
  const [notif, setNotif] = useState([]);
  const [visibleNotif, setVisibleNotif] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE = 5;

  const [notificationClicked, setNotificationClicked] = useState(false);
  const [clickedAppointId, setClickedAppointId] = useState(null);
  const [clickedAppointTitle, setClickedAppointTitle] = useState(null);
  const [isVet, setIsVet] = useState(false);

  //get notification
  useEffect(() => {
    const getNotification = async () => {
      setLoader(true);
      const res = await axiosIntance.get("client/notif/getNotification.php");
      if (res.data.success) {
        console.log("NOTIFICATION : ", res.data.data);
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
        setActiveNotifCount();
        setVisibleNotif(updateAuto);
      } else {
        console.log("Error from be : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    fetchNotifCount();
  }, []);

  return (
    <>
      <div className="notificationnn-overlay">
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="notification"
        >
          <div className="top-card">
            <h6>Notification</h6>{" "}
            <IoCloseOutline className="icon" onClick={close} />
          </div>

          <div className="notification-content">
            {loader ? (
              <Loader2 />
            ) : visibleNotif.length > 0 ? (
              <>
                {visibleNotif.map((item) => (
                  <div
                    key={item.notif_id}
                    className={`card ${item.status == 1 ? "clicked" : ""}`}
                    onClick={() => {
                      handleUpdateAsRead(item.notif_id);
                      setNotificationClicked(true);
                      setClickedAppointId(item.appointment_id);
                      setClickedAppointTitle(item.title);
                      setIsVet(true);
                    }}
                  >
                    <div className="left">
                      <img src={appointmentImg} alt="" />
                    </div>
                    <div className="right">
                      <div className="top">
                        <span className="title">{item.title}</span>
                        <p>{item.description}</p>
                      </div>
                      <div className="bot">
                        <span>{item.sentDate}</span>
                        {item.title === "Appointment reminder" && (
                          <button className="btn-view">
                            <Link to="/myappointment/">View</Link>
                          </button>
                        )}
                      </div>
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

      {notificationClicked && (
        <OpenNotification
          appointment_id={clickedAppointId}
          appointment_title={clickedAppointTitle}
          isVet={isVet}
          close={() => {
            setClickedAppointId(null);
            setNotificationClicked(false);
          }}
        />
      )}
    </>
  );
};

export default Notification_vet;
