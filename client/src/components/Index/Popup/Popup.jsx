import PropTypes from 'prop-types';
import "./Popup.css";
import CloseIcon from "@mui/icons-material/Close";
import DOMPurify from "dompurify";

function Popup({
  closePopup,
  title,
  content,
  choiceOne,
  actionOne,
  choiceTwo,
  actionTwo,
}) {
  return (
    <div className="popup-container">
      <div className="popup">
        <button
          type="button"
          className="close-popup-btn no-btn pointer"
          onClick={closePopup}
        >
          <CloseIcon />
        </button>
        <h3>{title}</h3>
        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
        {choiceOne || choiceTwo ? (
          <div className="popup-choice">
            {choiceOne ? (
              <button type="button" className="btn red" onClick={actionOne}>
                {choiceOne}
              </button>
            ) : (
              ""
            )}
            {choiceTwo ? (
              <button type="button" className="btn" onClick={actionTwo}>
                {choiceTwo}
              </button>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

Popup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  choiceOne: PropTypes.string,
  actionOne: PropTypes.func,
  choiceTwo: PropTypes.string,
  actionTwo: PropTypes.func,
};

Popup.defaultProps = {
  title: "",
  content: "",
  choiceOne: null,
  actionOne: () => {},
  choiceTwo: null,
  actionTwo: () => {},
};

export default Popup;
