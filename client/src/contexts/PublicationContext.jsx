import PropTypes from "prop-types";
import { createContext, useContext, useState, useMemo } from "react";

const PublicationContext = createContext();

export function PublicationProvider({ children }) {
  // For open the window to create a new publication
  const [showNewPublication, setShowNewPublication] = useState(false);

  const handleShowNewPublication = () => {
    setShowNewPublication(true);
  };

  const handleCloseNewPublication = () => {
    setShowNewPublication(false);
  };

  // Alert confirmation publication sent
  const [publicationSent, setPublicationSent] = useState(false);

  const handleCloseAlert = () => {
    setPublicationSent(false);
  };

  // For refresh News.jsx
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev); // Change la clé pour forcer la mise à jour du fil
  };

  const value = useMemo(
    () => ({
      showNewPublication,
      handleShowNewPublication,
      handleCloseNewPublication,
      publicationSent,
      handleCloseAlert,
      setPublicationSent,
      handleRefresh,
      refresh,
    }),
    [showNewPublication, publicationSent, refresh]
  );

  return (
    <PublicationContext.Provider value={value}>
      {children}
    </PublicationContext.Provider>
  );
}

PublicationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePublication = () => useContext(PublicationContext);
