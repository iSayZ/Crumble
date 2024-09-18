import PropTypes from "prop-types";
import "./FriendCard.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import myAxios from "../../../services/myAxios";

function FriendCard({ user }) {
  const { auth } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAddFriend = async () => {
    try {
      const response = await myAxios.post(
        "/api/friends-requests",
        {
          id_account: auth.account.id_account,
          id_recipient: user.id_account,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.info(response.data);
      setAdded(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="friend-card">
      <Link to={`/profil/${user.id_account}`} className="user-picture">
        <Avatar
          alt={`${user.firstname} ${user.lastname}`}
          src={user.avatar}
          sx={{ width: 55, height: 55 }}
          className="pointer"
        />
      </Link>
      <div className="friend-card-content">
        <Link to={`/profil/${user.id_account}`} className="user-info pointer">
          <h4>
            {user.firstname} {user.lastname}
          </h4>
          <p>
            {user.friendship_common} ami{user.friendship_common > 1 ? "s" : ""}{" "}
            en commun
          </p>
        </Link>
        <button
          type="button"
          onClick={added ? "" : handleAddFriend}
          className={added ? "no-btn" : "no-btn add-friend pointer"}
        >
          {added ? "" : <PersonAddIcon sx={{ width: 16, height: 16 }} />}
          <p className={added ? "bold" : "add-friend pointer"}>
            {added ? "Demande envoyée" : "Ajouter en ami"}
          </p>
        </button>
      </div>
    </div>
  );
}

FriendCard.propTypes = {
  user: PropTypes.shape({
    id_account: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    friendship_common: PropTypes.number.isRequired,
  }).isRequired,
};

export default FriendCard;
