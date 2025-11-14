import "./Appointment.scss";
import Swal from "sweetalert2";

import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import Loader3 from "../../components/loader/Loader3";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../../components/footer/Footer";

//IMAGES
import appointmentImage from "../../assets/icons/medical-appointment.png";
import cat from "../../assets/icons/mouth.png";
import html2pdf from "html2pdf.js";

//ICONS
import { BsCalendar2Date } from "react-icons/bs";
import { CiStethoscope } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { PiPawPrintLight } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import Emptydata from "../../components/emptydata/Emptydata";
import { LiaEdit } from "react-icons/lia";
import { PiPrinterLight } from "react-icons/pi";

const Appointment = ({ onSubmit, onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const receiptRef = useRef();

  const [activeContent, setActiveContent] = useState(true);

  const [activeAppointment, setActiveAppointment] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [clickedAppointment, setClickedAppointment] = useState({
    time: "",
    duration: "",
    id: "",
  });

  // jhdfjh
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [appointment_id, setAppointmentId] = useState(null);
  const [userIdC, setUserIdC] = useState(null);

  // SELECT REASON
  const handleReasonSelect = (text) => {
    setReason(text);
    setCustomReason("");
  };

  // CLICK CANCEL (show form)
  const handleClickToCancel = ({ appointment_id, user_id }) => {
    setAppointmentId(appointment_id);
    setUserIdC(user_id);
  };

  //Fetch data
  const fetchAppointentData = () => {
    const activeAppointment = async () => {
      setShowLoader(true);
      try {
        const res = await axiosIntance.post(
          "client/appointment/getAppointment.php",
          {
            currentUser: currentUser?.user_id,
          }
        );
        if (res.data.success) {
          setActiveAppointment(res.data.data);
          console.log("DATA : ", res.data.data);
          setShowLoader(false);
        } else {
          setShowLoader(false);

          console.log("Error_ : ", res.data);
        }
      } catch (error) {
        setShowLoader(false);

        console.log("Error : ", error);
      }
    };

    activeAppointment();
  };

  useEffect(() => {
    fetchAppointentData();
  }, []);

  //alert
  const showSuccessAlert_cancel = () => {
    Swal.fire({
      title: "Success!",
      text: "Appointment Cancelled",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
    });
  };

  // SUBMIT CANCELLATION FORM
  const handleSubmitCancel = async (e) => {
    e.preventDefault();

    const finalReason = customReason || reason;
    if (!finalReason.trim()) {
      alert("Please select or enter a reason for cancellation.");
      return;
    }

    try {
      const res = await axiosIntance.post(
        `admin/appointment/setAppointmentCanceled.php?appointment_id=${appointment_id}&client_id=${userIdC}&note_from_vet=${encodeURIComponent(
          finalReason
        )}`
      );

      if (res.data.success) {
        console.log("RES:", res.data.message);
        showSuccessAlert_cancel();
        fetchAppointentData();
        setAppointmentId(null);
        setUserIdC(null);
      } else {
        console.log("Delete failed:", res.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };
  //setClickedCancelId
  // const handleCancelAppointment = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axiosIntance.post(
  //       `admin/appointment/setAppointmentCanceled.php?appointment_id=${clickedCancelId}&client_id=${clickedCancelClientId}&note_from_vet=${encodeURIComponent(
  //         noteFromVetForm
  //       )}`
  //     );

  //     if (res.data.success) {
  //       console.log("RES : ", res.data.message);

  //       const handleUpdateAut = appointment.filter(
  //         (item) => item.appointment_id !== clickedCancelId
  //       );
  //       setAppointment(handleUpdateAut);
  //       setClickedCancelId(null);
  //       setClickedCancelClientId(null);
  //       showSuccessAlert_cancel();
  //     } else {
  //       console.log("Delete failed:", res.data);
  //     }
  //   } catch (error) {
  //     console.log("ERROR:", error);
  //   }
  // };

  //get Appointment

  const handleClickedAppointment = (time, duration, id) => {
    handleTimeDateSlotToRemove();
    setClickedAppointment({ time, duration, id });
    handleTimeDateSlotToRemove();
  };

  /////////////////////////////////////////

  const [showLoader3, setShowLoader3] = useState(false);

  //setAppointment
  const [appointmentForm, setAppointment] = useState({
    appointment_date: "",
    appointment_time: "",
  });

  const [slots, setSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notAvailableTimeSlot, setNotAvailableTimeSlot] = useState([]);

  const [emptyappointment_date, setEmptyappointment_date] = useState("");

  const handleDateChange = (date) => {
    setEmptyappointment_date("");

    setAppointment((prev) => ({
      ...prev,
      appointment_date: date,
    }));
  };

  //timeslots to remove
  const handleTimeDateSlotToRemove = async () => {
    const date = new Date(appointmentForm.appointment_date);
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    console.log("FORMATTED:", formattedDate);

    try {
      const res = await axiosIntance.get(
        "client/appointment/getTimeDateToRemove.php",
        {
          params: { choosenDate: formattedDate },
        }
      );
      if (res.data.success) {
        setNotAvailableTimeSlot(res.data.data);
        console.log("NOT AVAILABLE TIME SLOT : ", res.data.data);
      } else {
        console.log("Error : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    handleTimeDateSlotToRemove();
  }, [clickedAppointment, appointmentForm.appointment_date]);

  //get time slot
  useEffect(() => {
    if (!clickedAppointment?.time || !clickedAppointment?.duration) return;
    if (!notAvailableTimeSlot) return;

    const generateTimeSlots = (timeRange, duration) => {
      const [start, end] = timeRange.split(" - ");
      const slotList = [];

      const toDate = (timeStr) => {
        const [time, modifier] = timeStr
          .match(/(\d{1,2}:\d{2})(AM|PM)/)
          .slice(1, 3);
        const [hours, minutes] = time.split(":").map(Number);
        let h = hours % 12;
        if (modifier === "PM") h += 12;
        const date = new Date();
        date.setHours(h, minutes, 0, 0);
        return date;
      };

      let current = toDate(start);
      const endTime = toDate(end);

      const lunchStart = new Date(current);
      lunchStart.setHours(11, 0, 0, 0);

      const lunchEnd = new Date(current);
      lunchEnd.setHours(13, 0, 0, 0);

      while (current < endTime) {
        let next = new Date(current.getTime() + duration * 60000);

        // Skip lunch
        if (current >= lunchStart && current < lunchEnd) {
          current = new Date(lunchEnd);
          continue;
        }

        if (next > lunchStart && current < lunchStart) {
          next = new Date(lunchStart);
        }

        if (next > endTime) next = new Date(endTime);

        slotList.push(`${formatTime(current)} - ${formatTime(next)}`);
        current = new Date(next);
      }

      return slotList;
    };

    const formatTime = (date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes.toString().padStart(2, "0")}${ampm}`;
    };

    const allSlots = generateTimeSlots(
      clickedAppointment.time,
      clickedAppointment.duration
    );

    const unavailable = notAvailableTimeSlot.map(
      (item) => item.appointment_time
    );

    const availableSlots = allSlots.filter(
      (slot) => !unavailable.includes(slot)
    );

    setSlots(availableSlots);
  }, [clickedAppointment, notAvailableTimeSlot]);

  // submit updated appointment
  const handleSubmitUpdatedAppointment = async (e) => {
    e.preventDefault();

    setShowLoader3(true);

    const formattedDate = new Date(
      appointmentForm.appointment_date
    ).toLocaleDateString("en-CA");

    try {
      const res = await axiosIntance.post(
        "client/appointment/updateAppointment.php",
        {
          appointment_id: clickedAppointment.id,
          date: formattedDate,
          time_slot: selectedTimeSlot,
        }
      );

      if (res.data.success) {
        setShowLoader3(false);

        console.log("SUCCESS : ", res.data.message);
        setClickedAppointment({});
        showSuccessAlert();
      } else {
        console.log("ERROR : ", res.data);
        setShowLoader3(false);
      }
    } catch (error) {
      console.log("Error : ", error);
      setShowLoader3(false);
    }
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Appointment Updated",
      icon: "success",
      confirmButtonText: "OK",
      background: "rgba(0, 0, 0, 0.9)",
      color: "lightgrey",
      timer: 1200,
      showConfirmButton: false,
    });
  };
  const handleDownload = () => {
    setShowReceipt(true);
    setTimeout(() => {
      const element = receiptRef.current;
      if (!element) {
        console.error("Receipt element not found");
        return;
      }

      const opt = {
        margin: 0,
        filename: "vetcare-receipt.pdf",
        image: { type: "jpeg", quality: 0.9 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: [80, 140],
          orientation: "portrait",
        },
      };

      html2pdf().set(opt).from(element).save();
    }, 1000);
  };

  const [showReceipt, setShowReceipt] = useState(false);
  const [appointmentFormReceipt, setAppointmentFormReceipt] = useState({
    appointment_date: "",
    appointment_time: "",
    breed: "",
    current_health_issue: "",
    drFullname: "",
    paid_payment: "",
    pet_name: "",
    pet_type: "",
    service: "",
  });

  const handleGetReceipt = (item) => {
    console.log("ITEM  : ", item);
    setShowReceipt(true);
    setAppointmentFormReceipt({
      appointment_date: item.appointment_date,
      appointment_time: item.appointment_time,
      breed: item.breed,
      current_health_issue: item.current_health_issue,
      drFullname: item.drFullname,
      paid_payment: item.paid_payment,
      pet_name: item.pet_name,
      pet_type: item.pet_type,
      service: item.service,
    });
  };

  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={receiptRef}>
          <div className="receipt">
            <div className="top">
              <span>VETSMAGIC</span>
              <p style={{ textAlign: "center", marginBottom: "7px" }}>
                Magsaysay st,. Cogon bibincahan, Sorsogon
              </p>
              <p>0917 639 9344</p>
            </div>
            <div className="border">
              <span>RECEIPT</span>
            </div>
            <div className="content">
              <section>
                <span>
                  Appointment Date: {appointmentFormReceipt.appointment_date}
                </span>
                <span>
                  Appointment Time: {appointmentFormReceipt.appointment_time}
                </span>
              </section>
              <section>
                <strong>Owner Information</strong>
                <span>Name: {currentUser.fullname}</span>
                <span>Contact: {currentUser.phone}</span>
              </section>
              <section>
                <strong>Pet Information</strong>
                <span>Name: {appointmentFormReceipt.pet_name}</span>
                <span>Type: {appointmentFormReceipt.pet_type}</span>
                <span>Breed: {appointmentFormReceipt.breed}</span>
              </section>
              <section>
                <strong>Service</strong>
                <span>Treatment: {appointmentFormReceipt.service}</span>
                <span>
                  Health Issue: {appointmentFormReceipt.current_health_issue}
                </span>
                <span>Dr. Incharge: {appointmentFormReceipt.drFullname}</span>
              </section>
              <section>
                <div
                  style={{ borderTop: "3px dotted gray", marginBottom: "20px" }}
                ></div>
                <strong>Payment</strong>
                <span>
                  Payment:{" "}
                  <strong style={{ color: "#000" }}>
                    ₱ {appointmentFormReceipt.paid_payment}
                  </strong>
                </span>
                <div
                  style={{ borderTop: "3px dotted gray", marginTop: "20px" }}
                ></div>
              </section>
              <span
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "14px",
                }}
              >
                Thank You!!!
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="appointment">
        <div className="container">
          <div className="top">
            <h2 className="main-title">Appointment</h2>{" "}
          </div>
          {!showLoader && (
            <div className="title">
              <h3>
                <BsCalendar2Date className="icon" />{" "}
                {!activeContent
                  ? "Previous Appointment"
                  : "Pending Appointment"}
              </h3>

              <button onClick={() => setActiveContent(!activeContent)}>
                {activeContent
                  ? " Previous Appointment"
                  : "Pending Appointment"}
              </button>
            </div>
          )}
          <div className="myappointment">
            {activeContent && (
              <div className="current-appointment">
                {showLoader ? (
                  <Loader3 />
                ) : (
                  (() => {
                    const filteredAppointment = activeAppointment.filter(
                      (item) => item.status === 0
                    );

                    return filteredAppointment.length > 0 ? (
                      filteredAppointment.map((item) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="card"
                          key={item.appointment_id}
                        >
                          <img
                            src={appointmentImage}
                            alt=""
                            className="profile"
                          />
                          <div className="right-card">
                            <div className="top-card">
                              <h3 className="dr">
                                <PiPawPrintLight className="iconn" />
                                {item.pet_name}

                                <small
                                  style={{
                                    color: "gray",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  ({item.pet_type})
                                </small>
                              </h3>
                              <div className="date-time">
                                <span className="date">
                                  <CiStethoscope className="iconn" />
                                  Dr. {item.drFullname}
                                </span>
                                <span className="date">
                                  <CiCalendarDate className="iconn" />
                                  {item.appointment_date}
                                </span>

                                <div className="time-price">
                                  <span className="time">
                                    <CiClock2 className="iconn" />
                                    {item.appointment_time}
                                  </span>

                                  <div
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                      }}
                                      className="price"
                                    >
                                      <IoPricetagsOutline className="iconn" />₱
                                      {item.paid_payment}
                                      <span
                                        style={{
                                          color: "gray",
                                          fontSize: "12px",
                                          marginBottom: "5px",
                                          marginLeft: "5px",
                                        }}
                                        className="price"
                                      >
                                        ({item.payment_method})
                                      </span>
                                    </p>
                                    {(() => {
                                      const createdAtDate = new Date(
                                        item.createdAt
                                      );
                                      const now = new Date();
                                      const diffInMs = now - createdAtDate; // difference in milliseconds

                                      if (
                                        diffInMs >= 0 &&
                                        diffInMs <= 24 * 60 * 60 * 1000
                                      ) {
                                        // show button only if createdAt is in the past 24 hours
                                        return (
                                          <button
                                            style={{
                                              backgroundColor: "#ccc",
                                              color: "#333",
                                              border: "none",
                                              borderRadius: "5px",
                                              padding: "8px 16px",
                                              cursor: "pointer",
                                              fontWeight: "500",
                                              transition:
                                                "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) =>
                                              (e.target.style.backgroundColor =
                                                "#bbb")
                                            }
                                            onMouseLeave={(e) =>
                                              (e.target.style.backgroundColor =
                                                "#ccc")
                                            }
                                            onClick={() =>
                                              handleClickToCancel({
                                                appointment_id:
                                                  item.appointment_id,
                                                user_id: item.client_id,
                                              })
                                            }
                                          >
                                            Cancel
                                          </button>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="icon-buttons">
                              <PiPrinterLight
                                title="Download Receipt"
                                className="icon"
                                onClick={() => {
                                  handleGetReceipt(item);
                                  handleDownload();
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <Emptydata />
                    );
                  })()
                )}
              </div>
            )}

            {!activeContent && (
              <div className="previous-appointment">
                {showLoader ? (
                  <Loader3 />
                ) : (
                  (() => {
                    const filteredAppointment = activeAppointment.filter(
                      (item) => item.status !== 0
                    );

                    return filteredAppointment.length > 0 ? (
                      filteredAppointment.map((item) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="card"
                          key={item.appointment_id}
                        >
                          <img
                            src={appointmentImage}
                            alt=""
                            className="profile"
                          />
                          <div className="right-card">
                            <div className="top-card">
                              <h3 className="dr">
                                <PiPawPrintLight className="iconn" />
                                {item.pet_name}
                              </h3>
                              <span className="rule">{item.pet_type}</span>
                              <div className="date-time">
                                <span className="date">
                                  <CiStethoscope className="iconn" />
                                  Dr. {item.drFullname}
                                </span>
                                <span className="date">
                                  <CiCalendarDate className="iconn" />
                                  {item.appointment_date}
                                </span>

                                <div className="time-price">
                                  <span className="time">
                                    <CiClock2 className="iconn" />
                                    {item.appointment_time}
                                  </span>

                                  <p
                                    style={{
                                      display: "flex",
                                      justifyContent: "start",
                                      alignItems: "center",
                                    }}
                                    className="price"
                                  >
                                    <IoPricetagsOutline className="iconn" />₱
                                    {item.paid_payment}
                                    <span
                                      style={{
                                        color: "gray",
                                        fontSize: "12px",
                                        marginBottom: "5px",
                                        marginLeft: "5px",
                                      }}
                                      className="price"
                                    >
                                      ({item.payment_method})
                                    </span>
                                  </p>
                                </div>

                                <span className="notefromvet">
                                  <span
                                    style={{ color: "gray", fontSize: "12px" }}
                                  >
                                    Note:
                                  </span>
                                  {item.note_from_vet}
                                </span>

                                <span
                                  style={{
                                    alignSelf: "end",
                                    color: item.status === 1 ? "blue" : "red",
                                  }}
                                >
                                  {item.status === 1
                                    ? "Completed"
                                    : "Cancelled"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <Emptydata />
                    );
                  })()
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {clickedAppointment?.id && (
        <div className="modal-edit-sched-overlay">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="modal-edit-sched"
          >
            <div className="date-available">
              <span className="note2">
                Choose your appointment date and time.{" "}
              </span>
              <h6>Select Your Preferred Date</h6>

              <div className="dates-wrapper">
                <span
                  style={{
                    color: `${emptyappointment_date !== "" ? "red" : ""}`,
                  }}
                >
                  {emptyappointment_date !== "" ? emptyappointment_date : ""}
                </span>

                <div
                  style={{
                    border: `${
                      emptyappointment_date !== "" ? "red 2px solid" : ""
                    }`,
                  }}
                  className="date-input"
                >
                  <DatePicker
                    name="appointment_date"
                    selected={appointmentForm.appointment_date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={
                      new Date(new Date().setDate(new Date().getDate() + 6))
                    }
                    filterDate={(date) => date.getDay() !== 0}
                    placeholderText="Select your preferred date"
                    dateFormat="yyyy-MM-dd"
                  />

                  <BsCalendar2Date className="icon" />
                </div>
              </div>
            </div>

            <div className="time-available">
              <h6>Available Time Slots</h6>

              {appointmentForm.appointment_date !== "" ? (
                <div className="times-wrapper">
                  {slots.length > 0 ? (
                    slots.map((item, index) => (
                      <button
                        disabled={appointmentForm.appointment_date === ""}
                        key={index}
                        className={`time ${
                          selectedTimeSlot === item ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTimeSlot(item)}
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <div className="no-avslot">
                      <img src={cat} alt="cat_img" />
                      <p>No Available Slot for your Choosen date</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="choose-date">
                  <span>
                    Available time slots will be shown after you choose your
                    preferred date.
                  </span>
                </div>
              )}

              <div className="set-appointment-wrapper">
                <FaArrowLeft
                  className="back-icon"
                  onClick={() => setClickedAppointment({})}
                />
                <button
                  disabled={
                    !selectedTimeSlot ||
                    !appointmentForm.appointment_date ||
                    showLoader3
                  }
                  className="btn-setappointment"
                  onClick={handleSubmitUpdatedAppointment}
                >
                  {showLoader3 ? <Loader3 /> : " UPDATE SCHEDULE"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />

      {appointment_id && (
        <div className="cancel-overlay">
          <div className="cancel-box">
            <h3>Reason for Cancellation</h3>
            <form onSubmit={handleSubmitCancel}>
              <div className="suggestions">
                {[
                  "I’m not available on the selected date",
                  "I booked by mistake",

                  "Other",
                ].map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`reason-btn ${reason === item ? "active" : ""}`}
                    onClick={() => handleReasonSelect(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Or type your own reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              ></textarea>

              <div className="actions">
                <button type="submit" className="submit-btn">
                  Confirm Cancel
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setAppointmentId(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Appointment;
