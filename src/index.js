const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", () => {
  console.log("New connected added");
});

app.get("/", (req, res) => {
  res.render("index.html");
});

server.listen(process.env.PORT);
