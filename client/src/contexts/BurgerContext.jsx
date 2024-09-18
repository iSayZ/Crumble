import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const BurgerContext = createContext();

export function BurgerProvider({ children }) {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  const handleShowBurgerMenu = () => {
    setShowBurgerMenu(!showBurgerMenu);
  };

  const [showBurgerMenuIndex, setShowBurgerMenuIndex] = useState(false);

  const handleShowBurgerMenuIndex = () => {
    setShowBurgerMenuIndex(!showBurgerMenuIndex);
  };

  const handleCloseBurgerMenuIndex = () => {
    setShowBurgerMenuIndex(false);
  };

  useEffect(() => {
    if (showBurgerMenuIndex) {
      // Block the scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore the scroll
      document.body.style.overflow = "";
    }

    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "";
    };
  }, [showBurgerMenuIndex]);

  const value = useMemo(
    () => ({
      showBurgerMenu,
      handleShowBurgerMenu,
      showBurgerMenuIndex,
      handleShowBurgerMenuIndex,
      handleCloseBurgerMenuIndex,
    }),
    [
      showBurgerMenu,
      showBurgerMenuIndex,
    ]
  );

  return (
    <BurgerContext.Provider value={value}>{children}</BurgerContext.Provider>
  );
}

BurgerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useBurger = () => useContext(BurgerContext);
