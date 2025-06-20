import axios from "axios";

const axiosIntance = axios.create({

  //baseURL: "http://localhost/VETCARE/backend/", 
    baseURL: "https://vetcare3.unaux.com/backend/",
    //baseURL: "https://vetcare002.kesug.com/backend/",
  withCredentials: true,
});

export default axiosIntance;
