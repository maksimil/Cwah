import React from "react";

const Main: React.FC<{ userdata: UserData; socket: SocketIOClient.Socket }> = ({
  userdata,
  socket,
}) => {
  const { playernames, roomcode, gamestate } = userdata;

  return (
    <table>
      <tbody>
        <tr>
          <td>{roomcode}</td>
        </tr>
        {playernames.map((name) => (
          <tr>
            <td>{name}</td>
          </tr>
        ))}
        <tr>
          <td>
            <button
              onClick={() => {
                // start gaem
                socket.emit("start");
              }}
            >
              Start
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Main;
