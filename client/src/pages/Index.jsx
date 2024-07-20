import "./styles/Index.css";
import { useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBurger } from "../contexts/BurgerContext";
import { usePublication } from "../contexts/PublicationContext";

import TopBarIndex from "../components/Template/TopBar/TopBarIndex";
import BurgerMenuIndex from "../components/Template/BurgerMenu/BurgerMenuIndex";
import Navigation from "../components/Index/Navigation/Navigation";
import Suggestions from "../components/Index/Suggestions/Suggestions";
import ProfilCard from "../components/Index/ProfileCard/ProfileCard";
import NewPublicationBtn from "../components/Index/NewPublication/NewPublicationBtn";
import NewPublication from "../components/Index/NewPublication/NewPublication"
import AlertPublication from "../components/Index/Alert/AlertPublication";

function Index() {
  const { auth } = useAuth();
  const { showBurgerMenuIndex } = useBurger();
  const { showNewPublication, publicationSent } = usePublication();

  const navigate = useNavigate();

  useEffect(
    () => {
      if (!auth.account) {
        navigate("/connexion")
      }
    }, [auth.account, navigate]
  )

  const tablet = useMediaQuery('(min-width:768px)');
  const desktop = useMediaQuery('(min-width:1024px)');

  return (
    <>
      <TopBarIndex />
      {showBurgerMenuIndex && <BurgerMenuIndex />}
      {showNewPublication && <NewPublication />}
      <div className="main-container">
        {tablet && 
        <aside className="left-container">
          <ProfilCard />
          <Navigation />
          <NewPublicationBtn />
        </aside>}
        <Outlet />
        {desktop && <Suggestions />}
        {publicationSent && <AlertPublication />}
      </div>
    </>
  );
}

export default Index;
