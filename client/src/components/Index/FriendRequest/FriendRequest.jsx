import PropTypes from "prop-types";
import "./FriendRequest.css";
import { Avatar } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useMain } from "../../../contexts/MainContext";
import myAxios from "../../../services/myAxios";
import { calculateElapsedTime } from "../../../services/calculTime";

function FriendRequest({ user }) {
  const { auth } = useAuth();
  const { handleRefresh } = useMain();

  const handleAccept = async () => {
    try {
      await myAxios.post(
        `/api/friendships/${auth.account.id_account}`,
        {
          id_account_1: auth.account.id_account,
          id_account_2: user.id_account,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      await myAxios.delete(
        `/api/friends-requests/${auth.account.id_account}/${user.id_friend_request}`,
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

  const handleDeny = async () => {
    try {
      await myAxios.delete(
        `/api/friends-requests/${auth.account.id_account}/${user.id_friend_request}`,
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
    <div className="friend-request">
      <div className="friend-request-header">
        <Link to={`/profil/${user.id_account}`} className="user-picture">
          <Avatar
            alt={`${user.firstname} ${user.lastname}`}
            src={user.avatar}
            sx={{ width: 55, height: 55 }}
            className="pointer"
          />
        </Link>
        <div className="user-info">
          <Link to={`/profil/${user.id_account}`} className="user-info pointer">
            <h4>
              {user.firstname} {user.lastname}
            </h4>
            <p>
              {user.friendship_common} ami
              {user.friendship_common > 1 ? "s" : ""} en commun
            </p>
          </Link>
        </div>
        <div className="request-info">
          <p className="request-date">
            Envoyée {calculateElapsedTime(user.date_friend_request)}
          </p>
          <div className="friend-request-btn">
            <button
              type="button"
              aria-label="Accepter la demande d'ami"
              className="btn green"
              onClick={handleAccept}
            >
              <DoneIcon />
            </button>
            <button
              type="button"
              aria-label="Refuser la demande d'ami"
              className="btn red"
              onClick={handleDeny}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

FriendRequest.propTypes = {
  user: PropTypes.shape({
    id_account: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    friendship_common: PropTypes.number.isRequired,
    id_friend_request: PropTypes.number.isRequired,
    date_friend_request: PropTypes.string.isRequired,
  }).isRequired,
};

export default FriendRequest;
