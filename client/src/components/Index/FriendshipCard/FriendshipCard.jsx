import PropTypes from 'prop-types';
import "./FriendshipCard.css";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMain } from "../../../contexts/MainContext";
import { useAuth } from "../../../contexts/AuthContext";
import Popup from "../Popup/Popup";
import myAxios from "../../../services/myAxios";

function FriendshipCard({ user, noDelete }) {
  const { auth } = useAuth();
  const { handleRefresh } = useMain();

  // Function for validation popup
  const [showPopup, setShowPopup] = useState(false);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDeleteFriendship = () => {
    myAxios.delete(
      `/api/friendships/${auth.account.id_account}/${user.id_friendship}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    handleRefresh();
    handleClosePopup();
  };

  // Function for allowed the clic on the delete button
  const handleButtonClic = (event) => {
    setShowPopup(true);
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <>
      {showPopup ? (
        <Popup
          closePopup={handleClosePopup}
          title="Attention"
          content={`Êtes-vous sûrs de vouloir supprimer votre amitié avec ${user.firstname} ${user.lastname} ?`}
          choiceOne="Supprimer"
          actionOne={handleDeleteFriendship}
          choiceTwo="Annuler"
          actionTwo={handleClosePopup}
        />
      ) : (
        ""
      )}
      <Link to={`/profil/${user.id_account}`} className="friendship-card">
        {!noDelete && (
          <button
            type="button"
            aria-label={`Supprimer l'amitié avec ${user.firstname} ${user.lastname}`}
            className="btn red"
            onClick={handleButtonClic}
          >
            <CloseIcon />
          </button>
        )}
        <div className="friendship-avatar">
          <img
            src={user.avatar}
            alt={`Avatar de profil de ${user.firstname} ${user.lastname}`}
          />
        </div>
        <div className="friendship-profile">
          <h4>
            {user.firstname} {user.lastname}
          </h4>
          <p>
            {user.friendship_common} ami{user.friendship_common > 1 ? "s" : ""}{" "}
            en commun
          </p>
        </div>
      </Link>
    </>
  );
}

FriendshipCard.propTypes = {
  user: PropTypes.shape({
    id_friendship: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    id_account: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
    friendship_common: PropTypes.number.isRequired,
  }).isRequired,
  noDelete: PropTypes.bool,
};

FriendshipCard.defaultProps = {
  noDelete: false,
};

export default FriendshipCard;
