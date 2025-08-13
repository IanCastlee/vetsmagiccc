import "./Announcement.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loader2 from "../loader/Loader3";
import Emptydata from "../emptydata/Emptydata";
import { uploadUrl } from "../../../fileurl";
import axiosIntance from "../../../axios";

//ICONS
import { IoCloseOutline } from "react-icons/io5";

const Announcement = () => {
  const { setModlToShow } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 180;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  //get data

  useEffect(() => {
    const fetchedData = async () => {
      setLoader(true);
      try {
        const res = await axiosIntance.get(
          "admin/announcement/getannouncement.php"
        );
        if (res.data.success) {
          setData(res.data.data);
          console.log("SERVICES : ", res.data.data);
          setLoader(false);
        } else {
          console.log("Error : ", res.data);
          setLoader(false);
        }
      } catch (error) {
        console.log("Error : ", error);
        setLoader(false);
      }
    };
    fetchedData();
  }, []);

  return (
    <>
      <div className="announcement-ovelay">
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="announcement"
        >
          <div className="container">
            <div className="top-card">
              <h6>Announcement</h6>
              <IoCloseOutline
                className="icon"
                onClick={() => setModlToShow("")}
              />
            </div>

            <div className="content">
              {loader ? (
                <Loader2 />
              ) : data.length > 0 ? (
                data.map((item) => (
                  <div className="card">
                    <div className="top">
                      <LazyLoadImage
                        src={`${uploadUrl.uploadurl}/${item.image}`}
                        effect="blur"
                        className="announcement-image"
                      />
                    </div>
                    <div className="bot">
                      <span className="title">{item.title}</span>
                      <p className="description">
                        {isExpanded
                          ? item.description
                          : item.description.slice(0, maxLength) +
                            (item.description.length > maxLength ? "..." : "")}
                      </p>

                      {item.description.length > maxLength && (
                        <p onClick={toggleReadMore} className="btn-readmore">
                          {isExpanded ? "Read Less" : "Read More"}
                        </p>
                      )}

                      <span className="time-sent">
                        Date Posted : {item.postdate}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <Emptydata />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Announcement;
