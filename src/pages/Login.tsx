import React, { useState } from "react";

const Login: React.FC<{}> = () => {
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
          // login
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          // create room
        }}
      >
        Create room
      </button>
    </div>
  );
};

export default Login;
