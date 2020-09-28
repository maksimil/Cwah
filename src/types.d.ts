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
