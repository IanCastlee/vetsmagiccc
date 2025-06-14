import "./Home.scss";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

//IMAGES

//ICONS
import { CiStethoscope } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbCancel } from "react-icons/tb";
import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import axiosIntance from "../../../../../axios";
import Loader3 from "../../../../components/loader/Loader2";
import Emptydata from "../../../../components/emptydata/Emptydata";
import { uploadUrl } from "../../../../../fileurl";

const Home = () => {
  const vetId = useParams();

  const [loader, setLoader] = useState(false);
  const [veterinarianInfo, setVeterinarianInfo] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [price, setPrice] = useState(null);
  const [clickedDoneId, setClickedDoneId] = useState(null);

  useEffect(() => {
    const getClickedVeterinarian = async () => {
      try {
        const res = await axiosIntance.post(
          "admin/veterinarian/getClickedVeterinarian.php",
          { user_id: vetId.vetId }
        );
        if (res.data.success) {
          setVeterinarianInfo(res.data.data.veterinarianInfo);
          console.log(res.data.data.veterinarianInfo);

          console.log(res.data.data.veterinarianInfo);
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };
    getClickedVeterinarian();
  }, [vetId]);

  //get Appointment
  useEffect(() => {
    const activeAppointment = async () => {
      setLoader(true);
      try {
        const res = await axiosIntance.post(
          "veterinarian/getAppointmentForSpecificVet.php",
          {
            currentVet_id: vetId.vetId,
          }
        );
        if (res.data.success) {
          setAppointment(res.data.data);
          console.log("DATA : ", res.data.data);
          setLoader(false);
        } else {
          setLoader(false);

          console.log("Error_ : ", res.data);
        }
      } catch (error) {
        setLoader(false);

        console.log("Error : ", error);
      }
    };

    activeAppointment();
  }, []);

  //get current date
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const [clickedID, setClickedID] = useState(null);
  //clickedMenu
  const clickedMenu = (id) => {
    setClickedID(id);
  };

  const [moreInfo, setMorenInfo] = useState(null);

  const clickedMoreInfo = (item) => {
    setMorenInfo(item);
    console.log(item);
  };

  const followUpData = [
    {
      id: 1,
      desc: "Follow-up checkup scheduled for next week.",
    },
    {
      id: 2,
      desc: "Next week’s follow-up to monitor your pet’s recovery.",
    },
  ];

  //follow up checkup
  const [clickedToFollowUp, setClickedToFollowUp] = useState({
    appointment_id: "",
    client_id: "",
    dr_fullname: "",
    dr_id: "",
  });
  const [selectedFollowUpMessage, setSelectedFollowUpMessage] = useState(null);
  const [manualMessage, setManualMessage] = useState("");

  const clickedToFollowUpItem = (
    appointment_id,
    client_id,
    dr_fullname,
    dr_id
  ) => {
    setClickedToFollowUp({
      appointment_id: appointment_id,
      client_id: client_id,
      dr_fullname: dr_fullname,
      dr_id: dr_id,
    });
  };

  //handle submit followup appointment
  const handleSubmitFollowUpAppoinment = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await axiosIntance.post(
        "veterinarian/postFollowUpAppointment.php",
        {
          appointment_id: clickedToFollowUp.appointment_id,
          client_id: clickedToFollowUp.client_id,
          title:
            "Follow-Up Appointment for Dr. " + clickedToFollowUp.dr_fullname,
          desc:
            selectedFollowUpMessage !== null
              ? selectedFollowUpMessage
              : manualMessage,
          dr_id: clickedToFollowUp.dr_id,
          price: price,
        }
      );
      if (res.data.success) {
        console.log(res.data.message);

        const handleUpdateAut = appointment.filter(
          (item) => item.appointment_id !== clickedToFollowUp.appointment_id
        );
        setAppointment(handleUpdateAut);
        showSuccessAlert();
        setClickedToFollowUp({
          appointment_id: "",
          client_id: "",
          dr_fullname: "",
        });
        setLoader(false);
      } else {
        console.log(res.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log("Error : ", error);
    }
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Follow-up appointment sent succesfully. Appointment Done",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
    });
  };
  const showSuccessAlert_done = () => {
    Swal.fire({
      title: "Success!",
      text: "Appointment Done",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
    });
  };

  //handeSetAsDoneAppointment
  const handeSetAsDoneAppointment = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosIntance.post(
        `admin/appointment/setAppointmentDone.php?appointment_id=${clickedDoneId}`
      );

      if (res.data.success) {
        console.log("RES : ", res.data.message);

        const handleUpdateAut = appointment.filter(
          (item) => item.appointment_id !== clickedDoneId
        );
        setAppointment(handleUpdateAut);
        setClickedDoneId(null);
        showSuccessAlert_done();
        appoi;
      } else {
        console.log("Delete failed:", res.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  return (
    <>
      <div className="veterinarian-home">
        <div className="container">
          <div className="left">
            <div className="left-wrapper">
              <div className="profile-wrapper">
                <img
                  src={`http://localhost/VETCARE/backend/uploads/${veterinarianInfo?.profile}`}
                  alt="profile_pic"
                  className="profile"
                />
              </div>

              <div className="name-rule">
                <h3>
                  <CiStethoscope className="icon" /> Dr.
                  {veterinarianInfo?.fullname}
                </h3>
                <span> {veterinarianInfo?.specialization}</span>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="right-wrapper">
              <div className="today-appointment">
                <h4>Today's Appointment</h4>

                {loader ? (
                  <Loader3 />
                ) : (
                  (() => {
                    const todayAppointments = appointment.filter(
                      (item) => item.appointment_date === formattedDate
                    );

                    return todayAppointments.length > 0 ? (
                      todayAppointments.map((item) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="card"
                          key={item.appointment_id}
                        >
                          <div className="left-card">
                            <img
                              src={`${uploadUrl.uploadurl}/${item?.image}`}
                              alt="profile"
                              className="profile-card"
                            />
                          </div>

                          <div className="right-card">
                            <div className="top">
                              <div className="name-info">
                                <div className="name">{item.pet_name}</div>
                                <p>{item.appointment_date}</p>
                                <p>{item.appointment_time}</p>

                                <button onClick={() => clickedMoreInfo(item)}>
                                  Read More
                                </button>
                              </div>
                              <MdOutlineMoreHoriz
                                onClick={() => clickedMenu(item.appointment_id)}
                                className="more-icon"
                              />
                            </div>

                            <div className="bot">
                              <div className="pet">
                                <span className="type">
                                  Pet : {item.pet_type}
                                </span>
                              </div>
                            </div>

                            {clickedID === item.appointment_id && (
                              <div className="modal-menu">
                                <div className="top">
                                  <VscClose
                                    className="back-icon"
                                    onClick={() => setClickedID(null)}
                                  />
                                </div>
                                <div className="menu">
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      clickedToFollowUpItem(
                                        item.appointment_id,
                                        item.clientId,
                                        item.drFullname,
                                        item.dr_id
                                      )
                                    }
                                  >
                                    <FaRegCircleCheck className="icon" />
                                    Follow Up
                                  </button>
                                  <button
                                    onClick={() =>
                                      setClickedDoneId(item.appointment_id)
                                    }
                                    className="btn"
                                  >
                                    <FaRegCircleCheck className="icon" />
                                    Done
                                  </button>
                                  <button className="btn">
                                    <TbCancel className="icon" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <Emptydata />
                    );
                  })()
                )}
              </div>

              <div className="divider"></div>

              <div className="pending-appointment">
                <h4>Pending Appointment</h4>

                {loader ? (
                  <Loader3 />
                ) : appointment.length > 0 ? (
                  appointment
                    .filter((item) => item.appointment_date !== formattedDate)
                    .map((item) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="card"
                        key={item.appointment_id}
                      >
                        <div className="left-card">
                          <img
                            src={`${uploadUrl.uploadurl}/${item?.image}`}
                            alt="profile"
                            className="profile-card"
                          />
                        </div>

                        <div className="right-card">
                          <div className="top">
                            <div className="name-info">
                              <div className="name">{item.pet_name}</div>
                              <p>{item.appointment_date}</p>
                              <p>{item.appointment_time}</p>

                              <button onClick={() => clickedMoreInfo(item)}>
                                Read More
                              </button>
                            </div>
                          </div>

                          <div className="bot">
                            <div className="pet">
                              <span className="type">
                                {item.is_followup === 1
                                  ? "Follow-up Appointment"
                                  : ""}
                              </span>
                            </div>
                          </div>

                          {clickedID === item.appointment_id && (
                            <div className="modal-menu">
                              <div className="top">
                                <VscClose
                                  className="back-icon"
                                  onClick={() => setClickedID(null)}
                                />
                              </div>
                              <div className="menu">
                                <button
                                  className="btn"
                                  onClick={() =>
                                    clickedToFollowUpItem(
                                      item.appointment_id,
                                      item.clientId,
                                      item.drFullname,
                                      item.dr_id
                                    )
                                  }
                                >
                                  <FaRegCircleCheck className="icon" />
                                  Follow Up
                                </button>
                                <button
                                  onClick={() =>
                                    setClickedDoneId(item.appointment_id)
                                  }
                                  className="btn"
                                >
                                  <FaRegCircleCheck className="icon" />
                                  Done
                                </button>
                                <button className="btn">
                                  <TbCancel className="icon" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                ) : (
                  <Emptydata />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal  */}
      {moreInfo !== null && (
        <div className="modal-readmore-overlay">
          <motion.div
            initial={{ opacity: 0, y: -200 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="modal-viewmore"
          >
            <div className="top">
              <div className="left">
                <h6>Appointment Details</h6>
              </div>

              <IoMdClose
                onClick={() => setMorenInfo(null)}
                className="close-icon"
              />
            </div>

            <div className="content">
              <div className="title">
                <span>Pet Information</span>
              </div>
              <div className="top-content">
                <div className="image-wraper">
                  <img
                    src={`${uploadUrl.uploadurl}/${moreInfo?.image}`}
                    alt="Pet profile"
                  />
                </div>

                <div className="info">
                  <span>
                    <strong>Name:</strong> {moreInfo.pet_name}
                  </span>

                  <span>
                    <strong>Type:</strong> {moreInfo.pet_type}
                  </span>
                  <span>
                    <strong>Breed:</strong> {moreInfo.breed}
                  </span>
                  <span>
                    <strong>Gender:</strong> {moreInfo.gender}
                  </span>

                  <span>
                    <strong>Weight:</strong> {moreInfo.weight}
                  </span>
                </div>
              </div>

              <div className="pet-owner-content">
                <div className="title">
                  <span>Pet Owner</span>
                </div>

                <span>
                  <strong>Fullname :</strong> {moreInfo.petOwner}
                </span>
                <span>
                  <strong>Address :</strong> {moreInfo.clientAddres}
                </span>
                <span>
                  <strong>Phone :</strong> {moreInfo.phone}
                </span>
              </div>

              <div className="appointment-content">
                <div className="title">
                  <span>Details</span>
                </div>

                <span>
                  <strong>Service :</strong> {moreInfo.service}
                </span>
                <span>
                  <strong>Health Issues :</strong>{" "}
                  {moreInfo.current_health_issue}
                </span>
                <span>
                  <strong>Medical History :</strong>{" "}
                  {moreInfo.history_health_issue}
                </span>
              </div>

              <div className="appointment-content">
                <div className="title">
                  <span>Schedule</span>
                </div>

                <span>
                  <strong>Date :</strong> {moreInfo.appointment_date}
                </span>
                <span>
                  <strong>Time :</strong> {moreInfo.appointment_time}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* modal */}

      {/* modal follow up */}
      {clickedToFollowUp.appointment_id !== "" &&
        clickedToFollowUp.client_id !== "" && (
          <div className="modal-followup-overlay">
            <div className="followup">
              <div className="top">
                <div className="left">Schedule Follow-Up</div>

                <IoMdClose
                  onClick={() =>
                    setClickedToFollowUp({
                      appointment_id: "",
                      client_id: "",
                      dr_fullname: "",
                    })
                  }
                />
              </div>
              <div className="form">
                <div className="card-checklist">
                  {followUpData &&
                    followUpData.map((item) => (
                      <div key={item.id} className="check-item">
                        <input
                          type="radio"
                          name="follow-up"
                          value={item.desc}
                          checked={selectedFollowUpMessage === item.desc}
                          onChange={() => {
                            setSelectedFollowUpMessage(item.desc);
                            setManualMessage("");
                          }}
                        />
                        <span>{item.desc}</span>
                      </div>
                    ))}
                </div>

                <div className="input-wrapper">
                  <label htmlFor="inpt-other-concern">
                    Other Follow Up Message
                  </label>
                  <input
                    id="inpt-other-concern"
                    className="inpt-other-concern"
                    type="text"
                    value={manualMessage}
                    onChange={(e) => {
                      setManualMessage(e.target.value);
                      setSelectedFollowUpMessage(null);
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    borderTop: "1px solid lightgrey",
                    paddingTop: "20px",
                  }}
                  className="input-wrapper"
                >
                  <label htmlFor="inpt-other-concern">Payment</label>

                  <div className="payment-wrapper">
                    <h1>₱</h1>{" "}
                    <input
                      id="inpt-other-concern"
                      className="inpt-other-concern"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  disabled={!price || !selectedFollowUpMessage || loader}
                  onClick={handleSubmitFollowUpAppoinment}
                  className="btn-submit"
                >
                  {loader ? <Loader3 /> : "Send Follow Up"}
                </button>
              </div>
            </div>
          </div>
        )}
      {/* modal follow up end  */}

      {clickedDoneId !== null && (
        <div className="delete-overlay">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="delete"
          >
            <div className="top">
              <h6>Confirmation</h6>
            </div>

            <p>Is this appointment done?</p>

            <div className="bot">
              <button className="btn-yes" onClick={handeSetAsDoneAppointment}>
                Yes
              </button>
              <button className="btn-no" onClick={() => setClickedDoneId(null)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Home;
