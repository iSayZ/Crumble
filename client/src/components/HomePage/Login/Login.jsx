import "./Login.css";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import myAxios from "../../../services/myAxios";

function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  // Show password
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // HandleChange input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Error state
  const [error, setError] = useState("");

  // Login function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await myAxios.post("/api/login", {
        formData,
      });

      if (response.status === 200) {
        const { token, account } = response.data;

        // Store the token and account information in cookies
        Cookies.set("authToken", token, { expires: 1 / 24 }); // Expires in 1 hour
        Cookies.set("account", JSON.stringify(account), { expires: 1 / 24 }); // Expires in 1 hour

        setAuth({ token, account });
        if (account.assignment === "user") {
          navigate("/fil-actualite");
        } else if (account.assignment === "admin") {
          navigate("/admin/");
        }
      }
    } catch (err) {
      setError("E-mail ou mot de passe incorrect.");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-container">
          <div className="login-img">
            <img src="/assets/images/login.jpg" alt="" />
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-top">
            <h2>Connexion</h2>
            <div className="input-container">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input icon"
                placeholder="E-mail"
                required
              />
              <AccountCircleIcon className="input-icon" />
            </div>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input icon"
                placeholder="Mot de passe"
                required
              />
              {showPassword ? (
                <VisibilityOff
                  className="input-icon"
                  onClick={handleClickShowPassword}
                />
              ) : (
                <Visibility
                  className="input-icon"
                  onClick={handleClickShowPassword}
                />
              )}
            </div>
            <div className="checkbox-container">
              <Checkbox
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 22,
                    color: "white",
                    padding: 0,
                  },
                }}
              />
              <label htmlFor="remember">Se souvenir de moi</label>
            </div>
            <p className="error">{error}</p>
            <button type="submit" className="btn">
              Se connecter
            </button>
          </div>
          <Link to="/connexion" className="underline">
            Mot de passe oublié ?
          </Link>
          <div className="login-footer">
            <Link to="/inscription">
              Pas encore inscrit ?{" "}
              <span className="underline">C'est par ici</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
