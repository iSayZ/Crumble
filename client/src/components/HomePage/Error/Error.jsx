import "./Error.css";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  // Function to go at previous page
  const handleGoBack = () => {
    navigate(-2); // -1 pour revenir en arrière
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="image-container">
          <div className="error-img">
            <img src="/assets/images/login.jpg" alt="" />
          </div>
        </div>
        <div className="error-content">
          <div className="error-top">
            <h2>Oops ! Une erreur est survenue...</h2>
          </div>
          <p>
            Il semble que la page que vous recherchez n'est pas accessible. Cela
            peut être dû à une URL incorrecte, des permissions insuffisantes, ou
            une erreur inattendue. Veuillez vérifier l'URL, retourner à la page
            d'accueil, ou contacter l'administrateur du site si le problème
            persiste.
          </p>
          <div className="error-footer">
            <button type="button" className="btn" onClick={handleGoBack}>
              Revenir sur le site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
