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
import Error from "./components/HomePage/Error/Error";

// Index Pages
import News from "./pages/News";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Messenger from "./pages/Messenger";
import WindowMessenger from "./components/Index/Messenger/WindowMessenger";
import SearchResult from "./pages/SearchResult";
import PublicationPage from "./pages/PublicationPage";
import Notifications from "./pages/Notifications";

// Admin Pages
import AdminPanel from "./pages/Admin/AdminPanel";

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
          {
            path: "/*",
            element: <Error />,
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
            path: "/profil/:id",
            element: <Profile />,
          },
          {
            path: "/amis",
            element: <Friends />,
          },
          {
            path: "/messages",
            element: <Messenger />,
          },
          {
            path: "/conversation/:idUserConnected/:idUserSelected",
            element: <WindowMessenger />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/recherche/:query",
            element: <SearchResult />,
          },
          {
            path: "/parametres",
            element: <Settings />,
          },
          {
            path: "/publication/:id",
            element: <PublicationPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/*",
    element: <AdminPanel />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
