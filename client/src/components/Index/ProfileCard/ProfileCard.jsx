import "./ProfileCard.css";
import { Avatar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useBurger } from "../../../contexts/BurgerContext";
import myAxios from "../../../services/myAxios";

function ProfilCard() {
  const { auth, logout } = useAuth();
  const { handleCloseBurgerMenuIndex } = useBurger();

  const [profile, setProfile] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await myAxios.get(
          `/api/users/${auth.account.id_user_fk}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_user_fk) {
      getData();
    }
  }, [auth.account]);

  return (
    <div className="profile-card-container">
      {profile && (
        <div className="profile-card">
          <Link
            to={`/profil/${auth.account.id_account}`}
            onClick={handleCloseBurgerMenuIndex}
          >
            <Avatar
              alt={`${profile.firstname} ${profile.lastname}`}
              src={profile.avatar}
              sx={{ width: 70, height: 70 }}
              className="pointer"
            />
          </Link>
          <div className="profile-card-info pointer">
            <ul>
              <li className="nav-with-icon">
                <SettingsIcon sx={{ width: 15, height: 15 }} />
                <Link
                  to="/parametres"
                  onClick={handleCloseBurgerMenuIndex}
                  className="profile-link"
                >
                  Paramètres
                </Link>
              </li>
              <li className="nav-with-icon pointer">
                <LogoutIcon sx={{ width: 15, height: 15 }} />
                <button
                  type="button"
                  onClick={logout}
                  className="no-btn bold pointer profile-link"
                >
                  Se déconnecter
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilCard;
