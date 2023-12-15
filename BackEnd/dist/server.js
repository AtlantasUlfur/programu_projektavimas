"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
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
const CareTaker_ = new models_1.CareTaker();
const MAX_PLAYERS_IN_SESSION = 4;
const MAP_DIMENSIONS = 20;
app.use(cors({
    origin: "*",
}));
const getDefaultTileMap = () => {
    const tileMap = [];
    for (let i = 0; i < MAP_DIMENSIONS; i++) {
        for (let a = 0; a < MAP_DIMENSIONS; a++) {
            let entity = undefined;
            if (i === 0 ||
                i === MAP_DIMENSIONS - 1 ||
                a === 0 ||
                a === MAP_DIMENSIONS - 1) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (i === 5 && a > 4 && a < 11) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (i === 6 && a > 16 && a < 20) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (i === 12 && a > 14 && a < 16) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (a === 10 && i > 16 && i < 20) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (a === 7 && i > 14 && i < 20) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (a === 16 && i > 7 && i < 11) {
                entity = { id: "wall", x: i, y: a };
            }
            else if (a === 16 && i > 16 && i < 20) {
                entity = { id: "wall", x: i, y: a };
            }
            else {
                entity = { id: "ground", x: i, y: a };
            }
            tileMap.push({ x: i, y: a, entity });
        }
    }
    return tileMap;
};
const sessions = [];
const maps = [];
const players = [];
const sockets = {};
class Mediator {
    sendToGamePlayers(senderId, name, message) {
        const player = getPlayerById(senderId);
        const sessionId = player.sessionId;
        const sessionPlayers = getSessionPlayers(sessionId);
        _.forEach(sessionPlayers, function (currentPlayer) {
            const playerSocket = sockets[currentPlayer.socketId];
            playerSocket.emit(name, message);
        });
    }
    sendToRequester(senderId, name, message) {
        const playerSocket = sockets[senderId];
        playerSocket.emit(name, message);
    }
}
const mediator = new Mediator();
io.on("connection", function (socket) {
    sockets[socket.id] = socket;
    socket.on("disconnect", function () {
        try {
            // remove this player from our players object
            const removedPlayer = _.remove(players, (player) => player.socketId === socket.id);
            _.remove(sockets, (scoket) => scoket.id === socket.id);
            _.remove(sessions, (session) => {
                if (session.id === removedPlayer[0].sessionId) {
                    const sessionPlayers = getSessionPlayers(session.id);
                    if (sessionPlayers.length == 0) {
                        return true;
                    }
                }
            });
        }
        catch (error) {
        }
    });
    socket.on("createLobby", function (payload) {
        const sessionId = uuid();
        sessions.push({ id: sessionId, name: payload.name, playerCount: 1 });
        players.push({
            id: "player",
            socketId: socket.id,
            sessionId,
            currentHP: 100,
            name: payload.name,
            createMemento() {
                console.log(this.currentHP);
                return new models_1.PlayerMemento(this.socketId, { x: this.x, y: this.y }, this.currentHP || 0, this.isTurn || false, this.moveOrder || 0);
            },
            restoreMemento() {
                console.log("RESTORING:" + this.socketId);
                const snap = CareTaker_.undo(this.socketId);
                this.x = snap === null || snap === void 0 ? void 0 : snap.getPosition().x;
                this.y = snap === null || snap === void 0 ? void 0 : snap.getPosition().y;
                this.currentHP = snap === null || snap === void 0 ? void 0 : snap.getHealth();
                this.isTurn = snap === null || snap === void 0 ? void 0 : snap.getTurnStatus();
            }
        });
        mediator.sendToRequester(socket.id, "playerCount", 1);
    });
    socket.on("destroyedWall", function (payload) {
        const x = payload.x;
        const y = payload.y;
        mediator.sendToGamePlayers(socket.id, "destroyWall", { x: x, y: y });
    });
    socket.on("joinLobby", function (payload) {
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
            createMemento() {
                return new models_1.PlayerMemento(this.socketId, { x: this.x, y: this.y }, this.currentHP || 0, this.isTurn || false, this.moveOrder || 0);
            },
            restoreMemento() {
                const snap = CareTaker_.undo(this.socketId);
                console.log("SNAP RESTORE: " + snap);
                this.x = snap === null || snap === void 0 ? void 0 : snap.position.x;
                this.y = snap === null || snap === void 0 ? void 0 : snap.position.y;
                this.currentHP = snap === null || snap === void 0 ? void 0 : snap.health;
                this.isTurn = snap === null || snap === void 0 ? void 0 : snap.isTurn;
            }
        });
        const sessionPlayers = getSessionPlayers(session.id);
        const playerCount = sessionPlayers.length;
        mediator.sendToGamePlayers(socket.id, "playerCount", playerCount);
    });
    socket.on("startGame", function (payload) {
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
        const playerTiles = [];
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
        let firstPlayer = null;
        _.forEach(playerTiles, function (playerTile) {
            const tileIndex = _.findIndex(tileMap, (tile) => tile.x === playerTile.x && tile.y === playerTile.y);
            tileMap[tileIndex] = playerTile;
        });
        const map = { sessionId, tileMap };
        maps.push(map);
        let moveOrder = 1;
        _.forEach(sessionPlayers, function (player) {
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
                playersTurnId: firstPlayer === null || firstPlayer === void 0 ? void 0 : firstPlayer.socketId,
                theme,
            });
            moveOrder = moveOrder + 1;
        });
    });
    socket.on("changeGun", function (payload) {
        mediator.sendToGamePlayers(socket.id, "gunChange", { player: socket.id, command: payload });
    });
    socket.on("endTurn", function () {
        var _a;
        const player = getPlayerBySocketId(socket.id);
        const sessionId = player.sessionId; //ZaidimoID
        let moveOrder = (_a = player.moveOrder) !== null && _a !== void 0 ? _a : 0;
        const sessionPlayers = getSessionPlayers(sessionId);
        const nextPlayers = [];
        _.forEach(sessionPlayers, (player) => {
            if (Number(player.moveOrder) > moveOrder) {
                nextPlayers.push(player);
            }
        });
        const nextPlayersSorted = _.sortBy(nextPlayers, (player) => player.moveOrder);
        let nextPlayer = nextPlayersSorted[0];
        if (nextPlayers.length <= 0) {
            const sessionPlayersSorted = _.sortBy(sessionPlayers, (player) => player.moveOrder);
            nextPlayer = sessionPlayersSorted[0];
        }
        player.isTurn = false;
        nextPlayer.isTurn = true;
        mediator.sendToGamePlayers(socket.id, "turn", nextPlayer.socketId);
    });
    socket.on("movePlayer", function (x, y) {
        const player = getPlayerBySocketId(socket.id);
        const snap = player.createMemento();
        CareTaker_.save(snap);
        // player.memento = new PlayerMemento(
        //   { x: player.x, y: player.y },
        //   player.currentHP || 0,
        //   player.isTurn || false,
        //   player.moveOrder || 0
        // );
        player.x = x;
        player.y = y;
        mediator.sendToGamePlayers(socket.id, "playerMove", {
            player: socket.id,
            x: player.x,
            y: player.y,
        });
    });
    socket.on("damagePlayer", function (damage, targetId) {
        if (damage != 0) {
            const player = getPlayerBySocketId(targetId);
            // if (player.memento) {
            //   if (player.currentHP !== undefined) {
            //     player.memento.health = player.currentHP;
            //   } else {
            //   }
            // }
            const playerSocket = getPlayerBySocketId(socket.id);
            // playerSocket.memento = new PlayerMemento(
            //   { x: playerSocket.x, y: playerSocket.y },
            //   playerSocket.currentHP || 0,
            //   playerSocket.isTurn || false,
            //   playerSocket.moveOrder || 0
            // );
            const snap = player.createMemento();
            CareTaker_.save(snap);
            player.currentHP =
                player.currentHP == undefined ? 0 : player.currentHP - damage;
            if (player.currentHP < 0) {
                player.currentHP = 0;
            }
            mediator.sendToGamePlayers(socket.id, "playerDamage", {
                player: targetId,
                currentHP: player.currentHP,
            });
        }
    });
    socket.on("getAttackAmount", function () {
        const randomNumber = 10;
        mediator.sendToRequester(socket.id, "attackAmount", {
            player: socket.id,
            currentAttack: randomNumber,
        });
    });
    socket.on("loadState", function () {
        var _a;
        const player = getPlayerBySocketId(socket.id);
        const sessionId = player.sessionId; //ZaidimoID
        let moveOrder = (_a = player.moveOrder) !== null && _a !== void 0 ? _a : 0;
        const sessionPlayers = getSessionPlayers(sessionId);
        _.forEach(sessionPlayers, function (player) {
            player.restoreMemento();
            //player.x = player.memento?.getPosition().x;
            //player.y = player.memento?.getPosition().y;
            //player.currentHP = player.memento?.getHealth();
            //player.currentMoveCount = player.currentMoveCount === undefined ? undefined : player.currentMoveCount - 1;
            //player.isTurn = player.memento?.getTurnStatus();
            //player.memento = null;
        });
        _.forEach(sessionPlayers, function (player) {
            _.forEach(sessionPlayers, function (sessionPlayer) {
                const playerSocket = sockets[sessionPlayer.socketId];
                playerSocket.emit("playersState", player);
            });
        });
    });
    socket.on("getLobbies", function () {
        _.forEach(sessions, function (session) {
            const sessionPlayers = getSessionPlayers(session.id);
            const playerCount = sessionPlayers.length;
            session.playerCount = playerCount;
        });
        mediator.sendToRequester(socket.id, "lobbies", { sessions });
    });
    socket.on("healPlayer", function (healthIncrease) {
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
});
function getSession(name) {
    return _.find(sessions, (session) => session.name === name);
}
function getPlayerById(id) {
    return _.find(players, (player) => player.socketId === id);
}
function getSessionPlayers(sessionId) {
    return _.reduce(players, function (sessionPlayers, player) {
        if (player.sessionId === sessionId) {
            sessionPlayers.push(player);
        }
        return sessionPlayers;
    }, []);
}
function saveMemento(player) {
    return new models_1.PlayerMemento(player.socketId, { x: player.x, y: player.y }, player.currentHP || 0, player.isTurn || false, player.moveOrder || 0);
}
function restoreMemento_(player) {
    const snap = CareTaker_.undo(player.socketId);
    player.x = snap === null || snap === void 0 ? void 0 : snap.getPosition().x;
    player.y = snap === null || snap === void 0 ? void 0 : snap.getPosition().y;
    player.currentHP = snap === null || snap === void 0 ? void 0 : snap.getHealth();
    player.isTurn = snap === null || snap === void 0 ? void 0 : snap.getTurnStatus();
}
function getPlayerBySocketId(socketId) {
    return _.find(players, (player) => player.socketId === socketId);
}
