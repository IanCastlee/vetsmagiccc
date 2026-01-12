import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("data"));
  const path = location.pathname;
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

  // ---------------------
  // CLIENT (acc_type === 0 or GUEST)
  // ---------------------
  const allowedClientPaths = [
    "/",
    "/home",
    "/signin",
    "/signup",
    "/confirm",
    "/profile",
    "/medicine",
    "/myappointment",
    "/signin/",
    "/notfound",
    "/sms",
    "/about",
    "/terms",
    // "/paymongo",
  ];

  const clientDynamicPaths = [
    /^\/view-veterinarian\/\d+$/,
    /^\/set-appointment\/\d+$/,
  ];

  const isAllowedClientStaticPath = allowedClientPaths.includes(normalizedPath);
  const isAllowedClientDynamicPath = clientDynamicPaths.some((regex) =>
    regex.test(path)
  );

  //  Allow guest users to access client pages
  if (!user) {
    if (isAllowedClientStaticPath || isAllowedClientDynamicPath) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // ---------------------
  // Check authenticated user's role
  // ---------------------
  const userType = Number(user.acc_type);

  // ADMIN
  if (
    userType === 2 &&
    ![
      "/admin/home",
      "/admin/active-veterinarian",
      "/admin/not-active-veterinarian",
      "/admin/cancelled-appointment",
      "/admin/pending-appointment",
      "/admin/done-appointment",
      "/admin/followup-appointment",
      "/admin/appointment-history",
      "/admin/completed-followup-appointment",
      "/admin/shop",
      "/admin/shop-reservation",
      "/admin/shop-reservation-history",
      "/admin/low-stock",
      "/admin/soon-expired",
      "/admin/active-user",
      "/admin/not-active-user",
      "/admin/service",
      "/admin/treated_pet",
      "/admin/announcement",
      "/signin/",
    ].includes(normalizedPath.toLowerCase())
  ) {
    return <Navigate to="/admin/home" replace />;
  }

  // VETERINARIAN
  const allowedVetPaths = [
    /^\/veterinarian\/home\/\d+$/,
    "/veterinarian/history",
    "/signin/",
  ];

  const isAllowedVetPath = allowedVetPaths.some((p) =>
    typeof p === "string"
      ? normalizedPath.toLowerCase() === p
      : p.test(normalizedPath.toLowerCase())
  );

  if (userType === 1 && !isAllowedVetPath) {
    return <Navigate to={`/veterinarian/home/${user.user_id}`} replace />;
  }

  // CLIENT (authenticated)
  if (
    userType === 0 &&
    !isAllowedClientStaticPath &&
    !isAllowedClientDynamicPath
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
