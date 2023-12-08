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
io.on("connection", function (socket) {
    sockets[socket.id] = socket;
    socket.on("disconnect", function () {
        console.log("user disconnected");
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
            memento: null
        });
        socket.emit("playerCount", 1);
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
            memento: null
        });
        //NOTE(HB) collect players in updated session
        const sessionPlayers = getSessionPlayers(session.id);
        //NOTE(HB) find player count in current session
        const playerCount = sessionPlayers.length;
        //NOTE(HB) emit player count to all connected players
        _.forEach(sessionPlayers, function (player) {
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
        console.log("changeGun");
        socket.broadcast.emit("gunChange", socket.id);
    });
    socket.on("endTurn", function () {
        var _a;
        console.log("End Turn");
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
        _.forEach(sessionPlayers, function (player) {
            const playerSocket = sockets[player.socketId];
            playerSocket.emit("turn", nextPlayer.socketId);
        });
        console.log("memento");
    });
    socket.on("movePlayer", function (x, y) {
        console.log("Move");
        const player = getPlayerBySocketId(socket.id);
        player.memento = new models_1.PlayerMemento({ x: player.x, y: player.y }, player.currentHP || 0, player.isTurn || false, player.moveOrder || 0);
        player.x = x;
        player.y = y;
        const sessionId = player.sessionId;
        const sessionPlayers = getSessionPlayers(sessionId);
        _.forEach(sessionPlayers, function (playerCurrent) {
            const playerSocket = sockets[playerCurrent.socketId];
            playerSocket.emit("playerMove", {
                player: socket.id,
                x: player.x,
                y: player.y,
            });
        });
    });
    socket.on("damagePlayer", function (damage, targetId) {
        console.log("Damaged");
        console.log("DMG", damage);
        console.log(targetId);
        if (damage != 0) {
            const player = getPlayerBySocketId(targetId);
            if (player.memento) {
                if (player.currentHP !== undefined) {
                    player.memento.health = player.currentHP;
                }
                else {
                }
            }
            const playerSocket = getPlayerBySocketId(socket.id);
            playerSocket.memento = new models_1.PlayerMemento({ x: playerSocket.x, y: playerSocket.y }, playerSocket.currentHP || 0, playerSocket.isTurn || false, playerSocket.moveOrder || 0);
            console.log("BEFORE HP", player.currentHP);
            player.currentHP =
                player.currentHP == undefined ? 0 : player.currentHP - damage;
            if (player.currentHP < 0) {
                player.currentHP = 0;
            }
            console.log("AFTER HP", player.currentHP);
            const sessionId = player.sessionId;
            const sessionPlayers = getSessionPlayers(sessionId);
            _.forEach(sessionPlayers, function (currentPlayer) {
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
    socket.on("loadState", function () {
        var _a;
        console.log("loadState");
        const player = getPlayerBySocketId(socket.id);
        const sessionId = player.sessionId; //ZaidimoID
        let moveOrder = (_a = player.moveOrder) !== null && _a !== void 0 ? _a : 0;
        const sessionPlayers = getSessionPlayers(sessionId);
        _.forEach(sessionPlayers, function (player) {
            var _a, _b, _c, _d;
            player.x = (_a = player.memento) === null || _a === void 0 ? void 0 : _a.getPosition().x;
            player.y = (_b = player.memento) === null || _b === void 0 ? void 0 : _b.getPosition().y;
            player.currentHP = (_c = player.memento) === null || _c === void 0 ? void 0 : _c.getHealth();
            //player.currentMoveCount = player.currentMoveCount === undefined ? undefined : player.currentMoveCount - 1;
            player.isTurn = (_d = player.memento) === null || _d === void 0 ? void 0 : _d.getTurnStatus();
            //player.memento = null;
            console.log(player);
        });
        _.forEach(sessionPlayers, function (player) {
            _.forEach(sessionPlayers, function (sessionPlayer) {
                const playerSocket = sockets[sessionPlayer.socketId];
                playerSocket.emit("playersState", player);
                console.log("emitting");
            });
        });
    });
    socket.on("getLobbies", function () {
        console.log("Getting lobbies");
        _.forEach(sessions, function (session) {
            const sessionPlayers = getSessionPlayers(session.id);
            const playerCount = sessionPlayers.length;
            session.playerCount = playerCount;
        });
        socket.emit("lobbies", { sessions });
    });
});
server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});
function getSession(name) {
    return _.find(sessions, (session) => session.name === name);
}
function getSessionPlayers(sessionId) {
    return _.reduce(players, function (sessionPlayers, player) {
        if (player.sessionId === sessionId) {
            sessionPlayers.push(player);
        }
        return sessionPlayers;
    }, []);
}
function getPlayerBySocketId(socketId) {
    return _.find(players, (player) => player.socketId === socketId);
}
