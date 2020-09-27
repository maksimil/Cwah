import React, { useState } from "react";

const Login: React.FC<{ socket: SocketIOClient.Socket }> = ({ socket }) => {
  // name and key hooks
  const [name, setname] = useState("");
  const [key, setkey] = useState("");

  return (
    <div>
      <div>
        {/* name input field */}
        <input
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
      </div>
      <div>
        {/* key input field */}
        <input
          value={key}
          onChange={(e) => {
            setkey(e.target.value);
          }}
        />
      </div>
      {/* login button */}
      <button
        onClick={() => {
          socket.emit("login", name, key);
        }}
      >
        Login
      </button>
      {/* create room button */}
      <button
        onClick={() => {
          socket.emit("create", name);
        }}
      >
        Create room
      </button>
    </div>
  );
};

export default Login;
