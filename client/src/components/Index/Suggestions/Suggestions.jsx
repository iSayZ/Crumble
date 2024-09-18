import "./Suggestions.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import FriendCard from "../FriendCard/FriendCard";
import myAxios from "../../../services/myAxios";

function Suggestions() {
  const { auth } = useAuth();

  const [users, setUsers] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await myAxios(
          `/api/users/friends/suggestions/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_account) {
      getData();
    }
  }, [auth.account, auth.token]);

  // Mix the array
  function mixArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  return (
    <div className="suggestions-container">
      <div className="suggestion-friend">
        <div className="title bold">Suggestion d'amis</div>
        <hr />
        <div className="suggestion-friend-container">
          {users &&
            mixArray(users)
              .slice(0, 5)
              .map((user) => <FriendCard key={user.id_user} user={user} />)}
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
