type Entity = {
    id: String;
    x?: Number;
    y?: Number;
  };
  
  type Obstacle = Entity & {
    isBlocking: Boolean;
    isDestructable: Boolean;
  };
  
  type Player = Entity & {
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
  
  type Tile = {
    entity?: Entity;
    x: Number;
    y: Number;
  };
  
  type GameMap = {
    sessionId: string;
    tileMap: Tile[];
  };
  
  type Session = {
    name: string;
    id: string;
  };
  
  