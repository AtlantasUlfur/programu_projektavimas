import { Socket } from "socket.io";
const { uuid } = require("uuidv4");
const express = require("express");
const _ = require("lodash");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const MAX_PLAYERS_IN_SESSION = 4;
const MAP_DIMENSIONS = 20;

app.use(
  cors({
    origin: "*",
  })
);

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

const getDefaultTileMap: () => Tile[] = () => {
  const tileMap: Tile[] = [];

  for (let i = 0; i < MAP_DIMENSIONS; i++) {
    for (let a = 0; a < MAP_DIMENSIONS; a++) {
      let entity: Entity | undefined = undefined;
      if (
        i === 0 ||
        i === MAP_DIMENSIONS - 1 ||
        a === 0 ||
        a === MAP_DIMENSIONS - 1
      ) {
        entity = { id: "wall", x: i, y: a };
      }
      tileMap.push({ x: i, y: a, entity });
    }
  }

  return tileMap;
};

const sessions: Session[] = [];
const maps: GameMap[] = [];
const players: Player[] = [];
const sockets: { [key: string]: Socket } = {};

io.on("connection", function (socket: Socket) {
  sockets[socket.id] = socket;
  console.log("User connected");

  socket.on("createLobby", function (payload) {
    console.log("New lobby");

    const sessionId = uuid();
    sessions.push({ id: sessionId, name: payload.name });

    players.push({ id: "player", socketId: socket.id, sessionId });
  });

  socket.on("joinLobby", function (payload) {
    console.log("Join lobby");

    players.push({ id: "player", socketId: socket.id, sessionId: payload.sessionId });
  });

  socket.on("getLobbies", function () {
    console.log("Get lobbies");

    socket.emit("lobbiesList", sessions);
  });

  
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
