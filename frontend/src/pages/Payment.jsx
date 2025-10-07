import React, { useState } from "react";

function Payment() {
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.get("/xendit/create-invoice", {
        params: {
          amount,
          email,
        },
      });

      // Redirect user to Xendit's hosted payment page
      window.location.href = res.data.invoice_url;
    } catch (error) {
      console.error("Failed to create invoice", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay with Xendit</h2>
      <form onSubmit={handlePay}>
        <input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Amount"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Redirecting..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Payment;
