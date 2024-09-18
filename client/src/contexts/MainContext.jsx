import PropTypes from "prop-types";
import { createContext, useContext, useState, useMemo } from "react";

const MainContext = createContext();

export function MainProvider({ children }) {
  // For refresh a data of component
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev); // Change la clé pour forcer la mise à jour du fil
  };

  const value = useMemo(() => ({ handleRefresh, refresh }), [refresh]);

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}

MainProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMain = () => useContext(MainContext);
