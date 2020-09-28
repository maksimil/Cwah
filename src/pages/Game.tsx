import React from "react";

const Game: React.FC<{
  socket: SocketIOClient.Socket;
  userdata: UserData;
}> = ({ socket, userdata }) => {
  const { roomcode, playernames } = userdata;
  return (
    <table>
      <tbody>
        <tr>
          <td>{roomcode}</td>
        </tr>
        <tr>
          {playernames.map((name) => (
            <td>{name}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default Game;
