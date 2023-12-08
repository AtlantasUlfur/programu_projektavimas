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
      } else if (i === 5 && a > 4 && a < 11) {
        entity = { id: "wall", x: i, y: a };
      } else if (i === 6 && a > 16 && a < 20) {
        entity = { id: "wall", x: i, y: a };
      } else if (i === 12 && a > 14 && a < 16) {
        entity = { id: "wall", x: i, y: a };
      } else if (a === 10 && i > 16 && i < 20) {
        entity = { id: "wall", x: i, y: a };
      } else if (a === 7 && i > 14 && i < 20) {
        entity = { id: "wall", x: i, y: a };
      } else if (a === 16 && i > 7 && i < 11) {
        entity = { id: "wall", x: i, y: a };
      } else if (a === 16 && i > 16 && i < 20) {
        entity = { id: "wall", x: i, y: a };
      } else {
        entity = { id: "ground", x: i, y: a };
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

  socket.on("disconnect", function () {
    console.log("user disconnected");
    try {
      // remove this player from our players object
      const removedPlayer: Player[] = _.remove(
        players,
        (player: Player) => player.socketId === socket.id
      );
      _.remove(sockets, (scoket: Socket) => scoket.id === socket.id);

      _.remove(sessions, (session: Session) => {
        if (session.id === removedPlayer[0].sessionId) {
          const sessionPlayers = getSessionPlayers(session.id);
          if (sessionPlayers.length == 0) {
            return true;
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("createLobby", function (payload) {
    console.log("New lobby");

    const sessionId = uuid();
    sessions.push({ id: sessionId, name: payload.name, playerCount: 1 });

    players.push({
      id: "player",
      socketId: socket.id,
      sessionId,
      currentHP: 100,
      name: payload.name,
    });

    socket.emit("playerCount", 1);
  });

  socket.on("destroyedWall", function (payload)
  {
    const x = payload.x;
    const y = payload.y;

    const player = getPlayerBySocketId(socket.id);
    const sessionId = player.sessionId;
    const sessionPlayers = getSessionPlayers(sessionId);

    _.forEach(sessionPlayers, function (playerCurrent: Player) {
      const playerSocket = sockets[playerCurrent.socketId];
      playerSocket.emit("destroyWall", {
        x: x,
        y: y
      });
    });
    socket.emit("destroyWall", {x, y});
  });
  socket.on("joinLobby", function (payload) {
    console.log("Join lobby");
    console.log(payload);
    const name = payload.name;

    const session = getSession(name);

    if (!session) {
      socket.emit("lobbyStatus", 3);
      return;
    }

    socket.emit("lobbyStatus", 1);
    players.push({
      id: "player",
      socketId: socket.id,
      sessionId: session.id,
      currentHP: 100,
      name: payload.playerName,
    });

    //NOTE(HB) collect players in updated session
    const sessionPlayers = getSessionPlayers(session.id);

    //NOTE(HB) find player count in current session
    const playerCount = sessionPlayers.length;

    //NOTE(HB) emit player count to all connected players
    _.forEach(sessionPlayers, function (player: Player) {
      const playerSocket = sockets[player.socketId];
      playerSocket.emit("playerCount", playerCount);
    });
  });

  socket.on("startGame", function (payload) {
    console.log("Start game");
    const name = payload.name;
    const theme = payload.theme;

    const session = getSession(name);
    if (!session) {
      socket.emit("lobbyStatus", 3);
      return;
    }
    const sessionId = session.id;

    const sessionPlayers = getSessionPlayers(sessionId);

    const playerCount = sessionPlayers.length;

    const tileMap = getDefaultTileMap();

    const playerTiles: Tile[] = [];

    switch (playerCount) {
      case 4:
        sessionPlayers[3].x = 17;
        sessionPlayers[3].y = 17;
        playerTiles.push({
          x: 17,
          y: 17,
          entity: { id: "player", x: 17, y: 17 },
        });
      case 3:
        sessionPlayers[2].x = 17;
        sessionPlayers[2].y = 2;
        playerTiles.push({
          x: 17,
          y: 2,
          entity: { id: "player", x: 17, y: 2 },
        });
      default:
        sessionPlayers[1].x = 2;
        sessionPlayers[1].y = 2;
        sessionPlayers[0].x = 2;
        sessionPlayers[0].y = 17;
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
    let firstPlayer: Player | null = null;

    _.forEach(playerTiles, function (playerTile: Tile) {
      const tileIndex = _.findIndex(
        tileMap,
        (tile: Tile) => tile.x === playerTile.x && tile.y === playerTile.y
      );
      tileMap[tileIndex] = playerTile;
    });

    const map = { sessionId, tileMap };

    maps.push(map);

    let moveOrder = 1;
    _.forEach(sessionPlayers, function (player: Player) {
      player.moveOrder = moveOrder;

      const playerSocket = sockets[player.socketId];

      if (moveOrder === 1) {
        firstPlayer = player;
        firstPlayer.isTurn = true;
      }

      playerSocket.emit("gameStart", {
        map,
        player,
        sessionPlayers,
        playersTurnId: firstPlayer?.socketId,
        theme,
      });

      moveOrder = moveOrder + 1;
    });
  });

  socket.on("changeGun", function (payload) {
    console.log("changeGun");
    socket.broadcast.emit("gunChange", socket.id);
  });
  socket.on("endTurn", function () {
    console.log("End Turn");

    const player = getPlayerBySocketId(socket.id);
    const sessionId = player.sessionId;
    let moveOrder = player.moveOrder ?? 0;

    const sessionPlayers = getSessionPlayers(sessionId);
    const nextPlayers: Player[] = [];

    _.forEach(sessionPlayers, (player: Player) => {
      if (Number(player.moveOrder) > moveOrder) {
        nextPlayers.push(player);
      }
    });

    const nextPlayersSorted = _.sortBy(
      nextPlayers,
      (player: Player) => player.moveOrder
    );

    let nextPlayer = nextPlayersSorted[0];

    if (nextPlayers.length <= 0) {
      const sessionPlayersSorted = _.sortBy(
        sessionPlayers,
        (player: Player) => player.moveOrder
      );
      nextPlayer = sessionPlayersSorted[0];
    }

    player.isTurn = false;
    nextPlayer.isTurn = true;

    _.forEach(sessionPlayers, function (player: Player) {
      const playerSocket = sockets[player.socketId];
      playerSocket.emit("turn", nextPlayer.socketId);
    });
  });

  socket.on("movePlayer", function (x: number, y: number) {
    console.log("Move");

    const player = getPlayerBySocketId(socket.id);
    player.x = x;
    player.y = y;
    const sessionId = player.sessionId;

    const sessionPlayers = getSessionPlayers(sessionId);

    _.forEach(sessionPlayers, function (playerCurrent: Player) {
      const playerSocket = sockets[playerCurrent.socketId];
      playerSocket.emit("playerMove", {
        player: socket.id,
        x: player.x,
        y: player.y,
      });
    });
  });
  socket.on("damagePlayer", function (damage: number, targetId: string) {
    console.log("Damaged");
    console.log("DMG", damage);
    console.log(targetId);

    if (damage != 0) {
      const player = getPlayerBySocketId(targetId);
      console.log("BEFORE HP", player.currentHP);
      player.currentHP =
        player.currentHP == undefined ? 0 : player.currentHP - damage;
      if (player.currentHP < 0) {
        player.currentHP = 0;
      }
      console.log("AFTER HP", player.currentHP);
      const sessionId = player.sessionId;

      const sessionPlayers = getSessionPlayers(sessionId);

      _.forEach(sessionPlayers, function (currentPlayer: Player) {
        const playerSocket = sockets[currentPlayer.socketId];
        playerSocket.emit("playerDamage", {
          player: targetId,
          currentHP: player.currentHP,
        });
      });
    }
  });

  socket.on("getAttackAmount", function () {
    console.log("Getting attack amount");

    const player = getPlayerBySocketId(socket.id);
    const randomNumber = 10;

    const playerSocket = sockets[player.socketId];
    playerSocket.emit("attackAmount", {
      player: socket.id,
      currentAttack: randomNumber,
    });
  });

  socket.on("getLobbies", function () {
    console.log("Getting lobbies");

    _.forEach(sessions, function (session: Session) {
      const sessionPlayers = getSessionPlayers(session.id);
      const playerCount = sessionPlayers.length;
      session.playerCount = playerCount;
    });
    socket.emit("lobbies", { sessions });
  });

  socket.on("healPlayer", function (healthIncrease: number) {
    console.log("HealingPlayer ", socket.id, " by ", healthIncrease);

    const player = getPlayerBySocketId(socket.id);
    player.currentHP =
        player.currentHP == undefined ? 0 : player.currentHP + healthIncrease;
    if (player.currentHP > 100) {
      player.currentHP = 100;
    }

    const sessionId = player.sessionId;
    const sessionPlayers = getSessionPlayers(sessionId);

      _.forEach(sessionPlayers, function (currentPlayer: Player) {
        const playerSocket = sockets[currentPlayer.socketId];
        playerSocket.emit("playerDamage", { //devious usage
          player: socket.id,
          currentHP: player.currentHP,
        });
      });
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

function getSession(name: string): Session {
  return _.find(sessions, (session: Session) => session.name === name);
}

function getSessionPlayers(sessionId: string): Player[] {
  return _.reduce(
    players,
    function (sessionPlayers: Player[], player: Player) {
      if (player.sessionId === sessionId) {
        sessionPlayers.push(player);
      }
      return sessionPlayers;
    },
    []
  );
}

function getPlayerBySocketId(socketId: string): Player {
  return _.find(players, (player: Player) => player.socketId === socketId);
}
