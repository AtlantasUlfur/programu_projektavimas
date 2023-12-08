import { Socket } from "socket.io";
import {
  Tile,
  Entity,
  Session,
  GameMap,
  Player,
  PlayerMemento,
} from "./models";
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

class Mediator {
  public sendToGamePlayers(senderId: string, name: string, message: any) {
    const player = getPlayerById(senderId);
    const sessionId = player.sessionId;

    const sessionPlayers = getSessionPlayers(sessionId);

    _.forEach(sessionPlayers, function (currentPlayer: Player) {
      const playerSocket = sockets[currentPlayer.socketId];
      playerSocket.emit(name, message);
    });
  }

  public sendToRequester(senderId: string, name: string, message: any) {
    const playerSocket = sockets[senderId];
    playerSocket.emit(name, message);
  }
}

const mediator = new Mediator();

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
      memento: null,
    });

    mediator.sendToRequester(socket.id, "playerCount", 1);
  });

  socket.on("destroyedWall", function (payload) {
    const x = payload.x;
    const y = payload.y;

    mediator.sendToGamePlayers(socket.id, "destroyWall", { x: x, y: y });
  });

  socket.on("joinLobby", function (payload) {
    console.log("Join lobby");
    console.log(payload);
    const name = payload.name;

    const session = getSession(name);

    if (!session) {
      mediator.sendToRequester(socket.id, "lobbyStatus", 3);
      return;
    }

    mediator.sendToRequester(socket.id, "lobbyStatus", 1);
    players.push({
      id: "player",
      socketId: socket.id,
      sessionId: session.id,
      currentHP: 100,
      name: payload.playerName,
      memento: null,
    });

    const sessionPlayers = getSessionPlayers(session.id);

    const playerCount = sessionPlayers.length;

    mediator.sendToGamePlayers(socket.id, "playerCount", playerCount);
  });

  socket.on("startGame", function (payload) {
    console.log("Start game");
    const name = payload.name;
    const theme = payload.theme;

    const session = getSession(name);
    if (!session) {
      mediator.sendToRequester(socket.id, "lobbyStatus", 3);
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
    mediator.sendToGamePlayers(socket.id, "gunChange", {player: socket.id, command: payload});
  });

  socket.on("endTurn", function () {
    console.log("End Turn");

    const player = getPlayerBySocketId(socket.id);

    const sessionId = player.sessionId; //ZaidimoID
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
    mediator.sendToGamePlayers(socket.id, "turn", nextPlayer.socketId);
    console.log("memento");
  });

  socket.on("movePlayer", function (x: number, y: number) {
    console.log("Move");

    const player = getPlayerBySocketId(socket.id);
    player.memento = new PlayerMemento(
      { x: player.x, y: player.y },
      player.currentHP || 0,
      player.isTurn || false,
      player.moveOrder || 0
    );
    player.x = x;
    player.y = y;

    mediator.sendToGamePlayers(socket.id, "playerMove", {
      player: socket.id,
      x: player.x,
      y: player.y,
    });
  });
  socket.on("damagePlayer", function (damage: number, targetId: string) {
    console.log("Damaged");
    console.log("DMG", damage);
    console.log(targetId);

    if (damage != 0) {
      const player = getPlayerBySocketId(targetId);
      if (player.memento) {
        if (player.currentHP !== undefined) {
          player.memento.health = player.currentHP;
        } else {
        }
      }
      const playerSocket = getPlayerBySocketId(socket.id);
      playerSocket.memento = new PlayerMemento(
        { x: playerSocket.x, y: playerSocket.y },
        playerSocket.currentHP || 0,
        playerSocket.isTurn || false,
        playerSocket.moveOrder || 0
      );

      console.log("BEFORE HP", player.currentHP);
      player.currentHP =
        player.currentHP == undefined ? 0 : player.currentHP - damage;
      if (player.currentHP < 0) {
        player.currentHP = 0;
      }
      console.log("AFTER HP", player.currentHP);
      mediator.sendToGamePlayers(socket.id, "playerDamage", {
        player: targetId,
        currentHP: player.currentHP,
      });
    }
  });

  socket.on("getAttackAmount", function () {
    console.log("Getting attack amount");
    const randomNumber = 10;

    mediator.sendToRequester(socket.id, "attackAmount", {
      player: socket.id,
      currentAttack: randomNumber,
    });
  });

  socket.on("loadState", function () {
    console.log("loadState");
    const player = getPlayerBySocketId(socket.id);
    const sessionId = player.sessionId; //ZaidimoID
    let moveOrder = player.moveOrder ?? 0;

    const sessionPlayers = getSessionPlayers(sessionId);

    _.forEach(sessionPlayers, function (player: Player) {
      player.x = player.memento?.getPosition().x;
      player.y = player.memento?.getPosition().y;
      player.currentHP = player.memento?.getHealth();
      //player.currentMoveCount = player.currentMoveCount === undefined ? undefined : player.currentMoveCount - 1;
      player.isTurn = player.memento?.getTurnStatus();
      //player.memento = null;

      console.log(player);
    });
    _.forEach(sessionPlayers, function (player: Player) {
      _.forEach(sessionPlayers, function (sessionPlayer: Player) {
        const playerSocket = sockets[sessionPlayer.socketId];
        playerSocket.emit("playersState", player);
        console.log("emitting");
      });
    });
  });

  socket.on("getLobbies", function () {
    console.log("Getting lobbies");

    _.forEach(sessions, function (session: Session) {
      const sessionPlayers = getSessionPlayers(session.id);
      const playerCount = sessionPlayers.length;
      session.playerCount = playerCount;
    });
    mediator.sendToRequester(socket.id, "lobbies", { sessions });
  });

  socket.on("healPlayer", function (healthIncrease: number) {
    console.log("HealingPlayer ", socket.id, " by ", healthIncrease);

    const player = getPlayerBySocketId(socket.id);
    player.currentHP =
      player.currentHP == undefined ? 0 : player.currentHP + healthIncrease;
    if (player.currentHP > 100) {
      player.currentHP = 100;
    }

    mediator.sendToGamePlayers(socket.id, "playerDamage", {
      //devious usage
      player: socket.id,
      currentHP: player.currentHP,
    });
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

function getSession(name: string): Session {
  return _.find(sessions, (session: Session) => session.name === name);
}

function getPlayerById(id: string): Player {
  return _.find(players, (player: Player) => player.socketId === id);
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
