import "./App.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import LandingPage from "./pages/landingPage/LandingPage";
import Home from "./pages/home/Home";
import VeterinarianProfile from "./pages/veterinarianProfile/VeterinarianProfile";
import SetAppointment from "./pages/setAppointment/SetAppointment";

//VETERINARIAN path
import VeterinarianNavbar from "./pages/VETERINARIAN/components/navbar/Navbar";
import VeterinarianHome from "./pages/VETERINARIAN/pages/home/Home";
import Appointment from "./pages/appointment/Appointment";
import Signin from "./components/signinSignUp/Signin";
import Signup from "./components/signinSignUp/Signup";
import ConfirmationForm from "./components/signinSignUp/ConfirmationForm";

//ADMIN path
import AdminHome from "./pages/ADMIN/home/Home";
import ActiveVeterinarian from "./pages/ADMIN/veterinarian/ActiveVeterinarian";
import NotActiveVeterinarian from "./pages/ADMIN/veterinarian/NotActiveVeterinarian";
import AdminSidebar from "./pages/ADMIN/components/adminSidebar/AdminSidebar";
import AdminAppointment from "./pages/ADMIN/appointment/Appointment";
import Medicine from "./pages/medicine/Medicine";
import Shop from "./pages/ADMIN/shop/Shop";
import DoneAppointment from "./pages/ADMIN/appointment/DoneAppointment";

import FollowupAppointment from "./pages/ADMIN/appointment/FollowupAppointment";
import CompletedFollowUpAppointment from "./pages/ADMIN/appointment/CompletedFollowUpAppointment";
import User from "./pages/ADMIN/user/User";
import Notactiveuser from "./pages/ADMIN/user/Notactiveuser";
import AdminNav from "./pages/ADMIN/components/adminNavbar/AdminNav";
import Service from "./pages/ADMIN/service/Service";
import Profile from "./pages/profile/Profile";
import ClickSend from "./pages/ClickSend";
import AppointmentHistory from "./pages/VETERINARIAN/components/history/AppointmentHistory";
import Announcement from "./pages/ADMIN/announcement/Announcement";
import Test from "./pages/testing/Test";
import LowStock from "./pages/ADMIN/shop/LowStock";
import ProtectedRoute from "./contexts/ProtectedRoute";
import NotFound from "./components/notFound/NotFound";
import Appointmenthistory from "./pages/ADMIN/appointment/Appointmenthistory";
import Soontoexpired from "./pages/ADMIN/shop/Soontoexpired";
import TreatedPets from "./pages/ADMIN/treated_pets/TreatedPets";
import Paymongo from "./Paymongo";
import CancelledAppointment from "./pages/ADMIN/appointment/CancelledAppointment";
import ShopReservation from "./pages/ADMIN/shop/ShopReservation";
import ShopReservationHistory from "./pages/ADMIN/shop/ShopReservationHistory";
import About from "./pages/about/About";
// import TermsAndCondations from "./components/termsAndCondations/TermsAndCondations";

//CLIENT
const Client = () => {
  const location = useLocation();

  const isHome = location.pathname === "/home/";

  const shouldHideNavbar =
    location.pathname === "/" ||
    location.pathname.startsWith("/view-veterinarian/") ||
    location.pathname.startsWith("/set-appointment/") ||
    location.pathname.startsWith("/profile/") ||
    location.pathname.startsWith("/medicine/") ||
    location.pathname.startsWith("/notfound") ||
    location.pathname.startsWith("/test");
  return (
    <>
      {!shouldHideNavbar && <Navbar isHome={isHome} />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/terms" element={<TermsAndCondations />} /> */}
        <Route path="/home/" element={<Home />} />
        <Route
          path="/view-veterinarian/:userId"
          element={<VeterinarianProfile />}
        />
        <Route path="/set-appointment/:userId" element={<SetAppointment />} />
        <Route path="/myappointment/" element={<Appointment />} />
        <Route path="/medicine/" element={<Medicine />} />

        <Route path="/signin/" element={<Signin />} />
        <Route path="/signup/" element={<Signup />} />
        <Route path="/confirm/" element={<ConfirmationForm />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/sms/" element={<ClickSend />} />
        <Route path="/test/" element={<Test />} />
        <Route path="/notfound/" element={<NotFound />} />
        <Route path="/paymongo" element={<Paymongo />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

//Veterinarian
const Veterinarian = () => {
  return (
    <>
      <VeterinarianNavbar />
      <Routes>
        <Route path="home/:vetId" element={<VeterinarianHome />} />
        <Route path="/history/" element={<AppointmentHistory />} />
      </Routes>
    </>
  );
};

//Admin
const Admin = () => {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "");
  const isAdminHome = normalizedPath === "/admin/home";

  return (
    <>
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-left">
          <AdminNav isHome={isAdminHome} />
          <div className="admin-content">
            <Routes>
              <Route path="/home/" element={<AdminHome />} />
              <Route
                path="/active-veterinarian/"
                element={<ActiveVeterinarian />}
              />
              <Route
                path="/not-active-veterinarian/"
                element={<NotActiveVeterinarian />}
              />
              <Route
                path="/pending-appointment/"
                element={<DoneAppointment />}
              />
              <Route path="/done-appointment/" element={<AdminAppointment />} />
              <Route
                path="/followup-appointment/"
                element={<FollowupAppointment />}
              />
              <Route
                path="/appointment-history/"
                element={<Appointmenthistory />}
              />
              <Route
                path="/cancelled-appointment/"
                element={<CancelledAppointment />}
              />
              <Route
                path="/completed-followup-appointment/"
                element={<CompletedFollowUpAppointment />}
              />
              <Route path="/shop/" element={<Shop />} />
              <Route path="/shop-reservation/" element={<ShopReservation />} />
              <Route
                path="/shop-reservation-history/"
                element={<ShopReservationHistory />}
              />
              <Route path="/low-stock/" element={<LowStock />} />
              <Route path="/soon-expired/" element={<Soontoexpired />} />
              <Route path="/active-user/" element={<User />} />
              <Route path="/not-active-user/" element={<Notactiveuser />} />
              <Route path="/service/" element={<Service />} />
              <Route path="/treated_pet/" element={<TreatedPets />} />
              <Route path="/announcement/" element={<Announcement />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/veterinarian/*"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Veterinarian />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <Client />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
