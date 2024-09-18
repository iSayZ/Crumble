import PropTypes from 'prop-types';
import "./Comment.css";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMain } from "../../../../contexts/MainContext";
import { useAuth } from "../../../../contexts/AuthContext";
import OptionBtn from "../OptionBtn/OptionBtn";
import CommentEdit from "./CommentEdit";
import myAxios from "../../../../services/myAxios";
import { calculateElapsedTime } from "../../../../services/calculTime";

function Comment({ comment }) {
  const { auth } = useAuth();
  const { handleRefresh } = useMain();

  // For delete comment
  const handleDeleteComment = async () => {
    try {
      await myAxios.delete(
        `/api/comments/${auth.account.id_account}/${comment.id_comment}`,
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

  // For open modification menu
  const [showCommentEdit, setShowCommentEdit] = useState(false);

  const handleOpenCommentEdit = () => {
    setShowCommentEdit(true);
  };

  const handleCloseCommentEdit = () => {
    setShowCommentEdit(false);
  };

  return (
    <>
      {showCommentEdit && (
        <CommentEdit
          handleCloseCommentEdit={handleCloseCommentEdit}
          comment={comment}
        />
      )}
      <div className="comment">
        <Link to={`/profil/${comment.id_account_fk}`}>
          <Avatar
            alt={`${comment.user.firstname} ${comment.user.lastname}`}
            src={comment.user.avatar}
            sx={{ width: 40, height: 40 }}
            className="pointer"
          />
        </Link>
        <div className="comment-container">
          <OptionBtn
            idAuthor={comment.id_account_fk}
            handleDelete={handleDeleteComment}
            handleEdit={handleOpenCommentEdit}
          />
          <div className="comment-info">
            <div className="comment-user">
              <Link to={`/profil/${comment.id_account_fk}`}>
                <h4>
                  {comment.user.firstname} {comment.user.lastname}
                </h4>
              </Link>
              <p className="date-publication">
                {calculateElapsedTime(comment.date_comment)}
              </p>
            </div>
          </div>
          <div className="comment-content">
            <p>{comment.content}</p>
          </div>
        </div>
      </div>
    </>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id_comment: PropTypes.number.isRequired,
    id_account_fk: PropTypes.number.isRequired,
    user: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    date_comment: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
