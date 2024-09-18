import "./Navigation.css";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../../contexts/AuthContext";

function Navigation() {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    <div className="navigation-container">
      <ul>
        <li
          className="navigation-link"
          id={location.pathname === "/fil-actualite" ? "active" : ""}
        >
          <HomeIcon />
          <Link to="/fil-actualite" id="home">
            Accueil
          </Link>
        </li>
        <li
          className="navigation-link"
          id={
            location.pathname.substring(0, 9) ===
            `/profil/${auth.account.id_account}`
              ? "active"
              : ""
          }
        >
          <AccountCircleIcon />
          <Link to={`/profil/${auth.account.id_account}`} id="profile">
            Mon profil
          </Link>
        </li>
        <li
          className="navigation-link"
          id={location.pathname === "/amis" ? "active" : ""}
        >
          <PeopleIcon />
          <Link to="/amis" id="friend">
            Amis
          </Link>
        </li>
        <li
          className="navigation-link"
          id={location.pathname === "/messages" ? "active" : ""}
        >
          <ChatIcon />
          <Link to="/messages">Messages</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
