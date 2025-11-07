import "./LandingPage.scss";
import logo from "../../assets/icons/vetmagic.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TermsAndConditions from "../../components/termsAndCondations/TermsAndCondations";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(null);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("termsAgreed");

    if (!hasAgreed) {
      setShowTerms(true); // show modal
    } else {
      setShowTerms(false); // hide modal
      navigate("/home"); // redirect
    }
  }, [navigate]);

  const handleAgree = () => {
    localStorage.setItem("termsAgreed", "true");
    setShowTerms(false);
    navigate("/home");
  };

  const handleDisagree = () => {
    alert("You must agree to the Terms and Conditions to continue.");
    window.location.href = "https://google.com";
  };

  // Don't render anything until showTerms is decided
  if (showTerms === null) return null;

  return (
    <>
      <div className="landing">
        <div className="landing-container">
          <img src={logo} alt="VetsMagic Logo" />
        </div>
      </div>

      {showTerms && (
        <TermsAndConditions onAgree={handleAgree} onDisagree={handleDisagree} />
      )}
    </>
  );
};

export default LandingPage;
