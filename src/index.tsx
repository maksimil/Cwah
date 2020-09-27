import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import socketio from "socket.io-client";

const socket = socketio("http://192.168.1.105:5000");

const App: React.FC<{}> = () => {
  const [userdata, setuserdata] = useState<UserData | undefined>(undefined);

  socket.on("update", setuserdata);

  if (userdata) return <Main userdata={userdata} />;
  else return <Login socket={socket} />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
