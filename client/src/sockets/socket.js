
import { io } from "socket.io-client";

const VITE_SOCKET_BASE_URL=import.meta.env.VITE_SOCKET_BASE_URL
const token=localStorage.getItem("token")

console.log("base url --> ",VITE_SOCKET_BASE_URL);


export function connectWs(){
return io(VITE_SOCKET_BASE_URL,{
    auth:{
        token:`${token}`
    },
    autoConnect:false,
    transports: ["websocket"]
})
}