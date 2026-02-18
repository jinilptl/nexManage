import { io } from "socket.io-client";

const VITE_SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;
export function connectWs(token) {
  const authToken = token || localStorage.getItem("token");
  return io(VITE_SOCKET_BASE_URL, {
    auth: {
      token: `${authToken}`,
    },
    autoConnect: false,
    transports: ["websocket"],
  });
}
