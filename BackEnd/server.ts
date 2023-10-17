import { Socket } from "socket.io";
import { Tile, Entity, Session, GameMap, Player } from "./models";
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

    socket.emit("playerCount", 1);
  });

  socket.on("joinLobby", function (payload) {
    console.log("Join lobby");

    const sessionId = payload.sessionId;

    players.push({
      id: "player",
      socketId: socket.id,
      sessionId,
    });

    //NOTE(HB) collect players in updated session
    const sessionPlayers: Player[] = [];

    //NOTE(HB) find player count in current session
    const playerCount = _.reduce(
      players,
      function (count: number, player: Player) {
        if (player.sessionId === sessionId) {
          sessionPlayers.push(player);
          count++;
        }
        return count;
      },
      0
    );

    //NOTE(HB) emit player count to all connected players
    _.forEach(sessionPlayers, function (player: Player) {
      const playerSocket = sockets[player.socketId];
      playerSocket.emit("playerCount", playerCount);
    });
  });

  socket.on("getLobbies", function () {
    console.log("Get lobbies");

    socket.emit("lobbiesList", sessions);
  });

  socket.on("startGame", function (payload) {
    console.log("Start game");

    const sessionId = payload.sessionId;

    const sessionPlayers: Player[] = [];

    const playerCount = _.reduce(
      players,
      function (count: number, player: Player) {
        if (player.sessionId === sessionId) {
          sessionPlayers.push(player);
          count++;
        }
        return count;
      },
      0
    );

    const tileMap = getDefaultTileMap();

    const playerTiles: Tile[] = [];

    switch (playerCount) {
      case 4:
        playerTiles.push({
          x: 17,
          y: 17,
          entity: { id: "player", x: 17, y: 17 },
        });
      case 3:
        playerTiles.push({
          x: 17,
          y: 2,
          entity: { id: "player", x: 17, y: 2 },
        });
      default:
        playerTiles.push({
          x: 2,
          y: 2,
          entity: { id: "player", x: 2, y: 2 },
        });
        playerTiles.push({
          x: 2,
          y: 17,
          entity: { id: "player", x: 2, y: 17 },
        });
        break;
    }

    _.forEach(playerTiles, function (playerTile: Tile) {
      const tileIndex = _.findIndex(
        tileMap,
        (tile: Tile) => tile.x === playerTile.x && tile.y === playerTile.y
      );
      tileMap[tileIndex] = playerTile;
    });

    const map = { sessionId, tileMap };

    maps.push(map);

    _.forEach(players, function (player: Player) {
      if (player.sessionId === sessionId) {
        const playerSocket = sockets[player.socketId];
        playerSocket.emit("gameStart", map);
      }
    });
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
