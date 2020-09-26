import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from "./pages/Login";
import socketio from "socket.io-client";

const socket = socketio("http://192.168.1.105:5000");

const routes: { [key: string]: Page } = {
  "/": Login,
};

const App: React.FC<{}> = () => {
  const [path, setpath] = useState("/");

  return routes[path]({ socket, setpath }) || <div>404</div>;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
