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
  const [treatedPets, setTreatedPets] = useState([]);

  const [groomingType, setGroomingType] = useState("");
  const [showGroomingTypeForm, setShowGroomingTypeForm] = useState(false);

  const [disabledField, setDisabledField] = useState(false);

  const navigate = useNavigate();

  //setAppointment
  const [appointmentForm, setAppointment] = useState({
    service: "",
    pet_name: "",
    pet_type: "",
    breed: "",
    ageUnit: "",
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
  const [emptyageunit, setEmptyageunit] = useState("");
  const [emptyweight, setEmptyweight] = useState("");
  const [emptygender, setEmptygender] = useState("");
  const [emptycurrent_health_issue, setEmptycurrent_health_issue] =
    useState("");
  const [emptyhistory_health_issue, setEmptyhistory_health_issue] =
    useState("");
  const [emptyappointment_date, setEmptyappointment_date] = useState("");

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
      appointmentForm.ageUnit === "" ||
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
      if (appointmentForm.age == "") {
        setEmptyage("Pet age is required");
      }
      if (appointmentForm.ageUnit == "") {
        setEmptyageunit("Pet age unit is required");
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
    // setshowDateTime("2");
    setShowSummaryForm(true);
  };
  //timeslots to remove
  const handleTimeDateSlotToRemove = async () => {
    const date = new Date(appointmentForm.appointment_date);
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

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
          "admin/veterinarian/getClickedVeterinarian.php",
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
    let availableSlots = allSlots.filter((slot) => !unavailable.includes(slot));

    //  Extra logic: remove past times if selected date is today
    if (appointmentForm?.appointment_date) {
      const selectedDate = new Date(appointmentForm.appointment_date);
      const today = new Date();

      const formattedSelectedDate = selectedDate.toLocaleDateString("en-CA");
      const formattedToday = today.toLocaleDateString("en-CA");

      if (formattedSelectedDate === formattedToday) {
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        availableSlots = availableSlots.filter((slot) => {
          const match = slot.match(/^(\d{1,2}):(\d{2})(AM|PM)/);
          if (!match) return true;

          let hour = parseInt(match[1], 10);
          let minute = parseInt(match[2], 10);
          const period = match[3];

          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;

          return (
            hour > currentHour ||
            (hour === currentHour && minute > currentMinute)
          );
        });
      }
    }
    console.log(
      "availableSlotsavailableSlotsavailableSlots : ",
      availableSlots
    );
    setSlots(availableSlots);
  }, [
    veterinarianInfo,
    notAvailableTimeSlot,
    appointmentForm.appointment_date,
  ]);

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
    setshowDateTime("2");
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

    const fullAge =
      appointmentForm.age && appointmentForm.ageUnit
        ? `${appointmentForm.age} ${appointmentForm.ageUnit}${
            appointmentForm.age > 1 ? "s" : ""
          }`
        : "";

    let serviceValue = appointmentForm.service;

    // Check if the service includes "grooming"
    if (appointmentForm.service?.toLowerCase().includes("grooming")) {
      if (groomingType) {
        serviceValue += ` - ${groomingType}`;
      }
    }

    const formData = new FormData();
    formData.append("email", currentUser.email);
    formData.append("client_id", currentUser?.user_id);
    formData.append("dr_id", userId.userId);
    formData.append("service", serviceValue);

    formData.append("pet_name", appointmentForm.pet_name);
    formData.append("pet_type", appointmentForm.pet_type);
    formData.append("breed", appointmentForm.breed);
    formData.append("age", fullAge);
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
      `Your appointment for  ${appointmentForm.pet_name} (${appointmentForm.pet_type}) has been sent to your chosen vet. Please prepare for your selected date and time slot (${formattedDate} - ${selectedTimeSlot}).`
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

  const handlePayment = async (paymentTab) => {
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
        // stop loader because everything is ready
        setShowLoader3(false);

        // Redirect the pre-opened tab
        paymentTab.location.href = response.data.checkout_url;
      } else {
        setShowLoader3(false);
        paymentTab.document.write(
          "<h3>Error: Unable to fetch payment link.</h3>"
        );
        paymentTab.close();
        console.log("Payment error:", response.data);
      }
    } catch (error) {
      setShowLoader3(false);
      paymentTab.document.write("<h3>Payment Error</h3>");
      paymentTab.close();
      console.error("Error:", error);
    }
  };

  const handleSendDataAndPayment = async (e) => {
    e.preventDefault();

    // Open blank tab early to prevent popup blocking
    const paymentTab = window.open("", "_blank");
    paymentTab.document.write("<h3>Preparing your payment...</h3>");

    setShowLoader3(true);

    const submitResult = await handleSubmitAppointment();

    if (submitResult === true) {
      // Hide summary form NOW since appointment was saved
      setShowSummaryForm(false);

      // Continue to payment
      await handlePayment(paymentTab);
    } else {
      paymentTab.document.write(
        "<h3>Appointment failed. Payment cancelled.</h3>"
      );
      paymentTab.close();
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
    setDisabledField(true);

    // Reset all error states
    resetMessageError();

    setAppointment({
      service: "",
      pet_name: item.pet_name || "",
      pet_type: item.pet_type || "",
      breed: item.breed || "",
      age: item.age || "",
      ageUnit: "",
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

  const fetchedData = async () => {
    try {
      const res = await axiosIntance.get(
        "admin/treatedpets/getTreatedPets.php"
      );
      if (res.data.success) {
        setTreatedPets(res.data.data);
        console.log("getTreatedPets : ", res.data.data);
      } else {
        console.log("Error : ", res.data);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  useEffect(() => {
    fetchedData();
  }, []);

  //handle change appointemnt form
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Compute the next form state
    const updatedForm = {
      ...appointmentForm,
      [name]: value,
    };

    // Reset all error states
    resetMessageError();

    // Set updated appointment form
    setAppointment(updatedForm);

    if (!disabledField) {
      const isDuplicate = data.some(
        (pet) =>
          pet.pet_name === updatedForm.pet_name &&
          pet.pet_type === updatedForm.pet_type
      );

      if (isDuplicate) {
        setEmptypet_name(
          `This pet name is already taken by one of your other ${updatedForm.pet_type}s. Please try adding a unique identifier, like a number or nickname, to differentiate it.`
        );
      } else {
        setEmptypet_name("");
      }
    }
  };

  const handleClearField = () => {
    setDisabledField(false);

    // Reset all error states
    resetMessageError();

    //clear Field
    setAppointment({
      service: "",
      pet_name: "",
      pet_type: "",
      breed: "",
      age: "",
      ageUnit: "",
      weight: "",
      gender: "",
      current_health_issue: "",
      history_health_issue: "",
      appointment_date: "",
      appointment_time: "",
      price: "",
      image: null,
    });
  };

  //resetMessageError
  const resetMessageError = () => {
    setEmptyService("");
    setEmptypet_name("");
    setEmptypet_type("");
    setEmptybreed("");
    setEmptyage("");
    setEmptyageunit("");
    setEmptyweight("");
    setEmptygender("");
    setEmptycurrent_health_issue("");
    setEmptyhistory_health_issue("");
    setEmptyprofile(null);
  };

  const specs = veterinarianInfo?.specialization || "";

  const splitSpecs = specs.split(" ")[0];

  const handleGroomingTypeSelect = (text) => {
    setGroomingType(text);
  };

  useEffect(() => {
    if (
      groomingType === "" &&
      appointmentForm?.service.toLowerCase().includes("grooming")
    ) {
      setShowGroomingTypeForm(true);
    } else {
      setShowGroomingTypeForm(false);
    }
  }, [appointmentForm.service, groomingType]);

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

            {showDateTime === "2" && (
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
                            <span
                              style={{
                                color: "gray",
                                fontSize: "10px",
                                marginTop: "-3px",
                              }}
                            >
                              ({item.pet_type})
                            </span>
                          </div>
                        ))
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
                {/* previous appointment end */}

                <button className="btn-clear-field" onClick={handleClearField}>
                  Clear Field
                </button>

                <div className="form">
                  <div className="service-petname">
                    <div className="input-wrapper-select-services">
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
                        disabled={disabledField}
                      >
                        <option value="" disabled hidden>
                          Pet Type
                        </option>

                        {treatedPets && splitSpecs !== "General"
                          ? treatedPets
                              .filter(
                                (item) =>
                                  item.status === 1 &&
                                  item.petname === splitSpecs
                              )
                              .map((item, index) => (
                                <option key={index} value={item.petname}>
                                  {item.petname}
                                </option>
                              ))
                          : treatedPets
                              .filter((item) => item.status === 1)
                              .map((item, index) => (
                                <option key={index} value={item.petname}>
                                  {item.petname}
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
                        disabled={disabledField}
                      />
                    </div>
                  </div>

                  <div className="type-breed">
                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptyService !== "" ? "red" : ""}` }}
                        htmlFor="type"
                      >
                        {emptyService !== "" ? emptyService : "Choose Service"}
                      </label>

                      {appointmentForm?.service
                        .toLowerCase()
                        .includes("grooming") && (
                        <div
                          style={{
                            display: "flex",
                            item: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <p style={{ fontSize: "12px", marginBottom: "2px" }}>
                            {appointmentForm?.service +
                              " " +
                              "(" +
                              groomingType +
                              ")"}
                          </p>
                          <button
                            style={{
                              cursor: "pointer",
                              fontSize: "10px",
                              marginBottom: "2px",
                            }}
                            onClick={() => setShowGroomingTypeForm(true)}
                          >
                            Show Type
                          </button>
                        </div>
                      )}

                      <select
                        style={{
                          border: emptyService !== "" ? "2px solid red" : "",
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
                        <option value="" disabled hidden>
                          Services
                        </option>

                        {appointmentForm.pet_type ? (
                          (() => {
                            const filteredServices =
                              veterinarianServices.filter((item) =>
                                item.vservices
                                  .toLowerCase()
                                  .includes(
                                    appointmentForm.pet_type.toLowerCase()
                                  )
                              );

                            if (filteredServices.length === 0) {
                              return (
                                <option value="" disabled>
                                  No services available for{" "}
                                  {appointmentForm.pet_type}
                                </option>
                              );
                            }

                            return filteredServices.map((item) => (
                              <option
                                key={item.vservices_id}
                                value={item.vservices}
                              >
                                {item.vservices} - ₱{item.price}
                              </option>
                            ));
                          })()
                        ) : (
                          <option value="" disabled>
                            Please select a pet type first
                          </option>
                        )}
                      </select>
                    </div>

                    {/* HAHAHAHHA */}
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
                        disabled={disabledField}
                      />
                    </div>
                  </div>
                  <div className="age-weight">
                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptyage !== "" ? "red" : ""}` }}
                        htmlFor="age"
                      >
                        {emptyage !== "" ? emptyage : "Pet Age"}
                      </label>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        {/* Numeric Input */}
                        <input
                          style={{
                            border: `${emptyage !== "" ? "2px solid red" : ""}`,
                            width: "50px",
                            textAlign: "center",
                          }}
                          value={appointmentForm.age}
                          onChange={handleChange}
                          type="number"
                          name="age"
                          min="1"
                        />

                        {/* Radio Buttons for Unit */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "10px",
                              border: `${
                                emptyageunit !== "" ? "2px solid red" : ""
                              }`,
                            }}
                          >
                            <input
                              type="radio"
                              name="ageUnit"
                              value="month"
                              checked={appointmentForm.ageUnit === "month"}
                              onChange={handleChange}
                              style={{
                                height: "12px",
                                width: "12px",
                              }}
                            />
                            Month(s)
                          </label>

                          <label
                            style={{
                              fontSize: "10px",
                              border: `${
                                emptyageunit !== "" ? "2px solid red" : ""
                              }`,
                            }}
                          >
                            <input
                              type="radio"
                              name="ageUnit"
                              value="year"
                              checked={appointmentForm.ageUnit === "year"}
                              onChange={handleChange}
                              style={{
                                height: "12px",
                                width: "12px",
                              }}
                            />
                            Year(s)
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="input-wrapper">
                      <label
                        style={{ color: `${emptyweight !== "" ? "red" : ""}` }}
                        htmlFor="weight"
                      >
                        {" "}
                        {emptyweight !== "" ? emptyweight : "Pet weight"}
                      </label>
                      <input
                        style={{
                          border: `${
                            emptyweight !== "" ? "2px solid red" : ""
                          }`,
                        }}
                        value={appointmentForm.weight}
                        onChange={handleChange}
                        type="text"
                        name="weight"
                        placeholder="e.g. 2.5 kg (pet’s weight)"
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
                        accept="image/*"
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
                      disabled={disabledField}
                    ></textarea>
                  </div>
                  <div className="button">
                    {/* <FaArrowRight onClick={handleNext} className="next-icon" /> */}
                    <button className="btn-setappointment" onClick={handleNext}>
                      Proceed to Summary & Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showDateTime === "1" && (
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

            {showDateTime === "1" && (
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
                  {/* <FaArrowLeft
                    className="back-icon"
                    onClick={() => setshowDateTime("1")}
                  /> */}
                  <button
                    disabled={!selectedTimeSlot}
                    className="btn-setappointment"
                    onClick={handleShowSummary}
                    style={{
                      backgroundColor: selectedTimeSlot ? "#4CAF50" : "#ccc",
                      cursor: selectedTimeSlot ? "pointer" : "not-allowed",
                    }}
                  >
                    Continue to Pet Details
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

      {showGroomingTypeForm && (
        <div className="grooming-overlay">
          <div className="suggestions">
            <h3>Type</h3>
            {[
              "Full Groom",
              "Bath and Brush",
              "Basic Trim",
              "De-shedding Treatment",
              "Puppy Groom",
              "Nail Clipping",
              "Ear Cleaning",
              "Teeth Brushing",
              "Flea and Tick Treatment",
              "Medicated Bath",
            ].map((item, index) => (
              <button
                key={index}
                type="button"
                className={`groom-btn ${groomingType === item ? "active" : ""}`}
                onClick={() => handleGroomingTypeSelect(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SetAppointment;
