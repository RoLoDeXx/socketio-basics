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
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
let count = 0;

io.on("connection", socket => {
  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", generateMessage("Welcome"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(username + " has joined the chat"));
  });

  socket.on("sendMessage", (text, callback) => {
    const filter = new Filter();

    if (filter.isProfane(text))
      return callback("Chat is moderated, Please do not use curse words");

    //send Text
    io.to("cult").emit("message", generateMessage(text));
    callback();
  });

  //leaving
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User has left the chat"));
  });

  //location send
  socket.on("sendLocation", (response, callback) => {
    let { latitude, longitude } = response;
    io.emit(
      "locationMessage",
      generateLocationMessage(
        "https://google.com/maps?q=" + latitude + "," + longitude
      )
    );
    callback("Location shared");
  });
});

app.get("/", (req, res) => {
  res.render("index.html");
});

server.listen(process.env.PORT);
