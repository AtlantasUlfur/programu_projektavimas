"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // remove this player from our players object
        _.remove(players, (player) => player.socketId === socket.id);
        _.remove(sockets, (scoket) => scoket.id === socket.id);
    });
    socket.on("createLobby", function (payload) {
        console.log("New lobby");
        const sessionId = uuid();
        sessions.push({ id: sessionId, name: payload.name });
        players.push({ id: "player", socketId: socket.id, sessionId });
        socket.emit("playerCount", 1);
    });
    socket.on("joinLobby", function (payload) {
        console.log("Join lobby");
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
            playerSocket.emit("gameStart", { map, player, sessionPlayers, playersTurnId: firstPlayer === null || firstPlayer === void 0 ? void 0 : firstPlayer.socketId });
            moveOrder = moveOrder + 1;
        });
    });
    socket.on("endTurn", function () {
        var _a;
        console.log("End Turn");
        const player = getPlayerBySocketId(socket.id);
        const sessionId = player.sessionId;
        let moveOrder = (_a = player.moveOrder) !== null && _a !== void 0 ? _a : 0;
        const sessionPlayers = getSessionPlayers(sessionId);
        if (moveOrder < sessionPlayers.length) {
            moveOrder = moveOrder + 1;
        }
        else {
            moveOrder = 1;
        }
        const nextPlayer = _.find(sessionPlayers, (player) => player.moveOrder === moveOrder);
        player.isTurn = false;
        nextPlayer.isTurn = true;
        _.forEach(sessionPlayers, function (player) {
            const playerSocket = sockets[player.socketId];
            playerSocket.emit("turn", nextPlayer.socketId);
        });
    });
    socket.on("movePlayer", function (x, y) {
        console.log("Move");
        const player = getPlayerBySocketId(socket.id);
        player.x = x;
        player.y = y;
        const sessionId = player.sessionId;
        const sessionPlayers = getSessionPlayers(sessionId);
        _.forEach(sessionPlayers, function (player) {
            const playerSocket = sockets[player.socketId];
            playerSocket.emit("playerMove", { player: socket.id, x: player.x, y: player.y });
        });
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
