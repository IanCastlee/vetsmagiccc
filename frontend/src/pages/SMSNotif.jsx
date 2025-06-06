import axios from "axios";
import axiosIntance from "../../axios";

const SMSNotif = () => {
  function sendSMS() {
    const data = {
      to: "+639467021561",
      message: "Your booking has been confirmed!",
    };

    axiosIntance
      .post("sendSMS.php", data)
      .then((response) => {
        if (response.data.success) {
          alert("SMS sent!");
        } else {
          alert("SMS failed: " + response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });
  }
  return (
    <div
      style={{
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button onClick={sendSMS}>Send SMS</button>
    </div>
  );
};

export default SMSNotif;
