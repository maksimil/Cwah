import path from "path";
import express from "express";
import http from "http";
import config from "../config.json";
import socketio from "socket.io";
import { newblack, newhand } from "./cards";

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
    let gamedata: GameUserData | undefined = undefined;

    if (room.gamestate) {
      const gs = room.gamestate;
      const isking = room.playerids[gs.kingindex] === id;
      switch (gs.phase) {
        case "choosing":
          if (isking) {
            gamedata = {
              phase: "choosing",
              role: "king",
              card: gs.kingcard,
            };
          } else {
            gamedata = {
              phase: "choosing",
              role: "pawn",
            };
          }
          break;
        case "matching":
          if (isking) {
            gamedata = {
              phase: "matching",
              role: "king",
              card: gs.kingcard,
            };
          } else {
            gamedata = {
              phase: "matching",
              role: "pawn",
              card: gs.kingcard,
              hand: gs.hands[id],
              choice: gs.choices[id],
            };
          }
          break;
        case "rating":
          gamedata = {
            phase: "rating",
            role: isking ? "king" : "pawn",
            cards: gs.choices,
          };
          break;
      }
    }

    players[id].socket.emit("update", {
      roomcode,
      playernames,
      gamedata,
    } as UserData);
  });
};

// switch game to next phase
const nextphase = (gs: ref<GameState>, room: Room) => {
  switch (gs.v.phase) {
    case "choosing":
      {
        let phase: "matching" = "matching";
        let hands: smap<string[]> = {};
        let choices: smap<string | undefined> = {};
        room.playerids.forEach((id) => {
          hands[id] = newhand();
          choices[id] = undefined;
        });

        gs.v = { ...gs.v, phase, hands, choices };
      }
      break;
    case "matching":
      {
        let phase: "rating" = "rating";
        gs.v = { ...gs.v, phase };
        delete (gs.v as any).hands;
      }
      break;
    case "rating":
      {
        let phase: "choosing" = "choosing";
        gs.v = { ...gs.v, phase };
        delete (gs.v as any).choices;
      }
      break;
  }
};

// transitions to next phase if everyone chose their cards
const checknextphase = (
  gs: {
    phase: "matching";
    kingindex: number;
    kingcard: string;
    hands: smap<string[]>;
    choices: smap<string | undefined>;
  },
  room: Room
) => {
  if (Object.keys(gs.choices).length === room.playerids.length - 1) {
    nextphase({ v: gs }, room);
  }
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
    const room = rooms[roomcode];
    room.gamestate = {
      phase: "choosing",
      kingindex: 0,
      kingcard: newblack(),
    };

    console.log(`start in ${roomcode}`);

    // inform user
    update(roomcode);
  });

  // game events
  // custom card command
  socket.on("custom", (card: string) => {
    const roomcode = players[id].roomid;
    const room = rooms[roomcode];
    const gs = room.gamestate;
    switch (gs?.phase) {
      case "choosing":
        gs.kingcard = card;
        nextphase({ v: gs }, room);
        break;
      case "matching":
        gs.choices[id] = card;
        checknextphase(gs, room);
        break;
    }

    update(roomcode);
  });

  // skip choice command
  socket.on("skip", () => {
    const roomcode = players[id].roomid;
    const room = rooms[roomcode];
    const gs = room.gamestate;
    switch (gs?.phase) {
      case "choosing":
        gs.kingcard = newblack();
        break;
      case "matching":
        gs.choices[id] = undefined;
        checknextphase(gs, room);
        break;
    }

    update(roomcode);
  });

  // choose card command
  socket.on("choose", (...args: any[]) => {
    const roomcode = players[id].roomid;
    const room = rooms[roomcode];
    const gs = room.gamestate;
    switch (gs?.phase) {
      case "choosing":
        nextphase({ v: gs }, room);
        break;
      case "matching":
        const index = args[0] as number;
        gs.choices[id] = gs.hands[id][index];
        checknextphase(gs, room);
        break;
      case "rating":
        const pid = args[0] as string;
        // send smth to inform that pid won
        console.log(`${players[pid]} won in ${roomcode}`);
        nextphase({ v: gs }, room);
        break;
    }

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
