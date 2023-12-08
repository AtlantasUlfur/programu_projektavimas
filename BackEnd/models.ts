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
  currentHP?: number;
  currentAttack?: Number;
  currentMoveCount?: Number;
  leftMoveCount?: Number;
  isAlive?: Boolean;
  isTurn?: Boolean;
  isWinner?: Boolean;
  moveOrder?: number;
  memento: PlayerMemento | null;
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
  playerCount: Number;
};
export class PlayerMemento {
   position: { x: Number | undefined; y: Number | undefined };
   health: number;
   isTurn: Boolean;
   moveOrder: number;

  constructor(position: { x: Number | undefined; y: Number | undefined }, health: number, isTurn: Boolean, moveOrder: number) {
    this.position = { ...position };
    this.health = health;
    this.isTurn = isTurn;
    this.moveOrder = moveOrder;
  }

  getPosition(): { x: Number | undefined; y: Number | undefined } {
    return this.position;
  }

  getHealth(): number {
    return this.health;
  }

  getTurnStatus(): Boolean {
    return this.isTurn;
  }
  getMoveOrder():number{
    return this.moveOrder;
  }
  
}