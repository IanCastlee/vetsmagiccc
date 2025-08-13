import { useState } from "react";
import axiosIntance from "../../axios";

const ClickSend = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosIntance.post("send_sms.php", {
        phone,
        message,
      });
      alert("SMS sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send SMS.");
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "10px",
        }}
        onSubmit={handleSubmit}
      >
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Send SMS</button>
      </form>{" "}
    </div>
  );
};

export default ClickSend;
