import PropTypes from 'prop-types';
import "./NotificationCard.css";
import { Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import MessageIcon from "@mui/icons-material/Message";
import { Link } from "react-router-dom";
import { useMain } from "../../../contexts/MainContext";
import { useAuth } from "../../../contexts/AuthContext";
import myAxios from "../../../services/myAxios";
import { calculateElapsedTime } from "../../../services/calculTime";

function NotificationCard({ notification }) {
  const { auth } = useAuth();
  const { handleRefresh } = useMain();

  const handleDeleteNotification = async () => {
    try {
      await myAxios.delete(
        `/api/notifications/${auth.account.id_account}/${notification.id_notification}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      handleRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="notification-card">
      <Link
        to={`/profil/${notification.id_sender}`}
        className="notification-profile"
      >
        <Avatar
          alt={`${notification.firstname} ${notification.lastname}`}
          src={notification.avatar}
          sx={{ width: 55, height: 55 }}
          className="pointer"
        />
      </Link>
      <div className="notification-content">
        <p>
          {`${notification.firstname} ${notification.lastname} ${notification.content} `}
          <Link
            to={`/publication/${notification.id_publication_fk}`}
            className="publication-link"
          >
            publication
          </Link>
          .
          <span className="notification-source">
            {notification.source === "like" ? (
              <ThumbUpAltIcon sx={{ width: 20, height: 20 }} />
            ) : (
              <MessageIcon sx={{ width: 20, height: 20 }} />
            )}
          </span>
        </p>
        <p className="notification-date">
          {calculateElapsedTime(notification.date_notification)}
        </p>
      </div>
      <button
        type="button"
        className="notification-close-btn no-btn"
        onClick={handleDeleteNotification}
      >
        <CloseIcon sx={{ height: 25, width: 25 }} />
      </button>
    </div>
  );
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    id_notification: PropTypes.number.isRequired,
    id_sender: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    id_publication_fk: PropTypes.number.isRequired,
    source: PropTypes.oneOf(['like', 'comment']).isRequired,
    date_notification: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotificationCard;
