import "./Appointment.scss";
import Swal from "sweetalert2";

import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import Loader3 from "../../components/loader/Loader3";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../../components/footer/Footer";

//IMAGES
import appointmentImage from "../../assets/icons/medical-appointment.png";
import cat from "../../assets/icons/mouth.png";

//ICONS
import { BsCalendar2Date } from "react-icons/bs";
import { CiStethoscope } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { PiPawPrintLight } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Emptydata from "../../components/emptydata/Emptydata";

const Appointment = () => {
  const { currentUser } = useContext(AuthContext);

  const [activeContent, setActiveContent] = useState(true);

  const [activeAppointment, setActiveAppointment] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [clickedAppointment, setClickedAppointment] = useState({
    time: "",
    duration: "",
    id: "",
  });

  console.log("activeAppointment", activeAppointment);

  //get Appointment
  useEffect(() => {
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
  }, []);

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

  return (
    <>
      <div className="appointment">
        <div className="container">
          <div className="top">
            <h2 className="main-title">Appointment</h2>
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
                      (item) => item.status === 1
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
                                  {item.drFullname}
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

                                  <span className="price">
                                    <IoPricetagsOutline className="iconn" />₱
                                    {item.paid_payment}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <FaRegEdit
                              title="Change Schedule"
                              className="icon"
                              onClick={() =>
                                handleClickedAppointment(
                                  item.time,
                                  item.duration,
                                  item.appointment_id
                                )
                              }
                            />
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
                ) : activeAppointment.length > 0 ? (
                  activeAppointment
                    .filter((item) => item.status === 0)
                    .map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="card"
                        key={index}
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
                                {item.drFullname}
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

                                <span className="price">
                                  <IoPricetagsOutline className="iconn" />₱
                                  {item.paid_payment}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                ) : (
                  <div className="empty-container">
                    <Emptydata />
                  </div>
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
              <span className="note">
                *Choose your appointment date and time.{" "}
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
    </>
  );
};

export default Appointment;
