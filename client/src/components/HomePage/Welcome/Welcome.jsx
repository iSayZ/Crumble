import "./Welcome.css";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome">
        <div className="welcome-title">
          <h1>Bienvenue sur Crumble</h1>
          <p>
            Rejoignez nous et vivez une expérience sociale enrichissante où
            chaque connexion compte !
          </p>
        </div>
        <div className="welcome-btn">
          <Link className="btn" to="/connexion">
            Se connecter
          </Link>
          <Link className="btn-filled" to="/inscription">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
