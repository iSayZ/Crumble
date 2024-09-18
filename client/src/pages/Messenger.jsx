import "./styles/Messenger.css";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import FriendCardMessenger from "../components/Index/Messenger/FriendCardMessenger";
import myAxios from "../services/myAxios";

function Messenger() {
  const { auth } = useAuth();
  const [friendList, setFriendList] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const friends = await myAxios.get(
          `/api/users/friends/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFriendList(friends.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_account) {
      getData();
    }
  }, [auth.account.id_account, auth.token]);

  const [searchResult, setSearchResult] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmitSearch = async () => {
    if (searchQuery === "") {
      setSearchResult();
    }
    try {
      const result = await myAxios.get(
        `/api/users/friends/search/${auth.account.id_account}/${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSearchResult(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmitSearch();
    }
  };

  return (
    <div className="messenger-page">
      {friendList && (
        <div className="messenger-container">
          <h3>Messagerie</h3>
          <hr />
          <div className="input-container search">
            <input
              type="text"
              className="input search"
              placeholder="Rechercher un ami..."
              value={searchQuery}
              onChange={handleChangeSearch}
              onKeyDown={handleKeyPress}
            />
            <SearchIcon
              className="input-icon-search pointer"
              onClick={handleSubmitSearch}
            />
          </div>
          <div className="friend-list">
            {searchResult ? (
              searchResult.length > 0 ? (
                searchResult.map((friend) => (
                  <FriendCardMessenger
                    key={friend.id_account}
                    friend={friend}
                  />
                ))
              ) : (
                <>
                  <div className="no-result">
                    <p>Aucun résultat pour cette recherche...</p>
                    <hr />
                  </div>
                  {friendList.map((friend) => (
                    <FriendCardMessenger
                      key={friend.id_account}
                      friend={friend}
                    />
                  ))}
                </>
              )
            ) : (
              friendList.map((friend) => (
                <FriendCardMessenger key={friend.id_account} friend={friend} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Messenger;
