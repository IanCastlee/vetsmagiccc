import { createContext, useEffect, useState } from "react";
import axiosInstance from "../../axios";

export const NotifContext = createContext();
export const NotifContextProvider = ({ children }) => {
  const [activeNotifCount, setActiveNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const fetchNotifCount = async () => {
    try {
      const res = await axiosInstance.get("client/notif/getNotification.php");
      if (res.data.success) {
        const unread = res.data.data.filter((item) => item.status === 0);
        setActiveNotifCount(unread.length);
      }
    } catch (err) {
      console.error("Error fetching notif count:", err);
    }
  };

  useEffect(() => {
    fetchNotifCount();
  }, [activeNotifCount]);

  return (
    <NotifContext.Provider
      value={{
        activeNotifCount,
        setActiveNotifCount,
        showNotif,
        setShowNotif,
        fetchNotifCount,
      }}
    >
      {children}
      {showNotif && <Notification />}
    </NotifContext.Provider>
  );
};
