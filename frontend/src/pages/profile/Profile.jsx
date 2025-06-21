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
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, setFormToShow } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

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

  console.log(formData.image);

  return (
    <>
      <div className="user-profile2">
        <div className="container">
          <div className="top-content">
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
                <span>User Account Credentials</span>
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

        <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
      </div>
    </>
  );
};

export default Profile;
