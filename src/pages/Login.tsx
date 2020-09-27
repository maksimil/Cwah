import React, { useState } from "react";

const Login: Page = ({ socket, setpath }) => {
  const [name, setname] = useState("");
  const [key, setkey] = useState("");

  return (
    <div>
      <div>
        <input
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          value={key}
          onChange={(e) => {
            setkey(e.target.value);
          }}
        />
      </div>
      <button
        onClick={() => {
          socket.emit("login", name, key);
        }}
      >
        Login
      </button>
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
