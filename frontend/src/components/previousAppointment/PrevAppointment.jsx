import "./PreviousAppointment.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axiosIntance from "../../../axios";
import Loader2 from "../loader/Loader3";
import { uploadUrl } from "../../../fileurl";

const PrevAppointment = ({ specialization }) => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.user_id) {
      return;
    }

    const getPrevAppointment = async () => {
      let petType = specialization ? specialization.split(" ")[0] : "";
      setLoader(true);
      try {
        const res = await axiosIntance.get(
          `client/appointment/getPrevAppointment.php?user_id=${currentUser.user_id}&petType=${petType}`
        );
        if (res.data.success) {
          console.log("DATATATTATAT : ", res.data.data);
          setData(res.data.data);
          setLoader(false);
        } else {
          console.log("Err : ", res.data);
          setLoader(false);
        }
      } catch (error) {
        console.log("ERROR : ", error);
        setLoader(false);
      }
    };

    getPrevAppointment();
  }, [currentUser, specialization]);

  return (
    <>
      {data.length > 0 && (
        <div className="containerrr">
          <div className="title">
            <span>Previous Pet Appointent</span>
          </div>

          <div className="content">
            {loader ? (
              <Loader2 />
            ) : data ? (
              data.map((item) => (
                <div className="card">
                  <img src={`${uploadUrl.uploadurl}/${item?.image}`} alt="" />

                  <span>{item.pet_name}</span>
                </div>
              ))
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PrevAppointment;
