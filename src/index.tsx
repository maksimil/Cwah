import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import socketio from "socket.io-client";

// ws connection
const socket = socketio("http://192.168.1.105:5000");

// App component
const App: React.FC<{}> = () => {
  // hook for user data
  const [userdata, setuserdata] = useState<UserData | undefined>(undefined);

  // updating userdata from socket events
  socket.on("update", setuserdata);

  // login if userdata is not defined
  if (userdata) return <Main userdata={userdata} socket={socket} />;
  else return <Login socket={socket} />;
};

// render to DOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
