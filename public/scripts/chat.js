const socket = io();

socket.on("message", welcomeMessage => {
  console.log(welcomeMessage);
});

document.getElementById("submitButton").addEventListener("click", () => {
  if (document.getElementById("message").value !== "")
    socket.emit(
      "sendMessage",
      document.getElementById("message").value,
      res => {
        if (res) return console.log(res);

        console.log("Message delivered");
      }
    );
});

document.getElementById("sendLocation").addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Upgrade to a newer browser");

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      res => {
        console.log(res);
      }
    );
  });
});

socket.on("sendMessage", text => {
  console.log(text);
});
