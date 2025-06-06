import { useEffect, useState } from "react";
import "./Home.scss";
import axiosIntance from "../../../../axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Home = () => {
  const [counts, setCounts] = useState(null);
  const [mostSold, setMostSold] = useState([]);

  useEffect(() => {
    axiosIntance
      .get("admin/getDashboardCounts.php")
      .then((res) => {
        setCounts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching counts:", err);
      });

    // Fetch most selling products
    axiosIntance
      .get("admin/shop/getMostSellingProducts.php")
      .then((res) => {
        setMostSold(res.data);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
      });
  }, []);

  if (!counts || !counts.appointment || !counts.shop) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="content">
        <div className="top">
          <div className="appointment-section">
            <span className="title">Appointment</span>
            <div className="appointment-wrapper">
              <Card
                title="Pending Appointment"
                count={counts.appointment.pending ?? 0}
              />
              <Card
                title="Completed Appointment"
                count={counts.appointment.completed ?? 0}
              />
              <Card
                title="Follow-up Appointment"
                count={counts.appointment.followUp ?? 0}
              />
              <Card
                title="Completed Follow-up Appointment"
                count={counts.appointment.completedFollowUp ?? 0}
              />
            </div>
          </div>

          <div style={{ marginTop: "12px" }} className="appointment-section">
            <span className="title">Shop</span>
            <div className="appointment-wrapper">
              <Card title="All Medicine" count={counts.shop.all ?? 0} />
              <Card title="Expires Soon" count={4} />
              <Card title="New Added" count={2} />
            </div>
          </div>
        </div>

        <div className="bot">
          <span
            className="title"
            style={{ marginBottom: "12px", display: "block" }}
          >
            Most Selling Products
          </span>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mostSold}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#0075F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, count }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="card"
  >
    <div className="left">
      <span>{count}</span>
    </div>
    <div className="right">
      <span>{title}</span>
    </div>
  </motion.div>
);

export default Home;
