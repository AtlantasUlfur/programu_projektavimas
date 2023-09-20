const webSocketsServerPort = 8000;
import { server as webSocketServer } from 'websocket';
import * as http from 'http';
// const webSocketServer = require('websocket').server;
//const http = require('http');
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');
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
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);
            for (const key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ', key);
            }
        }
    });
});
//# sourceMappingURL=index.js.map