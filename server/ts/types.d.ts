declare module "*.json" {
  const value: any;
  export default value;
}

type smap<T> = { [key: string]: T };

type Player = {
  name: string;
  socket: SocketIO.Socket;
  roomid: string;
};

type Players = smap<Player>;

type Room = {
  gamestate: GameState | undefined;
  playerids: string[];
  code: string;
};

type Rooms = smap<Room>;

type Data = {
  players: smap<Player>;
  rooms: smap<Room>;
};

type GameState =
  | {
      phase: "choosing";
      kingindex: number;
      kingcard: string;
    }
  | {
      phase: "matching";
      kingindex: number;
      kingcard: string;
      hands: smap<string[]>;
      choices: smap<string>;
    }
  | {
      phase: "rating";
      kingindex: number;
      kingcard: string;
      choices: smap<string>;
    };

type UserData = {
  gamestate: GameState | undefined;
  playernames: string[];
  roomcode: string;
};
