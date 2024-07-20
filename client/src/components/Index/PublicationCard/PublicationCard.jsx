import PropTypes from 'prop-types';
import "./PublicationCard.css"
import Avatar from '@mui/material/Avatar';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import MessageIcon from '@mui/icons-material/Message';
import DOMPurify from 'dompurify';
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useMain } from "../../../contexts/MainContext";
import calculateElapsedTime from "../../../services/calculTime";
import myAxios from "../../../services/myAxios";

function PublicationCard({ publication }) {
    const { auth } = useAuth();
    const { handleRefresh } = useMain();

    // Clean the html code for securize
    const cleanContent = DOMPurify.sanitize(publication.content);

    // Verify if the text is truncate or no
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef(null);
  
    useEffect(() => {
      const textElement = textRef.current;
      if (textElement.scrollHeight > textElement.clientHeight) {
        setIsTruncated(true);
      }
    }, [publication.content]);
  
    const handleToggleExpand = () => {
      setIsExpanded(!isExpanded);
    };

    // Like function
    const [isLiked, setIsLiked] = useState(publication.is_liked);

    const handleLike = async () => {
        // Delete like
        if (isLiked) {
            try {
                await myAxios.delete(`/api/likes/${publication.id_publication}/${auth.account.id_account}`)
                setIsLiked(false);
                handleRefresh();
            } catch (error) {
                console.error(error);
            }
        // Add like
        } else {
            try {
                await myAxios.post(`/api/likes/`, {
                    id_publication: publication.id_publication,
                    id_account: auth.account.id_account
                })
                setIsLiked(true);
                handleRefresh();
            } catch (error) {
                console.error(error);

            }
        }
    }

    return (
        <div className="publi-card-container">
            <div className="card-header">
                <div className="profile-info">
                    <Avatar alt={`${publication.firstname} ${publication.lastname}`} 
                        src={publication.avatar}
                        sx={{ width: 50, height: 50 }}
                        className="pointer"
                    />
                    <div className="publi-info">                        
                        <h3 className="pointer">{publication.firstname} {publication.lastname}</h3>
                        <p>Publié {calculateElapsedTime(publication.date_publication)}</p>
                    </div>
                </div>
            </div>
            {publication.picture &&
            <div className="card-picture pointer">
                <img src={publication.picture} alt={`Publication de ${publication.firstname} ${publication.lastname}`} />
            </div>}
            <div className="card-content">
                <p
                  className={`content-text ${isExpanded ? 'expanded' : ''}`}
                  ref={textRef}
                  style={{ maxHeight: isExpanded ? 'none' : '6rem' }}
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />                    
                {isTruncated && (
          <button type='button' aria-label={isExpanded ? "Voir moins" : "Voir plus"} className="no-btn see-more-link underline pointer" onClick={handleToggleExpand}>
            {isExpanded ? 'Voir moins' : 'Voir plus'}
          </button>
        )}
            </div>
            <div className="card-footer">
                <div className="btn-publi pointer hoverunderline">
                    <MessageIcon />
                    <p>{publication.comment_count} commentaire{publication.comment_count > 1 ? "s" : ""}</p>
                </div>
                <button type="button" onClick={handleLike} className="no-btn btn-publi pointer">
                    {isLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                    <p>{publication.like_count}</p>
                </button>
            </div>
        </div>
    )
}

PublicationCard.propTypes = {
    publication: PropTypes.shape({
      id_publication: PropTypes.number.isRequired,
      id_account: PropTypes.number.isRequired,
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      date_publication: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      picture: PropTypes.string,
      is_liked: PropTypes.number.isRequired,
      like_count: PropTypes.number.isRequired,
      comment_count: PropTypes.number.isRequired
    }).isRequired
  };

export default PublicationCard;