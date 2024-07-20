import "./TopBar.css"
import { Link } from "react-router-dom";
import { useBurger } from "../../../contexts/BurgerContext";

function TopBar() {
    const { handleShowBurgerMenu } = useBurger();

    return (
        <div className="topbar">
            {/* FOR MOBIL */}
            <button type="button" onClick={handleShowBurgerMenu} className="no-btn burger-btn">
                <img src="/assets/images/icons/burger-btn-w.svg" alt="Bouton du menu de navigation" />
            </button>
            {/* END MOBIL */}
            <Link to="/" className="no-btn logo">
                <img src="/assets/images/logo.png" alt="Logo de Crumble" />
                <h2>Crumble</h2>
            </Link>
            <div className="nav">
                <Link to="/a-propos">A propos</Link>
                <Link to="/contact">Contact</Link>
            </div>
        </div>
    )
};

export default TopBar;