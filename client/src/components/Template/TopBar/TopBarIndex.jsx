import "./TopBarIndex.css";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBurger } from "../../../contexts/BurgerContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useMain } from "../../../contexts/MainContext";
import myAxios from "../../../services/myAxios";
import socket from "../../../services/socketConnection";

function TopBarIndex() {
  const { logout, auth } = useAuth();
  const { refresh } = useMain();

  const { showBurgerMenuIndex, handleShowBurgerMenuIndex } = useBurger();

  const [openSearch, setOpenSearch] = useState(false);

  const handleOpenSearchBar = () => {
    setOpenSearch(!openSearch);
  };

  // For search
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmitSearch = () => {
    navigate(`/recherche/${searchQuery}`);
    setOpenSearch(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmitSearch();
    }
  };

  // For the count of friend requests, messages, and notifications
  const [count, setCount] = useState(false);
  const [friendCount, setFriendCount] = useState();
  const [messageCount, setMessageCount] = useState();
  const [notificationCount, setNotificationCount] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const countResult = await myAxios.get(
          `/api/count/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFriendCount(countResult.data.friend_requests_count);
        setMessageCount(countResult.data.messages_count);
        setNotificationCount(countResult.data.notifications_count);
        setCount(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_account) {
      getData();
    }
  }, [auth.account, auth.token, refresh]);

  useEffect(() => {
    if (auth.account.id_account) {
      // Notify the server that the user is connected
      socket.emit("userConnected", auth.account.id_account);
  
      // Listen for friend request events
      socket.on("friend_request_notification", () => {
        setFriendCount((prev) => prev + 1);
      });
  
      // Listen for new message events
      socket.on("new_message_notification", () => {
        setMessageCount((prev) => prev + 1);
      });
  
      // Listen for message read events
      socket.on("reset_message_read", ({ countMessageRead }) => {
        setMessageCount((prev) => prev - countMessageRead);
      });
  
      // Listen for other types of notifications (e.g., general notifications)
      socket.on("general_notification", () => {
        setNotificationCount((prev) => prev + 1);
      });
  
      // Listen for notification read events
      socket.on("reset_notifications", () => {
        setNotificationCount(0); // Make sure to set to a default value, e.g., 0
      });
  
      // Clean up on unmount
      return () => {
        socket.emit("userDisconnected", auth.account.id_account);
        socket.disconnect();
      };
    }
    // Return an empty function if the condition is not met
    return () => {};
  }, [auth.account]);
  

  return (
    <div className="sticky-bar">
      {count && auth.account && (
        <>
          <div className="top-bar-index">
            <Link to="/fil-actualite" className="logo">
              <img src="/assets/images/logo.png" alt="Logo de Crumble" />
              <h2>Crumble</h2>
            </Link>
            {/* FOR DESKTOP */}
            <div className="input-container search">
              <input
                type="text"
                className="input search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleChangeQuery}
                onKeyDown={handleKeyPress}
              />
              <SearchIcon
                className="input-icon-search pointer"
                onClick={handleSubmitSearch}
              />
            </div>
            <div className="btn-container desktop">
              <Link to="/fil-actualite" className="top-bar-btn">
                <HomeIcon />
              </Link>
              <Link to="/amis" className="top-bar-btn">
                {friendCount ? (
                  <span className="bubble">{friendCount}</span>
                ) : (
                  ""
                )}
                <PeopleIcon />
              </Link>
              <Link to="/messages" className="top-bar-btn">
                {messageCount ? (
                  <span className="bubble">{messageCount}</span>
                ) : (
                  ""
                )}
                <ChatIcon />
              </Link>
              <Link to="/notifications" className="top-bar-btn">
                {notificationCount ? (
                  <span className="bubble">{notificationCount}</span>
                ) : (
                  ""
                )}
                <NotificationsIcon />
              </Link>
              <button
                type="button"
                aria-label="Se déconnecter"
                onClick={logout}
                className="no-btn top-bar-btn burger pointer"
              >
                <LogoutIcon />
              </button>
            </div>
            {/* END DESKTOP */}
            {/* FOR MOBILE */}
            <div className="btn-container mobil">
              <button
                type="button"
                onClick={handleOpenSearchBar}
                className="no-btn top-bar-btn search pointer"
              >
                <img
                  src="/assets/images/icons/search-w.svg"
                  alt="Search bar button"
                />
              </button>
              <button
                type="button"
                aria-label="Se déconnecter"
                onClick={logout}
                className="no-btn top-bar-btn burger pointer"
              >
                <LogoutIcon sx={{ height: 22, width: 22 }} />
              </button>
            </div>
          </div>
          <div className="top-bar-nav">
            <button
              type="button"
              onClick={handleShowBurgerMenuIndex}
              className="no-btn pointer"
            >
              {showBurgerMenuIndex ? <CloseIcon /> : <MenuIcon />}
            </button>
            <hr />
            <Link to="/fil-actualite" className="btn-nav">
              <HomeIcon />
            </Link>
            <hr />
            <Link to="/amis" className="btn-nav">
              {friendCount ? <span className="bubble">{friendCount}</span> : ""}
              <PeopleIcon />
            </Link>
            <hr />
            <Link to="/messages" className="btn-nav">
              {messageCount ? (
                <span className="bubble">{messageCount}</span>
              ) : (
                ""
              )}
              <ChatIcon />
            </Link>
            <hr />
            <Link to="/notifications" className="btn-nav">
              {notificationCount ? (
                <span className="bubble">{notificationCount}</span>
              ) : (
                ""
              )}
              <NotificationsIcon />
            </Link>
          </div>
          <div className={openSearch ? "search-mobil open" : "search-mobil"}>
            <input
              type="text"
              placeholder="Rechercher..."
              className="input-search-mobil"
              value={searchQuery}
              onChange={handleChangeQuery}
              onKeyDown={handleKeyPress}
            />
            <SearchIcon
              className="input-icon-search pointer"
              onClick={handleSubmitSearch}
            />
          </div>
          {/* END MOBILE */}
        </>
      )}
    </div>
  );
}

export default TopBarIndex;
