import "./TermsAndCondations.scss";
//icons
import { AiOutlineClose } from "react-icons/ai";

const TermsAndCondations = ({ close }) => {
  return (
    <div className="terms-cons-overlay">
      <AiOutlineClose className="close-icon" onClick={close} />
      <div className="terms-cons">
        <div className="top">
          <h6>Terms and Conditions</h6>
        </div>
        <div className="title">
          <span>
            Welcome to Vetsmagic. These Terms and Conditions govern your access
            to and use of our website located at https://vetcare4.unaux.com . By
            using our Site, you agree to be bound by these Terms.
          </span>
        </div>

        <div className="content">
          <div className="list">
            <span>1. Acceptance of Terms </span>
            <ul>
              <li>
                By accessing or using the Site, you confirm that you have read,
                understood, and agree to be bound by these Terms and Conditions,
                along with our Privacy Policy. If you do not agree, please do
                not use the Site.
              </li>
            </ul>
          </div>
          <div className="list">
            <span>2. User Accounts</span>
            <ul>
              <li>You must provide accurate and up-to-date information.</li>

              <li>
                You agree to notify us immediately if you suspect any
                unauthorized activity.
              </li>
            </ul>
          </div>
          <div className="list">
            <span>3. Appointment</span>
            <ul>
              <li>
                All bookings are final. Once a booking is confirmed, it cannot
                be canceled, refunded, or rescheduled under any circumstances.
                This policy ensures fairness to our veterinarians, whose
                schedules are carefully managed to accommodate all clients. It
                also helps avoid last-minute cancellations that may prevent
                other pet owners from receiving timely care.
              </li>
              <li>
                Please ensure that all details are correct before submitting
                your booking.
              </li>
            </ul>
          </div>
          <div className="list">
            <span>4. User Conduct</span>
            <ul>
              <li>
                Post or transmit any harmful, offensive, or unlawful content.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Site or
                its data, such as accessing admin or veterinarian account
                information without proper authorization.
              </li>
            </ul>
          </div>
          <div className="list">
            <span>5. Intellectual Property</span>
            <ul>
              <li>
                All content, design elements, and code on this Site are owned by
                vetsmagic or its licensors and are protected by copyright and
                intellectual property laws.
              </li>
            </ul>
          </div>{" "}
          <div className="list">
            <span>6. Limitation of Liability</span>
            <ul>
              <li>
                We provide the Site without warranties of any kind. We are not
                responsible for any loss, damage, or inconvenience resulting
                from the use of the Site or any service booked through it.
              </li>
            </ul>
          </div>
          <div className="list">
            <span>7. Contact Us</span>
            <ul>
              <li>
                For questions or support, please contact us at 0917 639 9344.
              </li>
            </ul>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default TermsAndCondations;
