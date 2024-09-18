// socketConnection.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3311");

export default socket;
