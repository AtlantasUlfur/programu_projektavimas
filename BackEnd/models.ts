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

  createMemento: (this: Player) => PlayerMemento;
  restoreMemento: (this: Player) => void;

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
   state: string;
   position: { x: Number | undefined; y: Number | undefined };
   health: number;
   isTurn: Boolean;
   moveOrder: number;

  constructor(state: string, position: { x: Number | undefined; y: Number | undefined }, health: number, isTurn: Boolean, moveOrder: number) {
    this.position = { ...position };
    this.health = health;
    this.isTurn = isTurn;
    this.moveOrder = moveOrder;
    this.state = state;
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

export class CareTaker{
private history: PlayerMemento[]

constructor(){
  this.history = []
}
save(momento: PlayerMemento){
  console.log(this.history[0]);
  let found = false;

  for (let i = 0; i < this.history.length; i++) {
      if (this.history[i].state === momento.state) {
          this.history[i] = momento; 
          found = true;
          break; 
      }
  }

  if (!found) {
      this.history.push(momento); 
  }
}
undo(state: string): PlayerMemento | null{
  for (const element of this.history) {
    if (element.state === state) {
        return element; 
    }
}
return null;

}
}