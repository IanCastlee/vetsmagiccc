import "./setAppointment.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosIntance from "../../../axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader2 from "../../components/loader/Loader2";
import { uploadUrl } from "../../../fileurl";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import html2pdf from "html2pdf.js";

//IMAGES
import cat from "../../assets/icons/mouth.png";

//ICONS
import { useContext, useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { CiStethoscope } from "react-icons/ci";
import { BsCalendar2Date } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineMedicalServices } from "react-icons/md";
import { AiOutlineSnippets } from "react-icons/ai";
import { RiImageAddFill } from "react-icons/ri";

const SetAppointment = () => {
  const receiptRef = useRef();

  const { currentUser } = useContext(AuthContext);

  const userId = useParams();
  const [veterinarianInfo, setVeterinarianInfo] = useState([]);
  const [veterinarianServices, setVeterinarianServices] = useState([]);
  const [showDateTime, setshowDateTime] = useState("1");
  const [showSummaryForm, setShowSummaryForm] = useState(false);
  const [showLoader3, setShowLoader3] = useState(false);
  const [showLoader4, setShowLoader4] = useState(false);
  const [noInternetConn, setNoInternetConn] = useState(false);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  //setAppointment
  const [appointmentForm, setAppointment] = useState({
    service: "",
    pet_name: "",
    pet_type: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    current_health_issue: "",
    history_health_issue: "",
    appointment_date: "",
    appointment_time: "",
    price: "",
    image: null,
  });

  const [price, setPrice] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notAvailableTimeSlot, setNotAvailableTimeSlot] = useState([]);
  const [formattedDate_, setformattedDate] = useState(null);
  const [showAppointmentsentModal, setshowAppointmentsentModal] =
    useState(false);

  const [emptyService, setEmptyService] = useState("");
  const [emptypet_name, setEmptypet_name] = useState("");
  const [emptypet_type, setEmptypet_type] = useState("");
  const [emptybreed, setEmptybreed] = useState("");
  const [emptyprofile, setEmptyprofile] = useState(null);
  const [emptyage, setEmptyage] = useState("");
  const [emptyweight, setEmptyweight] = useState("");
  const [emptygender, setEmptygender] = useState("");
  const [emptycurrent_health_issue, setEmptycurrent_health_issue] =
    useState("");
  const [emptyhistory_health_issue, setEmptyhistory_health_issue] =
    useState("");
  const [emptyappointment_date, setEmptyappointment_date] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmptyService("");
    setEmptypet_name("");
    setEmptypet_type("");
    setEmptybreed("");
    setEmptyage("");
    setEmptyweight("");
    setEmptygender("");
    setEmptycurrent_health_issue("");
    setEmptyhistory_health_issue("");
    setEmptyprofile(null);

    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDateChange = (date) => {
    setEmptyappointment_date("");

    setAppointment((prev) => ({
      ...prev,
      appointment_date: date,
    }));
  };

  //handleNext
  const handleNext = () => {
    if (
      appointmentForm.service === "" ||
      appointmentForm.pet_name === "" ||
      appointmentForm.pet_type === "" ||
      appointmentForm.breed === "" ||
      appointmentForm.age === "" ||
      appointmentForm.weight === "" ||
      appointmentForm.gender === "" ||
      appointmentForm.image === null ||
      appointmentForm.current_health_issue === "" ||
      appointmentForm.history_health_issue === ""
    ) {
      if (appointmentForm.service === "") {
        setEmptyService("Select your preferred service");
      }
      if (appointmentForm.pet_name === "") {
        setEmptypet_name("Petname is required");
      }
      if (appointmentForm.pet_type === "") {
        setEmptypet_type("Pet type is required");
      }
      if (appointmentForm.breed === "") {
        setEmptybreed("Pet breed is required");
      }
      if (appointmentForm.age === "") {
        setEmptyage("Pet age is required");
      }
      if (appointmentForm.weight === "") {
        setEmptyweight("Pet weight is required");
      }
      if (appointmentForm.gender === "") {
        setEmptygender("Pet gender is required");
      }
      if (appointmentForm.image === null) {
        setEmptyprofile("Pet Profile is required");
      }
      if (appointmentForm.current_health_issue === "") {
        setEmptycurrent_health_issue(
          "Please type your pet current health issue"
        );
      }
      if (appointmentForm.history_health_issue === "") {
        setEmptyhistory_health_issue(
          "Please enter your pet's health history, or type 'none' if there are no issues."
        );
      }
      return;
    }
    setshowDateTime("2");
  };
  //timeslots to remove
  const handleTimeDateSlotToRemove = async () => {
    const date = new Date(appointmentForm.appointment_date);
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    console.log("FORMATED : ", formattedDate);

    try {
      const res = await axiosIntance.get(
        "client/appointment/getTimeDateToRemove.php",
        {
          params: { choosenDate: formattedDate, vetId: userId.userId },
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

  //getClickedVeterinarian and services
  useEffect(() => {
    const getClickedVeterinarian = async () => {
      try {
        const res = await axiosIntance.post(
          "admin/veterinarian/GetClickedVeterinarian.php",
          { user_id: userId.userId }
        );

        if (res.data.success) {
          setVeterinarianInfo(res.data.data.veterinarianInfo);
          setVeterinarianServices(res.data.data.services);
        } else {
          console.log("Error from DB : ", res.data);
        }
      } catch (error) {
        console.log("Error : ", error);
      }
    };
    getClickedVeterinarian();
  }, [userId]);

  //get time slot
  useEffect(() => {
    if (!veterinarianInfo?.time || !veterinarianInfo?.duration) return;
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
      veterinarianInfo.time,
      veterinarianInfo.duration
    );

    // extract unavailable time slots from the array of objects
    const unavailable = notAvailableTimeSlot.map(
      (item) => item.appointment_time
    );

    // filter out unavailable slots
    const availableSlots = allSlots.filter(
      (slot) => !unavailable.includes(slot)
    );

    setSlots(availableSlots);
  }, [veterinarianInfo, notAvailableTimeSlot]);

  const handleShowSummary = () => {
    // Check if appointment_date is empty
    if (!appointmentForm.appointment_date) {
      setEmptyappointment_date("Select your preferred date");
      return;
    }
    if (selectedTimeSlot === null) {
      return;
    }

    const formattedDate = new Date(
      appointmentForm.appointment_date
    ).toLocaleDateString("en-CA");

    setformattedDate(formattedDate);
    setShowSummaryForm(true);
  };

  useEffect(() => {
    const handleOffline = () => console.log("You are offline");
    const handleOnline = () => console.log("Back online");

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  //handle submit
  const handleSubmitAppointment = async () => {
    setShowLoader3(true);

    if (!appointmentForm.appointment_date) {
      console.warn("Appointment date is required.");
      return false;
    }

    const formattedDate = new Date(
      appointmentForm.appointment_date
    ).toLocaleDateString("en-CA");

    setformattedDate(formattedDate);

    const formData = new FormData();
    formData.append("client_id", currentUser?.user_id);
    formData.append("dr_id", userId.userId);
    formData.append("service", appointmentForm.service);
    formData.append("pet_name", appointmentForm.pet_name);
    formData.append("pet_type", appointmentForm.pet_type);
    formData.append("breed", appointmentForm.breed);
    formData.append("age", appointmentForm.age);
    formData.append("weight", appointmentForm.weight);
    formData.append("gender", appointmentForm.gender);
    formData.append(
      "current_health_issue",
      appointmentForm.current_health_issue
    );
    formData.append(
      "history_health_issue",
      appointmentForm.history_health_issue
    );
    formData.append("appointment_date", formattedDate);
    formData.append("appointment_time", selectedTimeSlot);
    formData.append("payment_method", "Online Payment");

    formData.append("price", price);

    formData.append("title_for_vet", "New Appointment Request");
    formData.append(
      "message_for_vet",
      `You have received a new appointment request for a ${appointmentForm.pet_type}, requesting the ${appointmentForm.service} service.`
    );

    // client notification
    formData.append("title_for_client", "Appointment reminder");
    formData.append(
      "desc_for_client",
      `Your appointment has been sent to your chosen vet. Please prepare for your selected date and time slot (${formattedDate} - ${selectedTimeSlot}).`
    );

    if (appointmentForm.image) {
      formData.append("image", appointmentForm.image);
    }

    try {
      const res = await axiosIntance.post(
        "client/appointment/setAppointment.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        console.log("RESPONSE : ", res.data.message);
        setShowLoader3(true);
        handleTimeDateSlotToRemove();
        return true;
      } else {
        console.log("ERROR : ", res.data);
        setShowLoader3(true);

        return false;
      }
    } catch (error) {
      console.log("Error : ", error);
      setShowLoader3(true);

      return false;
    }
  };

  const handlePayOnClinick = async () => {
    setShowLoader4(true);

    if (!appointmentForm.appointment_date) {
      console.warn("Appointment date is required.");
      return false;
    }

    const formattedDate = new Date(
      appointmentForm.appointment_date
    ).toLocaleDateString("en-CA");

    setformattedDate(formattedDate);

    const formData = new FormData();
    formData.append("client_id", currentUser?.user_id);
    formData.append("dr_id", userId.userId);
    formData.append("service", appointmentForm.service);
    formData.append("pet_name", appointmentForm.pet_name);
    formData.append("pet_type", appointmentForm.pet_type);
    formData.append("breed", appointmentForm.breed);
    formData.append("age", appointmentForm.age);
    formData.append("weight", appointmentForm.weight);
    formData.append("gender", appointmentForm.gender);
    formData.append(
      "current_health_issue",
      appointmentForm.current_health_issue
    );
    formData.append(
      "history_health_issue",
      appointmentForm.history_health_issue
    );
    formData.append("appointment_date", formattedDate);
    formData.append("appointment_time", selectedTimeSlot);
    formData.append("payment_method", "Pay at Clinic");
    formData.append("price", price);

    formData.append("title_for_vet", "New Appointment Request");
    formData.append(
      "message_for_vet",
      `You have received a new appointment request for a ${appointmentForm.pet_type}, requesting the ${appointmentForm.service} service.`
    );

    // client notification
    formData.append("title_for_client", "Appointment reminder");
    formData.append(
      "desc_for_client",
      `Your appointment has been sent to your chosen vet. Please prepare for your selected date and time slot (${formattedDate} - ${selectedTimeSlot}).`
    );

    if (appointmentForm.image) {
      formData.append("image", appointmentForm.image);
    }

    try {
      const res = await axiosIntance.post(
        "client/appointment/setAppointment.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        console.log("RESPONSE : ", res.data.message);

        setTimeout(() => {
          setShowSummaryForm(false);
        }, 1000);
        setShowLoader4(false);
        setshowAppointmentsentModal(true);
        handleTimeDateSlotToRemove();
        return true;
      } else {
        console.log("ERROR : ", res.data);
        setShowLoader4(false);

        return false;
      }
    } catch (error) {
      console.log("Error : ", error);
      setShowLoader4(false);

      return false;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    setShowLoader3(true);

    try {
      const data = {
        description: `Payment for ${appointmentForm.service}`,
        remarks: "Remarks",
        amount: price * 100,
      };

      const response = await axiosIntance.post("paymongo.php", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.checkout_url) {
        setTimeout(() => {
          setShowLoader3(false);
          window.open(response.data.checkout_url, "_blank");
        }, 2000);
      } else {
        setShowLoader3(false);
        console.log("Error: Unable to fetch the checkout URL.");
        console.log("Err :", response.data);
      }
    } catch (error) {
      setShowLoader3(false);
      console.error("Error:", error);
    }
  };

  const handleSendDataAndPayment = async (e) => {
    e.preventDefault();

    const submitResult = await handleSubmitAppointment();

    if (submitResult === true) {
      await handlePayment(e);
      setTimeout(() => {
        setShowSummaryForm(false);
      }, 7000);
    } else {
      console.log("Appointment submission failed. Payment cancelled.");
    }
  };

  //handleTimeDateSlotToRemove();
  useEffect(() => {
    handleTimeDateSlotToRemove();
  }, [appointmentForm.appointment_date]);

  //prev appointment
  useEffect(() => {
    if (!currentUser || !currentUser.user_id) return;

    const getPrevAppointment = async () => {
      setLoader(true);

      let petType = veterinarianInfo?.specialization?.split(" ")[0];
      if (!petType) petType = "General";

      console.log("PET TYPE : ", petType);

      try {
        const res = await axiosIntance.get(
          `client/appointment/getPrevAppointment.php?user_id=${currentUser.user_id}&petType=${petType}`
        );

        if (res.data.success) {
          setData(res.data.data);
          console.log(":DTAA : ", res.data.data);
        } else {
          console.log("Err getPrevAppointment : ", res.data);
        }
      } catch (error) {
        console.log("ERROR : ", error);
      } finally {
        setLoader(false);
      }
    };

    getPrevAppointment();
  }, [currentUser, veterinarianInfo.specialization]);

  const previousAppointment = (item) => {
    setAppointment({
      service: "",
      pet_name: item.pet_name || "",
      pet_type: item.pet_type || "",
      breed: item.breed || "",
      age: item.age || "",
      weight: item.weight || "",
      gender: item.gender || "",
      current_health_issue: "",
      history_health_issue: item.services || "",
      appointment_date: "",
      appointment_time: "",
      price: "",
      image: null,
    });
  };

  const handleDownload = () => {
    const element = receiptRef.current;
    if (!element) {
      console.error("Receipt element not found");
      return;
    }

    const opt = {
      margin: 10,
      filename: "vetcare-receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <div className="setappointment">
        <div className="setappointment-container">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="setappointment-top"
          >
            <div className="top-image">
              <FaArrowLeft
                className="arrow-icon"
                onClick={() => navigate(-1)}
              />
            </div>
            <div className="profile-wrapper">
              <LazyLoadImage
                alt="profile"
                src={`${uploadUrl.uploadurl}/${veterinarianInfo?.profile}`}
                effect="blur"
                className="profile"
              />
            </div>

            <h3>
              <CiStethoscope className="icon" /> Dr.{" "}
              {veterinarianInfo?.fullname}
            </h3>
            <span>{veterinarianInfo?.specialization}</span>
          </motion.div>

          <div className="setappointment-bot">
            <div className="profile-wrapper">
              <LazyLoadImage
                alt="profile"
                src={`${uploadUrl.uploadurl}/${veterinarianInfo?.profile}`}
                effect="blur"
                className="profile"
              />
            </div>
            <span className="dr-name1">
              <CiStethoscope className="icon" />
              {veterinarianInfo?.fullname}
            </span>
            <small className="dr-name2">
              {veterinarianInfo?.specialization}
            </small>

            {showDateTime === "1" && (
              <div className="petinfo-form">
                <div className="note">
                  <p>
                    Note : Please make sure to fill out all required fields and
                    upload a pet profile image before submitting.
                  </p>
                </div>

                {/* previous appointment */}
                {data.length > 0 && (
                  <div className="containerrr">
                    <div className="title">
                      <span>Previous Pet Appointent</span>
                    </div>

                    <div className="content">
                      {loader ? (
                        <Loader2 />
                      ) : data ? (
                        data.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => previousAppointment(item)}
                            className="card"
                          >
                            <LazyLoadImage
                              alt="Pet Image"
                              src={`${uploadUrl.uploadurl}/${item?.image}`}
                              effect="blur"
                              className="card-img"
                            />

                            <span>{item.pet_name}</span>
                          </div>
                        ))
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
                {/* previous appointment end */}

                <div className="form">
                  <div className="service-petname">
                    <div className="input-wrapper-select-services">
                      <label
                        style={{ color: `${emptyService !== "" ? "red" : ""}` }}
                        htmlFor="type"
                      >
                        {emptyService !== "" ? emptyService : "Choose Service"}
                      </label>

                      <select
                        style={{
                          border: `${
                            emptyService !== "" ? "2px solid red" : ""
                          }`,
                          backgroundColor: "#fff",
                        }}
                        name="service"
                        value={appointmentForm.service}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAppointment((prev) => ({
                            ...prev,
                            service: value,
                          }));

                          const selected = veterinarianServices.find(
                            (item) => item.vservices === value
                          );
                          setPrice(selected ? selected.price : "");
                        }}
                        id="service"
                      >
                        <option value="">Services</option>

                        {veterinarianServices &&
                          veterinarianServices.map((item) => (
                            <option
                              key={item.vservices_id}
                              value={item.vservices}
                            >
                              {item.vservices} - ₱{item.price}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="input-wrapper">
                      <label
                        style={{
                          color: `${emptypet_name !== "" ? "red" : ""}`,
                        }}
                        htmlFor="petname"
                      >
                        {emptypet_name !== "" ? emptypet_name : "Petname"}
                      </label>
                      <input
                        style={{
                          border: `${
                            emptypet_name !== "" ? "2px solid red" : ""
                          }`,
                        }}
                        type="text"
                        name="pet_name"
                        value={appointmentForm.pet_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="type-breed">
                    <div className="input-wrapper">
                      <label
                        style={{
                          color: `${emptypet_type !== "" ? "red" : ""}`,
                        }}
                        htmlFor="type"
                      >
                        {emptypet_type !== "" ? emptypet_type : "Pet Type"}
                      </label>
                      <select
                        style={{
                          border: emptypet_type !== "" ? "2px solid red" : "",
                          backgroundColor: "#fff",
                        }}
                        value={
                          veterinarianInfo.petType || appointmentForm.pet_type
                        }
                        onChange={handleChange}
                        name="pet_type"
                        id="pet_type"
                      >
                        <option value="">Select Animal</option>
                        <option value="Bat">Bat</option>
                        <option value="Bird">Bird</option>
                        <option value="Buffalo">Buffalo</option>
                        <option value="Camel">Camel</option>
                        <option value="Cat">Cat</option>
                        <option value="Chicken">Chicken</option>
                        <option value="Chinchilla">Chinchilla</option>
                        <option value="Cow">Cow</option>
                        <option value="Deer">Deer</option>
                        <option value="Dog">Dog</option>
                        <option value="Donkey">Donkey</option>
                        <option value="Duck">Duck</option>
                        <option value="Ferret">Ferret</option>
                        <option value="Fish">Fish</option>
                        <option value="Fox">Fox</option>
                        <option value="Frog">Frog</option>
                        <option value="Goat">Goat</option>
                        <option value="Goose">Goose</option>
                        <option value="Guinea Pig">Guinea Pig</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Hedgehog">Hedgehog</option>
                        <option value="Horse">Horse</option>
                        <option value="Iguana">Iguana</option>
                        <option value="Lizard">Lizard</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Mule">Mule</option>
                        <option value="Ostrich">Ostrich</option>
                        <option value="Parrot">Parrot</option>
                        <option value="Peacock">Peacock</option>
                        <option value="Pig">Pig</option>
                        <option value="Pigeon">Pigeon</option>
                        <option value="Quail">Quail</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Rat">Rat</option>
                        <option value="Rooster">Rooster</option>
                        <option value="Sheep">Sheep</option>
                        <option value="Snake">Snake</option>
                        <option value="Squirrel">Squirrel</option>
                        <option value="Tortoise">Tortoise</option>
                        <option value="Turtle">Turtle</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Zebra">Zebra</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptybreed !== "" ? "red" : ""}` }}
                        htmlFor="type"
                      >
                        {emptybreed !== "" ? emptybreed : "Breed"}
                      </label>
                      <input
                        style={{
                          border: `${emptybreed !== "" ? "2px solid red" : ""}`,
                        }}
                        value={appointmentForm.breed}
                        onChange={handleChange}
                        type="text"
                        name="breed"
                      />
                    </div>
                  </div>
                  <div className="age-weight">
                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptyage !== "" ? "red" : ""}` }}
                        htmlFor="age"
                      >
                        {emptyage !== ""
                          ? emptyage
                          : "Pet Age (e.g 1 month, 1 year)"}
                      </label>
                      <input
                        style={{
                          border: `${emptyage !== "" ? "2px solid red" : ""}`,
                        }}
                        value={appointmentForm.age}
                        onChange={handleChange}
                        type="text"
                        name="age"
                      />
                    </div>
                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptyweight !== "" ? "red" : ""}` }}
                        htmlFor="weight"
                      >
                        {" "}
                        {emptyweight !== "" ? emptyweight : "Pet Weight(kg)"}
                      </label>
                      <input
                        style={{
                          border: `${
                            emptyweight !== "" ? "2px solid red" : ""
                          }`,
                        }}
                        value={appointmentForm.weight}
                        onChange={handleChange}
                        type="number"
                        name="weight"
                      />
                    </div>
                  </div>

                  <div className="radio-wrapper">
                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptygender !== "" ? "red" : ""}` }}
                        htmlFor="gender"
                      >
                        {emptygender !== "" ? emptygender : "Gender"}
                      </label>
                      <div className="male-female">
                        <div className="gender-wrapper">
                          <input
                            style={{ border: "none" }}
                            value="Male"
                            onChange={handleChange}
                            checked={appointmentForm.gender === "Male"}
                            type="radio"
                            name="gender"
                          />
                          <label htmlFor="male">Male</label>
                        </div>
                        <div className="gender-wrapper">
                          <input
                            value="Female"
                            onChange={handleChange}
                            type="radio"
                            checked={appointmentForm.gender === "Female"}
                            name="gender"
                          />
                          <label htmlFor="female">Female</label>
                        </div>
                      </div>
                    </div>

                    <div className="input-wrapper">
                      <label
                        style={{
                          color: `${emptyprofile !== null ? "red" : ""}`,
                        }}
                        htmlFor="file"
                      >
                        {emptyprofile !== null
                          ? emptyprofile
                          : "Latest Pet Picture"}
                        <br />

                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Selected"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              marginTop: "10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <RiImageAddFill
                            style={{
                              fontSize: "30px",
                              cursor: "pointer",
                              color: "#007bff",
                            }}
                            className="add-image-icon"
                          />
                        )}
                      </label>
                      <input
                        style={{ display: "none" }}
                        id="file"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setPreviewImage(URL.createObjectURL(file));
                            setAppointment({
                              ...appointmentForm,
                              image: file,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-area-wrapper">
                    <label
                      style={{
                        color: `${
                          emptycurrent_health_issue !== "" ? "red" : ""
                        }`,
                      }}
                      htmlFor="concern"
                    >
                      {emptycurrent_health_issue !== ""
                        ? emptycurrent_health_issue
                        : "Pet Health Concerns or Conditions"}{" "}
                    </label>
                    <textarea
                      style={{
                        border: `${
                          emptycurrent_health_issue !== ""
                            ? "2px solid red"
                            : ""
                        }`,
                      }}
                      value={appointmentForm.current_health_issue}
                      onChange={handleChange}
                      name="current_health_issue"
                      id="concern"
                    ></textarea>
                  </div>
                  <div className="text-area-wrapper">
                    <label
                      style={{
                        color: `${
                          emptyhistory_health_issue !== "" ? "red" : ""
                        }`,
                      }}
                      htmlFor="history"
                    >
                      {emptyhistory_health_issue !== ""
                        ? emptyhistory_health_issue
                        : "Medical History"}{" "}
                    </label>
                    <textarea
                      style={{
                        border: `${
                          emptyhistory_health_issue !== ""
                            ? "2px solid red"
                            : ""
                        }`,
                      }}
                      value={appointmentForm.history_health_issue}
                      onChange={handleChange}
                      name="history_health_issue"
                      id="history"
                    ></textarea>
                  </div>
                  <div className="button">
                    <FaArrowRight onClick={handleNext} className="next-icon" />
                  </div>
                </div>
              </div>
            )}
            {showDateTime === "2" && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="date-available"
              >
                <span className="note">
                  Note : Choose your appointment date and time.{" "}
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
              </motion.div>
            )}

            {showDateTime === "2" && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="time-available"
              >
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
                    onClick={() => setshowDateTime("1")}
                  />
                  <button
                    className="btn-setappointment"
                    onClick={handleShowSummary}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {showSummaryForm && (
        <div className="payment-summary">
          <div className="container">
            <div className="top">
              <h4>Appointment Summary</h4>
              <IoMdClose
                className="icon"
                onClick={() => setShowSummaryForm(false)}
              />
            </div>

            <div className="content">
              <span>
                <BsCalendar2Date className="icon" /> Appointment Date :{" "}
                {formattedDate_}
              </span>
              <span>
                <LuCalendarClock className="icon" /> Appointment Time :{" "}
                {selectedTimeSlot}
              </span>
              <span>
                <MdOutlineMedicalServices className="icon" /> Treatment :{" "}
                {appointmentForm.service.split(" - ")[0]}
              </span>
              <span>
                <AiOutlineSnippets className="icon" /> Pet Name :{" "}
                {appointmentForm.pet_name}
              </span>
              <span>
                <AiOutlineSnippets className="icon" /> Pet Type :{" "}
                {appointmentForm.pet_type}
              </span>
              <span>
                <AiOutlineSnippets className="icon" /> Pet Breed :{" "}
                {appointmentForm.breed}
              </span>
              <span>
                <AiOutlineSnippets className="icon" /> Pet Weight :{" "}
                {appointmentForm.weight}
              </span>
              <span>
                Health Issue : <br /> {appointmentForm.current_health_issue}
              </span>

              <div className="hr"></div>

              <span className="total_price">
                Total Price : <h3> ₱ {price}</h3>{" "}
              </span>
            </div>

            <div className="buttons">
              <button className="btn-submit" onClick={handlePayOnClinick}>
                {showLoader4 ? <div className="loader"></div> : "Pay at Clinic"}
              </button>{" "}
              <button
                className="btn-submit2"
                onClick={handleSendDataAndPayment}
              >
                {showLoader3 ? (
                  <div className="loader"></div>
                ) : (
                  "Proceed to Online Payment"
                )}
              </button>{" "}
            </div>
          </div>
        </div>
      )}
      {noInternetConn && (
        <motion.div
          className="no-internet"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>
            Can't proceed with the request. Please check your internet
            connection.
          </span>
        </motion.div>
      )}

      {showAppointmentsentModal && !showLoader4 && (
        <div className="appointment-sent-backdrop">
          <div className="appointment-sent-modal">
            <div className="top">
              <span>Appointment Sent Succesfully</span>
            </div>

            <div className="content">
              <p>
                <span>Pay at Clinic: ₱</span> {price}
              </p>
            </div>

            <div className="bot">
              <Link className="btn-view" to="/myappointment/">
                Go to Apppointment
              </Link>
              <button
                className="btn-close"
                onClick={() => setshowAppointmentsentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SetAppointment;
