import "./Profile.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import { uploadUrl } from "../../../fileurl";

//image
import noProfile from "../../assets/imges/profile-user.png";

//icons
import { CiEdit } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Loader2 from "../../components/loader/Loader3";
import { IoCloseOutline } from "react-icons/io5";
import { BsDot } from "react-icons/bs";

const Profile = () => {
  const { currentUser, setFormToShow } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [clickedAppointment, setClickedAppointment] = useState({
    appointment_date: "",
    appointment_id: "",
    appointment_time: "",
    breed: "",
    current_health_issue: "",
    gender: "",
    history_health_issue: "",
    image: "",
    paid_payment: "",
    pet_name: "",
    pet_type: "",
    service: "",
    weight: "",
    age: "",
    booking_history: {},
  });

  const [medicalHistoy, setMedicalHistory] = useState({});

  const [formData, setFormData] = useState({
    user_id: "",
    fullname: "",
    address: "",
    phone: "",
    email: "",
    image: null,
  });

  //handle input chnages
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(currentUser.user_id);

  //GetUserInfo
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axiosIntance.get(
          `client/profile/GetUserInfo.php?userId=${currentUser.user_id}`
        );
        if (res.data.success) {
          console.log("DATA : ", res.data.data);
          setUserData(res.data.data[0]);
        } else {
          console.log("Error from Backend : ", res.data);
        }
      } catch (error) {
        console.log("Client Error (fetch) : ", error);
      }
    };
    getUserInfo();
  }, []);

  //inheret data to form
  useEffect(() => {
    if (userData) {
      setFormData({
        user_id: userData.user_id || "",
        fullname: userData.fullname || "",
        address: userData.address || "",
        phone: userData.phone || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  //handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("user_id", formData.user_id);
    formdata.append("fullname", formData.fullname);
    formdata.append("address", formData.address);
    formdata.append("phone", formData.phone);
    if (formData.image) {
      formdata.append("image", formData.image);
    }

    try {
      const res = await axiosIntance.post(
        "client/profile/UpdateUserInfo.php",
        formdata
      );
      if (res.data.success) {
        console.log("DATA : ", res.data.message);
        window.location.reload();
      } else {
        console.log("Error from Backend (update) : ", res.data);
      }
    } catch (error) {
      console.log("Client Error (update) : ", error);
    }
  };

  useEffect(() => {
    const getPrevAppointment = async () => {
      setLoader(true);

      try {
        const res = await axiosIntance.get(
          `client/profile/GetPrevAppointment.php?user_id=${currentUser.user_id}`
        );

        if (res.data.success) {
          console.log("Previous Appointments Data:", res.data.data);
          setData(res.data.data);
        } else {
          console.log("Error fetching appointments:", res.data);
        }
      } catch (error) {
        console.log("API Error:", error);
      } finally {
        setLoader(false);
      }
    };

    getPrevAppointment();
  }, []);

  //previousAppointment
  const previousAppointment = (item) => {
    setClickedAppointment({
      appointment_date: item.appointment_date,
      appointment_time: item.appointment_time,
      breed: item.breed,
      current_health_issue: item.current_health_issue,
      gender: item.gender,
      history_health_issue: item.history_health_issue,
      image: item.image,
      is_followup: item.is_followup,
      paid_payment: item.paid_payment,
      pet_name: item.pet_name,
      pet_type: item.pet_type,
      service: item.service,
      weight: item.weight,
      age: item.age,
      booking_history: item.booking_history,
    });
  };

  //handleCloseModal

  const handleCloseModal = () => {
    setClickedAppointment({
      appointment_date: "",
      appointment_id: "",
      appointment_time: "",
      breed: "",
      client_id: "",
      current_health_issue: "",
      dr_id: "",
      gender: "",
      history_health_issue: "",
      image: "",
      is_followup: "",
      paid_payment: "",
      pet_name: "",
      pet_type: "",
      service: "",
      status: "",
      weight: "",
    });
  };

  console.log("clickedAppointment : ", clickedAppointment.booking_history);

  return (
    <>
      <div className="user-profile2">
        <div className="container">
          <div className="top-content">
            <div className="top-wrapper">
              <input
                type="file"
                id="image"
                name="image"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                    setFormData((prev) => ({
                      ...prev,
                      image: file,
                    }));
                  }
                }}
              />

              <label htmlFor="image">
                <LazyLoadImage
                  src={
                    previewImage
                      ? previewImage
                      : userData.profile
                      ? `${uploadUrl.uploadurl}/${userData.profile}`
                      : noProfile
                  }
                  alt="User Profile"
                  effect="blur"
                  className="profile-img"
                />
              </label>

              <CiEdit className="edit-profile-icon" />
            </div>

            <div className="top-previous">
              {data.length > 0 ? (
                <div className="containerrr">
                  <div className="title">
                    <span>Pet Profile</span>
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
              ) : (
                <>
                  <div className="no-prev-appointment">
                    <p>No Previous Appointment</p>
                    <Link className="btn-setapp" to="/home/">
                      Set Appointment
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bot-content">
            <form action="">
              <section>
                <span>Basic Information</span>
                <div className="inpts">
                  <input
                    type="hidden"
                    name="user_id"
                    onChange={handleChange}
                    value={formData.user_id}
                  />
                  <input
                    type="text"
                    name="fullname"
                    onChange={handleChange}
                    value={formData.fullname}
                  />
                  <input
                    type="text"
                    name="address"
                    onChange={handleChange}
                    value={formData.address}
                  />
                  <input
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </div>
              </section>

              <section>
                <span>
                  User Account Credentials{" "}
                  <span style={{ fontSize: "10px", color: "gray" }}>
                    (change password)
                  </span>
                </span>
                <div
                  className="inpts"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <input
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                  <FaEdit
                    className="edit-cred"
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                    }}
                    onClick={() => setFormToShow("forgot")}
                  />
                </div>
              </section>

              <button onClick={handleUpdate} className="btn-update">
                <CiEdit className="icon" />
                Update
              </button>
            </form>
          </div>
        </div>

        <FaArrowLeft className="back-icon-prof" onClick={() => navigate(-1)} />
      </div>

      {clickedAppointment.pet_name !== "" && (
        <div className="pet-info-modal-overlay">
          <div className="pet-info-modal">
            <div className="top">
              <IoCloseOutline
                className="back-icon-pet"
                onClick={handleCloseModal}
              />
            </div>
            <h6 className="title___">Pet Information</h6>

            <div className="content">
              <LazyLoadImage
                src={`${uploadUrl.uploadurl}/${clickedAppointment.image}`}
                className="pet-profile"
                effect="blur"
              />

              <div className="bot">
                <span>
                  <small>Name : </small>
                  {clickedAppointment.pet_name}
                </span>
                <span>
                  <small>Type : </small> {clickedAppointment.pet_type}
                </span>
                <span>
                  <small>Breed : </small>
                  {clickedAppointment.breed}
                </span>
                <span>
                  <small>Gender : </small> {clickedAppointment.gender}
                </span>
                <span>
                  <small>Age : </small> {clickedAppointment.age}
                  <small> year old</small>
                </span>
                <span>
                  <small>Weight : </small> {clickedAppointment.weight}
                  <small> klg </small>
                </span>
                <br />

                <div className="medical-history">
                  <h6 className="ptitle_">Appointment History</h6>

                  <div className="booking__">
                    {clickedAppointment.booking_history.length > 0 ? (
                      clickedAppointment.booking_history.map((item, index) => {
                        return (
                          <div className="card__booking">
                            <div className="service__note">
                              <span className="service__name">
                                <span
                                  style={{
                                    fontSize: "0.625rem",
                                    color: "gray",
                                    fontWeight: 200,
                                  }}
                                >
                                  Service:
                                </span>{" "}
                                {item.service}
                              </span>

                              <span className="vet__note">
                                <span
                                  style={{
                                    fontSize: "0.625rem",
                                    color: "gray",
                                    fontWeight: 200,
                                    marginRight: "10px",
                                  }}
                                >
                                  Note:
                                </span>{" "}
                                {item.note_from_vet === "" && item.status == 0
                                  ? "Awaiting vet’s notes – appointment is pending."
                                  : item.note_from_vet}
                              </span>
                            </div>

                            <div className="status-wrapper">
                              <span className="status__">
                                Status:{" "}
                                <span
                                  className="stat__"
                                  style={{
                                    color:
                                      item.status === 0
                                        ? "green"
                                        : item.status === 1
                                        ? "blue"
                                        : item.status === 2
                                        ? "red"
                                        : "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item.status === 0
                                    ? "Pending"
                                    : item.status === 1
                                    ? "Completed"
                                    : item.status === 2
                                    ? "Cancelled"
                                    : "Unknown"}
                                </span>
                              </span>
                              <p style={{ fontSize: "0.625rem" }}>
                                {item.appointment_date}
                              </p>
                              <p style={{ fontSize: "0.5rem" }}>
                                ({item.appointment_time})
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No Medical History Recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
