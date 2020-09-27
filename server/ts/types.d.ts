declare module "*.json" {
  const value: any;
  export default value;
}

type smap<T> = { [key: string]: T };
type ulist = { [key: string]: {} };

type Player = {
  name: string;
  socket: SocketIO.Socket;
  roomid: string;
};

type Players = smap<Player>;

type Room = {
  gamestate: GameState | undefined;
  playerids: ulist;
  code: string;
};

type Rooms = smap<Room>;

type Data = {
  players: smap<Player>;
  rooms: smap<Room>;
};

type GameState = {};

type UserData = {
  gamestate: GameState | undefined;
  playernames: string[];
  roomcode: string;
};
