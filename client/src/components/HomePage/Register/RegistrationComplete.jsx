import "./Register.css";
import { Link } from "react-router-dom";

function RegistrationComplete() {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="image-container">
          <div className="login-img">
            <img src="/assets/images/registration-complete.jpg" alt="" />
          </div>
        </div>
        <div className="register-form complete">
          <h2>Inscription</h2>
          <div className="register-top complete">
            <p>
              Votre inscription est terminée avec succès. Merci de vous être
              inscrit(e) !
            </p>
            <p>Connectez vous maintenant et commencez votre aventure !</p>
          </div>
          <div className="register-footer">
            <Link to="/fil-actualite" className="btn register" type="button">
              Suivant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationComplete;
