import "./TopBarIndex.css"
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useBurger } from "../../../contexts/BurgerContext";
import { useAuth } from "../../../contexts/AuthContext";

function TopBarIndex() {
    const { logout } = useAuth();

    const { showBurgerMenuIndex, handleShowBurgerMenuIndex } = useBurger();

    const [openSearch, setOpenSearch] = useState(false);

    const handleOpenSearchBar = () => {
        setOpenSearch(!openSearch)
    }

    return (
        <div className="sticky-bar">
            <div className="top-bar-index">
                <Link to="/fil-actualite" className="logo">
                    <img src="/assets/images/logo.png" alt="Logo de Crumble" />
                    <h2>Crumble</h2>
                </Link>
                {/* FOR DESKTOP */}
                <div className="input-container search">
                    <input type="text" className="input search" placeholder="Rechercher..."/>
                    <SearchIcon className="input-icon-search pointer"/>
                </div>
                <div className="btn-container desktop">
                    <Link to="/fil-actualite" className="top-bar-btn"><HomeIcon /></Link>
                    <Link to="/amis" className="top-bar-btn"><PeopleIcon /></Link>
                    <Link to="/" className="top-bar-btn"><span className="bubble">2</span><ChatIcon /></Link>
                    <Link to="/" className="top-bar-btn"><NotificationsIcon /></Link>
                    <button type="button" aria-label="Se déconnecter" onClick={logout} className="no-btn top-bar-btn burger pointer"><LogoutIcon /></button>
                </div>
                {/* END DESKTOP */}
                {/* FOR MOBIL */}
                <div className="btn-container mobil">
                    <button type="button" onClick={handleOpenSearchBar} className="no-btn top-bar-btn search pointer"><img src="/assets/images/icons/search-w.svg" alt="Bouton du champ de recherche" /></button>
                </div>
            </div>
            <div className="top-bar-nav">                
                    <button type="button" onClick={handleShowBurgerMenuIndex} className="no-btn pointer">{showBurgerMenuIndex ? <CloseIcon /> : <MenuIcon />}</button>
                    <hr />
                    <Link to="/fil-actualite" className="btn-nav"><HomeIcon /></Link>
                    <hr />
                    <Link to="/amis" className="btn-nav"><PeopleIcon /></Link>
                    <hr />
                    <Link to="/" className="btn-nav"><span className="bubble">2</span><ChatIcon /></Link>
                    <hr />
                    <Link to="/" className="btn-nav"><NotificationsIcon /></Link>
            </div>
            <div className={openSearch ? "search-mobil open" : "search-mobil"}>
                <input type="text" placeholder="Rechercher..." className="input-search-mobil" />
                <SearchIcon className="input-icon-search pointer"/>
            </div>
            {/* END MOBIL */}
        </div>
    )
}

export default TopBarIndex;