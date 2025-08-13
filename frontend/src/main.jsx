import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { NotifContextProvider } from "./contexts/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <NotifContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </NotifContextProvider>
);
