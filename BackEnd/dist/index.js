const webSocketsServerPort = 8001;
import { server as webSocketServer } from 'websocket';
import * as http from 'http';
// const webSocketServer = require('websocket').server;
//const http = require('http');
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8001');
const wsServer = new webSocketServer({
    httpServer: server
});
const clients = {};
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};
wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');
    const connection = request.accept(null, request.origin);
    var connected_players_string = `{"connectedPlayers" : [`;
    // inform all open clients about new connection
    var index = 0;
    for (const key in clients) {
        if (index > 0) {
            connected_players_string += ',';
        }
        connected_players_string += `{"userID": "${key}",
                                "x" : "10",
                                "y" : "10"}`;
        clients[key].sendUTF(`{"connected":{
            "userID" : "${userID}",
            "x": "10",
            "y": "10"
        }}`);
        index += 1;
    }
    connected_players_string += `]}`;
    connection.sendUTF(connected_players_string);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
    clients[userID].sendUTF(`{"userID": "${userID}"}`);
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const dataFromServer = JSON.parse(String(message.utf8Data));
            if (dataFromServer.hasOwnProperty("move")) {
                var move_object = dataFromServer["move"];
                for (const key in clients) {
                    if (key != move_object["userID"]) {
                        clients[key].sendUTF(message.utf8Data);
                    }
                }
            }
        }
    });
});
//# sourceMappingURL=index.js.map