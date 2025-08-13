import "./LandingPage.scss";
import logo from "../../assets/icons/vetmagic.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/home/");
    }, 1000);
  }, []);
  return (
    <div className="landing">
      <div className="landing-container">
        <img src={logo} alt="" />
      </div>
    </div>
  );
};

export default LandingPage;
