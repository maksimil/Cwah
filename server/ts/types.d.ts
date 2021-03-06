declare module "*.json" {
  const value: any;
  export default value;
}

type smap<T> = { [key: string]: T };

type ref<T> = {
  v: T;
};

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
      choices: smap<string | undefined>;
    }
  | {
      phase: "rating";
      kingindex: number;
      kingcard: string;
      choices: smap<string | undefined>;
    };

type GameUserData =
  | {
      phase: "choosing";
      role: "king";
      card: string;
    }
  | {
      phase: "choosing";
      role: "pawn";
    }
  | {
      phase: "matching";
      role: "king";
      card: string;
    }
  | {
      phase: "matching";
      role: "pawn";
      card: string;
      hand: string[];
      choice: string | undefined;
    }
  | {
      phase: "rating";
      role: "king" | "pawn";
      cards: smap<string | undefined>;
    };

type UserData = {
  gamedata: GameUserData | undefined;
  playernames: string[];
  roomcode: string;
};
