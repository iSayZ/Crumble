import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState, useMemo } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: Cookies.get("authToken"),
    account: Cookies.get("account"),
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");
    const account = Cookies.get("account")
      ? JSON.parse(Cookies.get("account"))
      : null;

    if (token && account) {
      setAuth({ token, account });
    }
  }, []);

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("account");
    setAuth({ token: null, account: null });
    navigate("/connexion");
  };

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      logout,
    }),
    [auth, setAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
