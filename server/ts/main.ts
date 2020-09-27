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
  rooms[code].playerids[socket.id] = {};
  players[socket.id] = { name, socket, roomid: code };
};

// creating the 4-digit room codes
const codebase = 10000;
const createcode = () =>
  (Math.floor(Math.random() * codebase) + codebase).toString().substring(1);

io.on("connect", (socket) => {
  const id = socket.id;

  // login with room code
  socket.on("login", (name: string, code: string) => {
    // room exist check
    if (!rooms[code]) return;

    // login
    login(socket, code, name);
  });

  // create new room
  socket.on("create", (name: string) => {
    // room creation
    let code = createcode();
    while (rooms[code]) code = createcode();
    rooms[code] = { playerids: {}, id: code };

    // login
    login(socket, code, name);
  });

  // disconnecting ws
  socket.on("disconnect", () => {
    // if not logged in
    if (!players[id]) return;

    // saving roomid for later use
    const roomid = players[id].roomid;

    // removing the player and its id from room
    delete players[id];
    delete rooms[roomid].playerids[id];

    // removing the room if its empty
    if (Object.keys(rooms[roomid].playerids).length === 0) delete rooms[roomid];
  });
});

// listening
// getting the ip and port from config file
const { port, lanip } = config;
// listen
server.listen(port, lanip, () => {
  console.log(`Listening on ${port} http://${lanip}:${port}`);
});
