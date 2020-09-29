import path from "path";
import express from "express";
import http from "http";
import config from "../config.json";
import socketio from "socket.io";

// create app
const app = express();

// create server
const server = http.createServer(app);

// serve public folder
app.use(express.static(path.join("build")));

// ws
const io = socketio(server);

// db
let rooms: smap<Room> = {};
let players: smap<Player> = {};

// login the player to server
const login = (socket: socketio.Socket, code: string, name: string) => {
  if (!rooms[code]) return false;
  rooms[code].playerids.push(socket.id);
  players[socket.id] = { name, socket, roomid: code };
  return true;
};

// creating the 4-digit room codes
const codebase = 10000;
const createcode = () =>
  (Math.floor(Math.random() * codebase) + codebase).toString().substring(1);

// undate function
const update = (roomcode: string) => {
  // get room
  const room = rooms[roomcode];

  // getting their names by ids
  const playernames = room.playerids.map((id) => players[id].name);

  // sending update info to everyone in the room
  room.playerids.forEach((id) => {
    players[id].socket.emit("update", {
      roomcode,
      playernames,
      gamedata: undefined,
    } as UserData);
  });
};

io.on("connect", (socket) => {
  const id = socket.id;

  // login with room code
  socket.on("login", (name: string, code: string) => {
    // room exist check
    if (!rooms[code]) return;

    // login
    if (login(socket, code, name))
      // send data
      update(code);
  });

  // create new room
  socket.on("create", (name: string) => {
    // room creation
    let code = createcode();
    while (rooms[code]) code = createcode();
    rooms[code] = { playerids: [], code, gamestate: undefined };

    // login
    login(socket, code, name);

    // send data to user
    update(code);
  });

  // starting the game
  socket.on("start", () => {
    // get room code
    const roomcode = players[id].roomid;

    // start the game in room
    console.log(`start in ${roomcode}`);

    // inform user
    update(roomcode);
  });

  // disconnecting ws
  socket.on("disconnect", () => {
    // if not logged in
    if (!players[id]) return;

    // saving roomid for later use
    const roomid = players[id].roomid;

    // removing the player and its id from room
    delete players[id];
    rooms[roomid].playerids = rooms[roomid].playerids.filter(
      (pid) => pid !== id
    );

    // removing the room if its empty
    if (Object.keys(rooms[roomid].playerids).length === 0) delete rooms[roomid];
    // updating the room otherwise
    else update(roomid);
  });
});

// listening
// getting the ip and port from config file
const { port, lanip } = config;
// listen
server.listen(port, lanip, () => {
  console.log(`Listening on ${port} http://${lanip}:${port}`);
});
