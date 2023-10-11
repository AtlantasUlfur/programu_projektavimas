const express = require("express");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const max_players_in_session = 4;

app.use(
  cors({
    origin: "*",
  })
);

var sessions = {};
var players = {};
var sockets = {};

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  sockets[socket.id] = socket
  console.log("a user connected");
  // create a new player and add it to our players object
  let x = 0;
  let y = 0;
  if (Object.keys(players).length <= 0) {
    x = 2;
    y = 2;
  } else if (Object.keys(players).length === 1) {
    x = 17;
    y = 2;
  } else if (Object.keys(players).length === 2) {
    x = 2;
    y = 17;
  } else if (Object.keys(players).length === 3) {
    x = 17;
    y = 17;
  }
  players[socket.id] = {
    x: x,
    y: y,
    playerId: socket.id,
    health: 100,
  };

  let player_session_id = 0

  if(Object.keys(sessions).length <= 0){
    sessions[0] = { "session_host": socket.id, "players": []}
    socket.emit("session_host", player_session_id)
  }else{
    let found_session = false;
    let id_of_last_session = 0;
    Object.keys(sessions).forEach( function (session_id){
      id_of_last_session = session_id
      if(sessions[session_id].players.length < max_players_in_session && !found_session){
        found_session = true;
        player_session_id = session_id;
        for (let index = 0; index < sessions[session_id].players.length; index++) {
          const current_player_id = sessions[session_id].players[index];
          sockets[current_player_id].emit("newPlayer", players[socket.id]);
        }
      }
    })
    if (!found_session){
      player_session_id = Number(id_of_last_session) + 1
      sessions[player_session_id] = { "session_host": socket.id, "players": []}
      socket.emit("session_host", player_session_id )
    }
  }

  // nezinau ar pagal dabartine logika current players su nauju playeriu siuncia
  socket.emit("currentPlayers", sessions[player_session_id].players);
  sessions[player_session_id].players.push(socket.id);

  console.log(players);
  // send the players object to the new player
  
  // update all other players of the new player
  //socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("move", function (message) {
    console.log("user moved");
    players[socket.id].x = message.x;
    players[socket.id].y = message.y;
    io.emit("move", {...message, playerId: socket.id});
  });
  // when a player disconnects, remove them from our players object
  socket.on("disconnect", function () {
    console.log("user disconnected");
    // remove this player from our players object
    delete players[socket.id];
    let sessionId = findSessionIdWithPlayer(socket.id);
    for (let index = 0; index < sessions[sessionId].players.length; index++) {
      const player_id = sessions[sessionId].players[index];
      const player_socket = sockets[player_id]
      player_socket.emit("disconnectPlayer", socket.id)
    }

    delete sockets[socket.id];
    deletePlayerFromSession(socket.id);
  });
  socket.on("healthChange", function (message) {
    console.log("healthChange")
    console.log(message)
    //console.log(`user ${message.targetId} health from ${players[message.targetId].health} to ${message.healthUpdate}`);
    players[message.targetId].health = message.healthUpdate;
    // emit a message to all players to remove this player
    socket.broadcast.emit("updateHealth", {players});
  });
});
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

function deletePlayerFromSession(player_id){
  var sessionId = findSessionIdWithPlayer(player_id);
  console.log(sessionId)
  let session = sessions[sessionId];
  console.log(session)
  if (session != undefined)
  {
    session.players = session.players.filter(_id => _id != player_id)
    if(session.players.length <= 0){
      console.log("deleting session")
      delete sessions[sessionId];
    }
    else if (session.session_host == player_id){
      session.session_host = session.players[0];
      new_host_socket = sockets[session.players[0]]
      new_host_socket.emit("session_host", sessionId)
    }
  }
}
function findSessionIdWithPlayer(player_id){
  found_session_id = undefined
  Object.keys(sessions).forEach(function (session_id){
    for (let index = 0; index < sessions[session_id].players.length; index++) {
      const current_player_id = sessions[session_id].players[index];
      if(current_player_id == player_id){
        found_session_id = session_id 
      }
    }
  })
  return found_session_id
  
}