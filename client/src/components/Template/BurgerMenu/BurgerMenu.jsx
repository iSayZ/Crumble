import "./BurgerMenu.css";
import { ClickAwayListener } from "@mui/material";
import { Link } from "react-router-dom";
import { useBurger } from "../../../contexts/BurgerContext";

function BurgerMenu() {
  const { handleShowBurgerMenu, handleCloseBurgerMenu } = useBurger();

  return (
    <ClickAwayListener onClickAway={handleCloseBurgerMenu}>
      <div className="burger-menu">
        <button
          type="button"
          onClick={handleShowBurgerMenu}
          className="no-btn close-burger pointer"
        >
          <img
            src="/assets/images/icons/close-w.svg"
            alt="Croix de fermeture du menu de navigation"
          />
        </button>
        <nav className="burger-nav">
          <div className="top-link">
            <Link onClick={handleShowBurgerMenu} to="/">
              Accueil
            </Link>
            <Link onClick={handleShowBurgerMenu} to="/">
              A propos
            </Link>
            <Link onClick={handleShowBurgerMenu} to="/">
              Contact
            </Link>
          </div>
          <div className="bottom-link">
            <Link onClick={handleShowBurgerMenu} to="/connexion">
              Connexion
            </Link>
            <Link onClick={handleShowBurgerMenu} to="/inscription">
              Inscription
            </Link>
          </div>
        </nav>
      </div>
    </ClickAwayListener>
  );
}

export default BurgerMenu;
