import PropTypes from 'prop-types';
import "./NewPublication.css";
import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import { useMain } from "../../../contexts/MainContext";
import { useAuth } from "../../../contexts/AuthContext";
import "react-quill/dist/quill.snow.css";
import myAxios from "../../../services/myAxios";

function PublicationEdit({ handleClosePublicationEdit, publication }) {
  const { auth } = useAuth();

  const [error, setError] = useState("");
  const { handleRefresh } = useMain();

  // Config for Quill editor
  const MAX_CHARACTERS = 3000;

  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Listen for text changes
      const handleTextChange = () => {
        const text = quill.getText();
        if (text.length > MAX_CHARACTERS) {
          quill.deleteText(MAX_CHARACTERS, text.length);
          setError(`Vous ne pouvez pas dépasser ${MAX_CHARACTERS} caractères.`);
        }
      };

      quill.on("text-change", handleTextChange);

      // Cleanup function to remove the event listener
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }

    // Explicitly return undefined if the condition is not met
    return undefined;
  }, []);

  // For update the publication
  const [modificationPublication, setModificationPublication] = useState("");

  // Get the publication content
  useEffect(() => {
    setModificationPublication(publication.content);
  }, [publication.content]);

  const handleEditPublication = async (e) => {
    e.preventDefault();

    if (modificationPublication === "") {
      setError("Vous ne pouvez pas publier un post vide...");
      return;
    }

    try {
      const response = await myAxios.put(
        "/api/publications",
        {
          content: modificationPublication,
          id_publication: publication.id_publication,
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
      handleClosePublicationEdit();
    } catch (err) {
      setError(err.response.data.error);
      console.error(err);
    }
  };

  return (
    <div className="new-publication-page">
      <form className="new-publication-container">
        <button
          type="button"
          onClick={handleClosePublicationEdit}
          className="no-btn close pointer"
        >
          <img
            src="/assets/images/icons/close-b.svg"
            alt="Bouton de fermeture de la fênetre de modification de la publication."
          />
        </button>
        <div className="new-publication-header">
          <h3>Modifier la publication</h3>
          <p className="error">{error}</p>
        </div>
        <ReactQuill
          placeholder="Bonjour à tous..."
          ref={quillRef}
          className="editor"
          value={modificationPublication}
          onChange={setModificationPublication}
        />
        <div className="new-publication-footer">
          <button type="button" onClick={handleEditPublication} className="btn">
            Modifier la publication
          </button>
        </div>
      </form>
    </div>
  );
}

PublicationEdit.propTypes = {
  handleClosePublicationEdit: PropTypes.func.isRequired,
  publication: PropTypes.shape({
    content: PropTypes.string.isRequired,
    id_publication: PropTypes.number.isRequired,
  }).isRequired,
};

export default PublicationEdit;
