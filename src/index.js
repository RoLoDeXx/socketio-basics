const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app); //socketio demands
const io = socketio(server); //socketio demands

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
let count = 0;

io.on("connection", socket => {
  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "Abcd has joined the chat");

  socket.emit("countUpdated", count);
  socket.on("sendMessage", (text, callback) => {
    const filter = new Filter();

    if (filter.isProfane(text))
      return callback("Chat is moderated, Please do not use curse words");

    io.emit("message", text);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "User has left the chat");
  });

  socket.on("sendLocation", (response, callback) => {
    let { latitude, longitude } = response;
    io.emit(
      "message",
      "https://google.com/maps?q=" + latitude + "," + longitude
    );
    callback("Location shared");
  });
});

app.get("/", (req, res) => {
  res.render("index.html");
});

server.listen(process.env.PORT);
