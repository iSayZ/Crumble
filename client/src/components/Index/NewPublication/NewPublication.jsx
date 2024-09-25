import "./NewPublication.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { usePublication } from "../../../contexts/PublicationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useBurger } from "../../../contexts/BurgerContext";
import { useMain } from "../../../contexts/MainContext";
import "react-quill/dist/quill.snow.css";
import myAxios from "../../../services/myAxios";
import Popup from "../Popup/Popup";

function NewPublication() {
  const { handleCloseNewPublication, setPublicationSent } = usePublication();
  const { handleCloseBurgerMenuIndex } = useBurger();
  const { handleRefresh } = useMain();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

  // For upload picture publication
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef();
  const [badExtension, setBadExtension] = useState(false);

  function getExtension(filename) {
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : "";
  }

  // Change picture displayed
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const extension = getExtension(file.name);
    const allowedExtensions = ["png", "jpg", "jpeg", "webp", "avif"];
    if (allowedExtensions.includes(extension) && file.size <= 7000000) {
      setSelectedFile(file);
    } else {
      setBadExtension(true);
    }
  };

  // Function for close popup extension image error
  const handleCloseError = () => {
    setBadExtension(false);
  };

  const handleUpload = async (image) => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    // Send formData to upload picture
    try {
      const response = await myAxios.post("/api/upload/publication", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { data: imageData } = response;
      const { filePath } = imageData;
      // eslint-disable-next-line consistent-return
      return `${filePath}`;
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  // For send publication
  const [publication, setPublication] = useState(``);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (publication === "") {
      return setError("Vous ne pouvez pas publier un post vide...");
    }

    const picturePublication = fileInput.current.files[0];

    const picture = await handleUpload(picturePublication);

    try {
      const response = await myAxios.post(
        "/api/publications",
        {
          id_account: auth.account.id_account,
          content: publication,
          picture,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.info(response);
      setPublicationSent(true);
      setTimeout(() => {
        handleRefresh();
      }, 1000);
      handleCloseNewPublication();
      handleCloseBurgerMenuIndex();
      return navigate("/fil-actualite");
    } catch (err) {
      setError(err.response.data.error);
      return console.error(err);
    }
  };

  return (
    <div className="new-publication-page">
      <form className="new-publication-container" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={handleCloseNewPublication}
          className="no-btn close pointer"
        >
          <img
            src="/assets/images/icons/close-b.svg"
            alt="Bouton de fermeture de la fênetre de création de publication."
          />
        </button>
        <div className="new-publication-header">
          <h3>Nouvelle publication</h3>
          <input
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            onChange={handleFileChange}
            id="fileInput"
          />
          <button
            type="button"
            className="no-btn add-picture pointer"
            onClick={() => fileInput.current.click()}
          >
            <AddCircleOutlineIcon />
            <p>
              {selectedFile
                ? selectedFile.name
                : "Ajouter une image (optionnel)"}
            </p>
          </button>
          <p className="error">{error}</p>
        </div>
        <ReactQuill
          placeholder="Bonjour à tous..."
          ref={quillRef}
          className="editor"
          value={publication}
          onChange={setPublication}
        />
        <div className="new-publication-footer">
          <button type="submit" className="btn">
            Créer la publication
          </button>
        </div>
      </form>
      {badExtension && (
        <Popup
          closePopup={handleCloseError}
          title="Erreur : Format d'image non valide"
          content="L'image que vous avez sélectionnée doit être au format PNG, JPEG/JPG, WEBP ou AVIF.<br><br>Veuillez vérifier l'extension de votre fichier et réessayer avec un format supporté."
          choiceTwo="D'accord"
          actionTwo={handleCloseError}
        />
      )}
    </div>
  );
}

export default NewPublication;
