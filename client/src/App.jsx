import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BurgerProvider } from "./contexts/BurgerContext";
import { PublicationProvider } from "./contexts/PublicationContext";
import { MainProvider } from "./contexts/MainContext";

function App() {
  return (
    <AuthProvider>
      <MainProvider>
        <PublicationProvider>
          <BurgerProvider>
            <Outlet />
          </BurgerProvider>
        </PublicationProvider>
      </MainProvider>
    </AuthProvider>
  );
}

export default App;
