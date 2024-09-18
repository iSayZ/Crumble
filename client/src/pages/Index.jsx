import "./styles/Index.css";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBurger } from "../contexts/BurgerContext";
import { usePublication } from "../contexts/PublicationContext";

import TopBarIndex from "../components/Template/TopBar/TopBarIndex";
import BurgerMenuIndex from "../components/Template/BurgerMenu/BurgerMenuIndex";
import Navigation from "../components/Index/Navigation/Navigation";
import Suggestions from "../components/Index/Suggestions/Suggestions";
import ProfilCard from "../components/Index/ProfileCard/ProfileCard";
import NewPublicationBtn from "../components/Index/NewPublication/NewPublicationBtn";
import NewPublication from "../components/Index/NewPublication/NewPublication";
import AlertPublication from "../components/Index/Alert/AlertPublication";

function Index() {
  const { auth } = useAuth();
  const { showBurgerMenuIndex } = useBurger();
  const { showNewPublication, publicationSent } = usePublication();

  const navigate = useNavigate();
  const location = useLocation();

  const [noPadding, setNoPadding] = useState(false);

  useEffect(() => {
    if (!auth.account) {
      navigate("/connexion");
    }

    if (
      location.pathname.substring(0, 7) === "/profil" ||
      location.pathname === "/amis" ||
      location.pathname.substring(0, 13) === "/conversation" ||
      location.pathname.substring(0, 10) === "/recherche"
    ) {
      setNoPadding(true);
    } else {
      setNoPadding(false);
    }
  }, [auth.account, navigate, location.pathname]);

  const tablet = useMediaQuery("(min-width:768px)");
  const desktop = useMediaQuery("(min-width:1024px)");

  return (
    <div>
      {auth.account && (
        <>
          <TopBarIndex />
          {showBurgerMenuIndex && <BurgerMenuIndex />}
          {showNewPublication && <NewPublication />}
          <div
            className={
              noPadding ? "main-container no-padding" : "main-container"
            }
          >
            {tablet && (
              <aside className="left-container">
                <ProfilCard />
                <Navigation />
                <NewPublicationBtn />
              </aside>
            )}
            <Outlet />
            {desktop && <Suggestions />}
            {publicationSent && <AlertPublication />}
          </div>
        </>
      )}
    </div>
  );
}

export default Index;
