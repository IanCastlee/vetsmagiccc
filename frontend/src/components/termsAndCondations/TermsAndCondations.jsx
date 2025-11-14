import "./TermsAndCondations.scss";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";

const TermsAndConditions = ({ onAgree, onDisagree, close }) => {
  const [alreadyAgreed, setAlreadyAgreed] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("termsAgreed");
    if (hasAgreed === "true") {
      setAlreadyAgreed(true);
    }
  }, []);

  return (
    <div className="terms-cons-overlay">
      <div className="terms-cons">
        {alreadyAgreed && (
          <AiOutlineClose className="close-icon" onClick={close} />
        )}
        <div className="top">
          <h6>Terms and Conditions</h6>
        </div>

        <div className="title">
          <span>
            Welcome to <strong>VetsMagic</strong>. These Terms and Conditions
            govern your access to and use of our website located at
            <em> https://vetcare4.unaux.com</em>. By using our Site, you agree
            to be bound by these Terms.
          </span>
        </div>

        <div className="content">
          <div className="list">
            <span>1. Acceptance of Terms</span>
            <ul>
              <li>
                By accessing or using this Site, you confirm that you have read,
                understood, and agreed to these Terms and Conditions and our
                Privacy Policy. If you do not agree, please do not use the Site.
              </li>
            </ul>
          </div>

          <div className="list">
            <span>2. User Accounts</span>
            <ul>
              <li>You must provide accurate and up-to-date information.</li>
              {/* <li>
                Notify us immediately if you suspect any unauthorized activity.
              </li> */}
            </ul>
          </div>

          <div className="list">
            <span>3. Appointment</span>
            <ul>
              <li>
                Users can cancel their booking only if it is at least 1 day
                before the appointment. Bookings within 24 hours of the
                appointment cannot be canceled and refunded.
              </li>

              <li>
                Please ensure all details are correct before submitting your
                booking.
              </li>
            </ul>
          </div>

          <div className="list">
            <span>4. User Conduct</span>
            <ul>
              <li>Do not post or transmit harmful or unlawful content.</li>
              <li>
                Do not attempt to gain unauthorized access to any part of the
                Site or its data.
              </li>
            </ul>
          </div>

          <div className="list">
            <span>5. Intellectual Property</span>
            <ul>
              <li>
                All content and design elements are owned by VetsMagic or its
                licensors and protected by intellectual property laws.
              </li>
            </ul>
          </div>

          <div className="list">
            <span>6. Limitation of Liability</span>
            <ul>
              <li>
                The Site is provided without warranties of any kind. We are not
                responsible for any loss, damage, or inconvenience resulting
                from use of the Site or services booked through it.
              </li>
            </ul>
          </div>

          <div className="list">
            <span>7. Data Privacy Act Compliance</span>
            <ul>
              <li>
                VetsMagic complies with the Data Privacy Act of 2012 (RA 10173).
                Any personal information you provide will be securely stored and
                used only for legitimate veterinary and customer service
                purposes.
              </li>
              <li>
                We will not share or sell your data to third parties without
                your consent unless required by law.
              </li>
            </ul>
          </div>

          <div className="list">
            <span>8. Contact Us</span>
            <ul>
              <li>
                For questions or support, please contact us at 0917 639 9344.
              </li>
            </ul>
          </div>
        </div>

        {/* Show buttons only if not yet agreed */}

        <div className="actions">
          <button className="agree-btn" onClick={onAgree}>
            Agree
          </button>
          <button className="disagree-btn" onClick={onDisagree}>
            Disagree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
