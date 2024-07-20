import "./styles/Friends.css"
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { useMain } from "../contexts/MainContext";
import FriendRequest from "../components/Index/FriendRequest/FriendRequest";
import myAxios from "../services/myAxios"

function Friends() {
    const { auth } = useAuth();
    const { refresh } = useMain();
    const [friendsRequests, setFriendsRequests] = useState();

    useEffect(
        () => {
            const getData = async() => {
                    try {
                        const response = await myAxios(`/api/users/friends/requests/${auth.account.id_account}`);
                        setFriendsRequests(response.data);               
                    } catch (error) {
                        console.error(error);
                    }
            }

            if (auth.account.id_account) {
                getData();
            };
        }, [auth.account, refresh]
    )
    return (
        <div className="friends-page">
            {friendsRequests && friendsRequests.length > 0 ? <h3>Demandes d'amis</h3> : <h3>Aucune demande d'ami</h3> }
            <div className="friend-request-container">
                {friendsRequests && friendsRequests.map((request) =>
                    <FriendRequest key={request.id_friend_request} user={request} />
                )}
            </div>
        </div>
    )
}

export default Friends;