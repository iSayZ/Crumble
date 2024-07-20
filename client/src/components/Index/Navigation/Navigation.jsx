import "./Navigation.css"
import { Link, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navigation() {
    const location = useLocation();

    return (
        <div className="navigation-container">
            <ul>
                <li className="navigation-link" id={location.pathname === "/fil-actualite" ? "active" : ""}>
                    <HomeIcon />
                    <Link to="/fil-actualite" id="home">Accueil</Link>
                </li>
                <li className="navigation-link">
                    <AccountCircleIcon />
                    <Link to="/fil-actualite" id="profile">Profil</Link>
                </li>
                <li className="navigation-link" id={location.pathname === "/amis" ? "active" : ""}>
                    <PeopleIcon />
                    <Link to="/amis" id="friend">Amis</Link>
                </li>
                <li className="navigation-link">
                    <ChatIcon />
                    <Link to="/fil-actualite">Messages</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navigation;