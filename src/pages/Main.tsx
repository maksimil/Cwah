import React from "react";
import Lobby from "./Lobby";
import Game from "./Game";

const Main: React.FC<{ userdata: UserData; socket: SocketIOClient.Socket }> = ({
  userdata,
  socket,
}) => {
  return userdata.gamestate ? (
    <Game socket={socket} userdata={userdata} />
  ) : (
    <Lobby socket={socket} userdata={userdata} />
  );
};

export default Main;
