declare module "*.json" {
  const value: any;
  export default value;
}

type smap<T> = { [key: string]: T };
type ulist = { [key: string]: {} };

type Player = {
  name: string;
  socket: SocketIO.Socket;
  roomid: RoomId;
};

type Players = smap<Player>;

type Room = {
  playerids: ulist;
  id: RoomId;
};

type Rooms = smap<Room>;

type Data = {
  players: smap<Player>;
  rooms: smap<Room>;
};
