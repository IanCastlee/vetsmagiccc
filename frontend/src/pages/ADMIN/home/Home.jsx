import { useEffect, useState } from "react";
import "./Home.scss";
import axiosIntance from "../../../../axios";
import { motion } from "framer-motion";
import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [countsRes, mostSoldRes] = await Promise.all([
          axiosIntance.get("admin/getDashboardCounts.php"),
          axiosIntance.get("admin/shop/getMostSellingProducts.php"),
        ]);
        setCounts(countsRes.data);
        setMostSold(mostSoldRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="content">
        <div className="top">
          <Section title="Appointment">
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
          </Section>

          <Section title="Shop" style={{ marginTop: "12px" }}>
            <Card title="All Medicine" count={counts.shop.all ?? 0} />
            <Card title="Expires Soon" count={4} />
            <Card title="New Added" count={2} />
          </Section>
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
                    return (
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    );
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
              </AreaChart>
            </ChartContainer>
          )}
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
              Total Payment for {selectedYear}: ₱{appointmentStats.yearly || 0}
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
              background: "linear-gradient(to bottom right, #e0f7e9, #c8f0da)",
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
              <Tooltip />
              <Bar dataKey="sold" fill="#0075F6" />
            </BarChart>
          </ChartContainer>
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
