import PropTypes from 'prop-types';
import "./FriendCardMessenger.css";
import { Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

function FriendCardMessenger({ friend }) {
  const { auth } = useAuth();

  return (
    <div className="friendcard-messenger">
      {auth.account.id_account && (
        <>
          <Link to={`/profil/${friend.id_account}`}>
            <Avatar
              alt={`${friend.firstname} ${friend.lastname}`}
              src={friend.avatar}
              sx={{ width: 55, height: 55 }}
              className="pointer"
            />
          </Link>
          <div className="card-info">
            <Link to={`/profil/${friend.id_account}`}>
              <h5>
                {friend.firstname} {friend.lastname}
              </h5>
            </Link>
            <p>
              {friend.last_message
                ? friend.unread_message_count > 0
                  ? `${friend.unread_message_count} message${friend.unread_message_count > 1 ? "s" : ""} non lu${friend.unread_message_count > 1 ? "s" : ""}`
                  : `Dernier message : "${friend.last_message}"`
                : "Aucune conversation pour le moment"}
            </p>
          </div>
          <Link
            to={`/conversation/${auth.account.id_account}/${friend.id_account}`}
            className="no-btn send-btn"
          >
            <SendIcon sx={{ width: 22, height: 22, color: "var(--white)" }} />
            {friend.last_message && friend.unread_message_count > 0 && (
              <span className="bubble-not-read" />
            )}
          </Link>
        </>
      )}
    </div>
  );
}

FriendCardMessenger.propTypes = {
  friend: PropTypes.shape({
    id_account: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    last_message: PropTypes.string,
    unread_message_count: PropTypes.number.isRequired,
  }).isRequired,
};

export default FriendCardMessenger;
