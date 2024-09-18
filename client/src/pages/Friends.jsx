import "./styles/Friends.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMain } from "../contexts/MainContext";
import FriendRequest from "../components/Index/FriendRequest/FriendRequest";
import FriendshipCard from "../components/Index/FriendshipCard/FriendshipCard";
import FriendCard from "../components/Index/FriendCard/FriendCard";
import myAxios from "../services/myAxios";

function Friends() {
  const { auth } = useAuth();
  const { refresh } = useMain();
  const [friendsRequests, setFriendsRequests] = useState();
  const [friendships, setFriendships] = useState();
  const [users, setUsers] = useState();

  // Mix the array
  function mixArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const requests = await myAxios(
          `/api/users/friends/requests/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFriendsRequests(requests.data);

        const friends = await myAxios(
          `/api/users/friends/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFriendships(friends.data);

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
  }, [auth.account, auth.token, refresh]);
  return (
    <div className="friends-page">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <h3>Demandes d'amis</h3>
          {friendsRequests && friendsRequests.length > 0 ? (
            <span className="bubble-count">{friendsRequests.length}</span>
          ) : (
            ""
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div className="friend-request-container">
            {friendsRequests && friendsRequests.length > 0 ? (
              friendsRequests.map((request) => (
                <FriendRequest key={request.id_friend_request} user={request} />
              ))
            ) : (
              <p>Aucune demande d'ami</p>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <h3>Mes amis</h3>
        </AccordionSummary>
        <AccordionDetails>
          <div className="friendships-container">
            {friendships && friendships.length > 0 ? (
              friendships.map((friend) => (
                <FriendshipCard key={friend.id_user} user={friend} />
              ))
            ) : (
              <p>Vous n'avez pas encore d'ami</p>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion className="mobile-friend-suggestion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <h3>Suggestion d'amis</h3>
        </AccordionSummary>
        <AccordionDetails>
          <div className="suggestion-friend-container">
            {users && users.length > 0 ? (
              mixArray(users)
                .slice(0, 5)
                .map((user) => <FriendCard key={user.id_user} user={user} />)
            ) : (
              <p>Vous n'avez pas de suggestion d'ami</p>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Friends;
