import PropTypes from 'prop-types';
import "./Comment.css";
import { useState, useEffect } from "react";
import { useMain } from "../../../../contexts/MainContext";
import { useAuth } from "../../../../contexts/AuthContext";
import myAxios from "../../../../services/myAxios";

function CommentEdit({ handleCloseCommentEdit, comment }) {
  const { auth } = useAuth();
  const { handleRefresh } = useMain();

  const [error, setError] = useState();

  // For update the comment
  const [modificationComment, setModificationComment] = useState("");

  useEffect(() => {
    setModificationComment(comment.content);
  }, [comment.content]);

  const handleEdit = (e) => {
    setModificationComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modificationComment === "") {
      setError("Vous ne pouvez pas publier un commentaire vide...");
      return;
    }

    try {
      const response = await myAxios.put(
        "/api/comments",
        {
          content: modificationComment,
          id_comment: comment.id_comment,
          id_account: auth.account.id_account,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.info(response);
      handleRefresh();
      handleCloseCommentEdit();
    } catch (err) {
      setError(err.response.data.error);
      console.error(err);
    }
  };

  return (
    <div className="comment-edit">
      <div className="comment-edit-menu">
        <h3>Modifier le commentaire</h3>
        <button
          type="button"
          onClick={handleCloseCommentEdit}
          className="no-btn close pointer"
        >
          <img
            src="/assets/images/icons/close-b.svg"
            alt="Bouton de fermeture de la fênetre de modification du commentaire."
          />
        </button>
        <p className="error">{error}</p>
        <div className="comment-input-container">
          <textarea
            name=""
            id=""
            className="input-comment"
            rows="15"
            value={modificationComment}
            onChange={handleEdit}
          />
          <button
            type="button"
            className="btn btn-comment-submit"
            onClick={handleSubmit}
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

CommentEdit.propTypes = {
  handleCloseCommentEdit: PropTypes.func.isRequired,
  comment: PropTypes.shape({
    content: PropTypes.string.isRequired,
    id_comment: PropTypes.number.isRequired,
  }).isRequired,
};

export default CommentEdit;
