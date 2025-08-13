import { useNavigate } from "react-router-dom";
import "./NotFound.scss";
import imgNotFound from "../../assets/imges/not-found.png";

//icons
import { FaArrowLeft } from "react-icons/fa6";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <img src={imgNotFound} alt="not found" />
      <p>The URL you are trying to access is invalid.</p>
      <button className="btn-back-notfound" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
    </div>
  );
};

export default NotFound;
