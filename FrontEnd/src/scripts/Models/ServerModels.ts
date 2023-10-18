export type Entity = {
    id: String;
    x?: Number;
    y?: Number;
  };
  
export type TileServer = {
    entity?: Entity;
    x: Number;
    y: Number;
  };

export type PlayerServer = Entity & {
socketId: string;
sessionId: string;
name?: string;
currentHP?: Number;
currentAttack?: Number;
currentMoveCount?: Number;
leftMoveCount?: Number;
isAlive?: Boolean;
isTurn?: Boolean;
isWinner?: Boolean;
moveOrder?: number;
};
