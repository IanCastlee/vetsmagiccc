import { useEffect, useState } from "react";
import { FiArrowRightCircle } from "react-icons/fi";

import "./Home.scss";
import axiosIntance from "../../../../axios";
import { motion } from "framer-motion";
import {
  BarChart,
  AreaChart,
  Bar,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Emptydata from "../../../components/emptydata/Emptydata";
import { IoWarningOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Home = () => {
  const [counts, setCounts] = useState(null);
  const [mostSold, setMostSold] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [appointmentStats, setAppointmentStats] = useState({
    daily: [],
    monthly: [],
    yearly: 0,
  });

  const [activeChart, setActiveChart] = useState(false);
  const [dataSales, setDataSales] = useState({
    totalCapital: "",
    currentSale: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [countsRes, mostSoldRes] = await Promise.all([
          axiosIntance.get("admin/getDashboardCounts.php"),
          axiosIntance.get("admin/shop/getMostSellingProducts.php"),
        ]);
        setDataSales({
          totalCapital: mostSoldRes.data.totalCapital,
          currentSale: mostSoldRes.data.currentSale,
        });
        setCounts(countsRes.data);
        setMostSold(mostSoldRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  console.log(mostSold);

  const maxY = Math.max(
    ...appointmentStats.monthly.flatMap((item) => [
      item.total_appointments,
      item.total_payment,
    ])
  );

  const yAxisMax = maxY + 1000;

  useEffect(() => {
    axiosIntance
      .get(`admin/appointment/getAppointmentStats.php?year=${selectedYear}`)
      .then((res) => {
        console.log("API response:", res.data);

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Parse daily data and make sure the date format is consistent
        const filteredDaily = Array.isArray(res.data.daily)
          ? res.data.daily.filter((item) => {
              const dateStr = item.day || item.date;
              if (!dateStr) return false;
              const date = new Date(dateStr);
              return (
                date.getMonth() + 1 === currentMonth &&
                date.getFullYear() === currentYear
              );
            })
          : [];

        // Parse monthly data with readable month names
        const formattedMonthly = Array.isArray(res.data.monthly)
          ? res.data.monthly.map((item) => ({
              ...item,
              month: monthNames[item.month - 1] || `M${item.month}`,
            }))
          : [];

        setAppointmentStats({
          daily: filteredDaily,
          monthly: formattedMonthly,
          yearly: res.data.yearly ?? 0,
        });
      })
      .catch((err) => console.error("Error fetching appointment stats:", err));
  }, [selectedYear]);

  if (
    !counts ||
    !counts.appointment ||
    !counts.shop ||
    !Array.isArray(appointmentStats.daily) ||
    !Array.isArray(appointmentStats.monthly)
  ) {
    return <Emptydata />;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      const formatNumber = (num) =>
        new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
        }).format(num);

      return (
        <div
          style={{
            background: "#fff",
            padding: "10px",
            border: "1px solid lightgray",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontSize: "14px" }}>
            <strong>{label}</strong>
          </p>
          <p style={{ fontSize: "12px", marginTop: "5px" }}>
            Original Stock: {data.orig_stock}
          </p>
          <p style={{ fontSize: "12px" }}>Sold: {data.sold}</p>
          <p style={{ fontSize: "12px" }}>
            Current Stock : {data.orig_stock - data.sold}
          </p>
          <p style={{ fontSize: "12px" }}>Price : {formatNumber(data.price)}</p>
          <div
            style={{ borderBottom: "1px solid lightgrey", margin: "10px 0" }}
          ></div>
          <p style={{ fontSize: "12px", marginBottom: "5px" }}>
            Initial Investment : {formatNumber(data.capital)}
          </p>
          <p style={{ fontSize: "12px" }}>
            Total Sale : {formatNumber(data.price * data.sold)}
          </p>
          <p style={{ fontSize: "12px", marginTop: "5px" }}>
            <strong
              style={{
                color: `${
                  data.capital > data.price * data.sold ? "red" : "#000"
                }`,
              }}
            >
              Profit: {formatNumber(data.price * data.sold - data.capital)}
            </strong>
          </p>
        </div>
      );
    }

    return null;
  };

  const now = new Date();

  // Get Monday (start of the week)
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  firstDayOfWeek.setHours(0, 0, 0, 0);

  // Get Sunday (end of the week)
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(0, 0, 0, 0);

  // Filter and sum total_payment for the current week
  const weeklyStats =
    appointmentStats.daily?.filter((item) => {
      const date = new Date(item.day || item.date);
      date.setHours(0, 0, 0, 0);
      return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }) || [];

  const totalWeeklyPayment = weeklyStats.reduce(
    (sum, item) => sum + (parseFloat(item.total_payment) || 0),
    0
  );

  return (
    <>
      {" "}
      <div className="home">
        <div className="content">
          <div className="top">
            <div className="cards">
              <h2>Appointment Report</h2>
              <div className="appointment-card">
                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>Pending Appointment</span>
                    </div>
                    <div className="right">
                      <span>{counts.appointment.pending ?? 0}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/pending-appointment/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>
                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>Completed Appointment</span>
                    </div>
                    <div className="right">
                      <span> {counts.appointment.completed ?? 0}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/done-appointment/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>

                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>Follow-up Appointment</span>
                    </div>
                    <div className="right">
                      <span>{counts.appointment.followUp ?? 0}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/followup-appointment/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>

                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>Completed Follow-up Appointment</span>
                    </div>
                    <div className="right">
                      <span>{counts.appointment.completedFollowUp ?? 0}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/completed-followup-appointment/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="cards">
              <h2>Shop Status</h2>
              <div className="appointment-card">
                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>All Products</span>
                    </div>
                    <div className="right">
                      <span>{counts.shop.all ?? 0}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/shop/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>
                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>Expires Soon</span>
                    </div>
                    <div className="right">
                      <span> {counts.shop.soonToExpire}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/soon-expired/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>

                <div className="card">
                  <div className="topp">
                    <div className="left">
                      <span>Low Stock Product</span>
                    </div>
                    <div className="right">
                      <span>{counts.shop.lowstock ?? 0}</span>
                    </div>
                  </div>
                  <div className="bott">
                    <Link to="/admin/low-stock/">
                      <FiArrowRightCircle className="info-icon" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bot">
            <div className="header">
              <span>
                {!activeChart ? "Daily" : "Monthly"} Appointment and Payment
              </span>
              {activeChart && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              )}

              <button onClick={() => setActiveChart(!activeChart)}>
                {activeChart ? "View Daily Report" : "View Monthly Report"}
              </button>
            </div>

            {!activeChart && (
              <ChartContainer style={{ marginTop: "20px" }}>
                <AreaChart
                  data={
                    appointmentStats.daily?.filter((item) => {
                      const date = new Date(item.day || item.date);
                      const now = new Date();

                      // Get the start of the week (Monday)
                      const firstDayOfWeek = new Date(now);
                      firstDayOfWeek.setDate(
                        now.getDate() - ((now.getDay() + 6) % 7)
                      );

                      // Get the end of the week (Sunday)
                      const lastDayOfWeek = new Date(firstDayOfWeek);
                      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

                      // Strip time for comparison
                      date.setHours(0, 0, 0, 0);
                      firstDayOfWeek.setHours(0, 0, 0, 0);
                      lastDayOfWeek.setHours(0, 0, 0, 0);

                      return date >= firstDayOfWeek && date <= lastDayOfWeek;
                    }) || []
                  }
                  width={600}
                  height={300}
                  margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    {/* Background Gradient */}
                    <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4f5e6" />
                      <stop offset="100%" stopColor="#b2e2c8" />
                    </linearGradient>

                    {/* Area Gradient */}
                    <linearGradient
                      id="colorAppointments"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16a085" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#bgGradient)"
                    rx={10}
                  />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total_appointments"
                    stroke="#27ae60"
                    fillOpacity={1}
                    fill="url(#colorAppointments)"
                    name="Appointments"
                  />
                  <Area
                    type="monotone"
                    dataKey="total_payment"
                    stroke="#e74c3c"
                    fillOpacity={1}
                    fill="url(#colorPayments)"
                    name="Earned"
                  />
                </AreaChart>
              </ChartContainer>
            )}
            <h4>Earnings This Week: ₱{totalWeeklyPayment.toLocaleString()}</h4>

            {activeChart && (
              <ChartContainer style={{ marginTop: "20px", paddingTop: "30px" }}>
                <AreaChart
                  data={appointmentStats.monthly}
                  width={600}
                  height={300}
                  margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e0f0ff" />
                      <stop offset="100%" stopColor="#c0ddf9" />
                    </linearGradient>

                    <linearGradient
                      id="colorAppointments"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2980b9" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="colorPayments"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#5dade2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2e86c1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#bgGradient)"
                    rx={10}
                  />

                  <XAxis dataKey="month" />
                  <YAxis domain={[0, yAxisMax]} />

                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total_appointments"
                    stroke="#27ae60"
                    fillOpacity={1}
                    fill="url(#colorAppointments)"
                    name="Appointments"
                  />
                  <Area
                    type="monotone"
                    dataKey="total_payment"
                    stroke="#e74c3c"
                    fillOpacity={1}
                    fill="url(#colorPayments)"
                    name="Earned"
                  />
                </AreaChart>
              </ChartContainer>
            )}

            {activeChart && (
              <h4>
                Total Earned for {selectedYear}: ₱{appointmentStats.yearly || 0}
              </h4>
            )}
          </div>

          <div className="bot">
            <span className="title" style={{ marginBottom: "12px" }}>
              Most Selling Products
            </span>
            <ChartContainer
              style={{
                marginTop: "20px",
                background:
                  "linear-gradient(to bottom right, #e0f7e9, #c8f0da)",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <BarChart
                data={mostSold}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sold" fill="#0075F6" />{" "}
              </BarChart>
            </ChartContainer>

            <div className="sales-wrapper">
              <p>
                Total Capital: ₱
                {Number(dataSales.totalCapital).toLocaleString()}
              </p>
              <p>
                Total Sale: ₱{Number(dataSales.currentSale).toLocaleString()}
              </p>
              <p style={{ marginTop: "10px", borderTop: "1px solid gray" }}>
                Total Profit: ₱
                {Number(
                  dataSales.currentSale - dataSales.totalCapital
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
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

const Section = ({ title, children, style = {} }) => (
  <div className="appointment-section" style={style}>
    <span className="title">{title}</span>
    <div className="appointment-wrapper">{children}</div>
  </div>
);

const ChartContainer = ({ children, style = {} }) => (
  <div style={{ width: "100%", height: "300px", ...style }}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

export default Home;
