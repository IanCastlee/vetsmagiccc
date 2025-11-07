import axios from "axios";

const axiosIntance = axios.create({
  baseURL: "http://localhost/VETCARE/backend/",
  //baseURL: "https://vetsmagic.unaux.com/backend/",
  withCredentials: true,
});

export default axiosIntance;
