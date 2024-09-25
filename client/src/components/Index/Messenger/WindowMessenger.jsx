import "./WindowMessenger.css";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import debounce from "lodash/debounce";
import { useAuth } from "../../../contexts/AuthContext";
import myAxios from "../../../services/myAxios";
import socket from "../../../services/socketConnection";

function WindowMessenger() {
  const { auth } = useAuth();
  const { idUserConnected, idUserSelected } = useParams();
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const socketRef = useRef(socket);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (auth.account.id_account) {
      socketRef.current.emit("userConnected", auth.account.id_account);
  
      const handleReceiveMessage = (msg) => {
        setConversation((prevConversation) => {
          if (
            prevConversation &&
            msg.id_conversation === prevConversation.conversationId
          ) {
            return {
              ...prevConversation,
              messages: [...prevConversation.messages, msg],
            };
          }
          return prevConversation;
        });
      };
  
      socketRef.current.on("receiveMessage", handleReceiveMessage);
  
      // Cleanup function
      return () => {
        socketRef.current.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [auth.account]);
  

  const getData = useCallback(
    debounce(async () => {
      try {
        const response = await myAxios.get(
          `/api/conversations/${idUserConnected}/${idUserSelected}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setConversation(response.data);
      } catch (error) {
        console.error("Error fetching conversation data:", error);
      }
    }, 500),
    [idUserConnected, idUserSelected]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (conversation && socketRef.current) {
      socketRef.current.emit("joinConversation", conversation.conversationId);
    }

    return () => {
      if (conversation && socketRef.current) {
        socketRef.current.emit(
          "leaveConversation",
          conversation.conversationId
        );
      }
    };
  }, [conversation]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        conversationId: conversation.conversationId,
        sender: idUserConnected,
        text: message,
        token: auth.token,
      });
      setMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="window-messenger">
      {conversation && (
        <>
          <div className="header-messenger">
            <Avatar
              alt={`${conversation.friend.firstname} ${conversation.friend.lastname}`}
              src={conversation.friend.avatar}
              sx={{ width: 55, height: 55 }}
              className="pointer"
            />
            <div className="messenger-info">
              <h3>
                {conversation.friend.firstname} {conversation.friend.lastname}
              </h3>
              <p>En ligne</p>
            </div>
            <button
              type="button"
              className="no-btn close-window"
              onClick={() => window.history.back()}
            >
              <CloseIcon sx={{ height: 30, width: 30 }} />
            </button>
          </div>
          <div className="conversation">
            {conversation.messages.length > 0 ? (
              conversation.messages.map((msg, index) => (
                <div
                  key={msg.id_message}
                  ref={
                    index === conversation.messages.length - 1
                      ? lastMessageRef
                      : null
                  }
                  className={
                    msg.id_sender === auth.account.id_account
                      ? "bubble-container recipient"
                      : "bubble-container sender"
                  }
                >
                  <div
                    className={
                      msg.id_sender === auth.account.id_account
                        ? "bubble-msg recipient"
                        : "bubble-msg sender"
                    }
                  >
                    <h4>
                      {msg.id_sender === auth.account.id_account
                        ? "Vous"
                        : `${conversation.friend.firstname} ${conversation.friend.lastname}`}
                    </h4>
                    <p>{msg.content}</p>
                    <div
                      className={
                        msg.id_sender === auth.account.id_account
                          ? "bubble-tail recipient"
                          : "bubble-tail sender"
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>
                Aucun message pour le moment, dites bonjour à{" "}
                {conversation.friend.firstname} {conversation.friend.lastname} !
              </p>
            )}
          </div>
          <div className="nav-bar-messenger">
            <div className="input-messenger">
              <textarea
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ecrivez ici votre message..."
                onKeyDown={handleKeyPress}
              />
              <button
                type="button"
                className="no-btn send-msg-btn"
                onClick={sendMessage}
              >
                <SendIcon
                  sx={{ width: 22, height: 22, color: "var(--white)" }}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WindowMessenger;
