import "./BurgerMenuIndex.css";
import { ClickAwayListener } from "@mui/material";
import { Link } from "react-router-dom";
import { useBurger } from "../../../contexts/BurgerContext";
import ProfilCard from "../../Index/ProfileCard/ProfileCard";
import NewPublicationBtn from "../../Index/NewPublication/NewPublicationBtn";

function BurgerMenuIndex() {
  const { handleCloseBurgerMenuIndex } = useBurger();

  return (
    <ClickAwayListener onClickAway={handleCloseBurgerMenuIndex}>
      <div className="burger-menu-index">
        <div className="profile-container">
          <ProfilCard />
        </div>
        <hr />
        <NewPublicationBtn />
        <hr />
        <nav>
          <Link to="/">A propos</Link>
          <a target="_blank" rel="noreferrer noopener" href="https://www.linkedin.com/in/alexis-estrine/">
            Contact
          </a>
        </nav>
      </div>
    </ClickAwayListener>
  );
}

export default BurgerMenuIndex;
