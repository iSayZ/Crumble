import PropTypes from 'prop-types';
import "./PublicationCard.css";
import { Avatar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import MessageIcon from "@mui/icons-material/Message";
import { Link } from "react-router-dom";
import { calculateElapsedTime } from "../../../services/calculTime";

function PublicationCard({ publication }) {
  return (
    <div className="publi-card">
      <div className="publi-card-header">
        <div className="author-container">
          <Link
            to={`/profil/${publication.id_account_fk}`}
            className="user-picture"
          >
            <Avatar
              alt={`${publication.firstname} ${publication.lastname}`}
              src={publication.avatar}
              sx={{ width: 55, height: 55 }}
              className="pointer"
            />
          </Link>
          <div className="author-info">
            <Link to={`/profil/${publication.id_account_fk}`}>
              <h4 className="pointer">
                {publication.firstname} {publication.lastname}
              </h4>
            </Link>
            <p>Publié {calculateElapsedTime(publication.date_publication)}</p>
          </div>
          <div className="feedback-details">
            <div className="feedback comment">
              <MessageIcon sx={{ height: 18, width: 18 }} />
              <p>{publication.comment_count}</p>
            </div>
            <div className="feedback like">
              <ThumbUpAltIcon sx={{ height: 18, width: 18 }} />
              <p>{publication.like_count}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="publi-content">
        <p>{publication.content}</p>
        <Link
          to={`/publication/${publication.id_publication}`}
          className="btn see-more"
        >
          Voir plus
        </Link>
      </div>
    </div>
  );
}

PublicationCard.propTypes = {
  publication: PropTypes.shape({
    id_account_fk: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    date_publication: PropTypes.string.isRequired,
    comment_count: PropTypes.number.isRequired,
    like_count: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    id_publication: PropTypes.number.isRequired,
  }).isRequired,
};

export default PublicationCard;
