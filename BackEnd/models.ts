export type Entity = {
  id: String;
  x?: Number;
  y?: Number;
};

export type Obstacle = Entity & {
  isBlocking: Boolean;
  isDestructable: Boolean;
};

export type Player = Entity & {
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
};

export type Tile = {
  entity?: Entity;
  x: Number;
  y: Number;
};

export type GameMap = {
  sessionId: string;
  tileMap: Tile[];
};

export type Session = {
  name: string;
  id: string;
};