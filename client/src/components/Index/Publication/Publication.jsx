import PropTypes from "prop-types";
import "./Publication.css";
import Avatar from "@mui/material/Avatar";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import MessageIcon from "@mui/icons-material/Message";
import DOMPurify from "dompurify";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useMain } from "../../../contexts/MainContext";
import { calculateElapsedTime } from "../../../services/calculTime";
import Comment from "./Comment/Comment";
import PublicationEdit from "../NewPublication/PublicationEdit";
import OptionBtn from "./OptionBtn/OptionBtn";
import myAxios from "../../../services/myAxios";

function Publication({ publication, connectedProfile }) {
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
        await myAxios.delete(
          `/api/likes/${publication.id_publication}/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setIsLiked(false);
        handleRefresh();
      } catch (err) {
        console.error(err);
      }
      // Add like
    } else {
      try {
        await myAxios.post(
          `/api/likes/`,
          {
            id_publication: publication.id_publication,
            id_account: auth.account.id_account,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setIsLiked(true);
        handleRefresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Show comments
  const [showComments, setShowComments] = useState(false);

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  // For text area comment
  const textareaRef = useRef(null);

  // Function for ajust the height of textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Ajusting the height on loading
  useEffect(() => {
    adjustHeight();
  }, []);

  // Ajust the height when the user writing
  const handleInput = () => {
    adjustHeight();
  };

  // For send a comment
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (comment !== "") {
      try {
        await myAxios.post(
          "/api/comments",
          {
            id_publication: publication.id_publication,
            id_account: auth.account.id_account,
            content: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setError("");
        setComment("");
        handleRefresh();
      } catch (err) {
        console.error(err);
      }
    } else {
      setError("Votre commentaire est vide...");
    }
  };

  // For delete the publication
  const handleDeletePublication = async () => {
    try {
      await myAxios.delete(
        `/api/publications/${auth.account.id_account}/${publication.id_publication}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      handleRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // For open/close the modification menu
  const [editPublication, setEditPublication] = useState(false);

  const handleOpenPublicationEdit = () => {
    setEditPublication(true);
  };

  const handleClosePublicationEdit = () => {
    setEditPublication(false);
  };

  return (
    <>
      {/* FOR UPDATE PUBLICATION */}
      {editPublication && (
        <PublicationEdit
          handleClosePublicationEdit={handleClosePublicationEdit}
          publication={publication}
        />
      )}
      {/* PUBLICATION CARD */}
      <div className="publi-container">
        <div className="card-header">
          <OptionBtn
            idAuthor={publication.id_account_fk}
            handleDelete={handleDeletePublication}
            handleEdit={handleOpenPublicationEdit}
          />
          <div className="profile-info">
            <Link to={`/profil/${publication.id_account_fk}`}>
              <Avatar
                alt={`${publication.firstname} ${publication.lastname}`}
                src={publication.avatar}
                sx={{ width: 50, height: 50 }}
                className="pointer"
              />
            </Link>
            <div className="publi-info">
              <Link to={`/profil/${publication.id_account_fk}`}>
                <h3 className="pointer">
                  {publication.firstname} {publication.lastname}
                </h3>
              </Link>
              <p>Publié {calculateElapsedTime(publication.date_publication)}</p>
            </div>
          </div>
        </div>
        {publication.picture && (
          <div className="card-picture pointer">
            <img
              src={publication.picture}
              alt={`Publication de ${publication.firstname} ${publication.lastname}`}
            />
          </div>
        )}
        <div className="card-content">
          <p
            className={`content-text ${isExpanded ? "expanded" : ""}`}
            ref={textRef}
            style={{ maxHeight: isExpanded ? "none" : "6rem" }}
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
          {isTruncated && (
            <button
              type="button"
              aria-label={isExpanded ? "Voir moins" : "Voir plus"}
              className="no-btn see-more-link underline pointer"
              onClick={handleToggleExpand}
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>
        <div className="card-footer">
          <button
            type="button"
            aria-label="Voir tous les commentaire"
            className="no-btn btn-publi pointer hoverunderline"
            onClick={handleShowComments}
          >
            <MessageIcon />
            <p>
              {publication.comment_count} commentaire
              {publication.comment_count > 1 ? "s" : ""}
            </p>
          </button>
          <button
            type="button"
            onClick={handleLike}
            className="no-btn btn-publi pointer"
          >
            {isLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
            <p>{publication.like_count}</p>
          </button>
        </div>
        <div
          className={
            showComments ? "publication-comments open" : "publication-comments"
          }
        >
          {publication.comments.length > 0 &&
            publication.comments.map((commentary) => (
              <Comment key={commentary.id_comment} comment={commentary} />
            ))}
          <div className="send-comment-container">
            <Avatar
              alt={`${connectedProfile.firstname} ${connectedProfile.lastname}`}
              src={connectedProfile.avatar}
              sx={{ width: 40, height: 40 }}
              className="pointer"
            />
            <div className="comment-input-container">
              <textarea
                type="text"
                name="comment"
                id=""
                className="input-comment"
                placeholder="Ajouter un commentaire..."
                ref={textareaRef}
                rows="2"
                onInput={handleInput}
                onChange={handleChangeComment}
                value={comment}
              />
              <p className="error center">{error}</p>
              <button
                type="button"
                aria-label="Envoyer le commentaire"
                className="btn btn-comment-submit"
                onClick={handleSubmitComment}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Publication.propTypes = {
  publication: PropTypes.shape({
    id_publication: PropTypes.number.isRequired,
    id_account_fk: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    date_publication: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    picture: PropTypes.string,
    is_liked: PropTypes.bool.isRequired,
    like_count: PropTypes.number.isRequired,
    comment_count: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id_comment: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  connectedProfile: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

export default Publication;
