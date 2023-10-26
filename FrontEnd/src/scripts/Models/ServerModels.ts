export type Entity = {
  id: string
  x?: number
  y?: number
}

export type TileServer = {
  entity?: Entity
  x: number
  y: number
}

export type PlayerServer = Entity & {
  socketId: string
  sessionId: string
  name: string
  currentHP: number
  currentAttack?: number
  currentMoveCount?: number
  leftMoveCount?: number
  isAlive?: boolean
  isTurn?: boolean
  isWinner?: boolean
  moveOrder?: number
}

export type SessionServer = {
  name: string
  id: string
  playerCount: number
}
