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
app.use(
  cors({
    origin: "*",
  })
);

var players = {};

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
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
  };

  console.log(players);
  // send the players object to the new player
  socket.emit("currentPlayers", players);
  // update all other players of the new player
  socket.broadcast.emit("newPlayer", players[socket.id]);

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
    // emit a message to all players to remove this player
    io.emit("disconnectPlayer", socket.id);
  });
});
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
