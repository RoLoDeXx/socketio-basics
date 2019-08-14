const socket = io();

socket.on("message", welcomeMessage => {
  console.log(welcomeMessage);
});

document.getElementById("submitButton").addEventListener("click", () => {
  if (document.getElementById("message").value !== "")
    socket.emit("sendMessage", document.getElementById("message").value);
});

socket.on("sendMessage", text => {
  console.log(text);
});
