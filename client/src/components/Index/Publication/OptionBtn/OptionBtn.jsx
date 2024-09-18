import PropTypes from 'prop-types';
import "./OptionBtn.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import { ClickAwayListener } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

function OptionBtn({ idAuthor, handleDelete, handleEdit }) {
  const { auth } = useAuth();

  // For open the option menu
  const [optionActive, setOptionActive] = useState(false);

  const handleShowOptions = () => {
    setOptionActive(!optionActive);
  };

  const handleCloseOptions = () => {
    setOptionActive(false);
  };

  return (
    <ClickAwayListener onClickAway={handleCloseOptions}>
      <div className="option-btn-group">
        <button
          type="button"
          aria-label="Ouvrir le menu d'options"
          className={
            optionActive
              ? "no-btn pointer btn-option active"
              : "no-btn pointer btn-option"
          }
          onClick={handleShowOptions}
        >
          <MoreVertIcon />
        </button>
        <div className={optionActive ? "option-menu active" : "option-menu"}>
          {auth.account.id_account === idAuthor && (
            <>
              <button
                type="button"
                className="no-btn option-choice pointer"
                aria-label="Editer"
                onClick={handleEdit}
              >
                <EditIcon sx={{ width: 15, height: 15 }} className="pen" />
                Modifier
              </button>
              <button
                type="button"
                aria-label="Supprimer"
                className="no-btn option-choice pointer bin"
                onClick={handleDelete}
              >
                <DeleteForeverIcon sx={{ width: 18, height: 18 }} />
                Supprimer
              </button>
            </>
          )}
          <button
            type="button"
            className="no-btn option-choice pointer"
            aria-label="Signaler"
          >
            <ReportIcon sx={{ width: 15, height: 15 }} />
            Signaler
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
}

OptionBtn.propTypes = {
  idAuthor: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default OptionBtn;
