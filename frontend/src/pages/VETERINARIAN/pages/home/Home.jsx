import "./Home.scss";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//IMAGES

//ICONS
import { CiStethoscope } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaUser } from "react-icons/fa";

import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbCancel, TbVaccine } from "react-icons/tb";
import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import axiosIntance from "../../../../../axios";
import Loader3 from "../../../../components/loader/Loader2";
import Emptydata from "../../../../components/emptydata/Emptydata";
import { uploadUrl } from "../../../../../fileurl";
import { PiVirusBold } from "react-icons/pi";

const Home = () => {
  const vetId = useParams();

  const [loader, setLoader] = useState(false);
  const [veterinarianInfo, setVeterinarianInfo] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [price, setPrice] = useState("");
  const [clickedDoneId, setClickedDoneId] = useState(null);

  const [clickedCancelId, setClickedCancelId] = useState(null);
  const [clickedCancelClientId, setClickedCancelClientId] = useState(null);

  const [showVaccinationModal, setShowVaccinationModal] = useState(false);

  const [noteFromVetForm, setNoteFromVetForm] = useState("");

  useEffect(() => {
    const getClickedVeterinarian = async () => {
      try {
        const res = await axiosIntance.post(
          "admin/veterinarian/GetClickedVeterinarian.php",
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
    phone: "",
    pet_name: "",
    pet_type: "",
  });
  const [selectedFollowUpMessage, setSelectedFollowUpMessage] = useState(null);
  const [manualMessage, setManualMessage] = useState("");

  const clickedToFollowUpItem = (
    appointment_id,
    client_id,
    dr_fullname,
    dr_id,
    phone,
    petName,
    petType
  ) => {
    setClickedToFollowUp({
      appointment_id: appointment_id,
      client_id: client_id,
      dr_fullname: dr_fullname,
      dr_id: dr_id,
      phone: phone,
      pet_name: petName,
      pet_type: petType,
    });
  };

  //handleSubmitSms
  const handleSubmitSms = async () => {
    try {
      await axiosIntance.post("send_sms.php", {
        phone: clickedToFollowUp.phone,
        message: `Dr. ${clickedToFollowUp.dr_fullname} is waiting for your confirmation regarding a follow-up appointment for your pet ${clickedToFollowUp.pet_name} next week.\n\nPlease visit the VetCare website to choose a date and confirm the appointment details.`,
      });
      console.log("SMS SENT");
    } catch (err) {
      console.error(err);
      alert("Failed to send SMS.");
    }
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
          pet_name: clickedToFollowUp.pet_name,
          pet_type: clickedToFollowUp.pet_type,
          title:
            "Follow-Up Appointment with Dr. " + clickedToFollowUp.dr_fullname,
          desc: `${
            selectedFollowUpMessage !== null
              ? selectedFollowUpMessage
              : manualMessage
          } - Petname:  ${clickedToFollowUp.pet_name}, (${
            clickedToFollowUp.pet_type
          })`,
          vet_note: manualMessage,

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

        // Clear state
        setClickedToFollowUp({
          appointment_id: "",
          client_id: "",
          dr_fullname: "",
        });

        await handleSubmitSms();

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

  //handeSetAsDoneAppointment
  const handeSetAsDoneAppointment = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosIntance.get(
        `admin/appointment/setAppointmentDone.php?appointment_id=${clickedDoneId}&note_from_vet=${encodeURIComponent(
          noteFromVetForm
        )}`
      );

      if (res.data.success) {
        console.log("RES : ", res.data.message);

        const handleUpdateAut = appointment.filter(
          (item) => item.appointment_id !== clickedDoneId
        );
        setAppointment(handleUpdateAut);
        setClickedDoneId(null);
        showSuccessAlert_done();
        setNoteFromVetForm("");
      } else {
        console.log("Error from DB:", res.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    if (manualMessage !== "") {
      setSelectedFollowUpMessage(null);
    }
  }, [manualMessage]);

  //setClickedCancelId
  const handleCancelAppointment = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosIntance.post(
        `admin/appointment/setAppointmentCanceled.php?appointment_id=${clickedCancelId}&client_id=${clickedCancelClientId}&note_from_vet=${encodeURIComponent(
          noteFromVetForm
        )}`
      );

      if (res.data.success) {
        console.log("RES : ", res.data.message);

        const handleUpdateAut = appointment.filter(
          (item) => item.appointment_id !== clickedCancelId
        );
        setAppointment(handleUpdateAut);
        setClickedCancelId(null);
        setClickedCancelClientId(null);
        showSuccessAlert_cancel();
      } else {
        console.log("Delete failed:", res.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const [showAllergiesModal, setShowAllergiesModal] = useState(false);

  const [getVaccination, setGetVaccination] = useState([]);
  const [getAllergies, setGetAllergies] = useState([]);
  const [moreInfo, setMorenInfo] = useState(null);
  const [vaccinationForm, setVaccinationForm] = useState("");
  const [clickedAppointmentId, setClickedAppointmentId] = useState(null);

  const [clickedAppointmentItem, setClickedAppointmentItem] = useState(null);
  const [allergyForm, setAllergyForm] = useState("");

  const clickedMoreInfo = async (item) => {
    setMorenInfo(item);

    try {
      const [vaccinationRes, allergyRes] = await Promise.all([
        axiosIntance.post(`veterinarian/getVaccination.php`, {
          pet_name: item.pet_name,
          pet_type: item.pet_type,
          client_id: item.clientId,
        }),
        axiosIntance.post(`veterinarian/getAllergies.php`, {
          pet_name: item.pet_name,
          pet_type: item.pet_type,
          client_id: item.clientId,
        }),
      ]);

      if (vaccinationRes.data.success) {
        console.log("Vaccination Record:", vaccinationRes.data);
        setGetVaccination(vaccinationRes.data.data);
      } else {
        setGetVaccination([]);
      }

      if (allergyRes.data.success) {
        console.log("Allergies:", allergyRes.data.data);
        setGetAllergies(allergyRes.data.data);
      } else {
        setGetAllergies([]);
      }
    } catch (error) {
      console.log("Error from FE:", error);
      setGetVaccination([]);
      setGetAllergies([]);
    }
  };

  //clickedVaccination=(itemt)
  const clickedVaccination = async (item) => {
    setGetVaccination([]);
    setShowVaccinationModal(true);
    setClickedAppointmentId(item.appointment_id);
    setClickedAppointmentItem(item); // ✅ Store the full item for later use

    try {
      const res = await axiosIntance.post(`veterinarian/getVaccination.php`, {
        pet_name: item.pet_name,
        pet_type: item.pet_type,
        client_id: item.clientId,
      });

      if (res.data.success) {
        setGetVaccination(res.data.data);
      } else {
        setGetVaccination([]);
      }
    } catch (error) {
      console.log("Error from FE:", error);
    }
  };

  //handleVaccinationSubmit
  const handleVaccinationSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await axiosIntance.post("veterinarian/postVaccination.php", {
        appointment_id: clickedAppointmentId,
        vaccination: vaccinationForm,
      });

      if (res.data.success) {
        console.log("Vaccination added successfully:", res.data.message);
        setVaccinationForm("");

        // Re-fetch updated vaccination list
        if (clickedAppointmentItem) {
          const updateRes = await axiosIntance.post(
            `veterinarian/getVaccination.php`,
            {
              pet_name: clickedAppointmentItem.pet_name,
              pet_type: clickedAppointmentItem.pet_type,
              client_id: clickedAppointmentItem.clientId,
            }
          );

          if (updateRes.data.success) {
            setGetVaccination(updateRes.data.data);
          } else {
            setGetVaccination([]);
          }
        }
      } else {
        console.log("Error adding vaccination:", res.data.message);
      }
    } catch (error) {
      console.log("Error from FE:", error);
    } finally {
      setLoader(false);
    }
  };

  //allergies
  const clickedAllergies = async (item) => {
    setGetAllergies([]);
    setShowAllergiesModal(true);
    setClickedAppointmentId(item.appointment_id);
    setClickedAppointmentItem(item);
    try {
      const res = await axiosIntance.post(`veterinarian/getAllergies.php`, {
        pet_name: item.pet_name,
        pet_type: item.pet_type,
        client_id: item.clientId,
      });

      if (res.data.success) {
        console.log("Allergeis : ", res.data.data);
        setGetAllergies(res.data.data);
      } else {
      }
    } catch (error) {
      console.log("Error from FE:", error);
    }
  };

  //handleAllergySubmit
  const handleAllergySubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await axiosIntance.post("veterinarian/postAllergy.php", {
        appointment_id: clickedAppointmentId,
        allergies: allergyForm,
      });

      if (res.data.success) {
        console.log("Allergy added successfully:", res.data.message);
        setAllergyForm("");

        if (clickedAppointmentItem) {
          const updateRes = await axiosIntance.post(
            `veterinarian/getAllergies.php`,
            {
              pet_name: clickedAppointmentItem.pet_name,
              pet_type: clickedAppointmentItem.pet_type,
              client_id: clickedAppointmentItem.clientId,
            }
          );

          if (updateRes.data.success) {
            setGetAllergies(updateRes.data.data);
          } else {
            setGetAllergies([]);
          }
        }
      } else {
        console.log("Error adding allergies:", res.data.message);
      }
    } catch (error) {
      console.log("Error from FE:", error);
    } finally {
      setLoader(false);
    }
  };

  const mclicked = (clientId) => {
    setClickedCancelClientId(clientId);
  };

  return (
    <>
      <div className="veterinarian-home">
        <div className="container">
          <div className="left">
            <div className="left-wrapper">
              <div className="profile-wrapper">
                <LazyLoadImage
                  src={`${uploadUrl.uploadurl}/${veterinarianInfo?.profile}`}
                  alt="profile_pic"
                  className="profile"
                  effect="blur"
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
                            <LazyLoadImage
                              src={`${uploadUrl.uploadurl}/${item?.image}`}
                              alt="profile"
                              className="profile-card"
                              effect="blur"
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          <div
                            className="right-card"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="top">
                              <div className="name-info">
                                <div className="name">{item.pet_name}</div>
                                <p>{item.appointment_date}</p>
                                <p>{item.appointment_time}</p>
                              </div>
                              <MdOutlineMoreHoriz
                                onClick={() => clickedMenu(item.appointment_id)}
                                className="more-icon"
                                style={{ cursor: "pointer" }}
                              />
                            </div>

                            <div
                              className="bot"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div className="pet" style={{ gap: "10px" }}>
                                <span
                                  className="type"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "300",
                                    borderRight: "1px solid gray",
                                    paddingRight: "10px",
                                    color: "blue",
                                  }}
                                >
                                  <IoIosCheckmarkCircle
                                    style={{ color: "green", fontSize: "14px" }}
                                  />
                                  {item.is_followup === 1 ? "Follow-Up" : ""}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "300",
                                  }}
                                  className="type"
                                >
                                  <FaUser
                                    style={{ color: "gray", fontSize: "13px" }}
                                  />
                                  Owner: {item.petOwner}
                                </span>
                              </div>

                              <div className="bot-buttons">
                                <button onClick={() => clickedMoreInfo(item)}>
                                  View Info
                                </button>
                                <button onClick={() => clickedAllergies(item)}>
                                  Allergy
                                </button>
                                <button
                                  onClick={() => clickedVaccination(item)}
                                >
                                  Vaccination
                                </button>
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
                                  {/* <button
                                    className="btn"
                                    onClick={() =>
                                      clickedToFollowUpItem(
                                        item.appointment_id,
                                        item.clientId,
                                        item.drFullname,
                                        item.dr_id,
                                        item.phone,
                                        item.pet_name,
                                        item.pet_type
                                      )
                                    }
                                  >
                                    <FaRegCircleCheck className="icon" />
                                    Follow Up
                                  </button> */}
                                  <button
                                    onClick={() =>
                                      setClickedDoneId(item.appointment_id)
                                    }
                                    className="btn"
                                  >
                                    <FaRegCircleCheck className="icon" />
                                    Done
                                  </button>
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      setClickedCancelId(item.appointment_id);
                                      mclicked(item.clientId);
                                    }}
                                  >
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

              <div className="today-appointment">
                <h4>Pending Appointment</h4>

                {loader ? (
                  <Loader3 />
                ) : (
                  (() => {
                    const todayAppointments = appointment.filter(
                      (item) => item.appointment_date !== formattedDate
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
                              style={{ objectFit: "cover" }}
                              src={`${uploadUrl.uploadurl}/${item?.image}`}
                              alt="profile"
                              className="profile-card"
                            />
                          </div>

                          <div
                            className="right-card"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="top">
                              <div className="name-info">
                                <div className="name">{item.pet_name}</div>
                                <p>{item.appointment_date}</p>
                                <p>{item.appointment_time}</p>
                              </div>
                            </div>

                            <div
                              className="bot"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div className="pet" style={{ gap: "10px" }}>
                                <span
                                  className="type"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "300",
                                    borderRight: "1px solid gray",
                                    paddingRight: "10px",
                                    color: "blue",
                                  }}
                                >
                                  <IoIosCheckmarkCircle
                                    style={{ color: "green", fontSize: "14px" }}
                                  />
                                  {item.is_followup === 1 ? "Follow-Up" : ""}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "300",
                                  }}
                                  className="type"
                                >
                                  <FaUser
                                    style={{ color: "gray", fontSize: "13px" }}
                                  />
                                  Owner: {item.petOwner}
                                </span>
                              </div>

                              <button
                                onClick={() => clickedMoreInfo(item)}
                                style={{
                                  padding: "0 10px",
                                  maxWidth: "fit-content",
                                  alignSelf: "end",
                                }}
                              >
                                View Info
                              </button>
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
            <div className="top-title-wrappperr">
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
                  <strong>Fullname:</strong> {moreInfo.petOwner}
                </span>
                <span>
                  <strong>Address:</strong> {moreInfo.clientAddres}
                </span>
                <span>
                  <strong>Phone:</strong> {moreInfo.phone}
                </span>
              </div>

              <div className="appointment-content">
                <div className="title">
                  <span>Details</span>
                </div>

                <span>
                  <strong>Service:</strong> {moreInfo.service}
                </span>
                <span>
                  <strong>Health Issue:</strong> {moreInfo.current_health_issue}
                </span>
                <span>
                  <strong>Medical History:</strong>{" "}
                  {moreInfo.history_health_issue}
                </span>
              </div>

              <div className="appointment-content">
                <div className="title">
                  <span>Vaccination and Allergies</span>
                </div>

                <div style={{ marginBottom: "20px" }} className="box">
                  <span>
                    <strong>Vaccination:</strong>
                  </span>

                  <ul style={{ marginLeft: "20px" }}>
                    {getVaccination.length > 0 ? (
                      getVaccination.map((item, index) => (
                        <li style={{ fontSize: "14px" }} key={index}>
                          {item}
                        </li>
                      ))
                    ) : (
                      <p style={{ fontSize: "14px" }}>
                        No recorded vaccination.
                      </p>
                    )}
                  </ul>
                </div>

                <div style={{ marginBottom: "20px" }} className="box">
                  <span>
                    <strong>Allergies:</strong>
                  </span>

                  <ul style={{ marginLeft: "20px" }}>
                    {getAllergies.length > 0 ? (
                      getAllergies.map((item, index) => (
                        <li style={{ fontSize: "14px" }} key={index}>
                          {item}
                        </li>
                      ))
                    ) : (
                      <p style={{ fontSize: "14px" }}>No recorded allergies.</p>
                    )}
                  </ul>
                </div>
              </div>

              <div className="appointment-content">
                <div className="title">
                  <span>Schedule</span>
                </div>

                <span>
                  <strong>Date:</strong> {moreInfo.appointment_date}
                </span>
                <span>
                  <strong>Time:</strong> {moreInfo.appointment_time}
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
                <div className="left">
                  <h3>Schedule Follow-Up</h3>
                </div>

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
                <div className="input-wrapper">
                  <label htmlFor="inpt-other-concern">
                    Add a note or message for this follow-up check-up,
                    diagnosis, or prescription.
                  </label>

                  <textarea
                    style={{ whiteSpace: "pre-wrap", border: "none" }}
                    id="inpt-other-concern"
                    className="inpt-other-concern__"
                    type="text"
                    value={manualMessage}
                    onChange={(e) => {
                      setManualMessage(e.target.value);
                      setSelectedFollowUpMessage(null);
                    }}
                  ></textarea>
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
                    <h1 style={{ color: "gray" }}>₱</h1>
                    <input
                      style={{
                        border: "none",
                        height: "25px",
                        paddingLeft: "10px",
                      }}
                      id="inpt-other-concern"
                      className="inpt-other-concern"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price"
                    />
                  </div>
                </div>
                <button
                  disabled={
                    !price ||
                    (!selectedFollowUpMessage && manualMessage === "".trim()) ||
                    loader
                  }
                  onClick={handleSubmitFollowUpAppoinment}
                  className="btn-submit"
                >
                  {loader ? <Loader3 /> : "Send message, Follow-up check-up"}
                </button>
              </div>
            </div>
          </div>
        )}
      {/* modal follow up end  */}

      {(clickedDoneId !== null || clickedCancelId !== null) && (
        <div className="delete-overlay__">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="delete__"
          >
            <div
              className="top"
              style={{
                marginBottom: "20px",
              }}
            >
              <h6 style={{ fontSize: "1rem", color: "#000" }}>
                {clickedCancelId
                  ? "Cancellation"
                  : "Add Note, Diagnosis, or Prescription"}
              </h6>
            </div>

            <div className="add-note">
              <textarea
                style={{ whiteSpace: "pre-wrap" }}
                rows={7}
                name="note"
                onChange={(e) => setNoteFromVetForm(e.target.value)}
                value={noteFromVetForm}
                placeholder={
                  clickedCancelId
                    ? "Reason for cancellation"
                    : "Add Note, Diagnosis, or Prescription"
                }
              ></textarea>
            </div>

            <div className="bot___">
              <button
                style={{
                  padding: "6px 10px",
                  marginTop: "10px",
                  borderRadius: "3px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                }}
                className="btn-yes"
                onClick={
                  clickedCancelId
                    ? handleCancelAppointment
                    : clickedDoneId
                    ? handeSetAsDoneAppointment
                    : ""
                }
              >
                {clickedCancelId ? "Send, Cancel" : "Send, Done"}
              </button>
              <button
                className="btn-no"
                style={{
                  padding: "6px 10px",
                  marginTop: "10px",
                  borderRadius: "3px",
                }}
                onClick={() => {
                  setClickedDoneId(null);
                  setClickedCancelId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add allergy or vaccination */}

      {showVaccinationModal && (
        <div className="add-vaccination_allergy-overlay">
          <div className="vaccination_allergy-modal">
            <div className="title">
              <h6>Vaccination Record</h6>

              <IoMdClose onClick={() => setShowVaccinationModal(false)} />
            </div>

            <div className="list">
              <ul>
                {getVaccination.length > 0 ? (
                  getVaccination.map((item) => (
                    <li style={{ fontSize: "14px" }}>
                      <TbVaccine
                        style={{
                          color: "green",
                          marginRight: "5px",
                          marginTop: "5px",
                        }}
                      />
                      {item}
                    </li>
                  ))
                ) : (
                  <p style={{ fontSize: "14px" }}>No recorded vaccination</p>
                )}
              </ul>
            </div>

            <div className="input-field">
              <textarea
                name="textarea"
                cols={1}
                placeholder="Add Vaccination Record"
                onChange={(e) => setVaccinationForm(e.target.value)}
                value={vaccinationForm}
              ></textarea>

              <button onClick={handleVaccinationSubmit}>
                {loader ? <Loader3 /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allergies */}
      {showAllergiesModal && (
        <div className="add-vaccination_allergy-overlay">
          <div className="vaccination_allergy-modal">
            <div className="title">
              <h6>Allergy Record</h6>

              <IoMdClose onClick={() => setShowAllergiesModal(false)} />
            </div>

            <div className="list">
              <ul>
                {getAllergies.length > 0 ? (
                  getAllergies.map((item, index) => (
                    <li key={index} style={{ fontSize: "14px" }}>
                      <PiVirusBold
                        style={{
                          color: "green",
                          marginRight: "5px",
                          marginTop: "5px",
                        }}
                      />

                      {item}
                    </li>
                  ))
                ) : (
                  <p style={{ fontSize: "14px" }}>No recorded allergies.</p>
                )}
              </ul>
            </div>

            <div className="input-field">
              <textarea
                name="textarea"
                cols={1}
                placeholder="Add Allergy Record"
                onChange={(e) => setAllergyForm(e.target.value)}
                value={allergyForm}
              ></textarea>

              <button onClick={handleAllergySubmit}>
                {loader ? <Loader3 /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
