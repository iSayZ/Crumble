import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";

// App Pages
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";

// Home Pages
import Welcome from "./components/HomePage/Welcome/Welcome";
import Login from "./components/HomePage/Login/Login";
import Register from "./components/HomePage/Register/Register";
import RegistrationComplete from "./components/HomePage/Register/RegistrationComplete";

// Index Pages
import News from "./pages/News";
import Friends from "./pages/Friends";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <HomePage />,
        children: [
          {
            path: "/",
            element: <Welcome />,
          },
          {
            path: "/connexion",
            element: <Login />,
          },
          {
            path: "/inscription",
            element: <Register />,
          },
          {
            path: "/inscription/complete",
            element: <RegistrationComplete />,
          },
        ],
      },
      {
        element: <Index />,
        children: [
          {
            path: "/fil-actualite",
            element: <News />,
          },
          {
            path: "/amis",
            element: <Friends />,
          }
        ],
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
