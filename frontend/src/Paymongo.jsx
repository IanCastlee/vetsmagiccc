import React, { useState } from "react";
import axiosInstance from "../axios";

function Paymongo() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Optional: Save payment to your DB (not necessary immediately since webhook handles final confirmation)
  const savePaymentToDB = async (paymentData) => {
    try {
      const response = await axiosInstance.post("insertdata.php", paymentData);
      console.log("Payment saved:", response.data);
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await axiosInstance.post("paymongo.php");

      const checkoutUrl =
        res.data?.data?.attributes?.url ||
        res.data?.data?.attributes?.checkout_url;
      const paymentIntentId = res.data?.data?.id;
      const amount = res.data?.data?.attributes?.amount;

      if (checkoutUrl) {
        setPaymentId(paymentIntentId);
        setPaymentStatus("Redirecting to payment gateway...");

        // Optional: save initial payment info to your DB if you want
        // await savePaymentToDB({
        //   id: paymentIntentId,
        //   name: "Customer Name",
        //   payment: amount / 100,
        //   method: "GCash",
        // });

        // Redirect user to PayMongo checkout page
        window.location.href = checkoutUrl;
      } else {
        setPaymentStatus("Failed to create payment link.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setPaymentStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Pay with GCash</h1>
      <button
        onClick={handlePayment}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#36A97F",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        Pay Now
      </button>
      {paymentStatus && (
        <div style={{ color: "green", fontWeight: "bold" }}>
          {paymentStatus} <br />
          {paymentId && <span>Payment Intent ID: {paymentId}</span>}
        </div>
      )}
    </div>
  );
}

export default Paymongo;
