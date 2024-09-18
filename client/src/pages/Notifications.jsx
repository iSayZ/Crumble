import "./styles/Notifications.css";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMain } from "../contexts/MainContext";
import NotificationCard from "../components/Index/NotificationCard/NotificationCard";
import myAxios from "../services/myAxios";

function Notifications() {
  const { auth } = useAuth();
  const { refresh } = useMain();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await myAxios.get(
          `/api/notifications/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_account) {
      getData();
    }
  }, [auth.account.id_account, auth.token, refresh]);

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <h3>Notifications</h3>
        <hr />
        {notifications && notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id_notification}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <p>Vous n'avez pas de notifications</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;
