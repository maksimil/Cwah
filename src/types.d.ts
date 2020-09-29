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
      role: "king";
      cards: string[];
    }
  | {
      phase: "rating";
      role: "pawn";
      cards: string[];
    };

type UserData = {
  gamedata: GameUserData | undefined;
  playernames: string[];
  roomcode: string;
};
