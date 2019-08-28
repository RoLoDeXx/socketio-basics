const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app); //socketio demands
const io = socketio(server); //socketio demands

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
let count = 0;

app.get("/", (req, res) => {
  res.render("index.html");
});

io.on("connection", socket => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room
    });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", generateMessage("Welcome"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(user.username + " has joined the chat!")
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on("sendMessage", (text, callback) => {
    const filter = new Filter();

    const user = getUser(socket.id);
    if (user) {
      if (filter.isProfane(text))
        return callback("Chat is moderated, Please do not use curse words");

      //send Text
      io.to(user.room).emit("message", generateMessage(text));
      callback();
    }
  });

  //leaving
  socket.on("disconnect", () => {
    let user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(user.username + " has left the chat!")
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });

  //location send

  socket.on("sendLocation", (response, callback) => {
    const user = getUser(socket.id);
    if (user) {
      let { latitude, longitude } = response;
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          "https://google.com/maps?q=" + latitude + "," + longitude
        )
      );
      callback("Location shared");
    }
  });
});

server.listen(process.env.PORT);
